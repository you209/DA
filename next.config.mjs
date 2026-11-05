/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Docker/Home Assistant on the normal Next.js server build.
  // Export static pages only while packaging the Android app.
  ...(process.env.CAPACITOR_BUILD === '1'
    ? { output: 'export', trailingSlash: true }
    : {}),
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
