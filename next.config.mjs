/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.uvtab.go.ug",
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
          "https://cms.uvtab.go.ug/:path*",
      },
    ];
  },
};

export default nextConfig;
