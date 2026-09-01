import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Pinned explicitly. Turbopack infers the workspace root by walking up for a
   * lockfile, and this project sits under a home directory that has an
   * unrelated package-lock.json above it — without this it warns on every
   * build and would resolve module paths against the wrong root.
   */
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
