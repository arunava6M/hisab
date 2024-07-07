/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  googleFonts: {
    fonts: [
      { family: "Roboto", variants: ["400", "500", "700"] },
      // Add more fonts as needed
    ],
  },
};

export default nextConfig;
