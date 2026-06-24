import { PageCanvas } from "@/components/PageCanvas";

interface PageDetailShellProps {
  children: React.ReactNode;
}

export function PageDetailShell({ children }: PageDetailShellProps) {
  return (
    <PageCanvas>
      <div className="mx-auto mb-6 w-full max-w-3xl sm:px-0">
        <div
          id="js-cover-mark"
          className="pointer-events-none absolute left-0 top-0 h-32 w-full"
        />
        {children}
      </div>
    </PageCanvas>
  );
}
