import { createRequire } from "node:module";
import type { StorybookConfig } from "@storybook/react-webpack5";
import path from 'path';

const require = createRequire(import.meta.url);

const getAbsolutePath = (packageName: string): any =>
    path.dirname(require.resolve(path.join(packageName, 'package.json')));

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    getAbsolutePath("@storybook/addon-docs")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {
      builder: {},
    },
  },

  docs: {},

  staticDirs: ['../stories/assets', '../node_modules/devextreme/dist'],

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
