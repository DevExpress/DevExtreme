/* global window */
/* global $ */

const themeKey = 'currentThemeId';

const themes = [
    { id: 'light', name: 'light' },
    { id: 'light.compact', name: 'light compact' },
    { id: 'material.lime.dark.compact', name: 'material lime dark compact' },
    { id: 'material.purple.light', name: 'material purple light' },
    dx.carmine.compact
    dx.carmine

];

$(function() {
    const value = window.localStorage.getItem(themeKey) || themes[0].id;

    const onValueChanged = (e) => {
        window.localStorage.setItem(themeKey, e.value);
        window.location.reload();
    };

    $('#theme-selector').dxSelectBox({
        width: 200,
        dataSource: themes,
        valueExpr: 'id',
        displayExpr: 'name',
        value,
        onValueChanged
    });
});
