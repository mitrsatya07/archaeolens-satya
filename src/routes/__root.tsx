import { Link, createRootRoute, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageTransition, TopProgressBar } from "@/components/RouteTransition";
import { MobileTabBar } from "@/components/MobileTabBar";
import { registerServiceWorker } from "@/lib/registerSW";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1a1a2e" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { title: "ArchaeoLens" },
      { name: "description", content: "Archaeological photo observation for artifacts, fragments, ceramics, lithics, inscriptions, and field records." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "ArchaeoLens" },
      { property: "og:description", content: "Create cautious archaeology-focused field observations from artifact photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "ArchaeoLens" },
      { name: "twitter:description", content: "Archaeological photo observation with field notes and research references." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/a3SxoKJNMcMUnfge6nvygFI3C4Y2/social-images/social-1777024378524-1000997476.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/a3SxoKJNMcMUnfge6nvygFI3C4Y2/social-images/social-1777024378524-1000997476.webp" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fira+Sans:wght@300;400;500;600;700;800&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "icon",
        href: "/icon-192.png",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        href: "/icon-512.png",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const router = useRouter();
  useEffect(() => {
    registerServiceWorker();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
      }
    });
    return () => data.subscription.unsubscribe();
  }, [router]);
  return (
    <>
      <TopProgressBar />
      <PageTransition />
      <MobileTabBar />
      <Toaster position="top-center" richColors />
    </>
  );
}
