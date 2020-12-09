/* eslint-disable import/no-commonjs */
// pathToWrapper should contains named export - WrapperWidget. WrapperWidget is predefined.
// Default export doesnt work
module.exports = [
    { name: 'Button', pathInRenovationFolder: 'ui/button.j', pathInJSFolder: 'ui/button.js' },
    { name: 'CheckBox', pathInRenovationFolder: 'ui/check_box.j', pathInJSFolder: 'ui/check_box.js' },
    // { name: 'Widget', pathInRenovationFolder: 'ui/widget.j' },
    // { name: 'ScrollView', pathInRenovationFolder: 'ui/scroll_view.j', pathInJSFolder: 'ui/scroll_view.js' },
    // { name: 'DataGrid', pathInRenovationFolder: 'ui/data_grid/data_grid.j', pathInJSFolder: 'ui/button.js' },
    { name: 'Pager', pathInRenovationFolder: 'ui/pager/pager.j', pathInJSFolder: 'ui/pager.js', pathToWrapper: '../../../testing/helpers/renovationPagerHelper.js' },
];
