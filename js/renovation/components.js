/* eslint-disable import/no-commonjs */
// pathToWrapper should contains named export - WrapperWidget. WrapperWidget is predefined.
// Default export doesnt work
module.exports = [
    { name: 'Button', pathInRenovationFolder: 'ui/button.j', pathInJSFolder: 'ui/button.js' },
    { name: 'CheckBox', pathInRenovationFolder: 'ui/editors/check_box/check_box.j', pathInJSFolder: 'ui/check_box.js' },
    // { name: 'Widget', pathInRenovationFolder: 'ui/widget.j' },
    { name: 'ScrollView', pathInRenovationFolder: 'ui/scroll_view/scroll_view.j', pathInJSFolder: 'ui/scroll_view.js', pathToWrapper: '/testing/helpers/renovationScrollViewHelper.js' },
    { name: 'Scrollable', pathInRenovationFolder: 'ui/scroll_view/scrollable.j', pathInJSFolder: 'ui/scroll_view/ui.scrollable.js', pathToWrapper: '/testing/helpers/renovationScrollableHelper.js' },
    // { name: 'DataGrid', pathInRenovationFolder: 'ui/grids/data_grid/data_grid.j', pathInJSFolder: 'ui/data_grid.js' },
    { name: 'DataGridNext', pathInRenovationFolder: 'ui/grids/data_grid_next/data_grid_next.j' },
    { name: 'DataGridNextPaging', pathInRenovationFolder: 'ui/grids/data_grid_next/paging/paging.j' },
    { name: 'DataGridNextPager', pathInRenovationFolder: 'ui/grids/data_grid_next/pager/pager.j' },
    { name: 'DataGridNextSelection', pathInRenovationFolder: 'ui/grids/data_grid_next/selection/selection.j' },
    { name: 'DataGridNextMasterDetail', pathInRenovationFolder: 'ui/grids/data_grid_next/master_detail/master_detail.j' },
    { name: 'Scheduler', pathInRenovationFolder: 'ui/scheduler/scheduler.j', pathInJSFolder: 'ui/scheduler.js', inProgress: true },
    { name: 'Pager', pathInRenovationFolder: 'ui/pager/pager.j', pathInJSFolder: 'ui/pager.js', pathToWrapper: '/testing/helpers/renovationPagerHelper.js' },
    // { name: 'Bullet', pathInRenovationFolder: 'viz/sparklines/bullet.j', pathInJSFolder: 'viz/sparklines/bullet.js' },
];
