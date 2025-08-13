/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize fonts and handle loading errors
  optimizeFonts: true,
  
  // Handle font loading timeouts and errors
  experimental: {
    // Enable font optimization
    optimizePackageImports: ['next/font'],
  },
  
  // Headers to handle font loading
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },
  
  // Webpack configuration for font handling
  webpack: (config, { isServer }) => {
    // Handle font loading errors gracefully
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/fonts/',
          outputPath: 'static/fonts/',
          fallback: 'system-ui, sans-serif',
        },
      },
    });
    
    return config;
  },
};

module.exports = nextConfig;
