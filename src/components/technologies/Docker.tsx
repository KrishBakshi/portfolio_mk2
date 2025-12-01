import React from "react";
import { SiDocker } from "react-icons/si";

export default function Docker({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ color: "#2496ED" }} {...props}>
      <SiDocker className="size-full" />
    </div>
  );
}

