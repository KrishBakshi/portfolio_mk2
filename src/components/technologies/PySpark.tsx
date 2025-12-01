import React from "react";
import { SiApachespark } from "react-icons/si";

export default function PySpark({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ color: "#E25A1C" }} {...props}>
      <SiApachespark className="size-full" />
    </div>
  );
}

