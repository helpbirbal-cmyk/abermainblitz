// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://www.googletagmanager.com;
              style-src 'self' 'unsafe-inline' https://assets.calendly.com;
              img-src 'self' https://assets.calendly.com data:;
              font-src 'self' https://assets.calendly.com;
              connect-src 'self' https://api.calendly.com;
              frame-src 'self' https://calendly.com https://*.calendly.com;
              child-src 'self' https://calendly.com https://*.calendly.com;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  }

};
