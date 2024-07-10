/** @type {import('next').NextConfig} */
const { GenerateSW } = require("workbox-webpack-plugin");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  // googleFonts: {
  //   fonts: [{ family: "Roboto", variants: ["400", "500", "700"] }],
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new GenerateSW({
          clientsClaim: true,
          skipWaiting: true,
          swDest: "public/sw.js",
          runtimeCaching: [
            {
              urlPattern: /^https?.*/,
              handler: "NetworkFirst",
              options: {
                cacheName: "offlineCache",
                expiration: {
                  maxEntries: 200,
                },
              },
            },
          ],
        })
      );
    }
    return config;
  },
};

// Configuration object tells the next-pwa plugin
const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  // disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig);
