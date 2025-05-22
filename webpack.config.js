const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components']
      }
    },
    argv
  );

  // Ensure assets are served from the correct path in production
  if (env.mode === 'production') {
    config.output = {
      ...config.output,
      publicPath: './'
    };
  }

  return config;
}; 