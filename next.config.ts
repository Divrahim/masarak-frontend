import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,

  // [TEMPORARY WORKAROUND — isolated, revert when possible]
  // Preview gateway 301-redirects "/dashboard" -> "/dashboard/" while Next's
  // default trailing-slash normalization 308s it back -> infinite loop.
  // This stops the 308 so the gateway's redirect resolves to a 200.
  // Remove once the platform gateway stops rewriting that path.
  skipTrailingSlashRedirect: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
