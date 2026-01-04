const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Explicitly set src directory
  experimental: {
    // This ensures Next.js uses src directory
  },
}

export default nextConfig
