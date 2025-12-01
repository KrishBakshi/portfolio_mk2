import React from "react";
import { SiGit } from "react-icons/si";

export default function Git({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ color: "#F05032" }} {...props}>
      <SiGit className="size-full" />
    </div>
  );
}

