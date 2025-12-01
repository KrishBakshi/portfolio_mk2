import React from "react";
import { SiPytorch } from "react-icons/si";

export default function PyTorch({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ color: "#EE4C2C" }} {...props}>
      <SiPytorch className="size-full" />
    </div>
  );
}

