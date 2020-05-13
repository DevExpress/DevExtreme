'use strict';

module.exports = {
    // regex, replacement - replace
    // import, type - additional import (
    //    index - in _index.scss file
    //    colors - in _colors.scss file
    //    sizes - in _sizes.scss file)
    'widget': [
        { regex: /\.disabled-widget/, replacement: '@mixin disabled-widget' },
    ],
    'list': [
        { import: './button' },
    ],
    'popup': [
        { regex: /@mixin user-select\(none\),/, replacement: '@include user-select(none);' },
        { regex: /normal,/, replacement: 'normal;' },
    ],
    'slider': [
        { import: './popover' },
    ],
    'actionSheet': [
        { import: './button' },
    ],
    'tagBox': [
        { regex: /\.hide-input-cursor\(\)/, replacement: '@include hide-input-cursor()' },
    ],
    'dataGrid': [
        { import: './gridBase' },
        { regex: /@mixin grid-base\(datagrid\),/, replacement: '@include grid-base(datagrid);' },
        { regex: /(relative|normal|default|important),/g, replacement: '$1;' },
    ],
    'treeList': [
        { import: './gridBase' },
    ],
    'diagram': [
        { import: './overlay' },
    ],
    'dropDownEditor': [
        { import: './textEditor' },
    ],
    'htmlEditor': [
        { regex: /extract\(/g, replacement: 'nth(' },
        { regex: /when\s\((.*)\s(.*)\s(.*?)\)\s{([\w\W]*?)^}/gm, replacement: '{\n    @if $1 $2 $3 {$4}\n}' },
        { regex: /\$counter >= \$start/, replacement: '$counter > $start' },
        { regex: /counter-reset\+_: "list-#{\$counter}";/, replacement: '' },
        { regex: /@include add-counter-reset\(\$counter - 1, \$start\);[\w\W]*?}/, replacement: '@return add-counter-reset($counter - 1, $start)+ " " + list-#{$counter};\n}\n@return list-#{$counter};' },
        { regex: /@mixin add-counter-reset/, replacement: '@function add-counter-reset' },
        { regex: /@include add-counter-reset\((.*)\)/g, replacement: 'counter-reset: add-counter-reset($1)' },
        { regex: /@mixin add-indent-styles\(\$counter - 1\),/, replacement: '@include add-indent-styles($counter - 1);' },
        { regex: /(em|0|_WIDTH),$/gm, replacement: '$1;' },
        { regex: /mod\(\$counter, 3\)/, replacement: '($counter % 3)' },
        { regex: /"list-#{\$counter}"/g, replacement: 'list-#{$counter}' },
    ],
    'textEditor': [
        { import: 'sass:string', alias: 'string' },
    ]
};
