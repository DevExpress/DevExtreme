import { extend } from '../../core/utils/extend';
import { getWindow } from '../../core/utils/window';
import { patchFontOptions } from './utils';
import { HIDDEN_FOR_EXPORT } from '../../core/utils/svg';
import { export as _export, image as imageExporter, svg as svgExporter, pdf as pdfExporter } from '../../exporter';
import messageLocalization from '../../common/core/localization/message';
import { isDefined } from '../../core/utils/type';
import { getTheme } from '../themes';
import { start as hoverEventStart, end as hoverEventEnd } from '../../common/core/events/hover';
import pointerEvents from '../../common/core/events/pointer';
import { logger } from '../../core/utils/console';
import { getWidth } from '../../core/utils/size';
import { Renderer } from './renderers/renderer';
import $ from '../../core/renderer';

const pointerActions = [pointerEvents.down, pointerEvents.move].join(' ');

const BUTTON_SIZE = 35;
const ICON_COORDS = [[9, 12, 26, 12, 26, 14, 9, 14], [9, 17, 26, 17, 26, 19, 9, 19], [9, 22, 26, 22, 26, 24, 9, 24]];

const LIST_PADDING_TOP = 4;
const LIST_WIDTH = 120;
const VERTICAL_TEXT_MARGIN = 8;
const HORIZONTAL_TEXT_MARGIN = 15;
const MENU_ITEM_HEIGHT = 30;
const LIST_STROKE_WIDTH = 1;
const MARGIN = 10;
const SHADOW_OFFSET = 2;
const SHADOW_BLUR = 3;

const DEFAULT_EXPORT_FORMAT = 'PNG';
const ALLOWED_IMAGE_FORMATS = [DEFAULT_EXPORT_FORMAT, 'JPEG', 'GIF'];
const ALLOWED_EXTRA_FORMATS = ['PDF', 'SVG'];
const EXPORT_CSS_CLASS = 'dx-export-menu';

const A4WidthCm = '21cm';

const EXPORT_DATA_KEY = 'export-element-type';
const FORMAT_DATA_KEY = 'export-element-format';

const GET_COLOR_REGEX = /data-backgroundcolor="([^"]*)"/;

function getRendererWrapper(width, height, backgroundColor) {
    const rendererContainer = $('<div>').get(0);

    const renderer = new Renderer({
        container: rendererContainer
    });

    renderer.resize(width, height);
    renderer.root.element.setAttribute('data-backgroundcolor', backgroundColor);

    return {
        createGroup() {
            return renderer.g();
        },
        getRootContent() {
            return renderer.root.element.cloneNode(true);
        },
        dispose() {
            renderer.dispose();
            rendererContainer.remove();
        }
    };
}

function getValidFormats() {
    const imageFormats = imageExporter.testFormats(ALLOWED_IMAGE_FORMATS);
    return {
        unsupported: imageFormats.unsupported,
        supported: imageFormats.supported.concat(ALLOWED_EXTRA_FORMATS)
    };
}

function validateFormat(format, incidentOccurred, validFormats) {
    validFormats = validFormats || getValidFormats();
    format = String(format).toUpperCase();

    if(validFormats.supported.indexOf(format) !== -1) {
        return format;
    }
    if(validFormats.unsupported.indexOf(format) !== -1) {
        incidentOccurred && incidentOccurred('W2108', [format]);
    }
}

function getCreatorFunc(format) {
    if(format === 'SVG') {
        return svgExporter.getData;
    } else if(format === 'PDF') {
        return pdfExporter.getData;
    } else {
        return imageExporter.getData;
    }
}

function print(imageSrc, options) {
    const document = getWindow().document;
    const iFrame = document.createElement('iframe');
    iFrame.onload = setPrint(imageSrc, options);
    iFrame.style.position = 'fixed';
    iFrame.style.width = '0';
    iFrame.style.height = '0';
    iFrame.style.right = '0';
    iFrame.style.bottom = '0';
    document.body.appendChild(iFrame);
}

function calculatePrintPageWidth(iFrameBody) {
    iFrameBody.style.width = A4WidthCm;

    const width = getWidth(iFrameBody);

    iFrameBody.style.width = '';

    return width;
}

function setPrint(imageSrc, options) {
    return function() {
        let window = this.contentWindow;
        const img = window.document.createElement('img');
        window.document.body.appendChild(img);

        const widthRatio = calculatePrintPageWidth(window.document.body) / options.width;

        ///#DEBUG
        const origImageSrc = imageSrc;
        if(options.__test) {
            imageSrc = options.__test.imageSrc;
            window = options.__test.mockWindow;
        }
        ///#ENDDEBUG

        if(widthRatio < 1) {
            window.document.body.style.transform = `scale(${widthRatio})`;
            window.document.body.style['transform-origin'] = '0 0';
        }

        const removeFrame = () => {
            ///#DEBUG
            options.__test && options.__test.checkAssertions();
            ///#ENDDEBUG
            this.parentElement.removeChild(this);
            ///#DEBUG
            options.__test && options.__test.deferred.resolve(origImageSrc, window?.document?.body?.style);
            ///#ENDDEBUG
        };

        img.addEventListener('load', () => {
            window.focus();
            window.print();
        });
        img.addEventListener('error', removeFrame);

        window.addEventListener('afterprint', ()=>{ // T933486
            setTimeout(removeFrame, 0);// timeout needed for FF
        });

        img.src = imageSrc;
    };
}

function getItemAttributes(options, type, itemIndex) {
    const x = BUTTON_SIZE - LIST_WIDTH;
    const y = BUTTON_SIZE + LIST_PADDING_TOP + LIST_STROKE_WIDTH + itemIndex * MENU_ITEM_HEIGHT;

    const attr = {
        rect: {
            width: LIST_WIDTH - LIST_STROKE_WIDTH * 2,
            height: MENU_ITEM_HEIGHT,
            x: x + LIST_STROKE_WIDTH,
            y: y
        },
        text: {
            x: x + (options.rtl ? LIST_WIDTH - HORIZONTAL_TEXT_MARGIN : HORIZONTAL_TEXT_MARGIN),
            y: y + MENU_ITEM_HEIGHT - VERTICAL_TEXT_MARGIN
        }
    };

    if(type === 'printing') {
        attr.separator = {
            stroke: options.button.default.borderColor,
            'stroke-width': LIST_STROKE_WIDTH,
            cursor: 'pointer',
            sharp: 'v',
            d: 'M ' + x + ' ' + (y + MENU_ITEM_HEIGHT - LIST_STROKE_WIDTH) + ' ' +
                'L ' + (x + LIST_WIDTH) + ' ' + (y + MENU_ITEM_HEIGHT - LIST_STROKE_WIDTH)
        };
    }

    return attr;
}

function createMenuItem(renderer, options, settings) {
    const itemData = {};
    const type = settings.type;
    const format = settings.format;
    const attr = getItemAttributes(options, type, settings.itemIndex);
    const fontStyle = patchFontOptions(options.font);
    fontStyle['pointer-events'] = 'none';

    const menuItem = renderer.g().attr({ 'class': EXPORT_CSS_CLASS + '-list-item' });

    itemData[EXPORT_DATA_KEY] = type;
    if(format) {
        itemData[FORMAT_DATA_KEY] = format;
    }

    const rect = renderer.rect();
    rect.attr(attr.rect).
        css({
            cursor: 'pointer',
            'pointer-events': 'all'
        }).
        data(itemData);

    rect.on(hoverEventStart + '.export', () => rect.attr({ fill: options.button.hover.backgroundColor }))
        .on(hoverEventEnd + '.export', () => rect.attr({ fill: null }));

    rect.append(menuItem);

    const text = renderer.text(settings.text).css(fontStyle).
        attr(attr.text).
        append(menuItem);

    if(type === 'printing') {
        renderer.path(null, 'line').
            attr(attr.separator).
            append(menuItem);
    }

    return {
        g: menuItem,
        rect: rect,
        resetState: () => rect.attr({ fill: null }),
        fixPosition: () => {
            const textBBox = text.getBBox();
            text.move(attr.text.x - textBBox.x - (options.rtl ? textBBox.width : 0));
        }
    };
}

function createMenuItems(renderer, options) {
    let items = [];

    if(options.printingEnabled) {
        items.push(createMenuItem(renderer, options, {
            type: 'printing',
            text: messageLocalization.format('vizExport-printingButtonText'),
            itemIndex: items.length
        }));
    }
    items = options.formats.reduce((r, format) => {
        r.push(createMenuItem(renderer, options, {
            type: 'exporting',
            text: messageLocalization.getFormatter('vizExport-exportButtonText')(format),
            format: format,
            itemIndex: r.length
        }));
        return r;
    }, items);

    return items;
}

function getBackgroundColorFromMarkup(markup) {
    const parsedMarkup = GET_COLOR_REGEX.exec(markup);

    return parsedMarkup?.[1];
}

export const exportFromMarkup = function(markup, options) {
    options.format = validateFormat(options.format) || DEFAULT_EXPORT_FORMAT;
    options.fileName = options.fileName || 'file';

    options.exportingAction = options.onExporting;
    options.exportedAction = options.onExported;
    options.fileSavingAction = options.onFileSaving;
    options.margin = isDefined(options.margin) ? options.margin : MARGIN;
    options.backgroundColor = isDefined(options.backgroundColor) ? options.backgroundColor : (getBackgroundColorFromMarkup(markup) || getTheme().backgroundColor);
    _export(markup, options, getCreatorFunc(options.format));
};

export const getMarkup = widgets => combineMarkups(widgets).root.outerHTML;

export const exportWidgets = function(widgets, options) {
    options = options || {};
    const markupInfo = combineMarkups(widgets, {
        gridLayout: options.gridLayout,
        verticalAlignment: options.verticalAlignment,
        horizontalAlignment: options.horizontalAlignment
    });
    options.width = markupInfo.width;
    options.height = markupInfo.height;
    exportFromMarkup(markupInfo.root, options);
};

export let combineMarkups = function(widgets, options = { }) {
    if(!Array.isArray(widgets)) {
        widgets = [[widgets]];
    } else if(!Array.isArray(widgets[0])) {
        widgets = widgets.map(item => [item]);
    }

    const compactView = !options.gridLayout;
    const exportItems = widgets.reduce((r, row, rowIndex) => {
        const rowInfo = row.reduce((r, item, colIndex) => {
            const size = item.getSize();
            const backgroundColor = item.option('backgroundColor') || getTheme(item.option('theme')).backgroundColor;
            const node = $(item.element())
                .find('svg')
                .get(0)
                .cloneNode(true);

            backgroundColor && r.backgroundColors.indexOf(backgroundColor) === -1 && r.backgroundColors.push(backgroundColor);

            r.hOffset = r.width;
            r.width += size.width;
            r.height = Math.max(r.height, size.height);
            r.itemWidth = Math.max(r.itemWidth, size.width);
            r.items.push({
                node,
                width: size.width,
                height: size.height,
                c: colIndex,
                r: rowIndex,
                hOffset: r.hOffset
            });

            return r;
        }, { items: [], height: 0, itemWidth: 0, hOffset: 0, width: 0, backgroundColors: r.backgroundColors });

        r.rowOffsets.push(r.totalHeight);
        r.rowHeights.push(rowInfo.height);
        r.totalHeight += rowInfo.height;
        r.items = r.items.concat(rowInfo.items);
        r.itemWidth = Math.max(r.itemWidth, rowInfo.itemWidth);
        r.maxItemLen = Math.max(r.maxItemLen, rowInfo.items.length);
        r.totalWidth = compactView ? Math.max(r.totalWidth, rowInfo.width) : (r.maxItemLen * r.itemWidth);

        return r;
    }, { items: [], rowOffsets: [], rowHeights: [], itemWidth: 0, totalHeight: 0, maxItemLen: 0, totalWidth: 0, backgroundColors: [] });

    const backgroundColor = `${exportItems.backgroundColors.length === 1 ? exportItems.backgroundColors[0] : '' }`;
    const { totalWidth, totalHeight } = exportItems;

    const rootElement = wrapItemsToElement(totalWidth,
        totalHeight,
        backgroundColor,
        {
            options,
            exportItems,
            compactView
        }
    );

    return {
        root: rootElement,
        width: totalWidth,
        height: totalHeight
    };
};

function wrapItemsToElement(width, height, backgroundColor, { exportItems, options, compactView }) {
    const rendererWrapper = getRendererWrapper(width, height, backgroundColor);
    const getVOffset = item => {
        const align = options.verticalAlignment;
        const dy = exportItems.rowHeights[item.r] - item.height;

        return exportItems.rowOffsets[item.r] + (align === 'bottom' ? dy : align === 'center' ? dy / 2 : 0);
    };
    const getHOffset = item => {
        if(compactView) {
            return item.hOffset;
        }

        const align = options.horizontalAlignment;
        const colWidth = exportItems.itemWidth;
        const dx = colWidth - item.width;

        return item.c * colWidth + (align === 'right' ? dx : align === 'center' ? dx / 2 : 0);
    };

    exportItems.items.forEach((item) => {
        const container = rendererWrapper.createGroup();

        container.attr({
            translateX: getHOffset(item),
            translateY: getVOffset(item),
        });
        container.element.appendChild(item.node);
        container.append();
    });

    const result = rendererWrapper.getRootContent();

    rendererWrapper.dispose();

    return result;
}

export let ExportMenu = function(params) {
    const renderer = this._renderer = params.renderer;
    this._incidentOccurred = params.incidentOccurred;
    this._exportTo = params.exportTo;
    this._print = params.print;

    this._shadow = renderer.shadowFilter('-50%', '-50%', '200%', '200%', SHADOW_OFFSET, 6, SHADOW_BLUR);
    this._shadow.attr({ opacity: 0.8 });
    this._group = renderer.g().attr({
        'class': EXPORT_CSS_CLASS,
        [HIDDEN_FOR_EXPORT]: true
    }).linkOn(renderer.root, { name: 'export-menu', after: 'peripheral' });
    this._buttonGroup = renderer.g().attr({ 'class': EXPORT_CSS_CLASS + '-button' }).append(this._group);
    this._listGroup = renderer.g().attr({ 'class': EXPORT_CSS_CLASS + '-list' }).append(this._group);

    this._overlay = renderer.rect(-LIST_WIDTH + BUTTON_SIZE, BUTTON_SIZE + LIST_PADDING_TOP, LIST_WIDTH, 0);
    this._overlay.attr({
        'stroke-width': LIST_STROKE_WIDTH,
        cursor: 'pointer',
        rx: 4,
        ry: 4,
        filter: this._shadow.id
    });
    this._overlay.data({ 'export-element-type': 'list' });
    this.validFormats = getValidFormats();

    this._subscribeEvents();
};

extend(ExportMenu.prototype, {
    getLayoutOptions() {
        if(this._hiddenDueToLayout) {
            return { width: 0, height: 0, cutSide: 'vertical', cutLayoutSide: 'top' };
        }
        const bBox = this._buttonGroup.getBBox();

        bBox.cutSide = 'vertical';
        bBox.cutLayoutSide = 'top';
        bBox.height += MARGIN;
        bBox.position = {
            vertical: 'top',
            horizontal: 'right'
        };

        bBox.verticalAlignment = 'top';
        bBox.horizontalAlignment = 'right';

        return bBox;
    },

    shift(_, y) {
        this._group.attr({ translateY: this._group.attr('translateY') + y });
    },

    draw(width, height, canvas) {
        this._group.move(width - BUTTON_SIZE - SHADOW_OFFSET - SHADOW_BLUR + canvas.left, Math.floor(height / 2 - BUTTON_SIZE / 2));

        const layoutOptions = this.getLayoutOptions();
        if(layoutOptions.width > width || layoutOptions.height > height) {
            this.freeSpace();
        }

        return this;
    },

    show() {
        this._group.linkAppend();
    },

    hide() {
        this._group.linkRemove();
    },

    setOptions(options) {
        this._options = options;

        if(options.formats) {
            options.formats = options.formats.reduce((r, format) => {
                format = validateFormat(format, this._incidentOccurred, this.validFormats);
                format && r.push(format);
                return r;
            }, []);
        } else {
            options.formats = this.validFormats.supported.slice();
        }

        options.printingEnabled = options.printingEnabled === undefined ? true : options.printingEnabled;

        if(options.enabled && (options.formats.length || options.printingEnabled)) {
            this.show();
            this._updateButton();
            this._updateList();
            this._hideList();
        } else {
            this.hide();
        }
    },

    dispose() {
        this._unsubscribeEvents();

        this._group.linkRemove().linkOff();
        this._group.dispose();
        this._shadow.dispose();
    },

    // BaseWidget_layout_implementation
    layoutOptions() {
        return this._options.enabled && { horizontalAlignment: 'right', verticalAlignment: 'top', weak: true };
    },

    measure() {
        this._fillSpace();
        const margin = this._options.button.margin;
        return [BUTTON_SIZE + margin.left + margin.right, BUTTON_SIZE + margin.top + margin.bottom];
    },

    move(rect) {
        const margin = this._options.button.margin;
        this._group.attr({
            translateX: Math.round(rect[0]) + margin.left,
            translateY: Math.round(rect[1]) + margin.top
        });
    },

    _fillSpace() {
        this._hiddenDueToLayout = false;
        this.show();
    },

    freeSpace() {
        this._incidentOccurred('W2107');
        this._hiddenDueToLayout = true;
        this.hide();
    },
    // BaseWidget_layout_implementation

    _hideList() {
        this._listGroup.remove();
        this._listShown = false;
        this._setButtonState('default');
        this._menuItems.forEach(item => item.resetState());
    },

    _showList() {
        this._listGroup.append(this._group);
        this._listShown = true;
        this._menuItems.forEach(item => item.fixPosition());
    },

    _setButtonState(state) {
        const style = this._options.button[state];

        this._button.attr({
            stroke: style.borderColor,
            fill: style.backgroundColor
        });

        this._icon.attr({ fill: style.color });
    },

    _subscribeEvents() {
        this._renderer.root.on(pointerEvents.up + '.export', e => {
            const elementType = e.target[EXPORT_DATA_KEY];

            if(!elementType) {
                if(this._button) {
                    this._hideList();
                }
                return;
            }

            if(elementType === 'button') {
                if(this._listShown) {
                    this._setButtonState('default');
                    this._hideList();
                } else {
                    this._setButtonState('focus');
                    this._showList();
                }
            } else if(elementType === 'printing') {
                this._print();
                this._hideList();
            } else if(elementType === 'exporting') {
                this._exportTo(e.target[FORMAT_DATA_KEY]);
                this._hideList();
            }
        });


        this._listGroup.on(pointerActions, e => e.stopPropagation());

        this._buttonGroup.on(pointerEvents.enter, () => this._setButtonState('hover'));
        this._buttonGroup.on(pointerEvents.leave, () => this._setButtonState(this._listShown ? 'focus' : 'default'));
        this._buttonGroup.on(pointerEvents.down + '.export', () => this._setButtonState('active'));
    },

    _unsubscribeEvents() {
        this._renderer.root.off('.export');
        this._listGroup.off();
        this._buttonGroup.off();
    },

    _updateButton() {
        const renderer = this._renderer;
        const options = this._options;
        const exportData = { 'export-element-type': 'button' };

        if(!this._button) {
            this._button = renderer.rect(0, 0, BUTTON_SIZE, BUTTON_SIZE).append(this._buttonGroup);
            this._button.attr({
                rx: 4,
                ry: 4,
                fill: options.button.default.backgroundColor,
                stroke: options.button.default.borderColor,
                'stroke-width': 1,
                cursor: 'pointer'
            });
            this._button.data(exportData);

            this._icon = renderer.path(ICON_COORDS).append(this._buttonGroup);
            this._icon.attr({
                fill: options.button.default.color,
                cursor: 'pointer'
            });
            this._icon.data(exportData);

            this._buttonGroup.setTitle(messageLocalization.format('vizExport-titleMenuText'));
        }
    },

    _updateList() {
        const options = this._options;
        const buttonDefault = options.button.default;
        const listGroup = this._listGroup;
        const items = createMenuItems(this._renderer, options);

        this._shadow.attr({
            color: options.shadowColor
        });

        this._overlay.attr({
            height: items.length * MENU_ITEM_HEIGHT + LIST_STROKE_WIDTH * 2,
            fill: buttonDefault.backgroundColor,
            stroke: buttonDefault.borderColor
        });

        listGroup.clear();
        this._overlay.append(listGroup);
        items.forEach(item => item.g.append(listGroup));

        this._menuItems = items;
    }
});

// BaseWidget.js
function getExportOptions(widget, exportOptions, fileName, format) {
    if(format || exportOptions.format) {
        format = validateFormat(format || exportOptions.format, widget._incidentOccurred);
    }
    const { width, height } = widget.getSize();

    return {
        format: format || DEFAULT_EXPORT_FORMAT,
        fileName: fileName || exportOptions.fileName || 'file',
        backgroundColor: exportOptions.backgroundColor,
        width,
        height,
        margin: exportOptions.margin,
        svgToCanvas: exportOptions.svgToCanvas,
        exportingAction: widget._createActionByOption('onExporting', { excludeValidators: ['disabled'] }),
        exportedAction: widget._createActionByOption('onExported', { excludeValidators: ['disabled'] }),
        fileSavingAction: widget._createActionByOption('onFileSaving', { excludeValidators: ['disabled'] })
    };
}

export const plugin = {
    name: 'export',
    init() {
        this._exportMenu = new ExportMenu({
            renderer: this._renderer,
            incidentOccurred: this._incidentOccurred,
            print: () => this.print(),
            exportTo: format => this.exportTo(undefined, format)
        });
        this._layout.add(this._exportMenu);
    },
    dispose() {
        this._exportMenu.dispose();
    },

    members: {
        _getExportMenuOptions() {
            return extend({}, this._getOption('export'), { rtl: this._getOption('rtlEnabled', true) });
        },

        _disablePointerEvents() {
            const pointerEventsValue = this._renderer.root.attr('pointer-events');

            this._renderer.root.attr({
                'pointer-events': 'none'
            });

            return pointerEventsValue;
        },

        exportTo(fileName, format) {
            const menu = this._exportMenu;
            const options = getExportOptions(this, this._getOption('export') || {}, fileName, format);

            menu && menu.hide();

            const pointerEventsValue = this._disablePointerEvents();

            const promise = _export(this._renderer.root.element, options, getCreatorFunc(options.format))
                .fail(logger.error)
                .always(() => {
                    this._renderer.root.attr({
                        'pointer-events': pointerEventsValue
                    });
                });
            menu && menu.show();
            return promise;
        },
        print() {
            const menu = this._exportMenu;
            const options = getExportOptions(this, this._getOption('export') || {});

            ///#DEBUG
            options.__test = this._getOption('export').__test;
            ///#ENDDEBUG

            options.exportingAction = null;
            options.exportedAction = null;
            options.margin = 0;
            options.format = 'PNG';
            options.useBase64 = true;
            options.fileSavingAction = eventArgs => {
                print(`data:image/png;base64,${eventArgs.data}`, { width: options.width, __test: options.__test });
                eventArgs.cancel = true;
            };

            const pointerEventsValue = this._disablePointerEvents();

            menu && menu.hide();
            const promise = _export(this._renderer.root.element, options, getCreatorFunc(options.format))
                .fail(logger.error)
                .always(() => {
                    this._renderer.root.attr({
                        'pointer-events': pointerEventsValue
                    });
                });
            menu && menu.show();
            return promise;
        }
    },
    customize(constructor) {
        const proto = constructor.prototype;

        constructor.addChange({
            code: 'EXPORT',
            handler() {
                this._exportMenu.setOptions(this._getExportMenuOptions());
                this._change(['LAYOUT']);
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: 'export'
        });

        // TODO: Event options change processing either should be done by the eventTrigger or shouldn't be done at all
        proto._optionChangesMap.onExporting = 'EXPORT';
        proto._optionChangesMap.onExported = 'EXPORT';
        proto._optionChangesMap.onFileSaving = 'EXPORT';
    },
    fontFields: ['export.font']
};

///#DEBUG
export const DEBUG_set_combineMarkups = function(value) {
    combineMarkups = value;
};

export const DEBUG_set_ExportMenu = function(value) {
    ExportMenu = value;
};
///#ENDDEBUG
