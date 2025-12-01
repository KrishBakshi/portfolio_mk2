import React from "react";
import { SiFastapi } from "react-icons/si";

export default function FastAPI({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ color: "#009688" }} {...props}>
      <SiFastapi className="size-full" />
    </div>
  );
}

