import React from "react";
import { SiFlask } from "react-icons/si";

export default function Flask({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ color: "currentColor" }} {...props}>
      <SiFlask className="size-full" />
    </div>
  );
}

