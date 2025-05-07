import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "img.daisyui.com",
      "static.vecteezy.com",
      "app.sandbox.midtrans.com",
      "js-agent.newrelic.com",
      "res.cloudinary.com",
    ],
  },
  crossOrigin: "anonymous",
};

export default nextConfig;
