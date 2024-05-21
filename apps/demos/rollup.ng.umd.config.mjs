const NG_BASE_DIR = '../../packages/devextreme-angular/node_modules/';
const OUTPUT_DIR = './bundles/';

export default [
  // animations
  {
    input: NG_BASE_DIR + `@angular/animations/fesm2022/animations.mjs`,
    output: {
      file: OUTPUT_DIR + `@angular/animations.umd.js`,
      format: "umd",
      name: "ng.animations",
      globals: {
        "@angular/animations": "ng.animations",
        "@angular/common": "ng.common",
        "@angular/core": "ng.core",
      },
    },
    external: ["@angular/core", "@angular/common"],
  },
  // common
  {
    input: NG_BASE_DIR + "@angular/common/fesm2022/common.mjs",
    output: {
      file: OUTPUT_DIR + `@angular/common.umd.js`,
      format: "umd",
      name: "ng.common",
      globals: {
        "@angular/common": "ng.common",
        "@angular/common/http": "ng.common.http",
        "@angular/core": "ng.core",
      },
    },
    external: ["@angular/core"],
  },
  // common.http
  {
    input: NG_BASE_DIR + "@angular/common/fesm2022/http.mjs",
    output: {
      file: OUTPUT_DIR + `@angular/common-http.umd.js`,
      format: "umd",
      name: "ng.common.http",
      globals: {
        "@angular/common/http": "ng.common.http",
        "@angular/common": "ng.common",
        "@angular/core": "ng.core",
        rxjs: "rxjs",
        "rxjs/operators": "rxjs.operators",
      },
    },
    external: ["@angular/core", "@angular/common", "rxjs", "rxjs/operators"],
  },
  // compiler
  {
    input: NG_BASE_DIR + "@angular/compiler/fesm2022/compiler.mjs",
    output: {
      file: OUTPUT_DIR + `@angular/compiler.umd.js`,
      format: "umd",
      name: "ng.compiler",
    },
  },
  // core
  {
    input: NG_BASE_DIR + "@angular/core/fesm2022/core.mjs",
    output: {
      file: OUTPUT_DIR + `@angular/core.umd.js`,
      format: "umd",
      name: "ng.core",
      globals: {
        "@angular/core": "ng.core",
        rxjs: "rxjs",
        "rxjs/operators": "rxjs.operators",
      },
    },
    external: ["rxjs", "rxjs/operators", "zone.js"],
  },

  // forms
  {
    input: NG_BASE_DIR + "@angular/forms/fesm2022/forms.mjs",
    output: {
      file: OUTPUT_DIR + `@angular/forms.umd.js`,
      format: "umd",
      name: "ng.forms",
      globals: {
        "@angular/core": "ng.core",
        "@angular/common": "ng.common",
        rxjs: "rxjs",
        "rxjs/operators": "rxjs.operators",
      },
    },
    external: ["@angular/core", "@angular/common", "rxjs", "rxjs/operators"],
  },
  // platform-browser
  {
    input:
        NG_BASE_DIR + "@angular/platform-browser/fesm2022/platform-browser.mjs",
    output: {
      file: OUTPUT_DIR + `@angular/platform-browser.umd.js`,
      format: "umd",
      name: "ng.platformBrowser",
      globals: {
        "@angular/common": "ng.common",
        "@angular/common/http": "ng.common.http",
        "@angular/core": "ng.core",
      },
    },
    external: ["@angular/core", "@angular/common", "@angular/common/http"],
  },
  // platform-browser-dynamic
  {
    input:
        NG_BASE_DIR + "@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs",
    output: {
      file: OUTPUT_DIR + `@angular/platform-browser-dynamic.umd.js`,
      format: "umd",
      name: "ng.platformBrowserDynamic",
      globals: {
        "@angular/compiler": "ng.compiler",
        "@angular/common": "ng.common",
        "@angular/core": "ng.core",
        "@angular/platform-browser": "ng.platformBrowser",
      },
    },
    external: [
      "@angular/compiler",
      "@angular/core",
      "@angular/common",
      "@angular/platform-browser",
    ],
  },
];
