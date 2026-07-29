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

const COL_W = 208;
const ROW_H = 96;
const NODE_H = 42;
const PAD = 28;
const CHAR_W = 7.1;
/** Keeps the arrowhead off the node border. */
const GAP = 7;

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

/**
 * Places nodes on a column/row lattice. Every node is centred on its column
 * centreline regardless of label width, so a stack of differently sized nodes
 * still reads as a straight spine.
 */
function place(nodes: GraphNode[]): PlacedNode[] {
    return nodes.map((n) => ({
        ...n,
        w: Math.max(96, n.label.length * CHAR_W + 26),
        h: NODE_H,
        cx: PAD + (n.col + 0.5) * COL_W,
        cy: PAD + (n.row + 0.5) * ROW_H,
    }));
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

export function NodeGraph({
    nodes,
    edges,
    legend,
    caption,
    className,
}: NodeGraphProps) {
    const placed = place(nodes);
    const byId = Object.fromEntries(placed.map((n) => [n.id, n]));

    const cols = Math.max(...nodes.map((n) => n.col)) + 1;
    const rows = Math.max(...nodes.map((n) => n.row)) + 1;
    const width = PAD * 2 + cols * COL_W;
    const height = PAD * 2 + rows * ROW_H;

    return (
        <figure
            className={cn(
                "not-prose my-6 w-full overflow-x-auto rounded-lg border border-border bg-muted/30 p-4",
                className
            )}
        >
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full min-w-[620px]"
                role="img"
                aria-label={caption ?? "Relationship graph"}
            >
                <defs>
                    {(["solid", "dotted", "causal"] as const).map((kind) => (
                        <marker
                            key={kind}
                            id={MARKER[kind]}
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

                {edges.map((edge, i) => {
                    const a = byId[edge.from];
                    const b = byId[edge.to];
                    if (!a || !b) return null;

                    const kind = edge.kind ?? "solid";
                    const p1 = border(a, b.cx, b.cy);
                    const p2 = border(b, a.cx, a.cy);
                    const mx = (p1.x + p2.x) / 2 + (edge.labelDx ?? 0);
                    const my = (p1.y + p2.y) / 2 + (edge.labelDy ?? 0);

                    return (
                        <g key={`${edge.from}-${edge.to}-${i}`}>
                            <line
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                stroke={STROKE[kind]}
                                strokeWidth={WIDTH[kind]}
                                strokeDasharray={DASH[kind]}
                                strokeLinecap="round"
                                markerEnd={`url(#${MARKER[kind]})`}
                            />
                            {edge.label && (
                                <text
                                    x={mx}
                                    y={my}
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
                            )}
                        </g>
                    );
                })}

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
            </svg>

            {(legend?.length || caption) && (
                <figcaption className="mt-3 space-y-1.5 border-t border-border pt-3">
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
