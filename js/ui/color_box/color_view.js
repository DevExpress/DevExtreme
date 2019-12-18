var $ = require('../../core/renderer'),
    eventsEngine = require('../../events/core/events_engine'),
    translator = require('../../animation/translator'),
    extend = require('../../core/utils/extend').extend,
    Color = require('../../color'),
    messageLocalization = require('../../localization/message'),
    devices = require('../../core/devices'),
    registerComponent = require('../../core/component_registrator'),
    Editor = require('../editor/editor'),
    NumberBox = require('../number_box'),
    TextBox = require('../text_box'),
    Draggable = require('../draggable'),
    clickEvent = require('../../events/click');

var COLOR_VIEW_CLASS = 'dx-colorview',
    COLOR_VIEW_CONTAINER_CLASS = 'dx-colorview-container',

    COLOR_VIEW_ROW_CLASS = 'dx-colorview-container-row',
    COLOR_VIEW_CELL_CLASS = 'dx-colorview-container-cell',

    COLOR_VIEW_PALETTE_CLASS = 'dx-colorview-palette',
    COLOR_VIEW_PALETTE_CELL_CLASS = 'dx-colorview-palette-cell',
    COLOR_VIEW_PALETTE_HANDLE_CLASS = 'dx-colorview-palette-handle',
    COLOR_VIEW_PALETTE_GRADIENT_CLASS = 'dx-colorview-palette-gradient',
    COLOR_VIEW_PALETTE_GRADIENT_WHITE_CLASS = 'dx-colorview-palette-gradient-white',
    COLOR_VIEW_PALETTE_GRADIENT_BLACK_CLASS = 'dx-colorview-palette-gradient-black',

    COLOR_VIEW_HUE_SCALE_CLASS = 'dx-colorview-hue-scale',
    COLOR_VIEW_HUE_SCALE_CELL_CLASS = 'dx-colorview-hue-scale-cell',
    COLOR_VIEW_HUE_SCALE_HANDLE_CLASS = 'dx-colorview-hue-scale-handle',
    COLOR_VIEW_HUE_SCALE_WRAPPER_CLASS = 'dx-colorview-hue-scale-wrapper',

    COLOR_VIEW_CONTROLS_CONTAINER_CLASS = 'dx-colorview-controls-container',

    COLOR_VIEW_RED_LABEL_CLASS = 'dx-colorview-label-red',
    COLOR_VIEW_GREEN_LABEL_CLASS = 'dx-colorview-label-green',
    COLOR_VIEW_BLUE_LABEL_CLASS = 'dx-colorview-label-blue',
    COLOR_VIEW_HEX_LABEL_CLASS = 'dx-colorview-label-hex',

    COLOR_VIEW_ALPHA_CHANNEL_SCALE_CLASS = 'dx-colorview-alpha-channel-scale',
    COLOR_VIEW_APLHA_CHANNEL_ROW_CLASS = 'dx-colorview-alpha-channel-row',
    COLOR_VIEW_ALPHA_CHANNEL_SCALE_WRAPPER_CLASS = 'dx-colorview-alpha-channel-wrapper',
    COLOR_VIEW_ALPHA_CHANNEL_LABEL_CLASS = 'dx-colorview-alpha-channel-label',
    COLOR_VIEW_ALPHA_CHANNEL_HANDLE_CLASS = 'dx-colorview-alpha-channel-handle',
    COLOR_VIEW_ALPHA_CHANNEL_CELL_CLASS = 'dx-colorview-alpha-channel-cell',
    COLOR_VIEW_ALPHA_CHANNEL_BORDER_CLASS = 'dx-colorview-alpha-channel-border',

    COLOR_VIEW_COLOR_PREVIEW = 'dx-colorview-color-preview',
    COLOR_VIEW_COLOR_PREVIEW_CONTAINER_CLASS = 'dx-colorview-color-preview-container',
    COLOR_VIEW_COLOR_PREVIEW_CONTAINER_INNER_CLASS = 'dx-colorview-color-preview-container-inner',
    COLOR_VIEW_COLOR_PREVIEW_COLOR_CURRENT = 'dx-colorview-color-preview-color-current',
    COLOR_VIEW_COLOR_PREVIEW_COLOR_NEW = 'dx-colorview-color-preview-color-new';

var ColorView = Editor.inherit({

    _supportedKeys: function() {
        var isRTL = this.option('rtlEnabled');

        var that = this,
            getHorizontalPaletteStep = function(e) {
                var step = 100 / that._paletteWidth;
                if(e.shiftKey) {
                    step = step * that.option('keyStep');
                }

                step = step > 1 ? step : 1;
                return Math.round(step);
            },
            updateHorizontalPaletteValue = function(step) {
                var value = that._currentColor.hsv.s + step;

                if(value > 100) {
                    value = 100;
                } else if(value < 0) {
                    value = 0;
                }

                that._currentColor.hsv.s = value;
                updatePaletteValue();
            },
            getVerticalPaletteStep = function(e) {
                var step = 100 / that._paletteHeight;
                if(e.shiftKey) {
                    step = step * that.option('keyStep');
                }

                step = step > 1 ? step : 1;
                return Math.round(step);
            },
            updateVerticalPaletteValue = function(step) {
                var value = that._currentColor.hsv.v + step;

                if(value > 100) {
                    value = 100;
                } else if(value < 0) {
                    value = 0;
                }

                that._currentColor.hsv.v = value;
                updatePaletteValue();
            },
            updatePaletteValue = function() {
                that._placePaletteHandle();
                that._updateColorFromHsv(
                    that._currentColor.hsv.h,
                    that._currentColor.hsv.s,
                    that._currentColor.hsv.v
                );
            },
            getHueScaleStep = function(e) {
                var step = 360 / (that._hueScaleWrapperHeight - that._hueScaleHandleHeight);
                if(e.shiftKey) {
                    step = step * that.option('keyStep');
                }

                step = step > 1 ? step : 1;
                return step;
            },
            updateHueScaleValue = function(step) {
                that._currentColor.hsv.h += step;
                that._placeHueScaleHandle();
                var handleLocation = translator.locate(that._$hueScaleHandle);
                that._updateColorHue(handleLocation.top + that._hueScaleHandleHeight / 2);
            },
            getAlphaScaleStep = function(e) {
                var step = 1 / (that._alphaChannelScaleWorkWidth);
                if(e.shiftKey) {
                    step = step * that.option('keyStep');
                }

                step = step > 0.01 ? step : 0.01;
                step = isRTL ? -step : step;
                return step;
            },
            updateAlphaScaleValue = function(step) {
                that._currentColor.a += step;
                that._placeAlphaChannelHandle();
                var handleLocation = translator.locate(that._$alphaChannelHandle);
                that._calculateColorTransparencyByScaleWidth(handleLocation.left + that._alphaChannelHandleWidth / 2);
            };

        return extend(this.callBase(), {
            upArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(e.ctrlKey) {
                    if(this._currentColor.hsv.h <= 360 && !this._isTopColorHue) {
                        updateHueScaleValue(getHueScaleStep(e));
                    }
                } else if(this._currentColor.hsv.v < 100) {
                    updateVerticalPaletteValue(getVerticalPaletteStep(e));
                }
            },
            downArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(e.ctrlKey) {
                    if(this._currentColor.hsv.h >= 0) {
                        if(this._isTopColorHue) {
                            this._currentColor.hsv.h = 360;
                        }

                        updateHueScaleValue(-getHueScaleStep(e));
                    }
                } else if(this._currentColor.hsv.v > 0) {
                    updateVerticalPaletteValue(-getVerticalPaletteStep(e));
                }
            },
            rightArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(e.ctrlKey) {
                    if(isRTL ? this._currentColor.a < 1 : this._currentColor.a > 0 && this.option('editAlphaChannel')) {
                        updateAlphaScaleValue(-getAlphaScaleStep(e));
                    }
                } else if(this._currentColor.hsv.s < 100) {
                    updateHorizontalPaletteValue(getHorizontalPaletteStep(e));
                }
            },
            leftArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(e.ctrlKey) {
                    if(isRTL ? this._currentColor.a > 0 : this._currentColor.a < 1 && this.option('editAlphaChannel')) {
                        updateAlphaScaleValue(getAlphaScaleStep(e));
                    }
                } else if(this._currentColor.hsv.s > 0) {
                    updateHorizontalPaletteValue(-getHorizontalPaletteStep(e));
                }
            },
            enter: function(e) {
                this._fireEnterKeyPressed(e);
            }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: null,
            matchValue: null,
            onEnterKeyPressed: undefined,
            editAlphaChannel: false,
            keyStep: 1,
            stylingMode: undefined
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();
        this._initColorAndOpacity();
        this._initEnterKeyPressedAction();
    },

    _initEnterKeyPressedAction: function() {
        this._onEnterKeyPressedAction = this._createActionByOption('onEnterKeyPressed');
    },

    _fireEnterKeyPressed: function(e) {
        if(!this._onEnterKeyPressedAction) return;
        this._onEnterKeyPressedAction({
            event: e
        });
    },

    _initColorAndOpacity: function() {
        this._setCurrentColor(this.option('value'));
    },

    _setCurrentColor: function(value) {
        value = value || '#000000';
        var newColor = new Color(value);
        if(!newColor.colorIsInvalid) {
            if(!this._currentColor || this._makeRgba(this._currentColor) !== this._makeRgba(newColor)) {
                this._currentColor = newColor;
                if(this._$currentColor) {
                    this._makeTransparentBackground(this._$currentColor, newColor);
                }
            }
        } else {
            this.option('value', this._currentColor.baseColor);
        }
    },

    _setBaseColor: function(value) {
        var color = value || '#000000';
        var newColor = new Color(color);

        if(!newColor.colorIsInvalid) {
            var isBaseColorChanged = this._makeRgba(this.option('matchValue') !== this._makeRgba(newColor));
            if(isBaseColorChanged) {
                if(this._$baseColor) {
                    this._makeTransparentBackground(this._$baseColor, newColor);
                }
            }
        }
    },

    _initMarkup: function() {
        this.callBase();
        this.$element().addClass(COLOR_VIEW_CLASS);
        this._renderColorPickerContainer();
    },

    _render: function() {
        this.callBase();

        this._renderPalette();
        this._renderHueScale();
        this._renderControlsContainer();
        this._renderControls();
        this._renderAlphaChannelElements();
    },

    _makeTransparentBackground: function($el, color) {
        if(!(color instanceof Color)) {
            color = new Color(color);
        }

        $el.css('backgroundColor', this._makeRgba(color));
    },

    _makeRgba: function(color) {
        if(!(color instanceof Color)) {
            color = new Color(color);
        }

        return 'rgba(' + [color.r, color.g, color.b, color.a].join(', ') + ')';
    },

    _renderValue: function() {
        this.callBase(this.option('editAlphaChannel') ? this._makeRgba(this._currentColor) : this.option('value'));
    },

    _renderColorPickerContainer: function() {
        var $parent = this.$element();
        this._$colorPickerContainer = $('<div>').addClass(COLOR_VIEW_CONTAINER_CLASS)
            .appendTo($parent);

        this._renderHtmlRows();
    },

    _renderHtmlRows: function(updatedOption) {
        var $renderedRows = this._$colorPickerContainer.find('.' + COLOR_VIEW_ROW_CLASS),
            renderedRowsCount = $renderedRows.length,
            rowCount = this.option('editAlphaChannel') ? 2 : 1,
            delta = renderedRowsCount - rowCount;

        if(delta > 0) {
            $renderedRows.eq(-1).remove();
        }
        if(delta < 0) {
            delta = Math.abs(delta);
            var rows = [],
                i;
            for(i = 0; i < delta; i++) {
                rows.push($('<div>').addClass(COLOR_VIEW_ROW_CLASS));
            }

            if(renderedRowsCount) {
                for(i = 0; i < rows.length; i++) {
                    $renderedRows.eq(0).after(rows[i]);
                }
            } else {
                this._$colorPickerContainer.append(rows);
            }
        }
    },

    _renderHtmlCellInsideRow: function(index, $rowParent, additionalClass) {
        return $('<div>')
            .addClass(COLOR_VIEW_CELL_CLASS)
            .addClass(additionalClass)
            .appendTo($rowParent.find('.' + COLOR_VIEW_ROW_CLASS).eq(index));
    },

    _renderPalette: function() {
        var $paletteCell = this._renderHtmlCellInsideRow(0, this._$colorPickerContainer, COLOR_VIEW_PALETTE_CELL_CLASS),
            $paletteGradientWhite = $('<div>').addClass([COLOR_VIEW_PALETTE_GRADIENT_CLASS, COLOR_VIEW_PALETTE_GRADIENT_WHITE_CLASS].join(' ')),
            $paletteGradientBlack = $('<div>').addClass([COLOR_VIEW_PALETTE_GRADIENT_CLASS, COLOR_VIEW_PALETTE_GRADIENT_BLACK_CLASS].join(' '));

        this._$palette = $('<div>')
            .addClass(COLOR_VIEW_PALETTE_CLASS)
            .css('backgroundColor', this._currentColor.getPureColor().toHex())
            .appendTo($paletteCell);

        this._paletteHeight = this._$palette.height();
        this._paletteWidth = this._$palette.width();

        this._renderPaletteHandle();
        this._$palette.append([$paletteGradientWhite, $paletteGradientBlack]);
    },

    _renderPaletteHandle: function() {
        this._$paletteHandle = $('<div>')
            .addClass(COLOR_VIEW_PALETTE_HANDLE_CLASS)
            .appendTo(this._$palette);
        this._createComponent(this._$paletteHandle, Draggable, {
            area: this._$palette,
            allowMoveByClick: true,
            boundOffset: (function() {
                return -this._paletteHandleHeight / 2;
            }).bind(this),
            onDrag: (function() {
                var paletteHandlePosition = translator.locate(this._$paletteHandle);
                this._updateByDrag = true;
                this._updateColorFromHsv(
                    this._currentColor.hsv.h,
                    this._calculateColorSaturation(paletteHandlePosition),
                    this._calculateColorValue(paletteHandlePosition)
                );
            }).bind(this)
        });

        this._paletteHandleWidth = this._$paletteHandle.width();
        this._paletteHandleHeight = this._$paletteHandle.height();

        this._placePaletteHandle();
    },

    _placePaletteHandle: function() {
        translator.move(this._$paletteHandle, {
            left: Math.round(this._paletteWidth * this._currentColor.hsv.s / 100 - this._paletteHandleWidth / 2),
            top: Math.round(this._paletteHeight - (this._paletteHeight * this._currentColor.hsv.v / 100) - this._paletteHandleHeight / 2)
        });
    },

    _calculateColorValue: function(paletteHandlePosition) {
        var value = Math.floor(paletteHandlePosition.top + this._paletteHandleHeight / 2);
        return 100 - Math.round(value * 100 / this._paletteHeight);
    },

    _calculateColorSaturation: function(paletteHandlePosition) {
        var saturation = Math.floor(paletteHandlePosition.left + this._paletteHandleWidth / 2);
        return Math.round(saturation * 100 / this._paletteWidth);
    },

    _updateColorFromHsv: function(hue, saturation, value) {
        var a = this._currentColor.a;
        this._currentColor = new Color('hsv(' + [hue, saturation, value].join(',') + ')');
        this._currentColor.a = a;
        this._updateColorParamsAndColorPreview();
        this.applyColor();
    },

    _renderHueScale: function() {
        var $hueScaleCell = this._renderHtmlCellInsideRow(0, this._$colorPickerContainer, COLOR_VIEW_HUE_SCALE_CELL_CLASS);

        this._$hueScaleWrapper = $('<div>')
            .addClass(COLOR_VIEW_HUE_SCALE_WRAPPER_CLASS)
            .appendTo($hueScaleCell);

        this._$hueScale = $('<div>')
            .addClass(COLOR_VIEW_HUE_SCALE_CLASS)
            .appendTo(this._$hueScaleWrapper);

        this._hueScaleHeight = this._$hueScale.height();
        this._hueScaleWrapperHeight = this._$hueScaleWrapper.outerHeight();

        this._renderHueScaleHandle();
    },

    _renderHueScaleHandle: function() {
        this._$hueScaleHandle = $('<div>')
            .addClass(COLOR_VIEW_HUE_SCALE_HANDLE_CLASS)
            .appendTo(this._$hueScaleWrapper);
        this._createComponent(this._$hueScaleHandle, Draggable, {
            area: this._$hueScaleWrapper,
            allowMoveByClick: true,
            direction: 'vertical',
            onDrag: (function() {
                this._updateByDrag = true;
                this._updateColorHue(translator.locate(this._$hueScaleHandle).top + this._hueScaleHandleHeight / 2);
            }).bind(this)
        });

        this._hueScaleHandleHeight = this._$hueScaleHandle.height();

        this._placeHueScaleHandle();
    },

    _placeHueScaleHandle: function() {
        var hueScaleHeight = this._hueScaleWrapperHeight,
            handleHeight = this._hueScaleHandleHeight,
            top = (hueScaleHeight - handleHeight) * (360 - this._currentColor.hsv.h) / 360;

        if(hueScaleHeight < top + handleHeight) {
            top = hueScaleHeight - handleHeight;
        }
        if(top < 0) {
            top = 0;
        }

        translator.move(this._$hueScaleHandle, { top: Math.round(top) });
    },

    _updateColorHue: function(handlePosition) {
        var hue = 360 - Math.round((handlePosition - this._hueScaleHandleHeight / 2) * 360 / (this._hueScaleWrapperHeight - this._hueScaleHandleHeight)),
            saturation = this._currentColor.hsv.s,
            value = this._currentColor.hsv.v;

        this._isTopColorHue = false;

        hue = hue < 0 ? 0 : hue;

        if(hue >= 360) {
            this._isTopColorHue = true;
            hue = 0;
        }

        this._updateColorFromHsv(hue, saturation, value);
        this._$palette.css('backgroundColor', this._currentColor.getPureColor().toHex());
    },

    _renderControlsContainer: function() {
        var $controlsContainerCell = this._renderHtmlCellInsideRow(0, this._$colorPickerContainer);
        this._$controlsContainer = $('<div>')
            .addClass(COLOR_VIEW_CONTROLS_CONTAINER_CLASS)
            .appendTo($controlsContainerCell);
    },

    _renderControls: function() {
        this._renderColorsPreview();
        this._renderRgbInputs();
        this._renderHexInput();
    },

    _renderColorsPreview: function() {
        var $colorsPreviewContainer = $('<div>')
            .addClass(COLOR_VIEW_COLOR_PREVIEW_CONTAINER_CLASS)
            .appendTo(this._$controlsContainer);

        var $colorsPreviewContainerInner = $('<div>')
            .addClass(COLOR_VIEW_COLOR_PREVIEW_CONTAINER_INNER_CLASS)
            .appendTo($colorsPreviewContainer);

        this._$currentColor = $('<div>').addClass([COLOR_VIEW_COLOR_PREVIEW, COLOR_VIEW_COLOR_PREVIEW_COLOR_NEW].join(' '));
        this._$baseColor = $('<div>').addClass([COLOR_VIEW_COLOR_PREVIEW, COLOR_VIEW_COLOR_PREVIEW_COLOR_CURRENT].join(' '));

        this._makeTransparentBackground(this._$baseColor, this.option('matchValue'));
        this._makeTransparentBackground(this._$currentColor, this._currentColor);

        $colorsPreviewContainerInner.append([this._$baseColor, this._$currentColor]);
    },

    _renderAlphaChannelElements: function() {
        if(this.option('editAlphaChannel')) {
            this._$colorPickerContainer
                .find('.' + COLOR_VIEW_ROW_CLASS)
                .eq(1)
                .addClass(COLOR_VIEW_APLHA_CHANNEL_ROW_CLASS);

            this._renderAlphaChannelScale();
            this._renderAlphaChannelInput();
        }
    },

    _renderRgbInputs: function() {
        this._rgbInputsWithLabels = [
            this._renderEditorWithLabel({
                editorType: NumberBox,
                value: this._currentColor.r,
                onValueChanged: this._updateColor.bind(this, false),
                labelText: 'R',
                labelAriaText: messageLocalization.format('dxColorView-ariaRed'),
                labelClass: COLOR_VIEW_RED_LABEL_CLASS
            }),
            this._renderEditorWithLabel({
                editorType: NumberBox,
                value: this._currentColor.g,
                onValueChanged: this._updateColor.bind(this, false),
                labelText: 'G',
                labelAriaText: messageLocalization.format('dxColorView-ariaGreen'),
                labelClass: COLOR_VIEW_GREEN_LABEL_CLASS
            }),
            this._renderEditorWithLabel({
                editorType: NumberBox,
                value: this._currentColor.b,
                onValueChanged: this._updateColor.bind(this, false),
                labelText: 'B',
                labelAriaText: messageLocalization.format('dxColorView-ariaBlue'),
                labelClass: COLOR_VIEW_BLUE_LABEL_CLASS
            })
        ];

        this._$controlsContainer.append(this._rgbInputsWithLabels);

        this._rgbInputs = [
            this._rgbInputsWithLabels[0].find('.dx-numberbox').dxNumberBox('instance'),
            this._rgbInputsWithLabels[1].find('.dx-numberbox').dxNumberBox('instance'),
            this._rgbInputsWithLabels[2].find('.dx-numberbox').dxNumberBox('instance')
        ];
    },

    _renderEditorWithLabel: function(options) {
        var $editor = $('<div>');
        var $label = $('<label>')
            .addClass(options.labelClass)
            .text(options.labelText + ':')
            .append($editor);

        eventsEngine.off($label, clickEvent.name);
        eventsEngine.on($label, clickEvent.name, function(e) {
            e.preventDefault();
        });

        var editorType = options.editorType;

        var editorOptions = extend({
            value: options.value,
            onValueChanged: options.onValueChanged
        }, {
            stylingMode: this.option('stylingMode')
        });

        if(editorType === NumberBox) {
            editorOptions.min = options.min || 0;
            editorOptions.max = options.max || 255;
            editorOptions.step = options.step || 1;
        }

        var editor = new editorType($editor, editorOptions);

        this._attachKeyboardProcessorToEditor(editor);

        editor.registerKeyHandler('enter', (function(e) {
            this._fireEnterKeyPressed(e);
        }).bind(this));

        this.setAria('label', options.labelAriaText, $editor);

        return $label;
    },

    _attachKeyboardProcessorToEditor: function(editor) {
        var keyboardProcessor = editor._keyboardProcessor;

        if(keyboardProcessor) {
            keyboardProcessor
                .attachChildProcessor()
                .reinitialize(this._keyboardHandler, this);
        }
    },

    hexInputOptions: function() {
        return {
            editorType: TextBox,
            value: this._currentColor.toHex().replace('#', ''),
            onValueChanged: this._updateColor.bind(this, true),
            labelClass: COLOR_VIEW_HEX_LABEL_CLASS,
            labelText: '#',
            labelAriaText: messageLocalization.format('dxColorView-ariaHex')
        };
    },

    _renderHexInput: function() {
        this._hexInput = TextBox.getInstance(
            this._renderEditorWithLabel(this.hexInputOptions())
                .appendTo(this._$controlsContainer)
                .find('.dx-textbox')
        );
    },

    _renderAlphaChannelScale: function() {
        var $alphaChannelScaleCell = this._renderHtmlCellInsideRow(1, this._$colorPickerContainer, COLOR_VIEW_ALPHA_CHANNEL_CELL_CLASS),
            $alphaChannelBorder = $('<div>')
                .addClass(COLOR_VIEW_ALPHA_CHANNEL_BORDER_CLASS)
                .appendTo($alphaChannelScaleCell),
            $alphaChannelScaleWrapper = $('<div>')
                .addClass(COLOR_VIEW_ALPHA_CHANNEL_SCALE_WRAPPER_CLASS)
                .appendTo($alphaChannelBorder);

        this._$alphaChannelScale = $('<div>').addClass(COLOR_VIEW_ALPHA_CHANNEL_SCALE_CLASS)
            .appendTo($alphaChannelScaleWrapper);

        this._makeCSSLinearGradient(this._$alphaChannelScale);

        this._renderAlphaChannelHandle($alphaChannelScaleCell);
    },

    _makeCSSLinearGradient: function($el) {
        var color = this._currentColor,
            colorAsRgb = [color.r, color.g, color.b].join(','),
            colorAsHex = color.toHex().replace('#', '');

        var combineGradientString = function(colorAsRgb, colorAsHex) {
            var rtlEnabled = this.option('rtlEnabled'),
                startColor = 'rgba(' + colorAsRgb + ', ' + (rtlEnabled ? '1' : '0') + ')',
                finishColor = 'rgba(' + colorAsRgb + ', ' + (rtlEnabled ? '0' : '1') + ')',
                startColorIE = '\'#' + (rtlEnabled ? '00' : '') + colorAsHex + '\'',
                finishColorIE = '\'#' + (rtlEnabled ? '' : '00') + colorAsHex + '\'';

            return [
                'background-image: -webkit-linear-gradient(180deg, ' + startColor + ', ' + finishColor + ')',
                'background-image: -moz-linear-gradient(-90deg, ' + startColor + ', ' + finishColor + ')',
                'background-image: -o-linear-gradient(-90deg, ' + startColor + ', ' + finishColor + ')',
                'background-image: linear-gradient(-90deg, ' + startColor + ', ' + finishColor + ')',
                'filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1,startColorstr=' + startColorIE + ', endColorstr=' + finishColorIE + ')'
            ].join(';');
        };

        $el.attr('style', combineGradientString.call(this, colorAsRgb, colorAsHex));
    },

    _renderAlphaChannelInput: function() {
        var that = this,
            $alphaChannelInputCell = this._renderHtmlCellInsideRow(1, this._$colorPickerContainer);

        that._alphaChannelInput = this._renderEditorWithLabel({
            editorType: NumberBox,
            value: this._currentColor.a,
            max: 1,
            step: 0.1,
            onValueChanged: function(e) {
                var value = e.value;
                value = that._currentColor.isValidAlpha(value) ? value : that._currentColor.a;
                that._updateColorTransparency(value);
                that._placeAlphaChannelHandle();
            },
            labelClass: COLOR_VIEW_ALPHA_CHANNEL_LABEL_CLASS,
            labelText: 'Alpha',
            labelAriaText: messageLocalization.format('dxColorView-ariaAlpha')
        })
            .appendTo($alphaChannelInputCell)
            .find('.dx-numberbox')
            .dxNumberBox('instance');
    },

    _updateColorTransparency: function(transparency) {
        this._currentColor.a = transparency;
        this.applyColor();
    },

    _renderAlphaChannelHandle: function($parent) {
        this._$alphaChannelHandle = $('<div>')
            .addClass(COLOR_VIEW_ALPHA_CHANNEL_HANDLE_CLASS)
            .appendTo($parent);
        this._createComponent(this._$alphaChannelHandle, Draggable, {
            area: $parent,
            allowMoveByClick: true,
            direction: 'horizontal',
            onDrag: (function() {
                this._updateByDrag = true;
                var $alphaChannelHandle = this._$alphaChannelHandle,
                    alphaChannelHandlePosition = translator.locate($alphaChannelHandle).left + this._alphaChannelHandleWidth / 2;

                this._calculateColorTransparencyByScaleWidth(alphaChannelHandlePosition);
            }).bind(this)
        });

        this._alphaChannelHandleWidth = this._$alphaChannelHandle.width();

        this._alphaChannelScaleWorkWidth = $parent.width() - this._alphaChannelHandleWidth;

        this._placeAlphaChannelHandle();
    },

    _calculateColorTransparencyByScaleWidth: function(handlePosition) {
        var transparency = (handlePosition - this._alphaChannelHandleWidth / 2) / (this._alphaChannelScaleWorkWidth),
            rtlEnabled = this.option('rtlEnabled');

        transparency = rtlEnabled ? transparency : 1 - transparency;

        if(handlePosition >= (this._alphaChannelScaleWorkWidth + this._alphaChannelHandleWidth / 2)) {
            transparency = rtlEnabled ? 1 : 0;
        } else if(transparency < 1) {
            transparency = transparency.toFixed(2);
        }

        transparency = Math.max(transparency, 0);
        transparency = Math.min(transparency, 1);
        this._alphaChannelInput.option('value', transparency);
    },

    _placeAlphaChannelHandle: function() {
        var left = (this._alphaChannelScaleWorkWidth) * (1 - this._currentColor.a);

        if(left < 0) {
            left = 0;
        }
        if(this._alphaChannelScaleWorkWidth < left) {
            left = this._alphaChannelScaleWorkWidth;
        }

        translator.move(this._$alphaChannelHandle, {
            'left': this.option('rtlEnabled') ? this._alphaChannelScaleWorkWidth - left : left
        });
    },

    applyColor: function() {
        var colorValue = this.option('editAlphaChannel') ? this._makeRgba(this._currentColor) : this._currentColor.toHex();
        this._makeTransparentBackground(this._$currentColor, this._currentColor);

        this.option('value', colorValue);
    },

    cancelColor: function() {
        this._initColorAndOpacity();
        this._refreshMarkup();
    },

    _updateColor: function(isHex, e) {
        var rgba, newColor;

        if(isHex) {
            newColor = this._validateHex('#' + this._hexInput.option('value'));
        } else {
            rgba = this._validateRgb();
            if(this._alphaChannelInput) {
                rgba.push(this._alphaChannelInput.option('value'));
                newColor = 'rgba(' + rgba.join(', ') + ')';
            } else {
                newColor = 'rgb(' + rgba.join(', ') + ')';
            }
        }

        if(!this._suppressEditorsValueUpdating) {
            this._currentColor = new Color(newColor);
            this.applyColor();
            this._refreshMarkup();
        }
    },

    _validateHex: function(hex) {
        return this._currentColor.isValidHex(hex) ? hex : this._currentColor.toHex();
    },

    _validateRgb: function() {
        var r = this._rgbInputs[0].option('value'),
            g = this._rgbInputs[1].option('value'),
            b = this._rgbInputs[2].option('value');

        if(!this._currentColor.isValidRGB(r, g, b)) {
            r = this._currentColor.r;
            g = this._currentColor.g;
            b = this._currentColor.b;
        }

        return [r, g, b];
    },

    _refreshMarkup: function() {
        this._placeHueScaleHandle();
        this._placePaletteHandle();
        this._updateColorParamsAndColorPreview();
        this._$palette.css('backgroundColor', this._currentColor.getPureColor().toHex());
        if(this._$alphaChannelHandle) {
            this._updateColorTransparency(this._currentColor.a);
            this._placeAlphaChannelHandle();
        }
    },

    _updateColorParamsAndColorPreview: function() {
        this._suppressEditorsValueUpdating = true;
        this._hexInput.option('value', this._currentColor.toHex().replace('#', ''));
        this._rgbInputs[0].option('value', this._currentColor.r);
        this._rgbInputs[1].option('value', this._currentColor.g);
        this._rgbInputs[2].option('value', this._currentColor.b);
        this._suppressEditorsValueUpdating = false;

        if(this.option('editAlphaChannel')) {
            this._makeCSSLinearGradient.call(this, this._$alphaChannelScale);
            this._alphaChannelInput.option('value', this._currentColor.a);
        }
    },

    _optionChanged: function(args) {
        var value = args.value;

        switch(args.name) {
            case 'value':
                this._setCurrentColor(value);
                if(!this._updateByDrag) {
                    this._refreshMarkup();
                }

                this._updateByDrag = false;
                this.callBase(args);
                break;
            case 'matchValue':
                this._setBaseColor(value);
                break;
            case 'onEnterKeyPressed':
                this._initEnterKeyPressedAction();
                break;
            case 'editAlphaChannel':
                if(this._$colorPickerContainer) {
                    this._renderHtmlRows('editAlphaChannel');
                    this._renderAlphaChannelElements();
                }
                break;
            case 'keyStep':
                break;
            case 'stylingMode':
                this._renderControls();
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent('dxColorView', ColorView);

module.exports = ColorView;
