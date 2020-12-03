/* eslint-disable import/no-commonjs */
// pathToWrapper should contains named export - WrapperWidget. WrapperWidget is predefined.
// Default export doesnt work
module.exports = [
    { name: 'Button', pathInRenovationFolder: 'ui/button.j' },
    { name: 'CheckBox', pathInRenovationFolder: 'ui/check_box.j' },
    { name: 'Widget', pathInRenovationFolder: 'ui/widget.j' },
    // { name: 'ScrollView', pathInRenovationFolder: 'ui//scroll_view/scroll_view.j' },
    // { name: 'DataGrid', pathInRenovationFolder: 'ui/data_grid/data_grid.j' },
    { name: 'Pager', pathInRenovationFolder: 'ui/pager/pager.j' },
];
