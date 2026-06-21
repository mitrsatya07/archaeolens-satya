import { Outlet, useRouterState } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

export function TopProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.isLoading || s.status === "pending" });
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[2px] overflow-hidden"
    >
      <div
        className={
          "h-full bg-gradient-to-r from-[hsl(var(--copper,28_60%_45%))] via-[hsl(var(--terracotta,18_55%_35%))] to-[hsl(var(--copper,28_60%_45%))] transition-all duration-300 ease-out " +
          (isLoading ? "w-4/5 opacity-100" : "w-full opacity-0")
        }
        style={{
          animation: isLoading ? "route-progress 1.2s ease-in-out infinite" : undefined,
        }}
      />
    </div>
  );
}

export function PageTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="animate-route-fade">
      <Outlet />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-12 animate-fade-in">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
