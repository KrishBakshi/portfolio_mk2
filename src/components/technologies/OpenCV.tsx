import React from "react";

export const OpenCV = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 48 48"
            className={className}
        >
            <defs>
                <path
                    d="M-69.65 120.638a139.301 139.301 120 1 1 139.301 0L27.71 47.993a55.418 55.418 120 1 0-55.418 0z"
                    id="A"
                />
            </defs>
            <g transform="matrix(1.275322 0 0 1.275322 -38.047246 -14.965624)">
                <use
                    transform="matrix(.063405 0 0 .063405 29.66229 12.95855)"
                    y="140"
                    x="298"
                    xlinkHref="#A"
                    fill="#ff0101"
                />
                <use
                    transform="matrix(-.063405 0 0 -.063405 87.614835 65.58504)"
                    y="415"
                    x="457"
                    xlinkHref="#A"
                    fill="#0101ff"
                />
                <use
                    transform="matrix(-.031703 -.054911 .054911 -.031703 20.379704 60.225737)"
                    y="415"
                    x="142"
                    xlinkHref="#A"
                    fill="#01ff01"
                />
            </g>
        </svg>
    );
};