import * as sass from 'sass-embedded';
import * as path from 'path';
import postcss from 'postcss';
import bootstrap6meta from '../data/bootstrap-metadata/bootstrap6-metadata';

export default class BootstrapExtractor {
  input: string;

  version: number;

  constructor(source: string, version = 6) {
    this.input = source;
    // SCSS imports can supply 0/undefined. Bootstrap 6 is the installed peer;
    // v5's _variables.scss and _variables-dark.scss no longer exist in v6.
    this.version = version || 6;
    if (this.version !== 6) {
      throw new Error(`Unsupported Bootstrap version: ${this.version}. Install Bootstrap 6 and migrate to token maps.`);
    }
  }

  static sassRender(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sass.compileStringAsync(input, {
        silenceDeprecations: ['color-functions', 'global-builtin', 'if-function', 'import'],
      })
        .then((data) => resolve(data.css.toString()))
        .catch((error: sass.Exception) => reject(error.message));
    });
  }

  static convertRemToPx(cssValue: string): string {
    const remValueRegex = /(\d*?\.?\d+?)rem([;\s])?/g;
    const replaceHandler = (_match: string, value: string, separator: string): string => {
      const pixelsInRem = 16;
      const pxValue = Math.round(parseFloat(value) * pixelsInRem);
      return `${pxValue}px${separator || ''}`;
    };
    return cssValue.replace(remValueRegex, replaceHandler);
  }

  static getFilePath(fileName: string): string {
    return require.resolve(`bootstrap/scss/${fileName}`);
  }

  async extract(): Promise<ConfigMetaItem[]> {
    const bootstrapPath = BootstrapExtractor.getFilePath('bootstrap.scss');
    // A configured @use/@forward already emits Bootstrap CSS. Loading it again
    // would emit defaults after the user's CSS overrides and overwrite them.
    // Empty inputs still need the default tokens emitted through the module API.
    const loadBootstrap = /@(?:use|forward)\s+["'][^"']*bootstrap/.test(this.input)
      ? '' : `@include dx-themebuilder.load-css("${bootstrapPath}");`;
    const { css } = await sass.compileStringAsync(`@use "sass:meta" as dx-themebuilder;
${this.input}
${loadBootstrap}`, {
      loadPaths: [path.dirname(bootstrapPath), path.dirname(path.dirname(bootstrapPath))],
    });
    const tokens: Record<string, string> = {};
    // V6 places tokens inside cascade layers and on component selectors.
    // Read their default scopes; variant/state rules must not replace defaults.
    const selectors = [':root', '.btn', '.form-control', '.pagination', '.tooltip', '.dialog', '.progress', '.list-group'];
    postcss.parse(css).walkRules((rule) => {
      if (rule.selectors.some((selector) => selectors.includes(selector))) {
        rule.walkDecls(/^--/, (declaration) => {
          tokens[declaration.prop] = declaration.value;
        });
      }
    });

    // V6 visual settings are CSS tokens rather than globally visible Sass variables.
    // Resolve nested references/fallbacks before DevExtreme consumes concrete values.
    const resolveValue = (value: string, chain: string[] = []): string => {
      const match = /(var|light-dark|color-mix)\(/.exec(value);
      if (!match) return value;
      const start = match.index + match[0].length;
      let end = start;
      let depth = 1;
      while (depth && end < value.length) {
        if (value[end] === '(') depth += 1;
        if (value[end] === ')') depth -= 1;
        end += 1;
      }
      const args = postcss.list.comma(value.slice(start, end - 1));
      let replacement = '';
      if (match[1] === 'var') {
        const [key, fallback] = args;
        if (chain.includes(key)) throw new Error(`Circular Bootstrap token: ${key}`);
        const token = tokens[key] ?? fallback;
        if (token === undefined) throw new Error(`Missing Bootstrap token: ${key}`);
        replacement = resolveValue(token, [...chain, key]);
      } else if (match[1] === 'light-dark') {
        // V6 uses native light-dark() instead of separate dark Sass variables.
        // ThemeBuilder deliberately imports the light branch, matching v5 defaults.
        replacement = resolveValue(args[0], chain);
      } else {
        // Sass leaves CSS color-mix() unevaluated. Use color.mix() in the same
        // interpolation space so DevExtreme receives a color, not a CSS expression.
        const space = args[0].replace(/^in /, '');
        const colors = args.slice(1).map((arg) => resolveValue(arg, chain));
        const weighted = colors.map((color) => /^(.*)\s+([\d.]+)%$/.exec(color));
        const weight = weighted[0]
          ? Number(weighted[0][2])
          : 100 - (weighted[1] ? Number(weighted[1][2]) : 50);
        replacement = `color.mix(${weighted[0]?.[1] ?? colors[0]}, ${weighted[1]?.[1] ?? colors[1]}, $weight: ${weight}%, $method: ${space})`;
      }
      return resolveValue(value.slice(0, match.index) + replacement + value.slice(end), chain);
    };
    const declarations = Object.entries(bootstrap6meta).map(([key, token]) => {
      if (tokens[token] === undefined) throw new Error(`Missing Bootstrap token: ${token}`);
      const value = resolveValue(tokens[token]);
      // Preserve font-family quoting and dimensions; these are not color tokens.
      if (key === 'base-font-family' || key.includes('radius')) {
        return `${key}: ${value};`;
      }
      // V6 palettes use OKLCH, including colors outside the sRGB gamut.
      // Gamut-map before converting to legacy RGB for DevExtreme's Sass functions.
      return `${key}: #{color.to-space(color.to-gamut(${value}, $space: rgb, $method: local-minde), rgb)};`;
    });
    const result = await BootstrapExtractor.sassRender(`@use "sass:color";
dx-tokens {${declarations.join('')}}`);
    const items: ConfigMetaItem[] = [];
    postcss.parse(result).walkDecls((declaration) => {
      items.push({ key: `$${declaration.prop}`, value: BootstrapExtractor.convertRemToPx(declaration.value) });
    });
    return items;
  }
}
