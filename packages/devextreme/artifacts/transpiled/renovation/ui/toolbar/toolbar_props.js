"use strict";

exports.ToolbarTextBoxProps = exports.ToolbarProps = exports.ToolbarItemType = exports.ToolbarItem = exports.ToolbarDropDownButtonProps = exports.ToolbarDropDownButtonItemPropsType = exports.ToolbarDropDownButtonItemProps = exports.ToolbarCheckBoxProps = exports.ToolbarButtonProps = exports.ToolbarButtonGroupProps = exports.CollectionWidgetItem = exports.BaseToolbarItemProps = void 0;
var _base_props = require("../common/base_props");
const CollectionWidgetItem = exports.CollectionWidgetItem = {};
const BaseToolbarItemProps = exports.BaseToolbarItemProps = {};
const ToolbarTextBoxProps = exports.ToolbarTextBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseToolbarItemProps), Object.getOwnPropertyDescriptors({
  value: ''
})));
const ToolbarCheckBoxProps = exports.ToolbarCheckBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseToolbarItemProps), Object.getOwnPropertyDescriptors({
  value: false
})));
const ToolbarButtonGroupProps = exports.ToolbarButtonGroupProps = BaseToolbarItemProps;
const ToolbarButtonProps = exports.ToolbarButtonProps = BaseToolbarItemProps;
const ToolbarDropDownButtonItemProps = exports.ToolbarDropDownButtonItemProps = CollectionWidgetItem;
const ToolbarDropDownButtonItemPropsType = exports.ToolbarDropDownButtonItemPropsType = {};
const ToolbarDropDownButtonProps = exports.ToolbarDropDownButtonProps = BaseToolbarItemProps;
const ToolbarItem = exports.ToolbarItem = CollectionWidgetItem;
const ToolbarItemType = exports.ToolbarItemType = {};
const ToolbarProps = exports.ToolbarProps = _base_props.BaseWidgetProps;