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
  async rewrites() {
    return [
      {
        source: "/docs/:path*",
        destination:
          "https://nice-books-5133946fb0.media.strapiapp.com/:path*",
      },
    ];
  },
};

export default nextConfig;
