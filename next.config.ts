import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN IPs to access the dev server without RSC payload being rejected.
  // Add other IPs here when testing on different networks.
  allowedDevOrigins: ["192.168.1.115"],
};

export default nextConfig;
