module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });

      return config;
    },
  };
  return nextConfig;
};
