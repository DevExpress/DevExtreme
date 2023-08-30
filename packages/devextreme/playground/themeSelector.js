/* global window */
/* global document */

const themeKey = 'currentThemeId';

const themeList = [
    'light',
    'light.compact',

    'carmine.compact',
    'carmine',

    'contrast.compact',
    'contrast',

    'dark.compact',
    'dark',

    'darkmoon.compact',
    'darkmoon',

    'darkviolet.compact',
    'darkviolet',

    'fluent.blue.dark.compact',
    'fluent.blue.dark',
    'fluent.blue.light.compact',
    'fluent.blue.light',

    'greenmist.compact',
    'greenmist',

    'softblue.compact',
    'softblue',

    'material.blue.dark.compact',
    'material.blue.dark',
    'material.blue.light.compact',
    'material.blue.light',

    'material.lime.dark.compact',
    'material.lime.dark',
    'material.lime.light.compact',
    'material.lime.light',

    'material.orange.dark.compact',
    'material.orange.dark',
    'material.orange.light.compact',
    'material.orange.light',

    'material.purple.dark.compact',
    'material.purple.dark',
    'material.purple.light.compact',
    'material.purple.light',

    'material.teal.dark.compact',
    'material.teal.dark',
    'material.teal.light.compact',
    'material.teal.light'
];

const initThemes = (dropDownList) => {
    themeList.forEach(theme => {
        const item = document.createElement('option');
        item.value = theme;
        item.text = theme;

        dropDownList.add(item);
    });
};

window.addEventListener('load', () => {
    const dropDownList = document.querySelector('#theme-selector');

    dropDownList.addEventListener('change', () => {
        window.localStorage.setItem(themeKey, dropDownList.value);
        window.location.reload();
    });

    initThemes(dropDownList);
    dropDownList.value = window.localStorage.getItem(themeKey) || themeList[0];
});
