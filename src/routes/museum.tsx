import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const MuseumExperience = lazy(() =>
  import("@/components/Museum3D/MuseumExperience").then((m) => ({ default: m.MuseumExperience })),
);

export const Route = createFileRoute("/museum")({
  head: () => ({
    meta: [
      { title: "The Virtual Museum — 3D Gallery | ArchaeoLens" },
      {
        name: "description",
        content:
          "Walk an immersive 3D gallery of prehistoric artefacts — handaxes, microliths, querns and Harappan blades on lit pedestals.",
      },
    ],
    }),
  component: MuseumPage,
});

function MuseumPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0b0906]">
          <p className="small-caps animate-pulse text-muted-foreground">Preparing the galleries…</p>
        </div>
      }
    >
      <MuseumExperience />
    </Suspense>
  );
}
