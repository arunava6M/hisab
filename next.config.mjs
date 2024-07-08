/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
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
  distDir: "out",
  output: "export",
};

export default nextConfig;
