import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.daisyui.com", "app.sandbox.midtrans.com", "js-agent.newrelic.com"],
  },
  crossOrigin: 'anonymous'
};

export default nextConfig;
