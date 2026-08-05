"use client";

import React from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type GraphEdgeKind = "solid" | "dashed" | "dotted" | "causal";

export interface GraphNode {
    id: string;
    label: string;
    /** Grid position. Fractions are allowed when a node needs to sit off-lattice. */
    row: number;
    col: number;
    /** Small caption rendered under the label. */
    note?: string;
    /** Dashed border, for nodes that sit outside the main system. */
    isolated?: boolean;
}

export interface GraphEdge {
    from: string;
    to: string;
    kind?: GraphEdgeKind;
    label?: string;
    /** Nudge the label off the edge midpoint when the default would collide. */
    labelDx?: number;
    labelDy?: number;
}

export interface NodeGraphProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
    legend?: { kind: GraphEdgeKind; label: string }[];
    caption?: string;
    className?: string;
}

const NODE_H = 42;
const PAD = 32;
const CHAR_W = 7.1;
const EDGE_CHAR_W = 6;
/** Keeps the arrowhead off the node border. */
const GAP = 7;
const BASE_COL_GUTTER = 48;
const BASE_ROW_GUTTER = 48;
const LABEL_EDGE_PAD = 28;

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 4;
const ZOOM_STEP = 1.15;

const STROKE: Record<GraphEdgeKind, string> = {
    solid: "#0d9488",
    dashed: "#0d9488",
    dotted: "#b58a44",
    causal: "#d9822b",
};

const DASH: Record<GraphEdgeKind, string | undefined> = {
    solid: undefined,
    dashed: "6 4",
    dotted: "1 5",
    causal: "2 4",
};

const WIDTH: Record<GraphEdgeKind, number> = {
    solid: 1.7,
    dashed: 1.3,
    dotted: 1.3,
    causal: 1.3,
};

const MARKER: Record<GraphEdgeKind, string> = {
    solid: "ng-arrow-solid",
    dashed: "ng-arrow-solid",
    dotted: "ng-arrow-dotted",
    causal: "ng-arrow-causal",
};

interface PlacedNode extends GraphNode {
    cx: number;
    cy: number;
    w: number;
    h: number;
}

interface Camera {
    x: number;
    y: number;
    zoom: number;
}

function nodeWidth(node: GraphNode) {
    return Math.max(96, node.label.length * CHAR_W + 26);
}

function labelWidth(label: string) {
    return label.length * EDGE_CHAR_W;
}

/**
 * Places nodes on a lattice, but widens any gutter that a labeled edge crosses
 * so the label has room to sit on the line without landing under a box.
 */
function place(nodes: GraphNode[], edges: GraphEdge[]) {
    const colCount = Math.ceil(Math.max(...nodes.map((n) => n.col))) + 1;
    const rowCount = Math.ceil(Math.max(...nodes.map((n) => n.row))) + 1;

    const colTrack = Array.from({ length: colCount }, () => 96);
    const rowTrack = Array.from({ length: rowCount }, () => NODE_H);
    for (const n of nodes) {
        const c = Math.round(n.col);
        const r = Math.round(n.row);
        colTrack[c] = Math.max(colTrack[c], nodeWidth(n));
        rowTrack[r] = Math.max(rowTrack[r], NODE_H);
    }

    const colGutter = Array.from({ length: Math.max(0, colCount - 1) }, () => BASE_COL_GUTTER);
    const rowGutter = Array.from({ length: Math.max(0, rowCount - 1) }, () => BASE_ROW_GUTTER);
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

    const bump = (track: number[], from: number, to: number, need: number) => {
        const lo = Math.min(from, to);
        const hi = Math.max(from, to);
        const spans = Math.max(1, hi - lo);
        for (let i = lo; i < hi; i++) {
            track[i] = Math.max(track[i] ?? 0, need / spans);
        }
    };

    for (const edge of edges) {
        const a = byId[edge.from];
        const b = byId[edge.to];
        if (!a || !b || !edge.label) continue;

        const need = labelWidth(edge.label) + LABEL_EDGE_PAD;
        const dCol = Math.abs(b.col - a.col);
        const dRow = Math.abs(b.row - a.row);

        if (dCol >= dRow && dCol > 0) {
            bump(colGutter, Math.round(a.col), Math.round(b.col), need);
            if (dRow > 0) bump(rowGutter, Math.round(a.row), Math.round(b.row), 22 + LABEL_EDGE_PAD);
            continue;
        }

        if (dRow > 0) {
            bump(rowGutter, Math.round(a.row), Math.round(b.row), 22 + LABEL_EDGE_PAD);
            // Wide labels on vertical edges need side clearance past the column box.
            const col = Math.round(a.col);
            const overhang = need / 2 - colTrack[col] / 2 + 12;
            if (overhang > 0) {
                if (col - 1 >= 0) colGutter[col - 1] = Math.max(colGutter[col - 1], overhang);
                if (col < colGutter.length) colGutter[col] = Math.max(colGutter[col], overhang);
            }
        }
    }

    const colCenters: number[] = [];
    let x = PAD;
    for (let c = 0; c < colCount; c++) {
        colCenters.push(x + colTrack[c] / 2);
        x += colTrack[c] + (colGutter[c] ?? 0);
    }

    const rowCenters: number[] = [];
    let y = PAD;
    for (let r = 0; r < rowCount; r++) {
        rowCenters.push(y + rowTrack[r] / 2);
        y += rowTrack[r] + (rowGutter[r] ?? 0);
    }

    const centerAt = (centers: number[], index: number) => {
        const lo = Math.floor(index);
        const hi = Math.ceil(index);
        const a = centers[lo] ?? centers[centers.length - 1] ?? 0;
        const b = centers[hi] ?? a;
        return lo === hi ? a : a + (b - a) * (index - lo);
    };

    const placed: PlacedNode[] = nodes.map((n) => ({
        ...n,
        w: nodeWidth(n),
        h: NODE_H,
        cx: centerAt(colCenters, n.col),
        cy: centerAt(rowCenters, n.row),
    }));

    return {
        placed,
        width: x + PAD,
        height: y + PAD,
    };
}

/** Where the ray from a node's centre toward (tx, ty) crosses its border. */
function border(node: PlacedNode, tx: number, ty: number) {
    const dx = tx - node.cx;
    const dy = ty - node.cy;
    if (dx === 0 && dy === 0) return { x: node.cx, y: node.cy };

    const hw = node.w / 2 + GAP;
    const hh = node.h / 2 + GAP;
    const sx = dx === 0 ? Number.POSITIVE_INFINITY : hw / Math.abs(dx);
    const sy = dy === 0 ? Number.POSITIVE_INFINITY : hh / Math.abs(dy);
    const s = Math.min(sx, sy);

    return { x: node.cx + dx * s, y: node.cy + dy * s };
}

function clampZoom(value: number) {
    return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 1000) / 1000));
}

/** Fit the graph inside the frame with a little padding, like Maps' initial bounds. */
function fitCamera(viewW: number, viewH: number, graphW: number, graphH: number): Camera {
    if (viewW <= 0 || viewH <= 0) return { x: 0, y: 0, zoom: 1 };
    const zoom = clampZoom(Math.min((viewW - 32) / graphW, (viewH - 32) / graphH, 1.25));
    return {
        zoom,
        x: (viewW - graphW * zoom) / 2,
        y: (viewH - graphH * zoom) / 2,
    };
}

export function NodeGraph({
    nodes,
    edges,
    legend,
    caption,
    className,
}: NodeGraphProps) {
    const { placed, width, height } = place(nodes, edges);
    const byId = Object.fromEntries(placed.map((n) => [n.id, n]));
    const markerId = React.useId().replace(/:/g, "");

    const viewportRef = React.useRef<HTMLDivElement>(null);
    const cameraRef = React.useRef<Camera>({ x: 0, y: 0, zoom: 1 });
    const [camera, setCamera] = React.useState<Camera>({ x: 0, y: 0, zoom: 1 });
    const [dragging, setDragging] = React.useState(false);
    const dragOrigin = React.useRef<{
        pointerX: number;
        pointerY: number;
        camX: number;
        camY: number;
    } | null>(null);

    const commitCamera = React.useCallback((next: Camera) => {
        cameraRef.current = next;
        setCamera(next);
    }, []);

    const resetView = React.useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        commitCamera(fitCamera(viewport.clientWidth, viewport.clientHeight, width, height));
    }, [commitCamera, height, width]);

    React.useEffect(() => {
        resetView();
    }, [resetView]);

    /** Zoom toward a point inside the viewport, Maps-style. */
    const zoomAt = React.useCallback(
        (factor: number, clientX: number, clientY: number) => {
            const viewport = viewportRef.current;
            if (!viewport) return;

            const prev = cameraRef.current;
            const nextZoom = clampZoom(prev.zoom * factor);
            if (nextZoom === prev.zoom) return;

            const rect = viewport.getBoundingClientRect();
            const px = clientX - rect.left;
            const py = clientY - rect.top;
            const ratio = nextZoom / prev.zoom;

            commitCamera({
                zoom: nextZoom,
                x: px - (px - prev.x) * ratio,
                y: py - (py - prev.y) * ratio,
            });
        },
        [commitCamera]
    );

    const zoomByButton = (factor: number) => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const rect = viewport.getBoundingClientRect();
        zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
    };

    React.useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const onWheel = (event: WheelEvent) => {
            event.preventDefault();
            const intensity = Math.min(Math.abs(event.deltaY) / 100, 2.5);
            const step = Math.pow(ZOOM_STEP, intensity);
            const direction = event.deltaY < 0 ? step : 1 / step;
            zoomAt(direction, event.clientX, event.clientY);
        };

        viewport.addEventListener("wheel", onWheel, { passive: false });
        return () => viewport.removeEventListener("wheel", onWheel);
    }, [zoomAt]);

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        const cam = cameraRef.current;
        dragOrigin.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            camX: cam.x,
            camY: cam.y,
        };
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const origin = dragOrigin.current;
        if (!origin) return;
        commitCamera({
            ...cameraRef.current,
            x: origin.camX + (event.clientX - origin.pointerX),
            y: origin.camY + (event.clientY - origin.pointerY),
        });
    };

    const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
        dragOrigin.current = null;
        setDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const marker = (kind: GraphEdgeKind) => `${MARKER[kind]}-${markerId}`;

    const drawnEdges = edges.flatMap((edge, i) => {
        const a = byId[edge.from];
        const b = byId[edge.to];
        if (!a || !b) return [];
        return [
            {
                key: `${edge.from}-${edge.to}-${i}`,
                edge,
                kind: edge.kind ?? "solid",
                p1: border(a, b.cx, b.cy),
                p2: border(b, a.cx, a.cy),
            },
        ];
    });

    return (
        <figure
            className={cn(
                "not-prose my-6 w-full overflow-hidden rounded-lg border border-border bg-muted/30",
                className
            )}
        >
            <div className="group relative">
                <div
                    ref={viewportRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    className={cn(
                        "relative h-[min(70vh,420px)] overflow-hidden bg-background/40",
                        dragging ? "cursor-grabbing" : "cursor-grab"
                    )}
                    style={{ touchAction: "none" }}
                    aria-label="Interactive graph map. Drag to pan. Scroll or pinch to zoom."
                >
                    <div
                        className="origin-top-left will-change-transform"
                        style={{
                            width,
                            height,
                            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
                        }}
                    >
                        <svg
                            viewBox={`0 0 ${width} ${height}`}
                            width={width}
                            height={height}
                            className="block max-w-none select-none"
                            role="img"
                            aria-label={caption ?? "Relationship graph"}
                        >
                            <defs>
                                {(["solid", "dotted", "causal"] as const).map((kind) => (
                                    <marker
                                        key={kind}
                                        id={marker(kind)}
                                        viewBox="0 0 10 10"
                                        refX="8"
                                        refY="5"
                                        markerWidth="6"
                                        markerHeight="6"
                                        orient="auto-start-reverse"
                                    >
                                        <path d="M 0 1 L 9 5 L 0 9 z" fill={STROKE[kind]} />
                                    </marker>
                                ))}
                            </defs>

                            {drawnEdges.map(({ key, kind, p1, p2 }) => (
                                <line
                                    key={key}
                                    x1={p1.x}
                                    y1={p1.y}
                                    x2={p2.x}
                                    y2={p2.y}
                                    stroke={STROKE[kind]}
                                    strokeWidth={WIDTH[kind]}
                                    strokeDasharray={DASH[kind]}
                                    strokeLinecap="round"
                                    markerEnd={`url(#${marker(kind)})`}
                                />
                            ))}

                            {placed.map((n) => (
                                <g key={n.id}>
                                    <rect
                                        x={n.cx - n.w / 2}
                                        y={n.cy - n.h / 2}
                                        width={n.w}
                                        height={n.h}
                                        rx="6"
                                        className="fill-background stroke-border"
                                        strokeWidth="1"
                                        strokeDasharray={n.isolated ? "4 3" : undefined}
                                    />
                                    <text
                                        x={n.cx}
                                        y={n.note ? n.cy - 4 : n.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-foreground font-mono"
                                        fontSize="12"
                                    >
                                        {n.label}
                                    </text>
                                    {n.note && (
                                        <text
                                            x={n.cx}
                                            y={n.cy + 11}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="fill-muted-foreground font-mono"
                                            fontSize="9"
                                        >
                                            {n.note}
                                        </text>
                                    )}
                                </g>
                            ))}

                            {/* Labels last so they stay readable above boxes. */}
                            {drawnEdges.map(({ key, edge, p1, p2 }) =>
                                edge.label ? (
                                    <text
                                        key={`label-${key}`}
                                        x={(p1.x + p2.x) / 2 + (edge.labelDx ?? 0)}
                                        y={(p1.y + p2.y) / 2 + (edge.labelDy ?? 0)}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-muted-foreground font-mono"
                                        fontSize="10"
                                        stroke="var(--background)"
                                        strokeWidth="4"
                                        paintOrder="stroke"
                                    >
                                        {edge.label}
                                    </text>
                                ) : null
                            )}
                        </svg>
                    </div>

                    <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
                        Scroll to zoom · Drag to pan
                    </div>
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-md border border-border bg-background/95 opacity-0 shadow-sm transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100">
                    <button
                        type="button"
                        onClick={() => zoomByButton(ZOOM_STEP)}
                        disabled={camera.zoom >= ZOOM_MAX}
                        className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Zoom in"
                        title="Zoom in"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                    <div className="h-px bg-border" />
                    <button
                        type="button"
                        onClick={() => zoomByButton(1 / ZOOM_STEP)}
                        disabled={camera.zoom <= ZOOM_MIN}
                        className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Zoom out"
                        title="Zoom out"
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </button>
                    <div className="h-px bg-border" />
                    <button
                        type="button"
                        onClick={resetView}
                        className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Reset view"
                        title="Reset view"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {(legend?.length || caption) && (
                <figcaption className="space-y-1.5 border-t border-border px-4 py-3">
                    {legend?.length ? (
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                            {legend.map((item) => (
                                <span
                                    key={item.label}
                                    className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
                                >
                                    <svg width="26" height="8" aria-hidden="true">
                                        <line
                                            x1="0"
                                            y1="4"
                                            x2="26"
                                            y2="4"
                                            stroke={STROKE[item.kind]}
                                            strokeWidth={WIDTH[item.kind]}
                                            strokeDasharray={DASH[item.kind]}
                                        />
                                    </svg>
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    ) : null}
                    {caption && (
                        <p className="font-mono text-xs text-muted-foreground">{caption}</p>
                    )}
                </figcaption>
            )}
        </figure>
    );
}
