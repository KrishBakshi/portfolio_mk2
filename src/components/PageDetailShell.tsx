import { PageCanvas } from "@/components/PageCanvas";

interface PageDetailShellProps {
  children: React.ReactNode;
}

export function PageDetailShell({ children }: PageDetailShellProps) {
  return (
    <PageCanvas>
      <main className="mx-auto w-full bg-background px-5 pb-12 sm:px-8 sm:pb-16">
        {children}
      </main>
    </PageCanvas>
  );
}
