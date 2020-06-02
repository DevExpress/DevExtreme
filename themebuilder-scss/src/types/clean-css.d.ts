/* eslint-disable */
// NOTE devextreme-themebuilder need this file because
// original @types/clean-css package has an error
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/45111

// Type definitions for clean-css 4.2
// Project: https://github.com/jakubpawlowicz/clean-css
// Definitions by: Tanguy Krotoff <https://github.com/tkrotoff>
//                 Andrew Potter <https://github.com/GolaWaya>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// / <reference types="node" />

import { RequestOptions as HttpsRequestOptions } from 'https';
import { RequestOptions as HttpRequestOptions } from 'http';

declare interface OptionsBase {

  compatibility?: '*' | 'ie9' | 'ie8' | 'ie7' | CleanCSS.CompatibilityOptions;

  fetch?: (
    uri: string,
    inlineRequest: HttpRequestOptions | HttpsRequestOptions,
    inlineTimeout: number,
    done: (message: string | number, body: string) => void,
  ) => void;

  format?: 'beautify' | 'keep-breaks' | CleanCSS.FormatOptions | false;

  inline?: ReadonlyArray<string> | false;

  inlineRequest?: HttpRequestOptions | HttpsRequestOptions;

  inlineTimeout?: number;

  level?: 0 | 1 | 2 | CleanCSS.OptimizationsOptions;

  rebase?: boolean;

  rebaseTo?: string;

  sourceMap?: boolean;

  sourceMapInlineSources?: boolean;
}

declare namespace CleanCSS {

  interface Output {

    styles: string;

    sourceMap: string;

    errors: string[];

    warnings: string[];

    stats: {

      originalSize: number;

      minifiedSize: number;

      timeSpent: number;

      efficiency: number;
    };
  }

  interface CompatibilityOptions {

    colors?: {

      opacity?: boolean;
    };

    properties?: {

      backgroundClipMerging?: boolean;

      backgroundOriginMerging?: boolean;

      backgroundSizeMerging?: boolean;

      colors?: boolean;

      ieBangHack?: boolean;

      ieFilters?: boolean;

      iePrefixHack?: boolean;

      ieSuffixHack?: boolean;

      merging?: boolean;

      shorterLengthUnits?: false;

      spaceAfterClosingBrace?: true;

      urlQuotes?: boolean;

      zeroUnits?: boolean;
    };

    selectors?: {

      adjacentSpace?: boolean;

      ie7Hack?: boolean;

      mergeablePseudoClasses?: ReadonlyArray<string>;

      mergeablePseudoElements: ReadonlyArray<string>;

      mergeLimit: number;

      multiplePseudoMerging: boolean;
    };

    units?: {

      ch?: boolean;

      in?: boolean;

      pc?: boolean;

      pt?: boolean;

      rem?: boolean;

      vh?: boolean;

      vm?: boolean;

      vmax?: boolean;

      vmin?: boolean;
    };
  }

  interface FormatOptions {

    breaks?: {

      afterAtRule?: boolean;

      afterBlockBegins?: boolean;

      afterBlockEnds?: boolean;

      afterComment?: boolean;

      afterProperty?: boolean;

      afterRuleBegins?: boolean;

      afterRuleEnds?: boolean;

      beforeBlockEnds?: boolean;

      betweenSelectors?: boolean;
    };

    breakWith?: string;

    indentBy?: number;

    indentWith?: 'space' | 'tab';

    spaces?: {

      aroundSelectorRelation?: boolean;

      beforeBlockBegins?: boolean;

      beforeValue?: boolean;
    };

    wrapAt?: false | number;

    semicolonAfterLastProperty?: boolean;
  }

  interface OptimizationsOptions {
    1?: {

      all?: boolean;

      cleanupCharsets?: boolean;

      normalizeUrls?: boolean;

      optimizeBackground?: boolean;

      optimizeBorderRadius?: boolean;

      optimizeFilter?: boolean;

      optimizeFont?: boolean;

      optimizeFontWeight?: boolean;

      optimizeOutline?: boolean;

      removeEmpty?: boolean;

      removeNegativePaddings?: boolean;

      removeQuotes?: boolean;

      removeWhitespace?: boolean;

      replaceMultipleZeros?: boolean;

      replaceTimeUnits?: boolean;

      replaceZeroUnits?: boolean;

      roundingPrecision?: boolean;

      selectorsSortingMethod?: 'standard' | 'natural' | 'none';

      specialComments?: string;

      tidyAtRules?: boolean;

      tidyBlockScopes?: boolean;

      tidySelectors?: boolean;

      transform?: (propertyName: string, propertyValue: string, selector?: string) => string;
    };
    2?: {

      all?: boolean;

      mergeAdjacentRules?: boolean;

      mergeIntoShorthands?: boolean;

      mergeMedia?: boolean;

      mergeNonAdjacentRules?: boolean;

      mergeSemantically?: boolean;

      overrideProperties?: boolean;

      removeEmpty?: boolean;

      reduceNonAdjacentRules?: boolean;

      removeDuplicateFontRules?: boolean;

      removeDuplicateMediaBlocks?: boolean;

      removeDuplicateRules?: boolean;

      removeUnusedAtRules?: boolean;

      restructureRules?: boolean;

      skipProperties?: ReadonlyArray<string>;
    };
  }

  interface Source {

    [path: string]: {

      styles: string;

      sourceMap?: string;
    };
  }

    type FetchCallback = (message: string | number, body: string) => void;

    type Sources = string | ReadonlyArray<string> | Source | ReadonlyArray<Source> | Buffer;

    type Minifier = MinifierOutput | MinifierPromise;

    interface MinifierOutput {
      minify(sources: Sources, callback?: (error: any, output: Output) => void): Output;
      minify(
        sources: Sources,
        sourceMap: string,
        callback?: (error: any, output: Output) => void
      ): Output;
    }

    interface MinifierPromise {
      minify(sources: Sources, sourceMap?: string): Promise<Output>;
    }

    type OptionsPromise = OptionsBase & {

      returnPromise: true;
    };

    type OptionsOutput = OptionsBase & {

      returnPromise?: false;
    };

    type Options = OptionsPromise | OptionsOutput;

    interface Constructor {
      new(options: OptionsPromise): MinifierPromise;
      new(options?: OptionsOutput): MinifierOutput;
    }
}

declare const CleanCSS: CleanCSS.Constructor;

export = CleanCSS;
