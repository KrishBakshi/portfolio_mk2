import React from "react";
import { SiPandas } from "react-icons/si";

export default function Pandas({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ color: "#150458" }} {...props}>
      <SiPandas className="size-full" />
    </div>
  );
}

