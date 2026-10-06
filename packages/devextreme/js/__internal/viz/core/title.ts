/* eslint-disable import/no-import-module-exports */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { extend } from '@js/core/utils/extend';
import { isString as _isString } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { LayoutTargetOptions } from '@ts/viz/core/layout';
import type { AlignedLayoutRect } from '@ts/viz/core/layout_element';
import { LayoutElement } from '@ts/viz/core/layout_element';
import type { BBox, Bounds } from '@ts/viz/core/types';

import { enumParser, patchFontOptions as _patchFontOptions } from './utils';

const _Number = Number;
const parseHorizontalAlignment = enumParser(['left', 'center', 'right']);
const parseVerticalAlignment = enumParser(['top', 'bottom']);

const DEFAULT_MARGIN = 10;

interface TitleParams {
  renderer: ThemeValue;
  cssClass?: string;
  root?: ThemeValue;
  incidentOccurred: (id: string) => void;
}

function hasText(text: ThemeValue): boolean {
  return !!(text && String(text).length > 0);
}

function processTitleLength(elem: ThemeValue, text: ThemeValue, width: number, options: ThemeValue, placeholderSize: ThemeValue): void {
  if (elem.attr({ text }).setMaxSize(width, placeholderSize, options).textChanged) {
    elem.setTitle(text);
  }
}

function pickMarginValue(value: ThemeValue): number {
  return value >= 0 ? _Number(value) : DEFAULT_MARGIN;
}

function validateMargin(margin: ThemeValue): Bounds {
  let result: Bounds;
  if (margin >= 0) {
    result = {
      left: _Number(margin), top: _Number(margin), right: _Number(margin), bottom: _Number(margin),
    };
  } else {
    margin = margin || {};
    result = {
      left: pickMarginValue(margin.left),
      top: pickMarginValue(margin.top),
      right: pickMarginValue(margin.right),
      bottom: pickMarginValue(margin.bottom),
    };
  }
  return result;
}

function checkRect(rect: number[], boundingRect: BBox): boolean {
  return rect[2] - rect[0] < boundingRect.width || rect[3] - rect[1] < boundingRect.height;
}
export let Title = class Title extends LayoutElement {
  declare _params: TitleParams;

  declare _group: ThemeValue;

  declare _hasText: boolean;

  declare _titleElement: ThemeValue;

  declare _subtitleElement: ThemeValue;

  declare _clipRect: ThemeValue;

  declare _baseLineCorrection: number;

  declare _boundingRect: AlignedLayoutRect;

  declare DEBUG_getOptions?: () => ThemeValue;

  constructor(params: TitleParams) {
    super();
    this._params = params;
    this._group = params.renderer.g().attr({ class: params.cssClass }).linkOn(params.root || params.renderer.root, 'title');
    this._hasText = false;
  }

  dispose(): void {
    this._group.linkRemove();
    this._group.linkOff();
    if (this._titleElement) {
      this._clipRect.dispose();
      this._titleElement = this._subtitleElement = this._clipRect = null;
    }
    // @ts-expect-error dispose() drops the references
    this._params = this._group = this._options = null;
  }

  _updateOptions(options: ThemeValue): void {
    this._options = options;
    this._options.horizontalAlignment = parseHorizontalAlignment(options.horizontalAlignment, 'center');
    this._options.verticalAlignment = parseVerticalAlignment(options.verticalAlignment, 'top');
    this._options.margin = validateMargin(options.margin);
  }

  _updateStructure(): void {
    const renderer = this._params.renderer;
    const group = this._group;
    const options = this._options;
    const align = options.horizontalAlignment;

    // Looks like the following "laziness" is only to avoid unnecessary DOM content creation -
    // for example when widget is created without "title" option.
    if (!this._titleElement) {
      this._titleElement = renderer.text().append(group);
      this._subtitleElement = renderer.text();
      this._clipRect = renderer.clipRect();
      group.attr({ 'clip-path': this._clipRect.id });
    }

    this._titleElement.attr({ align, class: options.cssClass });
    this._subtitleElement.attr({ align, class: options.subtitle.cssClass });

    group.linkAppend();
    hasText(options.subtitle.text) ? this._subtitleElement.append(group) : this._subtitleElement.remove();
  }

  _updateTexts(): void {
    const options = this._options;
    const subtitleOptions = options.subtitle;
    const titleElement = this._titleElement;
    const subtitleElement = this._subtitleElement;
    const testText = 'A';
    let titleBox;

    titleElement.attr({ text: testText, y: 0 }).css(_patchFontOptions(options.font));
    titleBox = titleElement.getBBox(); // for multiline text
    this._baseLineCorrection = titleBox.height + titleBox.y;

    titleElement.attr({ text: options.text });
    titleBox = titleElement.getBBox();
    const y = -titleBox.y;

    titleElement.attr({ y });

    if (hasText(subtitleOptions.text)) {
      subtitleElement.attr({ text: subtitleOptions.text, y: 0 }).css(_patchFontOptions(subtitleOptions.font));
    }
  }

  _shiftSubtitle(): void {
    const titleBox = this._titleElement.getBBox();
    const element = this._subtitleElement;
    const offset = this._options.subtitle.offset;

    element.move(0, titleBox.y + titleBox.height - element.getBBox().y - offset);
  }

  _updateBoundingRectAlignment(): void {
    const boundingRect = this._boundingRect;
    const options = this._options;

    boundingRect.verticalAlignment = options.verticalAlignment;
    boundingRect.horizontalAlignment = options.horizontalAlignment;
    boundingRect.cutLayoutSide = options.verticalAlignment;
    boundingRect.cutSide = 'vertical';
    boundingRect.position = {
      horizontal: options.horizontalAlignment,
      vertical: options.verticalAlignment,
    };
  }

  hasText(): boolean {
    return this._hasText;
  }

  update(themeOptions: ThemeValue, userOptions?: ThemeValue): boolean {
    const options = extend(true, {}, themeOptions, processTitleOptions(userOptions));
    const _hasText = hasText(options.text);
    const isLayoutChanged = _hasText || _hasText !== this._hasText;

    this._baseLineCorrection = 0;

    this._updateOptions(options);
    this._boundingRect = {} as AlignedLayoutRect;
    if (_hasText) {
      this._updateStructure();
      this._updateTexts();
    } else {
      this._group.linkRemove();
    }
    this._updateBoundingRect();
    this._updateBoundingRectAlignment();
    this._hasText = _hasText;
    return isLayoutChanged;
  }

  draw(width: number, height: number): this {
    if (this._hasText) {
      this._group.linkAppend();
      this._correctTitleLength(width);

      if (this._group.getBBox().height > height) {
        this.freeSpace();
      }
    }

    return this;
  }

  _correctTitleLength(width: number): void {
    const options = this._options;
    const margin = options.margin;
    const maxWidth = width - margin.left - margin.right;

    let placeholderSize = options.placeholderSize;

    processTitleLength(this._titleElement, options.text, maxWidth, options, placeholderSize);
    if (this._subtitleElement) {
      if (_Number(placeholderSize) > 0) {
        placeholderSize -= this._titleElement.getBBox().height;
      }
      processTitleLength(this._subtitleElement, options.subtitle.text, maxWidth, options.subtitle, placeholderSize);
      this._shiftSubtitle();
    }

    this._updateBoundingRect();

    const { x, y, height } = this.getCorrectedLayoutOptions();
    this._clipRect.attr({
      x, y, width, height,
    });
  }

  getLayoutOptions(): AlignedLayoutRect {
    return this._boundingRect || null;
  }

  shift(x: number, y: number): this {
    const box = this.getLayoutOptions();
    this._group.move(x - box.x, y - box.y);

    return this;
  }

  _updateBoundingRect(): void {
    const options = this._options;
    const margin = options.margin;
    const boundingRect = this._boundingRect;
    const box = this._hasText ? this._group.getBBox() : {
      width: 0, height: 0, x: 0, y: 0, isEmpty: true,
    };

    if (!box.isEmpty) {
      box.height += margin.top + margin.bottom - this._baseLineCorrection;
      box.width += margin.left + margin.right;
      box.x -= margin.left;
      box.y += this._baseLineCorrection - margin.top;
    }

    if (options.placeholderSize > 0) {
      box.height = options.placeholderSize;
    }

    boundingRect.height = box.height;
    boundingRect.width = box.width;
    boundingRect.x = box.x;
    boundingRect.y = box.y;
  }

  getCorrectedLayoutOptions(): AlignedLayoutRect {
    const srcBox = this.getLayoutOptions();
    const correction = this._baseLineCorrection;

    return extend({}, srcBox, {
      y: srcBox.y - correction,
      height: srcBox.height + correction,
    });
  }

  // BaseWidget_layout_implementation
  layoutOptions(): LayoutTargetOptions | null {
    if (!this._hasText) {
      return null;
    }
    return {
      horizontalAlignment: this._boundingRect.horizontalAlignment,
      verticalAlignment: this._boundingRect.verticalAlignment,
      priority: 0,
    };
  }

  measure(size: number[]): number[] {
    this.draw(size[0], size[1]);
    return [this._boundingRect.width, this._boundingRect.height];
  }

  move(rect: number[], fitRect: number[]): void {
    const boundingRect = this._boundingRect;
    if (checkRect(rect, boundingRect)) {
      this.shift(fitRect[0], fitRect[1]);
    } else {
      this.shift(Math.round(rect[0]), Math.round(rect[1]));
    }
  }

  freeSpace(): void {
    this._params.incidentOccurred('W2103');
    this._group.linkRemove();
    this._boundingRect.width = this._boundingRect.height = 0;
  }

  getOptions(): ThemeValue {
    return this._options;
  }

  changeLink(root: ThemeValue): void {
    this._group.linkRemove();
    this._group.linkOn(root, 'title');
  }
  // BaseWidget_layout_implementation
};

/// #DEBUG
Title.prototype.DEBUG_getOptions = function (): ThemeValue { return this._options; };
/// #ENDDEBUG

function processTitleOptions(options: ThemeValue): ThemeValue {
  const newOptions = _isString(options) ? { text: options } : options || {};
  newOptions.subtitle = _isString(newOptions.subtitle) ? { text: newOptions.subtitle } : newOptions.subtitle || {};
  return newOptions;
}

export const plugin = {
  name: 'title',
  init(): void {
    const that = this;

    that._title = new Title({
      renderer: that._renderer,
      cssClass: `${that._rootClassPrefix}-title`,
      incidentOccurred: that._incidentOccurred,
    });
    that._layout.add(that._title);
  },
  dispose(): void {
    this._title.dispose();
    this._title = null;
  },
  customize(constructor: ThemeValue): void {
    constructor.addChange({
      code: 'TITLE',
      handler(): void {
        if (this._title.update(this._themeManager.theme('title'), this.option('title'))) {
          this._change(['LAYOUT']);
        }
      },
      isThemeDependent: true,
      option: 'title',
      isOptionChange: true,
    });
  },
  fontFields: ['title.font', 'title.subtitle.font'],
};

/// #DEBUG
exports.DEBUG_set_title = function (value): void {
  Title = value;
};
/// #ENDDEBUG
