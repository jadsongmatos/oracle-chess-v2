/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === 'development',
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    swSrc: './public/workers/cache.js',
    swDest: 'sw.js',
    runtimeCaching: [], // optional, add caching strategies here
  },
});


module.exports = withPWA({
  reactStrictMode: true,
});

