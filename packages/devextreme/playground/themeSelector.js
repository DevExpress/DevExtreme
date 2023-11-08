/* global window */
/* global document */

const themeKey = 'currentThemeId';

const themeList = [
    {
        group: 'Fluent',
        list: [
            { theme: 'fluent.blue.light' },
            { theme: 'fluent.blue.light.compact' },
            { theme: 'fluent.blue.dark' },
            { theme: 'fluent.blue.dark.compact' },
        ]
    },

    {
        group: 'Material',
        list: [
            { theme: 'material.purple.dark.compact' },
            { theme: 'material.purple.dark' },
            { theme: 'material.purple.light.compact' },
            { theme: 'material.purple.light' },

            { theme: 'material.teal.dark.compact' },
            { theme: 'material.teal.dark' },
            { theme: 'material.teal.light.compact' },
            { theme: 'material.teal.light' },

            { theme: 'material.orange.dark.compact' },
            { theme: 'material.orange.dark' },
            { theme: 'material.orange.light.compact' },
            { theme: 'material.orange.light' },

            { theme: 'material.lime.dark.compact' },
            { theme: 'material.lime.dark' },
            { theme: 'material.lime.light.compact' },
            { theme: 'material.lime.light' },

            { theme: 'material.blue.dark.compact' },
            { theme: 'material.blue.dark' },
            { theme: 'material.blue.light.compact' },
            { theme: 'material.blue.light' },
        ]
    },

    {
        group: 'Generic',
        list: [
            { theme: 'light' },
            { theme: 'light.compact' },
            { theme: 'carmine.compact' },
            { theme: 'carmine' },
            { theme: 'contrast.compact' },
            { theme: 'contrast' },
            { theme: 'dark.compact' },
            { theme: 'dark' },
            { theme: 'darkmoon.compact' },
            { theme: 'darkmoon' },
            { theme: 'darkviolet.compact' },
            { theme: 'darkviolet' },
            { theme: 'softblue.compact' },
            { theme: 'softblue' },
            { theme: 'greenmist.compact' },
            { theme: 'greenmist' },
        ]
    },
];

const initThemes = (dropDownList) => {
    themeList.forEach(({ group, list }) => {
        const parent = document.createElement('optgroup');
        parent.setAttribute('label', group);
        dropDownList.add(parent);

        list.forEach(({ theme }) => {
            const child = document.createElement('option');

            child.value = theme;
            child.text = theme.replaceAll('.', ' ');

            parent.appendChild(child);
        });
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
