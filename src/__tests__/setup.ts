import "@testing-library/react/pure";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Stub next/navigation so components that import usePathname/useRouter don't crash
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Stub next/link so <Link> renders as a plain <a>
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [k: string]: unknown }) =>
    ({ type: "a", props: { href, ...rest, children } }),
}));

// Stub framer-motion to render children without animations (avoids requestAnimationFrame issues)
vi.mock("framer-motion", () => ({
  motion: new Proxy({}, {
    get: (_t, tag: string) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const React = require("react");
      // eslint-disable-next-line react/display-name
      const Comp = React.forwardRef(
        ({ children, animate: _a, initial: _i, exit: _e, transition: _t2, ...rest }: Record<string, unknown>, ref: unknown) =>
          React.createElement(tag, { ...rest, ref }, children)
      );
      Comp.displayName = `Motion.${tag}`;
      return Comp;
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useInView: () => true,
  useAnimation: () => ({ start: vi.fn() }),
}));
