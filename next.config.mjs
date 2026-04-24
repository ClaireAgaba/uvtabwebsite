/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nice-books-5133946fb0.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "**.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "emis.uvtab.go.ug",
      },
      {
        protocol: "https",
        hostname: "eims.uvtab.go.ug",
      },
    ],
  },
};

export default nextConfig;
