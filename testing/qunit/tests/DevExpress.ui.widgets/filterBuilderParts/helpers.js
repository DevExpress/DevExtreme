import $ from 'jquery';
import {
    FILTER_BUILDER_ITEM_FIELD_CLASS,
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS,
    FILTER_BUILDER_GROUP_OPERATION_CLASS,
    TREE_VIEW_ITEM_CLASS,
} from './constants.js';

export const getSelectedMenuText = function() {
    return $('.dx-treeview-node.dx-state-selected').text();
};

export const getFilterBuilderGroups = function(container) {
    return container.find('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS);
};

export const getFilterBuilderItems = function(container) {
    return container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
};

export const clickByOutside = function() {
    $('body').trigger('dxpointerdown'); // use dxpointerdown because T600142
};

export const clickByValue = function(index) {
    $('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).eq(index || 0).trigger('dxclick');
};

export const selectMenuItem = function(menuItemIndex) {
    $(`.${TREE_VIEW_ITEM_CLASS}`).eq(menuItemIndex).trigger('dxclick');
};

export const clickByButtonAndSelectMenuItem = function($button, menuItemIndex) {
    $button.trigger('dxclick');
    selectMenuItem(menuItemIndex);
    $(`.${TREE_VIEW_ITEM_CLASS}`).eq(menuItemIndex).trigger('dxclick');
};
