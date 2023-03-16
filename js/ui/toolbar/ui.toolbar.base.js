import { getWidth, getOuterWidth, getHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { isMaterial, waitWebFont } from '../themes';
import { isPlainObject, isDefined } from '../../core/utils/type';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { getBoundingRect } from '../../core/utils/position';
import AsyncCollectionWidget from '../collection/ui.collection_widget.async';
import { BindableTemplate } from '../../core/templates/bindable_template';
import fx from '../../animation/fx';

import { TOOLBAR_CLASS } from './constants';

const TOOLBAR_BEFORE_CLASS = 'dx-toolbar-before';
const TOOLBAR_CENTER_CLASS = 'dx-toolbar-center';
const TOOLBAR_AFTER_CLASS = 'dx-toolbar-after';
const TOOLBAR_MINI_CLASS = 'dx-toolbar-mini';
const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_BUTTON_CLASS = 'dx-toolbar-button';
const TOOLBAR_ITEMS_CONTAINER_CLASS = 'dx-toolbar-items-container';
const TOOLBAR_GROUP_CLASS = 'dx-toolbar-group';
const TOOLBAR_COMPACT_CLASS = 'dx-toolbar-compact';
const TEXT_BUTTON_MODE = 'text';

const DEFAULT_BUTTON_TYPE = 'default';
const DEFAULT_DROPDOWNBUTTON_STYLING_MODE = 'contained';

const TOOLBAR_ITEM_DATA_KEY = 'dxToolbarItemDataKey';
const ANIMATION_TIMEOUT = 15;

class ToolbarBase extends AsyncCollectionWidget {
    _getSynchronizableOptionsForCreateComponent() {
        return super._getSynchronizableOptionsForCreateComponent().filter(item => item !== 'disabled');
    }

    _initTemplates() {
        super._initTemplates();
        const template = new BindableTemplate(function($container, data, rawModel) {
            if(isPlainObject(data)) {
                const { text, html, widget } = data;

                if(text) {
                    $container.text(text).wrapInner('<div>');
                }

                if(html) {
                    $container.html(html);
                }

                if(widget === 'dxDropDownButton') {
                    data.options = data.options ?? {};

                    if(!isDefined(data.options.stylingMode)) {
                        data.options.stylingMode = this.option('useFlatButtons')
                            ? TEXT_BUTTON_MODE
                            : DEFAULT_DROPDOWNBUTTON_STYLING_MODE;
                    }
                }

                if(widget === 'dxButton') {
                    if(this.option('useFlatButtons')) {
                        data.options = data.options ?? {};
                        data.options.stylingMode = data.options.stylingMode ?? TEXT_BUTTON_MODE;
                    }

                    if(this.option('useDefaultButtons')) {
                        data.options = data.options ?? {};
                        data.options.type = data.options.type ?? DEFAULT_BUTTON_TYPE;
                    }
                }
            } else {
                $container.text(String(data));
            }

            this._getTemplate('dx-polymorph-widget').render({
                container: $container,
                model: rawModel,
                parent: this
            });
        }.bind(this), ['text', 'html', 'widget', 'options'], this.option('integrationOptions.watchMethod'));

        this._templateManager.addDefaultTemplates({
            item: template,
            menuItem: template,
        });
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            renderAs: 'topToolbar',
            grouped: false,
            useFlatButtons: false,
            useDefaultButtons: false,
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: function() {
                    return isMaterial();
                },
                options: {
                    useFlatButtons: true
                }
            }
        ]);
    }

    _itemContainer() {
        return this._$toolbarItemsContainer.find([
            `.${TOOLBAR_BEFORE_CLASS}`,
            `.${TOOLBAR_CENTER_CLASS}`,
            `.${TOOLBAR_AFTER_CLASS}`,
        ].join(','));
    }

    _itemClass() {
        return TOOLBAR_ITEM_CLASS;
    }

    _itemDataKey() {
        return TOOLBAR_ITEM_DATA_KEY;
    }

    _dimensionChanged() {
        if(this._disposed) {
            return;
        }

        this._arrangeItems();
        this._applyCompactMode();
    }

    _initMarkup() {
        this._renderToolbar();
        this._renderSections();

        super._initMarkup();
    }

    _render() {
        super._render();
        this._renderItemsAsync();

        this._updateDimensionsInMaterial();
    }

    _postProcessRenderItems() {
        this._arrangeItems();
    }

    _renderToolbar() {
        this.$element()
            .addClass(TOOLBAR_CLASS);

        this._$toolbarItemsContainer = $('<div>')
            .addClass(TOOLBAR_ITEMS_CONTAINER_CLASS)
            .appendTo(this.$element());

        this.setAria('role', 'toolbar');
    }

    _renderSections() {
        const $container = this._$toolbarItemsContainer;

        each(['before', 'center', 'after'], (_, section) => {
            const sectionClass = `dx-toolbar-${section}`;
            const $section = $container.find(`.${sectionClass}`);

            if(!$section.length) {
                this[`_$${section}Section`] = $('<div>')
                    .addClass(sectionClass)
                    .appendTo($container);
            }
        });
    }

    _arrangeItems(elementWidth) {
        elementWidth = elementWidth ?? getWidth(this.$element());

        this._$centerSection.css({
            margin: '0 auto',
            float: 'none'
        });

        const beforeRect = getBoundingRect(this._$beforeSection.get(0));
        const afterRect = getBoundingRect(this._$afterSection.get(0));

        this._alignCenterSection(beforeRect, afterRect, elementWidth);

        const $label = this._$toolbarItemsContainer.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0);
        const $section = $label.parent();

        if(!$label.length) {
            return;
        }

        const labelOffset = beforeRect.width ? beforeRect.width : $label.position().left;
        const widthBeforeSection = $section.hasClass(TOOLBAR_BEFORE_CLASS) ? 0 : labelOffset;
        const widthAfterSection = $section.hasClass(TOOLBAR_AFTER_CLASS) ? 0 : afterRect.width;
        let elemsAtSectionWidth = 0;

        $section.children().not(`.${TOOLBAR_LABEL_CLASS}`).each(function() {
            elemsAtSectionWidth += getOuterWidth(this);
        });

        const freeSpace = elementWidth - elemsAtSectionWidth;
        const sectionMaxWidth = Math.max(freeSpace - widthBeforeSection - widthAfterSection, 0);

        if($section.hasClass(TOOLBAR_BEFORE_CLASS)) {
            this._alignSection(this._$beforeSection, sectionMaxWidth);
        } else {
            const labelPaddings = getOuterWidth($label) - getWidth($label);
            $label.css('maxWidth', sectionMaxWidth - labelPaddings);
        }
    }

    _alignCenterSection(beforeRect, afterRect, elementWidth) {
        this._alignSection(this._$centerSection, elementWidth - beforeRect.width - afterRect.width);

        const isRTL = this.option('rtlEnabled');
        const leftRect = isRTL ? afterRect : beforeRect;
        const rightRect = isRTL ? beforeRect : afterRect;
        const centerRect = getBoundingRect(this._$centerSection.get(0));

        if(leftRect.right > centerRect.left || centerRect.right > rightRect.left) {
            this._$centerSection.css({
                marginLeft: leftRect.width,
                marginRight: rightRect.width,
                float: leftRect.width > rightRect.width ? 'none' : 'right'
            });
        }
    }

    _alignSection($section, maxWidth) {
        const $labels = $section.find(`.${TOOLBAR_LABEL_CLASS}`);
        let labels = $labels.toArray();

        maxWidth = maxWidth - this._getCurrentLabelsPaddings(labels);

        const currentWidth = this._getCurrentLabelsWidth(labels);
        const difference = Math.abs(currentWidth - maxWidth);

        if(maxWidth < currentWidth) {
            labels = labels.reverse();
            this._alignSectionLabels(labels, difference, false);
        } else {
            this._alignSectionLabels(labels, difference, true);
        }
    }

    _alignSectionLabels(labels, difference, expanding) {
        const getRealLabelWidth = function(label) { return getBoundingRect(label).width; };

        for(let i = 0; i < labels.length; i++) {
            const $label = $(labels[i]);
            const currentLabelWidth = Math.ceil(getRealLabelWidth(labels[i]));
            let labelMaxWidth;

            if(expanding) {
                $label.css('maxWidth', 'inherit');
            }

            const possibleLabelWidth = Math.ceil(expanding ? getRealLabelWidth(labels[i]) : currentLabelWidth);

            if(possibleLabelWidth < difference) {
                labelMaxWidth = expanding ? possibleLabelWidth : 0;
                difference = difference - possibleLabelWidth;
            } else {
                labelMaxWidth = expanding ? currentLabelWidth + difference : currentLabelWidth - difference;
                $label.css('maxWidth', labelMaxWidth);
                break;
            }

            $label.css('maxWidth', labelMaxWidth);
        }
    }

    _applyCompactMode() {
        const $element = this.$element();
        $element.removeClass(TOOLBAR_COMPACT_CLASS);

        if(this.option('compactMode') && this._getSummaryItemsWidth(this.itemElements(), true) > getWidth($element)) {
            $element.addClass(TOOLBAR_COMPACT_CLASS);
        }
    }

    _getCurrentLabelsWidth(labels) {
        let width = 0;

        labels.forEach(function(label, index) {
            width += getOuterWidth(label);
        });

        return width;
    }

    _getCurrentLabelsPaddings(labels) {
        let padding = 0;

        labels.forEach(function(label, index) {
            padding += (getOuterWidth(label) - getWidth(label));
        });

        return padding;
    }

    _renderItem(index, item, itemContainer, $after) {
        const location = item.location ?? 'center';
        const container = itemContainer ?? this[`_$${location}Section`];
        const itemHasText = !!(item.text ?? item.html);
        const itemElement = super._renderItem(index, item, container, $after);

        itemElement
            .toggleClass(TOOLBAR_BUTTON_CLASS, !itemHasText)
            .toggleClass(TOOLBAR_LABEL_CLASS, itemHasText)
            .addClass(item.cssClass);

        return itemElement;
    }

    _renderGroupedItems() {
        each(this.option('items'), (groupIndex, group) => {
            const groupItems = group.items;
            const $container = $('<div>').addClass(TOOLBAR_GROUP_CLASS);
            const location = group.location ?? 'center';

            if(!groupItems || !groupItems.length) {
                return;
            }

            each(groupItems, (itemIndex, item) => {
                this._renderItem(itemIndex, item, $container, null);
            });

            this._$toolbarItemsContainer.find(`.dx-toolbar-${location}`).append($container);
        });
    }

    _renderItems(items) {
        const grouped = this.option('grouped') && items.length && items[0].items;
        grouped ? this._renderGroupedItems() : super._renderItems(items);
    }

    _getToolbarItems() {
        return this.option('items') ?? [];
    }

    _renderContentImpl() {
        const items = this._getToolbarItems();

        this.$element().toggleClass(TOOLBAR_MINI_CLASS, items.length === 0);

        if(this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount));
        } else {
            this._renderItems(items);
        }

        this._applyCompactMode();
    }

    _renderEmptyMessage() {}

    _clean() {
        this._$toolbarItemsContainer.children().empty();
        this.$element().empty();

        delete this._$beforeSection;
        delete this._$centerSection;
        delete this._$afterSection;
    }

    _visibilityChanged(visible) {
        if(visible) {
            this._arrangeItems();
        }
    }

    _isVisible() {
        return getWidth(this.$element()) > 0 && getHeight(this.$element()) > 0;
    }

    _getIndexByItem(item) {
        return this._getToolbarItems().indexOf(item);
    }

    _itemOptionChanged(item, property, value) {
        super._itemOptionChanged.apply(this, [item, property, value]);
        this._arrangeItems();
    }

    _optionChanged({ name, value }) {
        switch(name) {
            case 'width':
                super._optionChanged.apply(this, arguments);
                this._dimensionChanged();
                break;
            case 'renderAs':
            case 'useFlatButtons':
            case 'useDefaultButtons':
                this._invalidate();
                break;
            case 'compactMode':
                this._applyCompactMode();
                break;
            case 'grouped':
                break;
            default:
                super._optionChanged.apply(this, arguments);
        }
    }

    _dispose() {
        super._dispose();
        clearTimeout(this._waitParentAnimationTimeout);
    }

    _updateDimensionsInMaterial() {
        if(isMaterial()) {
            const _waitParentAnimationFinished = () => {
                return new Promise(resolve => {
                    const check = () => {
                        let readyToResolve = true;
                        this.$element().parents().each((_, parent) => {
                            if(fx.isAnimating($(parent))) {
                                readyToResolve = false;
                                return false;
                            }
                        });
                        if(readyToResolve) {
                            resolve();
                        }
                        return readyToResolve;
                    };
                    const runCheck = () => {
                        clearTimeout(this._waitParentAnimationTimeout);
                        this._waitParentAnimationTimeout = setTimeout(() => check() || runCheck(), ANIMATION_TIMEOUT);
                    };
                    runCheck();
                });
            };

            const _checkWebFontForLabelsLoaded = () => {
                const $labels = this.$element().find(`.${TOOLBAR_LABEL_CLASS}`);
                const promises = [];
                $labels.each((_, label) => {
                    const text = $(label).text();
                    const fontWeight = $(label).css('fontWeight');
                    promises.push(waitWebFont(text, fontWeight));
                });
                return Promise.all(promises);
            };

            Promise.all([
                _waitParentAnimationFinished(),
                _checkWebFontForLabelsLoaded(),
            ]).then(() => { this._dimensionChanged(); });
        }
    }
}

registerComponent('dxToolbarBase', ToolbarBase);

export default ToolbarBase;
