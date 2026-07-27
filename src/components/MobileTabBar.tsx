import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Camera, Building2, Pickaxe, Menu } from "lucide-react";

type Tab = { to: "/" | "/sites" | "/stone-tools" | "/about"; label: string; Icon: typeof Home; primary?: boolean };
const tabs: Tab[] = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/sites", label: "Sites", Icon: Building2 },
  { to: "/", label: "Scan", Icon: Camera, primary: true },
  { to: "/stone-tools", label: "Tools", Icon: Pickaxe },
  { to: "/about", label: "More", Icon: Menu },
];

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/15 bg-background/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map(({ to, label, Icon, primary }) => {
          const active = !primary && pathname === to;
          return (
            <li key={label} className="flex">
              <Link
                to={to}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {primary ? (
                  <span className="grid h-11 w-11 -mt-4 place-items-center rounded-full bg-foreground text-background shadow-[var(--shadow-editorial)]">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
