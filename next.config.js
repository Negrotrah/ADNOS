/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Конфигурация для поддержки ассетов
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|webp)$/i,
      type: 'asset/resource',
    });
    return config;
  }
};

module.exports = nextConfig; 