import $ from '../../core/renderer';
import Button from '../button';
import CollectionWidget from '../collection/ui.collection_widget.edit';
import { extend } from '../../core/utils/extend';
import { BindableTemplate } from '../../core/templates/bindable_template';

// STYLE buttonGroup

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + '-item';
const BUTTON_GROUP_FIRST_ITEM_CLASS = BUTTON_GROUP_CLASS + '-first-item';
const BUTTON_GROUP_LAST_ITEM_CLASS = BUTTON_GROUP_CLASS + '-last-item';
const SHAPE_STANDARD_CLASS = 'dx-shape-standard';

const ButtonCollection = CollectionWidget.inherit({
    _initTemplates() {
        this.callBase();
        /**
         * @name dxButtonGroupItem.html
         * @hidden
         */
        this._templateManager.addDefaultTemplates({
            item: new BindableTemplate((($container, data, model) => {
                this._prepareItemStyles($container);
                this._createComponent($container, Button, extend({}, model, data, this._getBasicButtonOptions(), {
                    _templateData: model,
                    template: model.template || this.option('buttonTemplate')
                }));
            }), ['text', 'type', 'icon', 'disabled', 'visible', 'hint'], this.option('integrationOptions.watchMethod'))
        });
    },

    _getBasicButtonOptions() {
        return {
            focusStateEnabled: false,
            onClick: null,
            hoverStateEnabled: this.option('hoverStateEnabled'),
            activeStateEnabled: this.option('activeStateEnabled'),
            stylingMode: this.option('stylingMode')
        };
    },

    _getDefaultOptions: function _getDefaultOptions() {
        return extend(this.callBase(), {
            itemTemplateProperty: null
        });
    },

    _prepareItemStyles($item) {
        const itemIndex = $item.data('dxItemIndex');
        itemIndex === 0 && $item.addClass(BUTTON_GROUP_FIRST_ITEM_CLASS);

        const items = this.option('items');
        items && itemIndex === items.length - 1 && $item.addClass(BUTTON_GROUP_LAST_ITEM_CLASS);

        $item.addClass(SHAPE_STANDARD_CLASS);
    },

    _renderItemContent(args) {
        args.container = $(args.container).parent();
        return this.callBase(args);
    },

    _renderItemContentByNode: function(args, $node) {
        args.container = $(args.container.children().first());
        return this.callBase(args, $node);
    },

    _focusTarget() {
        return this.$element().parent();
    },

    _keyboardEventBindingTarget() {
        return this._focusTarget();
    },

    _refreshContent() {
        this._prepareContent();
        this._renderContent();
    },

    _itemClass() {
        return BUTTON_GROUP_ITEM_CLASS;
    },

    _itemSelectHandler: function(e) {
        if(this.option('selectionMode') === 'single' && this.isItemSelected(e.currentTarget)) {
            return;
        }

        this.callBase(e);
    }
});

export default ButtonCollection;
