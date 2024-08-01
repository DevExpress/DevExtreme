'use strict';

const sizes = ['default'/* , 'compact' */];
const materialColors = ['blue',/*  'lime', 'orange', 'purple', 'teal' */];
const materialModes = ['light'/* , 'dark' */];
// const fluentColors = ['blue', 'saas'];
// const fluentModes = ['light', 'dark'];
// const genericColors = ['carmine', 'contrast', 'dark', 'darkmoon', 'darkviolet', 'greenmist', 'light', 'softblue'];

const getThemes = () => sizes.flatMap((size) => [
    ...materialModes.flatMap((mode) => materialColors.map((color) => ['material', size, color, mode])),
    // ...fluentModes.flatMap((mode) => fluentColors.map((color) => ['fluent', size, color, mode])),
    // ...genericColors.map((color) => ['generic', size, color])
]);

module.exports = {
    getThemes
};
