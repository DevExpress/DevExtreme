import $ from '../../core/renderer';
import { isMaterial, waitWebFont } from '../themes';
import fx from '../../animation/fx';

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_ITEMS = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
const ANIMATION_TIMEOUT = 15;


const getItemInstance = function($element) {
    const itemData = $element.data && $element.data();
    const dxComponents = itemData && itemData.dxComponents;
    const widgetName = dxComponents && dxComponents[0];

    return widgetName && itemData[widgetName];
};

export function toggleItemFocusableElementTabIndex(context, item) {
    if(!context) return;

    const $item = context._findItemElementByItem(item);
    if(!$item.length) {
        return;
    }

    const itemData = context._getItemData($item);
    const isItemNotFocusable = !!(itemData.options?.disabled || itemData.disabled || context.option('disabled'));

    const { widget } = itemData;

    if(widget && TOOLBAR_ITEMS.indexOf(widget) !== -1) {
        const $widget = $item.find(widget.toLowerCase().replace('dx', '.dx-'));
        if($widget.length) {
            const itemInstance = getItemInstance($widget);
            const $focusTarget = widget === 'dxDropDownButton'
                ? itemInstance._focusTarget().find(`.${BUTTON_GROUP_CLASS}`)
                : itemInstance?._focusTarget?.() ?? $(itemInstance.element());

            const tabIndex = itemData.options?.tabIndex;
            if(isItemNotFocusable) {
                $focusTarget.attr('tabIndex', -1);
            } else {
                $focusTarget.attr('tabIndex', tabIndex ?? 0);
            }
        }
    }
}

export function updateDimensionsInMaterial() {
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
