/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loedtoyszcyawzdamuld.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/places-bucket/**",
      },
    ],
  },
};

module.exports = nextConfig;
