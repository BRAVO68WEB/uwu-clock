import React from "react";

export const BackgroundOption = Object.freeze({
  Hyperspeed: "hyperspeed",
  Orb: "orb",
  Aurora: "aurora",
  Particles: "particles",
  Threads: "threads",
  Prism: "prism",
  Squares: "squares",
});

// use React.lazy to create lazy-loaded components without top-level await
const BackgroundOptions: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<unknown>>
> = {
  [BackgroundOption.Hyperspeed]: React.lazy(() =>
    import("./Hyperspeed").then((mod) => ({ default: mod.Hyperspeed })),
  ),
  [BackgroundOption.Orb]: React.lazy(() =>
    import("./Orb").then((mod) => ({ default: mod.Orb })),
  ),
  [BackgroundOption.Aurora]: React.lazy(() =>
    import("./Aurora").then((mod) => ({ default: mod.Aurora })),
  ),
  [BackgroundOption.Particles]: React.lazy(() =>
    import("./Particles").then((mod) => ({ default: mod.Particles })),
  ),
  [BackgroundOption.Threads]: React.lazy(() =>
    import("./Threads").then((mod) => ({ default: mod.Threads })),
  ),
  [BackgroundOption.Prism]: React.lazy(() =>
    import("./Prism").then((mod) => ({ default: mod.Prism })),
  ),
  [BackgroundOption.Squares]: React.lazy(() =>
    import("./Squares").then((mod) => ({ default: mod.Squares })),
  ),
};

// create a single export for Background as a react lazy-loaded component
function Background({
  type,
}: {
  type: (typeof BackgroundOption)[keyof typeof BackgroundOption];
}) {
  const Comp = BackgroundOptions[type];

  return (
    <React.Suspense fallback={null}>{Comp ? <Comp /> : null}</React.Suspense>
  );
}

export default Background;
