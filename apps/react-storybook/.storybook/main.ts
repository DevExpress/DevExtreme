import type { StorybookConfig } from "@storybook/react-webpack5";
import path from 'path';
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
};
export default config;
