'use strict';

module.exports = {
    // regex, replacement - replace
    // import, type - additional import (
    //    index - in _index.scss file
    //    colors - in _colors.scss file
    //    sizes - in _sizes.scss file)
    'typography': [
        { regex: /\(css\)\s/, replacement: '' },
        { import: '../common', type: 'index' },
    ],
    'common': [
        { regex: /([^$][\w-].*?:\s.*),$/gm, replacement: '$1;' },
        { regex: /\.user-select\(none\),/, replacement: '@include user-select(none);' },
        { regex: /@mixin badge-settings\(\),/, replacement: '@include badge-settings();' },
        { regex: /@mixin validation-badge-animation\(\),/, replacement: '@include validation-badge-animation();' },
        { import: '../../base/mixins', type: 'index' },
        { import: '../../base/validation', type: 'index' },
        { import: '../list/sizes', type: 'index' },
    ],
    'icons': [
        { regex: /@import \(once\) "..\/base\/icons.scss";/, replacement: '' },
        { import: '../../base/icons', type: 'index' },
    ],
    'widget': [
        { import: '../common', type: 'index' },
    ],
    'fieldset': [
        { import: '../common/sizes', type: 'index' },
        { import: '../common', type: 'index' },
        { import: '../typography', type: 'index' },
    ],
    'button': [
        { import: '../../base/icons', type: 'index' },
        { regex: /@mixin dx-icon-sizing\(\$ICON_SIZE\),/, replacement: '@include dx-icon-sizing($ICON_SIZE);' },
        { regex: /\.dx-icon-margin\(\$ICON_MARGIN\),/, replacement: '@include dx-icon-margin($ICON_MARGIN);' },
        { regex: /@mixin dx-button-onlyicon-sizing\(\),/, replacement: '@include dx-button-onlyicon-sizing();' },
        { regex: /.dx-button-onlyicon-sizing\(\),/, replacement: '@include dx-button-onlyicon-sizing();' },
        { regex: /.dx-button-withtext-sizing\(\),/, replacement: '@include dx-button-withtext-sizing();' },
        { regex: /.dx-button-text-and-icon-sizing\(\),/, replacement: '@include dx-button-text-and-icon-sizing();' },
        { regex: /\$MATERIAL_BUTTON_MIN_WIDTH,/, replacement: '$MATERIAL_BUTTON_MIN_WIDTH;' }
    ],
    'buttonGroup': [
        { import: '../button', type: 'index' },
        { import: '../button/colors', type: 'index' },
        { import: '../button/colors', type: 'colors' },
    ],
    'scrollView': [
        { import: '../scrollable/colors', type: 'index' },
    ],
    'checkBox': [
        { import: 'colors', type: 'sizes' },
        { import: '../../base/icons', type: 'index' },
    ],
    'switch': [
        { import: '../../base/mixins', type: 'index' },
    ],
    'tabs': [
        { import: '../button', type: 'index' },
        { import: '../button/colors', type: 'index' },
        { import: '../button/colors', type: 'colors' },
        { import: '../../base/icons', type: 'index' },
    ],
    'navBar': [
        { import: '../../base/icons', type: 'index' },
    ],
    'validation': [
        { import: '../../base/validation', type: 'index' },
    ],
    'textEditor': [
        { import: '../../base/icons', type: 'index' },
        { import: '../common/sizes', type: 'index' },
        { import: '../button/sizes', type: 'index' },
        { import: '../common', type: 'index' },
        { import: '../button', type: 'index' },
        { regex: /@mixin texteditor-input-padding-filled\(\),/g, replacement: '@inclide texteditor-input-padding-filled();' },
        { regex: /@mixin texteditor-input-padding\(\),/g, replacement: '@inclide texteditor-input-padding();' },
        { regex: /.texteditor-validation-icon-offset-filled\(\),/g, replacement: '@include texteditor-validation-icon-offset-filled();' },
        { regex: /.texteditor-validation-icon-offset\(\),/g, replacement: '@include texteditor-validation-icon-offset();' },
        { regex: /@mixin dx-icon-sizing\(\$MATERIAL_TEXTEDITOR_ICON_CONTAINER_SIZE\),/, replacement: '@include dx-icon-sizing($MATERIAL_TEXTEDITOR_ICON_CONTAINER_SIZE);' },
        { regex: /@mixin dx-texteditor-icon\(\),/, replacement: '@include dx-texteditor-icon();' },
        { regex: /.dx-icon-font-centered-sizing\(\$MATERIAL_TEXTEDITOR_CLEAR_ICON_SIZE\),/, replacement: '@include dx-icon-font-centered-sizing($MATERIAL_TEXTEDITOR_CLEAR_ICON_SIZE);' },
        { regex: /\$texteditor-input-border-radius,/g, replacement: '$texteditor-input-border-radius;' },
        { regex: /relative,/g, replacement: 'relative;' }
    ],
    'textBox': [
        { import: '../../base/icons', type: 'index' },
        { import: '../textEditor', type: 'index' },
        { import: '../textEditor/colors', type: 'index' },
        { import: '../textEditor/sizes', type: 'index' },
    ],
    'dropDownEditor': [
        { import: '../common', type: 'index' },
        { import: '../common/sizes', type: 'index' },
        { import: '../textEditor/sizes', type: 'index' },
        { import: '../button/colors', type: 'colors' },
        { import: '../button/colors', type: 'index' },
        { import: '../textEditor/colors', type: 'colors' },
        { import: '../../base/icons', type: 'index' },
    ],
    'dropDownBox': [
        { import: '../dropDownEditor', type: 'index' },
    ],
    'list': [
        { import: '../../base/icons', type: 'index' },
        { import: '../button/colors', type: 'colors' },
        { import: '../button/colors', type: 'index' },
        { import: '../button/sizes', type: 'index' },
        { import: '../button', type: 'index' },
        { import: '../checkBox/colors', type: 'index' },
        { import: '../list/colors', type: 'sizes' },
        { regex: /@mixin item-states\(\),/, replacement: '@include item-states();' },
        { regex: /@mixin dx-icon\(chevronnext\),/, replacement: '@include dx-icon(chevronnext);' },
        { regex: /.dx-icon-sizing\(\$GENERIC_BASE_ICON_SIZE\),/g, replacement: '@include dx-icon-sizing($GENERIC_BASE_ICON_SIZE);' },
        { regex: /margin-left: -5px,/, replacement: 'margin-left: -5px;' },
        { regex: /color: \$list-item-chevron-icon-color,/, replacement: 'color: $list-item-chevron-icon-color;' },
        { regex: /width: \$GENERIC_BASE_ICON_SIZE \+ \$GENERIC_LIST_ITEM_HORIZONTAL_PADDING,/, replacement: 'width: $GENERIC_BASE_ICON_SIZE + $GENERIC_LIST_ITEM_HORIZONTAL_PADDING;' },
        { regex: /height: \$GENERIC_BASE_ICON_SIZE,/, replacement: 'height: $GENERIC_BASE_ICON_SIZE;' },
        { regex: /vertical-align: top,/, replacement: 'vertical-align: top;' },
        { regex: /margin-bottom: \$GENERIC_LIST_SEARCHBOX_MARGIN_BOTTOM,/, replacement: 'margin-bottom: $GENERIC_LIST_SEARCHBOX_MARGIN_BOTTOM;' }

    ],
    'numberBox': [
        { import: '../../base/icons', type: 'index' },
        { import: '../textEditor', type: 'index' },
        { import: '../textEditor/sizes', type: 'index' },
        { import: '../textEditor/colors', type: 'index' },
        { import: '../button/colors', type: 'colors' },
    ],
    'dateView': [
        { import: '../../base/mixins', type: 'index' },
    ],
    'timeView': [
        { import: '../textEditor/sizes', type: 'index' },
    ],
    'calendar': [
        { import: '../button/colors', type: 'colors' },
        { import: '../button', type: 'index' },
        { import: '../button/colors', type: 'index' },
    ],
    'dateBox': [
        { import: '../../base/icons', type: 'index' },
        { import: '../dropDownEditor', type: 'index' },
        { import: '../textEditor', type: 'index' },
        { import: '../textEditor/colors', type: 'index' },
        { regex: /@mixin dx-icon\(spindown\),/, replacement: '@include dx-icon(spindown);' },
        { regex: /.dx-dropdowneditor-button-icon\(\),/, replacement: '@include dx-dropdowneditor-button-icon();' },
        { regex: /(hover-bg|opacity: 1|padding: 0|: none|_MARGIN|_MARGIN\/2|-1px),/g, replacement: '$1;' },
        { regex: /@mixin dx-icon\(event\),/, replacement: '@include dx-icon(event);' },
    ],
    'dropDownList': [
        { import: '../common', type: 'index' },
    ],
    'autocomplete': [
        { import: '../common', type: 'index' },
    ],
    'treeView': [
        { import: '../../base/treeView', type: 'index' },
        { import: '../../base/icons', type: 'index' },
        { import: '../checkBox/colors', type: 'index' },
    ],
    'overlay': [
        { import: '../common', type: 'index' },
    ],
    'menuBase': [
        { import: '../menu/colors', type: 'index' },
        { import: '../common', type: 'index' },
        { import: '../../base/icons', type: 'index' },
        { import: '../../base/mixins', type: 'index' },
    ],
    'menu': [
        { import: '../menuBase', type: 'index' },
        { import: '../menuBase/sizes', type: 'index' },
        { import: '../../base/icons', type: 'index' },
    ],
    'toolbar': [
        { import: '../../base/icons', type: 'index' },
        { import: '../list/sizes', type: 'index' },
        { import: '../button', type: 'index' },
        { regex: /@mixin dx-toolbar-item-padding\(\$MATERIAL_TOOLBAR_ITEM_SPACING\),/, replacement: '@include dx-toolbar-item-padding($MATERIAL_TOOLBAR_ITEM_SPACING);' },
        { regex: /.dx-toolbar-item-padding\(\$MATERIAL_MOBILE_TOOLBAR_ITEM_SPACING\),/, replacement: '@include dx-toolbar-item-padding($MATERIAL_MOBILE_TOOLBAR_ITEM_SPACING);' },
        { regex: /(-bg|-color|: 0|MATERIAL_LIST_ITEM_HEIGHT|MATERIAL_LIST_ITEM_HORIZONTAL_PADDING|4px|2 0|50%),/g, replacement: '$1;' },
        { regex: /@mixin dx-icon-sizing\(\$MATERIAL_BUTTON_ICON_SIZE\),/, replacement: '@include dx-icon-sizing($MATERIAL_BUTTON_ICON_SIZE);' },
        { regex: /\.dx-button-onlyicon-sizing\(\),/g, replacement: '@include dx-button-onlyicon-sizing();' },
        { regex: /\.dx-icon-margin\(6px\),/, replacement: '@include dx-icon-margin(6px);' },
    ],
    'popup': [
        { import: '../../base/icons', type: 'index' },
        { import: '../overlay/colors', type: 'index' },
        { import: '../toolbar', type: 'index' },
        { import: '../toolbar/sizes', type: 'index' },
        { import: '../button', type: 'index' },
    ],
    'dropDownButton': [
        { import: '../../base/icons', type: 'index' },
        { import: '../button', type: 'index' },
        { import: '../button/sizes', type: 'index' },
        { import: '../common', type: 'index' },
    ],
    'popover': [
        { import: '../overlay/colors', type: 'colors' },
        { import: '../overlay/colors', type: 'index' },
        { import: '../textEditor/colors', type: 'index' },
    ],
    'progressBar': [
        { import: '../../base/mixins', type: 'index' },
    ],
    'tooltip': [
        { import: '../overlay/colors', type: 'colors' },
    ],
    'gallery': [
        { import: '../../base/icons', type: 'index' },
    ],
    'lookup': [
        { import: '../../base/icons', type: 'index' },
        { import: '../textEditor/sizes', type: 'index' },
        { import: '../textEditor/colors', type: 'index' },
        { import: '../dropDownEditor', type: 'index' },
        { import: '../common', type: 'index' },
        { regex: /@mixin dx-icon\(spinnext\),/, replacement: '@include dx-icon(spinnext);' },
        { regex: /\.dx-icon-font-centered-sizing\(\$GENERIC_BASE_ICON_SIZE\),/, replacement: '@include dx-icon-font-centered-sizing($GENERIC_BASE_ICON_SIZE);' },
        { regex: /(GENERIC_BASE_INLINE_BORDEREDWIDGET_INNER_SIZE|lookup-icon-color|none|_CONTENT_PADDING|0|CONTENT_TOP|placeholder-color),/g, replacement: '$1;' },
    ],
    'loadPanel': [
        { import: '../overlay/colors', type: 'colors' },
    ],
    'tagBox': [
        { import: '../../base/icons', type: 'index' },
        { import: '../textEditor', type: 'index' },
        { import: '../common', type: 'index' },
        { regex: /@mixin dx-icon\(clear\),/, replacement: '@include dx-icon(clear);' },
        { regex: /(px|block|absolute|%|-remove-color|-active-color|-bg|none|0 0),/g, replacement: '$1;' },
    ],
    'accordion': [
        { import: '../../base/icons', type: 'index' },
    ],
    'slideOut': [
        { import: '../../base/icons', type: 'index' },
    ],
    'colorView': [
        { import: '../overlay/colors', type: 'colors' },
        { import: '../../base/colorView', type: 'index' },
    ],
    'colorBox': [
        { import: '../colorView/colors', type: 'index' },
    ],
};
