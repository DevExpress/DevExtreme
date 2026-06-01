import type { ApplyValueMode } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { locate, move } from '@ts/common/core/animation/translator';
import messageLocalization from '@ts/core/localization/message';
import devices from '@ts/core/m_devices';
import { Guid } from '@ts/core/m_guid';
import { extend } from '@ts/core/utils/m_extend';
import { getHeight, getOuterHeight, getWidth } from '@ts/core/utils/m_size';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeyHandler, SupportedKeys } from '@ts/core/widget/widget';
import eventsEngine from '@ts/events/core/m_events_engine';
import { name as clickEventName } from '@ts/events/m_click';
import { isCommandKeyPressed } from '@ts/events/utils/index';
import Color, { type ColorInstance } from '@ts/m_color';
import Draggable from '@ts/m_draggable';
import type { EditorProperties, ValueChangedEvent } from '@ts/ui/editor/editor';
import Editor from '@ts/ui/editor/editor';
import NumberBox from '@ts/ui/number_box/m_number_box';
import { WIDGET_CLASS as NUMBERBOX_CLASS } from '@ts/ui/number_box/m_number_box.base';
import TextBox from '@ts/ui/text_box/text_box';

const COLOR_VIEW_CLASS = 'dx-colorview';
const COLOR_VIEW_CONTAINER_CLASS = 'dx-colorview-container';

const COLOR_VIEW_ROW_CLASS = 'dx-colorview-container-row';
const COLOR_VIEW_CELL_CLASS = 'dx-colorview-container-cell';

const COLOR_VIEW_PALETTE_CLASS = 'dx-colorview-palette';
const COLOR_VIEW_PALETTE_CELL_CLASS = 'dx-colorview-palette-cell';
const COLOR_VIEW_PALETTE_HANDLE_CLASS = 'dx-colorview-palette-handle';
const COLOR_VIEW_PALETTE_GRADIENT_CLASS = 'dx-colorview-palette-gradient';
const COLOR_VIEW_PALETTE_GRADIENT_WHITE_CLASS = 'dx-colorview-palette-gradient-white';
const COLOR_VIEW_PALETTE_GRADIENT_BLACK_CLASS = 'dx-colorview-palette-gradient-black';

const COLOR_VIEW_HUE_SCALE_CLASS = 'dx-colorview-hue-scale';
const COLOR_VIEW_HUE_SCALE_CELL_CLASS = 'dx-colorview-hue-scale-cell';
const COLOR_VIEW_HUE_SCALE_HANDLE_CLASS = 'dx-colorview-hue-scale-handle';
const COLOR_VIEW_HUE_SCALE_WRAPPER_CLASS = 'dx-colorview-hue-scale-wrapper';

const COLOR_VIEW_CONTROLS_CONTAINER_CLASS = 'dx-colorview-controls-container';

const COLOR_VIEW_RED_LABEL_CLASS = 'dx-colorview-label-red';
const COLOR_VIEW_GREEN_LABEL_CLASS = 'dx-colorview-label-green';
const COLOR_VIEW_BLUE_LABEL_CLASS = 'dx-colorview-label-blue';
const COLOR_VIEW_HEX_LABEL_CLASS = 'dx-colorview-label-hex';

const COLOR_VIEW_ALPHA_CHANNEL_SCALE_CLASS = 'dx-colorview-alpha-channel-scale';
const COLOR_VIEW_APLHA_CHANNEL_ROW_CLASS = 'dx-colorview-alpha-channel-row';
const COLOR_VIEW_ALPHA_CHANNEL_SCALE_WRAPPER_CLASS = 'dx-colorview-alpha-channel-wrapper';
const COLOR_VIEW_ALPHA_CHANNEL_LABEL_CLASS = 'dx-colorview-alpha-channel-label';
const COLOR_VIEW_ALPHA_CHANNEL_HANDLE_CLASS = 'dx-colorview-alpha-channel-handle';
const COLOR_VIEW_ALPHA_CHANNEL_CELL_CLASS = 'dx-colorview-alpha-channel-cell';
const COLOR_VIEW_ALPHA_CHANNEL_BORDER_CLASS = 'dx-colorview-alpha-channel-border';

const COLOR_VIEW_COLOR_PREVIEW = 'dx-colorview-color-preview';
const COLOR_VIEW_COLOR_PREVIEW_CONTAINER_CLASS = 'dx-colorview-color-preview-container';
const COLOR_VIEW_COLOR_PREVIEW_CONTAINER_INNER_CLASS = 'dx-colorview-color-preview-container-inner';
const COLOR_VIEW_COLOR_PREVIEW_COLOR_CURRENT = 'dx-colorview-color-preview-color-current';
const COLOR_VIEW_COLOR_PREVIEW_COLOR_NEW = 'dx-colorview-color-preview-color-new';

const TEXT_EDITOR_INPUT = 'dx-texteditor-input';

const BLACK_COLOR = '#000000';

interface PaletteHandlePosition {
  top: number; left: number;
}

export interface ColorViewProperties extends EditorProperties {
  keyStep?: number;

  value?: string | null;

  matchValue?: string | null;

  editAlphaChannel?: boolean;

  onEnterKeyPressed?: (event?) => void;

  applyValueMode?: ApplyValueMode;

  target?: string | Element | dxElementWrapper | null;
}

type EditorWithLabelType = new (
  element: dxElementWrapper,
  options?: object,
) => { registerKeyHandler: (key: string, handler: SupportedKeyHandler) => void };

interface EditorWithLabelOptions {
  editorType: EditorWithLabelType;
  value: number | string;
  onValueChanged: (args: ValueChangedEvent) => void;
  labelText: string;
  labelAriaText: string;
  labelClass: string;
  min?: number;
  max?: number;
  step?: number;
}

class ColorView extends Editor<ColorViewProperties> {
  _$palette!: dxElementWrapper;

  _$paletteHandle?: dxElementWrapper;

  _paletteWidth!: number;

  _paletteHeight!: number;

  _paletteHandleWidth!: number;

  _paletteHandleHeight!: number;

  _updateByDrag?: boolean;

  _currentColor!: ColorInstance;

  _isTopColorHue?: boolean;

  _$colorPickerContainer!: dxElementWrapper;

  _$hueScale?: dxElementWrapper;

  _$hueScaleHandle?: dxElementWrapper;

  _$hueScaleWrapper?: dxElementWrapper;

  _hueScaleHeight?: number;

  _hueScaleWrapperHeight!: number;

  _hueScaleHandleHeight!: number;

  _suppressEditorsValueUpdating?: boolean;

  _$alphaChannelHandle?: dxElementWrapper;

  _$controlsContainer!: dxElementWrapper;

  _$alphaChannelScale?: dxElementWrapper;

  _alphaChannelInput!: NumberBox;

  _rgbInputs!: NumberBox[];

  _hexInput!: TextBox;

  _$currentColor?: dxElementWrapper;

  _$baseColor?: dxElementWrapper;

  _alphaChannelScaleWorkWidth!: number;

  _alphaChannelHandleWidth!: number;

  _rgbInputsWithLabels?: dxElementWrapper[];

  _onEnterKeyPressedAction?: (event: Record<string, unknown>) => void;

  _supportedKeys(): SupportedKeys {
    const { rtlEnabled: isRTL } = this.option();

    const getHorizontalPaletteStep = (e: KeyboardEvent): number => {
      let step = 100 / this._paletteWidth;
      if (e.shiftKey) {
        const { keyStep } = this.option();
        step *= keyStep ?? 1;
      }

      step = step > 1 ? step : 1;
      return Math.round(step);
    };

    const updatePaletteValue = (): void => {
      this._placePaletteHandle();
      this._updateColorFromHsv(
        this._currentColor.hsv.h,
        this._currentColor.hsv.s,
        this._currentColor.hsv.v,
      );
    };

    const updateHorizontalPaletteValue = (step: number): void => {
      let value = this._currentColor.hsv.s + step;

      if (value > 100) {
        value = 100;
      } else if (value < 0) {
        value = 0;
      }

      this._currentColor.hsv.s = value;
      updatePaletteValue();
    };
    const getVerticalPaletteStep = (e: KeyboardEvent): number => {
      let step = 100 / this._paletteHeight;
      if (e.shiftKey) {
        const { keyStep } = this.option();
        step *= keyStep ?? 1;
      }

      step = step > 1 ? step : 1;
      return Math.round(step);
    };
    const updateVerticalPaletteValue = (step: number): void => {
      let value = this._currentColor.hsv.v + step;

      if (value > 100) {
        value = 100;
      } else if (value < 0) {
        value = 0;
      }

      this._currentColor.hsv.v = value;
      updatePaletteValue();
    };
    const getHueScaleStep = (e: KeyboardEvent): number => {
      let step = 360 / (this._hueScaleWrapperHeight - this._hueScaleHandleHeight);
      if (e.shiftKey) {
        const { keyStep } = this.option();
        step *= keyStep ?? 1;
      }

      step = step > 1 ? step : 1;
      return step;
    };
    const updateHueScaleValue = (step: number): void => {
      this._currentColor.hsv.h += step;
      this._placeHueScaleHandle();
      const handleLocation = locate(this._$hueScaleHandle);
      this._updateColorHue(handleLocation.top + this._hueScaleHandleHeight / 2);
    };
    const getAlphaScaleStep = (e: KeyboardEvent): number => {
      let step = 1 / this._alphaChannelScaleWorkWidth;
      if (e.shiftKey) {
        const { keyStep } = this.option();
        step *= keyStep ?? 1;
      }

      step = step > 0.01 ? step : 0.01;
      step = isRTL ? -step : step;
      return step;
    };
    const updateAlphaScaleValue = (step: number): void => {
      this._currentColor.a += step;
      this._placeAlphaChannelHandle();
      const handleLocation = locate(this._$alphaChannelHandle);
      this._calculateColorTransparencyByScaleWidth(
        handleLocation.left + this._alphaChannelHandleWidth / 2,
      );
    };

    return {
      ...super._supportedKeys(),
      upArrow(e): void {
        e.preventDefault();
        e.stopPropagation();
        if (isCommandKeyPressed(e)) {
          if (this._currentColor.hsv.h <= 360 && !this._isTopColorHue) {
            this._saveValueChangeEvent(e);
            updateHueScaleValue(getHueScaleStep(e));
          }
        } else if (this._currentColor.hsv.v < 100) {
          this._saveValueChangeEvent(e);
          updateVerticalPaletteValue(getVerticalPaletteStep(e));
        }
      },
      downArrow(e): void {
        e.preventDefault();
        e.stopPropagation();
        if (isCommandKeyPressed(e)) {
          if (this._currentColor.hsv.h >= 0) {
            if (this._isTopColorHue) {
              this._currentColor.hsv.h = 360;
            }

            this._saveValueChangeEvent(e);
            updateHueScaleValue(-getHueScaleStep(e));
          }
        } else if (this._currentColor.hsv.v > 0) {
          this._saveValueChangeEvent(e);
          updateVerticalPaletteValue(-getVerticalPaletteStep(e));
        }
      },
      rightArrow(e): void {
        e.preventDefault();
        e.stopPropagation();
        const { editAlphaChannel } = this.option();
        if (isCommandKeyPressed(e)) {
          if (isRTL ? this._currentColor.a < 1 : this._currentColor.a > 0 && editAlphaChannel) {
            this._saveValueChangeEvent(e);
            updateAlphaScaleValue(-getAlphaScaleStep(e));
          }
        } else if (this._currentColor.hsv.s < 100) {
          this._saveValueChangeEvent(e);
          updateHorizontalPaletteValue(getHorizontalPaletteStep(e));
        }
      },
      leftArrow(e): void {
        e.preventDefault();
        e.stopPropagation();
        const { editAlphaChannel } = this.option();
        if (isCommandKeyPressed(e)) {
          if (isRTL ? this._currentColor.a > 0 : this._currentColor.a < 1 && editAlphaChannel) {
            this._saveValueChangeEvent(e);
            updateAlphaScaleValue(getAlphaScaleStep(e));
          }
        } else if (this._currentColor.hsv.s > 0) {
          this._saveValueChangeEvent(e);
          updateHorizontalPaletteValue(-getHorizontalPaletteStep(e));
        }
      },
      enter: (e: KeyboardEvent): void => {
        this._fireEnterKeyPressed(e);
      },
    };
  }

  _getDefaultOptions(): ColorViewProperties {
    return {
      ...super._getDefaultOptions(),
      value: null,
      matchValue: null,
      onEnterKeyPressed: undefined,
      editAlphaChannel: false,
      keyStep: 1,
      stylingMode: undefined,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<ColorViewProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  _init(): void {
    super._init();
    this._initColorAndOpacity();
    this._initEnterKeyPressedAction();
  }

  _initEnterKeyPressedAction(): void {
    this._onEnterKeyPressedAction = this._createActionByOption('onEnterKeyPressed');
  }

  _fireEnterKeyPressed(e: KeyboardEvent): void {
    if (!this._onEnterKeyPressedAction) return;
    this._onEnterKeyPressedAction({
      event: e,
    });
  }

  _initColorAndOpacity(): void {
    const { value } = this.option();
    this._setCurrentColor(value);
  }

  _setCurrentColor(currentValue: string | null | undefined): void {
    const value = currentValue ?? BLACK_COLOR;
    const newColor = new Color(value);
    if (!newColor.colorIsInvalid) {
      if (!this._currentColor || this._makeRgba(this._currentColor) !== this._makeRgba(newColor)) {
        this._currentColor = newColor;
        if (this._$currentColor) {
          this._makeTransparentBackground(this._$currentColor, newColor);
        }
      }
    } else {
      if (!this._currentColor) {
        this._currentColor = new Color(BLACK_COLOR);
      }
      this.option('value', this._currentColor.baseColor);
    }
  }

  _setBaseColor(baseValue: string | null | undefined): void {
    const color = baseValue ?? BLACK_COLOR;
    const newColor = new Color(color);

    if (!newColor.colorIsInvalid) {
      const { matchValue } = this.option();

      const isBaseColorChanged = matchValue !== this._makeRgba(newColor);
      if (isBaseColorChanged) {
        if (this._$baseColor) {
          this._makeTransparentBackground(this._$baseColor, newColor);
        }
      }
    }
  }

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(COLOR_VIEW_CLASS);
    this._renderColorPickerContainer();
  }

  _render(): void {
    super._render();

    this._renderPalette();
    this._renderHueScale();
    this._renderControlsContainer();
    this._renderControls();
    this._renderAlphaChannelElements();
  }

  _makeTransparentBackground($el: dxElementWrapper, color: ColorInstance): void {
    $el.css('backgroundColor', this._makeRgba(color));
  }

  _makeRgba(color: ColorInstance): string {
    return `rgba(${[color.r, color.g, color.b, color.a].join(', ')})`;
  }

  _renderColorPickerContainer(): void {
    const $parent = this.$element();
    this._$colorPickerContainer = $('<div>').addClass(COLOR_VIEW_CONTAINER_CLASS)
      .appendTo($parent);

    this._renderHtmlRows();
  }

  _renderHtmlRows(): void {
    const { editAlphaChannel } = this.option();
    const $renderedRows = this._$colorPickerContainer.find(`.${COLOR_VIEW_ROW_CLASS}`);
    const renderedRowsCount = $renderedRows.length;
    const rowCount = editAlphaChannel ? 2 : 1;
    let delta = renderedRowsCount - rowCount;

    if (delta > 0) {
      $renderedRows.eq(-1).remove();
    }
    if (delta < 0) {
      delta = Math.abs(delta);
      const rows: dxElementWrapper[] = [];
      for (let i = 0; i < delta; i += 1) {
        rows.push($('<div>').addClass(COLOR_VIEW_ROW_CLASS));
      }

      if (renderedRowsCount) {
        rows.forEach((row) => { $renderedRows.eq(0).after(row); });
      } else {
        this._$colorPickerContainer.append(rows);
      }
    }
  }

  _renderHtmlCellInsideRow(
    index: number,
    $rowParent: dxElementWrapper,
    additionalClass?: string,
  ): dxElementWrapper {
    return $('<div>')
      .addClass(COLOR_VIEW_CELL_CLASS)
      .addClass(additionalClass ?? '')
      .appendTo($rowParent.find(`.${COLOR_VIEW_ROW_CLASS}`).eq(index));
  }

  _renderPalette(): void {
    const $paletteCell = this._renderHtmlCellInsideRow(
      0,
      this._$colorPickerContainer,
      COLOR_VIEW_PALETTE_CELL_CLASS,
    );
    const $paletteGradientWhite = $('<div>').addClass([COLOR_VIEW_PALETTE_GRADIENT_CLASS, COLOR_VIEW_PALETTE_GRADIENT_WHITE_CLASS].join(' '));
    const $paletteGradientBlack = $('<div>').addClass([COLOR_VIEW_PALETTE_GRADIENT_CLASS, COLOR_VIEW_PALETTE_GRADIENT_BLACK_CLASS].join(' '));

    this._$palette = $('<div>')
      .addClass(COLOR_VIEW_PALETTE_CLASS)
      .css('backgroundColor', this._currentColor.getPureColor().toHex())
      .appendTo($paletteCell);

    this._paletteHeight = getHeight(this._$palette);
    this._paletteWidth = getWidth(this._$palette);

    this._renderPaletteHandle();
    this._$palette.append([$paletteGradientWhite, $paletteGradientBlack]);
  }

  _renderPaletteHandle(): void {
    const { target } = this.option();
    this._$paletteHandle = $('<div>')
      .addClass(COLOR_VIEW_PALETTE_HANDLE_CLASS)
      .appendTo(this._$palette);

    const ariaId = `dx-${new Guid()}`;
    const handleAria = {
      id: ariaId,
      role: 'application',
    };

    this.setAria(handleAria, this._$paletteHandle);
    this.setAria('activedescendant', ariaId, target);

    this._createComponent(this._$paletteHandle, Draggable, {
      contentTemplate: null,
      // @ts-expect-error need to fix type for Draggable boundary option
      boundary: this._$palette,
      allowMoveByClick: true,
      boundOffset: () => -this._paletteHandleHeight / 2,
      onDragMove: ({ event }) => {
        const paletteHandlePosition = locate(this._$paletteHandle);
        this._updateByDrag = true;
        this._saveValueChangeEvent(event);
        this._updateColorFromHsv(
          this._currentColor.hsv.h,
          this._calculateColorSaturation(paletteHandlePosition),
          this._calculateColorValue(paletteHandlePosition),
        );
      },
    });

    this._paletteHandleWidth = getWidth(this._$paletteHandle);
    this._paletteHandleHeight = getHeight(this._$paletteHandle);

    this._placePaletteHandle();
  }

  _placePaletteHandle(): void {
    move(this._$paletteHandle, {
      left: Math.round(
        (this._paletteWidth * this._currentColor.hsv.s) / 100 - this._paletteHandleWidth / 2,
      ),
      top: Math.round(
        this._paletteHeight
          - ((this._paletteHeight * this._currentColor.hsv.v) / 100)
            - this._paletteHandleHeight / 2,
      ),
    });
  }

  _calculateColorValue(paletteHandlePosition: PaletteHandlePosition): number {
    const value = Math.floor(paletteHandlePosition.top + this._paletteHandleHeight / 2);
    return 100 - Math.round((value * 100) / this._paletteHeight);
  }

  _calculateColorSaturation(paletteHandlePosition: PaletteHandlePosition): number {
    const saturation = Math.floor(paletteHandlePosition.left + this._paletteHandleWidth / 2);
    return Math.round((saturation * 100) / this._paletteWidth);
  }

  _updateColorFromHsv(hue: number, saturation: number, value: number): void {
    const { a } = this._currentColor;
    this._currentColor = new Color(`hsv(${[hue, saturation, value].join(',')})`);
    this._currentColor.a = a;
    this._updateColorParamsAndColorPreview();
    this.applyColor();
  }

  _renderHueScale(): void {
    const $hueScaleCell = this._renderHtmlCellInsideRow(
      0,
      this._$colorPickerContainer,
      COLOR_VIEW_HUE_SCALE_CELL_CLASS,
    );

    this._$hueScaleWrapper = $('<div>')
      .addClass(COLOR_VIEW_HUE_SCALE_WRAPPER_CLASS)
      .appendTo($hueScaleCell);

    this._$hueScale = $('<div>')
      .addClass(COLOR_VIEW_HUE_SCALE_CLASS)
      .appendTo(this._$hueScaleWrapper);

    this._hueScaleHeight = getHeight(this._$hueScale);
    this._hueScaleWrapperHeight = getOuterHeight(this._$hueScaleWrapper);

    this._renderHueScaleHandle();
  }

  _renderHueScaleHandle(): void {
    if (this._$hueScaleWrapper !== undefined) {
      this._$hueScaleHandle = $('<div>')
        .addClass(COLOR_VIEW_HUE_SCALE_HANDLE_CLASS)
        .appendTo(this._$hueScaleWrapper);
      this._createComponent(this._$hueScaleHandle, Draggable, {
        contentTemplate: null,
        // @ts-expect-error need to fix type for Draggable boundary option
        boundary: this._$hueScaleWrapper,
        allowMoveByClick: true,
        dragDirection: 'vertical',
        onDragMove: ({ event }) => {
          this._updateByDrag = true;
          this._saveValueChangeEvent(event);
          this._updateColorHue(locate(this._$hueScaleHandle).top + this._hueScaleHandleHeight / 2);
        },
      });
    }

    this._hueScaleHandleHeight = getHeight(this._$hueScaleHandle);

    this._placeHueScaleHandle();
  }

  _placeHueScaleHandle(): void {
    const hueScaleHeight = this._hueScaleWrapperHeight;
    const handleHeight = this._hueScaleHandleHeight;
    let top = ((hueScaleHeight - handleHeight) * (360 - this._currentColor.hsv.h)) / 360;

    if (hueScaleHeight < top + handleHeight) {
      top = hueScaleHeight - handleHeight;
    }
    if (top < 0) {
      top = 0;
    }

    move(this._$hueScaleHandle, { top: Math.round(top) });
  }

  _updateColorHue(handlePosition: number): void {
    let hue = 360 - Math.round(
      ((handlePosition - this._hueScaleHandleHeight / 2) * 360)
        / (this._hueScaleWrapperHeight - this._hueScaleHandleHeight),
    );
    const saturation = this._currentColor.hsv.s;
    const value = this._currentColor.hsv.v;

    this._isTopColorHue = false;

    hue = hue < 0 ? 0 : hue;

    if (hue >= 360) {
      this._isTopColorHue = true;
      hue = 0;
    }

    this._updateColorFromHsv(hue, saturation, value);
    this._$palette.css('backgroundColor', this._currentColor.getPureColor().toHex());
  }

  _renderControlsContainer(): void {
    const $controlsContainerCell = this._renderHtmlCellInsideRow(0, this._$colorPickerContainer);
    this._$controlsContainer = $('<div>')
      .addClass(COLOR_VIEW_CONTROLS_CONTAINER_CLASS)
      .appendTo($controlsContainerCell);
  }

  _renderControls(): void {
    this._renderColorsPreview();
    this._renderRgbInputs();
    this._renderHexInput();
  }

  _renderColorsPreview(): void {
    const { matchValue } = this.option();
    const $colorsPreviewContainer = $('<div>')
      .addClass(COLOR_VIEW_COLOR_PREVIEW_CONTAINER_CLASS)
      .appendTo(this._$controlsContainer);

    const $colorsPreviewContainerInner = $('<div>')
      .addClass(COLOR_VIEW_COLOR_PREVIEW_CONTAINER_INNER_CLASS)
      .appendTo($colorsPreviewContainer);

    this._$currentColor = $('<div>').addClass([COLOR_VIEW_COLOR_PREVIEW, COLOR_VIEW_COLOR_PREVIEW_COLOR_NEW].join(' '));
    this._$baseColor = $('<div>').addClass([COLOR_VIEW_COLOR_PREVIEW, COLOR_VIEW_COLOR_PREVIEW_COLOR_CURRENT].join(' '));

    this._makeTransparentBackground(this._$baseColor, new Color(matchValue ?? BLACK_COLOR));
    this._makeTransparentBackground(this._$currentColor, this._currentColor);

    $colorsPreviewContainerInner.append([this._$baseColor, this._$currentColor]);
  }

  _renderAlphaChannelElements():void {
    const { editAlphaChannel } = this.option();
    if (editAlphaChannel) {
      this._$colorPickerContainer
        .find(`.${COLOR_VIEW_ROW_CLASS}`)
        .eq(1)
        .addClass(COLOR_VIEW_APLHA_CHANNEL_ROW_CLASS);

      this._renderAlphaChannelScale();
      this._renderAlphaChannelInput();
    }
  }

  _renderRgbInputs(): void {
    this._rgbInputsWithLabels = [
      this._renderEditorWithLabel({
        editorType: NumberBox,
        value: this._currentColor.r,
        onValueChanged: this._updateColor.bind(this, false),
        labelText: 'R',
        labelAriaText: messageLocalization.format('dxColorView-ariaRed'),
        labelClass: COLOR_VIEW_RED_LABEL_CLASS,
      }),
      this._renderEditorWithLabel({
        editorType: NumberBox,
        value: this._currentColor.g,
        onValueChanged: this._updateColor.bind(this, false),
        labelText: 'G',
        labelAriaText: messageLocalization.format('dxColorView-ariaGreen'),
        labelClass: COLOR_VIEW_GREEN_LABEL_CLASS,
      }),
      this._renderEditorWithLabel({
        editorType: NumberBox,
        value: this._currentColor.b,
        onValueChanged: this._updateColor.bind(this, false),
        labelText: 'B',
        labelAriaText: messageLocalization.format('dxColorView-ariaBlue'),
        labelClass: COLOR_VIEW_BLUE_LABEL_CLASS,
      }),
    ];

    this._$controlsContainer.append(this._rgbInputsWithLabels);

    this._rgbInputs = [
      NumberBox.getInstance(this._rgbInputsWithLabels[0].find(`.${NUMBERBOX_CLASS}`)),
      NumberBox.getInstance(this._rgbInputsWithLabels[1].find(`.${NUMBERBOX_CLASS}`)),
      NumberBox.getInstance(this._rgbInputsWithLabels[2].find(`.${NUMBERBOX_CLASS}`)),
    ];
  }

  _renderEditorWithLabel(options: EditorWithLabelOptions): dxElementWrapper {
    const $editor = $('<div>');
    const $label = $('<label>')
      .addClass(options.labelClass)
      .text(`${options.labelText}:`)
      .append($editor);

    eventsEngine.off($label, clickEventName);
    eventsEngine.on($label, clickEventName, (e) => {
      e.preventDefault();
    });

    const { editorType: EditorConstructor } = options;
    const { stylingMode } = this.option();

    const editorOptions = extend({
      value: options.value,
      onValueChanged: options.onValueChanged,
      onKeyboardHandled: (opts) => this._keyboardHandler(opts),
    }, {
      stylingMode,
    });

    if (EditorConstructor === NumberBox) {
      editorOptions.min = options.min || 0;
      editorOptions.max = options.max || 255;
      editorOptions.step = options.step || 1;
    }

    const editor = new (EditorConstructor)($editor, editorOptions);

    editor.registerKeyHandler('enter', (e) => {
      this._fireEnterKeyPressed(e);
    });

    this.setAria('label', options.labelAriaText, $editor);

    return $label;
  }

  hexInputOptions(): EditorWithLabelOptions {
    return {
      editorType: TextBox,
      value: this._currentColor.toHex().replace('#', ''),
      onValueChanged: this._updateColor.bind(this, true),
      labelClass: COLOR_VIEW_HEX_LABEL_CLASS,
      labelText: '#',
      labelAriaText: messageLocalization.format('dxColorView-ariaHex'),
    };
  }

  _renderHexInput(): void {
    this._hexInput = TextBox.getInstance(
      this._renderEditorWithLabel(this.hexInputOptions())
        .appendTo(this._$controlsContainer)
        .find('.dx-textbox'),
    );

    const inputId = `dx-${new Guid()}`;

    const $hexInput = this._$controlsContainer
      .find(`.${COLOR_VIEW_HEX_LABEL_CLASS}`)
      .find(`.${TEXT_EDITOR_INPUT}`);

    this.setAria('id', inputId, $hexInput);
    this.setAria('labelledby', inputId, this._$paletteHandle);
  }

  _renderAlphaChannelScale(): void {
    const $alphaChannelScaleCell = this._renderHtmlCellInsideRow(
      1,
      this._$colorPickerContainer,
      COLOR_VIEW_ALPHA_CHANNEL_CELL_CLASS,
    );
    const $alphaChannelBorder = $('<div>')
      .addClass(COLOR_VIEW_ALPHA_CHANNEL_BORDER_CLASS)
      .appendTo($alphaChannelScaleCell);
    const $alphaChannelScaleWrapper = $('<div>')
      .addClass(COLOR_VIEW_ALPHA_CHANNEL_SCALE_WRAPPER_CLASS)
      .appendTo($alphaChannelBorder);

    this._$alphaChannelScale = $('<div>').addClass(COLOR_VIEW_ALPHA_CHANNEL_SCALE_CLASS)
      .appendTo($alphaChannelScaleWrapper);

    this._makeCSSLinearGradient(this._$alphaChannelScale);

    this._renderAlphaChannelHandle($alphaChannelScaleCell);
  }

  _makeCSSLinearGradient($el: dxElementWrapper): void {
    const { rtlEnabled } = this.option();
    const color = this._currentColor;
    const colorAsRgb = `${color.r},${color.g},${color.b}`;
    const startColor = `rgba(${colorAsRgb}, ${rtlEnabled ? '1' : '0'})`;
    const finishColor = `rgba(${colorAsRgb}, ${rtlEnabled ? '0' : '1'})`;
    const backgroundImage = `linear-gradient(-90deg, ${startColor}, ${finishColor})`;

    $el.css('backgroundImage', backgroundImage);
  }

  _renderAlphaChannelInput(): void {
    const $alphaChannelInputCell = this._renderHtmlCellInsideRow(1, this._$colorPickerContainer);

    const editorWithLabel = this._renderEditorWithLabel({
      editorType: NumberBox,
      value: this._currentColor.a,
      max: 1,
      step: 0.1,
      onValueChanged: (args) => {
        let { value } = args;
        value = this._currentColor.isValidAlpha(value) ? value : this._currentColor.a;
        if (args.event) {
          this._saveValueChangeEvent(args.event);
        }
        this._updateColorTransparency(value);
        this._placeAlphaChannelHandle();
      },
      labelClass: COLOR_VIEW_ALPHA_CHANNEL_LABEL_CLASS,
      labelText: 'Alpha',
      labelAriaText: messageLocalization.format('dxColorView-ariaAlpha'),
    })
      .appendTo($alphaChannelInputCell);

    this._alphaChannelInput = NumberBox.getInstance(editorWithLabel.find(`.${NUMBERBOX_CLASS}`));
  }

  _updateColorTransparency(transparency: number): void {
    this._currentColor.a = transparency;
    this.applyColor();
  }

  _renderAlphaChannelHandle($parent: dxElementWrapper): void {
    this._$alphaChannelHandle = $('<div>')
      .addClass(COLOR_VIEW_ALPHA_CHANNEL_HANDLE_CLASS)
      .appendTo($parent);
    this._createComponent(this._$alphaChannelHandle, Draggable, {
      contentTemplate: null,
      // @ts-expect-error need to fix type for Draggable
      boundary: $parent,
      allowMoveByClick: true,
      dragDirection: 'horizontal',
      onDragMove: ({ event }) => {
        this._updateByDrag = true;
        const $alphaChannelHandle = this._$alphaChannelHandle;
        const alphaChannelHandlePosition = locate($alphaChannelHandle).left
          + this._alphaChannelHandleWidth / 2;
        this._saveValueChangeEvent(event);
        this._calculateColorTransparencyByScaleWidth(alphaChannelHandlePosition);
      },
    });

    this._alphaChannelHandleWidth = getWidth(this._$alphaChannelHandle);

    this._alphaChannelScaleWorkWidth = getWidth($parent) - this._alphaChannelHandleWidth;

    this._placeAlphaChannelHandle();
  }

  _calculateColorTransparencyByScaleWidth(handlePosition: number): void {
    let transparency = (handlePosition - this._alphaChannelHandleWidth / 2)
       / this._alphaChannelScaleWorkWidth;
    const { rtlEnabled } = this.option();

    transparency = rtlEnabled ? transparency : 1 - transparency;

    if (handlePosition >= (this._alphaChannelScaleWorkWidth + this._alphaChannelHandleWidth / 2)) {
      transparency = rtlEnabled ? 1 : 0;
    } else if (transparency < 1) {
      transparency = parseFloat(transparency.toFixed(2));
    }

    const previousTransparency = this._alphaChannelInput.option('value');
    transparency = Math.max(transparency, 0);
    transparency = Math.min(transparency, 1);

    if (transparency === previousTransparency) {
      this._updateByDrag = false;
    } else {
      this._alphaChannelInput.option('value', transparency);
    }
  }

  _placeAlphaChannelHandle(): void {
    let left = this._alphaChannelScaleWorkWidth * (1 - this._currentColor.a);
    const { rtlEnabled } = this.option();

    if (left < 0) {
      left = 0;
    }
    if (this._alphaChannelScaleWorkWidth < left) {
      left = this._alphaChannelScaleWorkWidth;
    }

    move(this._$alphaChannelHandle, {
      left: rtlEnabled ? this._alphaChannelScaleWorkWidth - left : left,
    });
  }

  applyColor(): void {
    const { value: previousValue, editAlphaChannel } = this.option();
    const colorValue = editAlphaChannel
      ? this._makeRgba(this._currentColor) : this._currentColor.toHex();
    if (this._$currentColor) {
      this._makeTransparentBackground(this._$currentColor, this._currentColor);
    }

    if (colorValue === previousValue) {
      this._updateByDrag = false;
    } else {
      this.option('value', colorValue);
    }
  }

  cancelColor(): void {
    this._initColorAndOpacity();
    this._refreshMarkup();
  }

  _updateColor(isHex: boolean, args: ValueChangedEvent): void {
    let rgba: number[] = [];
    let newColor = '';

    if (isHex) {
      newColor = this._validateHex(`#${this._hexInput.option('value') as string}`);
    } else {
      rgba = this._validateRgb();
      if (this._alphaChannelInput) {
        const { value: alphaValue } = this._alphaChannelInput.option();
        const isValidAlpha = alphaValue !== undefined
          && this._currentColor.isValidAlpha(alphaValue);

        const valueToAdd = isValidAlpha ? alphaValue : this._currentColor.a;

        rgba.push(valueToAdd);
        newColor = `rgba(${rgba.join(', ')})`;
      } else {
        newColor = `rgb(${rgba.join(', ')})`;
      }
    }

    if (!this._suppressEditorsValueUpdating) {
      this._currentColor = new Color(newColor);
      this._saveValueChangeEvent(args.event);
      this.applyColor();
      this._refreshMarkup();
    }
  }

  _validateHex(hex: string): string {
    return this._currentColor.isValidHex(hex) ? hex : this._currentColor.toHex();
  }

  _validateRgb(): number[] {
    let { value: r } = this._rgbInputs[0].option();
    let { value: g } = this._rgbInputs[1].option();
    let { value: b } = this._rgbInputs[2].option();

    const isInvalidRgb = !this._currentColor.isValidRGB(r, g, b);
    if (isInvalidRgb) {
      r = this._currentColor.r;
      g = this._currentColor.g;
      b = this._currentColor.b;
    }

    return [r ?? 0, g ?? 0, b ?? 0];
  }

  _refreshMarkup(): void {
    this._placeHueScaleHandle();
    this._placePaletteHandle();
    this._updateColorParamsAndColorPreview();
    this._$palette.css('backgroundColor', this._currentColor.getPureColor().toHex());
    if (this._$alphaChannelHandle) {
      this._updateColorTransparency(this._currentColor.a);
      this._placeAlphaChannelHandle();
    }
  }

  _updateColorParamsAndColorPreview(): void {
    const { editAlphaChannel } = this.option();
    this._suppressEditorsValueUpdating = true;
    this._hexInput.option('value', this._currentColor.toHex().replace('#', ''));
    this._rgbInputs[0].option('value', this._currentColor.r);
    this._rgbInputs[1].option('value', this._currentColor.g);
    this._rgbInputs[2].option('value', this._currentColor.b);
    this._suppressEditorsValueUpdating = false;

    if (editAlphaChannel && this._$alphaChannelScale) {
      this._makeCSSLinearGradient(this._$alphaChannelScale);
      this._alphaChannelInput.option('value', this._currentColor.a);
    }
  }

  _optionChanged(args: OptionChanged<ColorViewProperties>): void {
    const { value } = args;

    switch (args.name) {
      case 'value':
        this._setCurrentColor(value);
        if (!this._updateByDrag) {
          this._refreshMarkup();
        }

        this._updateByDrag = false;
        super._optionChanged({ ...args, value: this.option('value') as string | null });
        break;
      case 'matchValue':
        this._setBaseColor(value);
        break;
      case 'onEnterKeyPressed':
        this._initEnterKeyPressedAction();
        break;
      case 'editAlphaChannel':
        if (this._$colorPickerContainer) {
          this._renderHtmlRows();
          this._renderAlphaChannelElements();
        }
        break;
      case 'keyStep':
        break;
      case 'stylingMode':
        this._renderControls();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxColorView', ColorView);

export default ColorView;
