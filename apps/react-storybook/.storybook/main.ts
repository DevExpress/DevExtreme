import type { StorybookConfig } from "@storybook/react-webpack5";
import path from 'path';
import webpack from 'webpack';

const getAbsolutePath = (packageName: string): any =>
    path.dirname(require.resolve(path.join(packageName, 'package.json')));

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ['../stories/assets', '../node_modules/devextreme/dist'],
  webpackFinal: async (config, { configType }) => {
    if (!config.plugins) {
      return config;
    }

    if (configType === 'PRODUCTION') {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /(.*)\/state_manager/,
          (resource) => {
            if (resource.request.includes('state_manager/index.prod')) {
              return;
            }

            const newRequest = resource.request.replace('state_manager/index', 'state_manager/index.prod');
            resource.request = newRequest;
          }
        )
      );
    }

    return config;
  },
};
export default config;
