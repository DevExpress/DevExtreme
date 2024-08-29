'use strict';

const sizes = ['default'];
const materialColors = ['blue',];
const materialModes = ['light'];
const fluentColors = ['blue'];
const fluentModes = ['light'];
const genericColors = ['light'];

const getThemes = () => sizes.flatMap((size) => [
    ...materialModes.flatMap((mode) => materialColors.map((color) => ['material', size, color, mode])),
    ...fluentModes.flatMap((mode) => fluentColors.map((color) => ['fluent', size, color, mode])),
    ...genericColors.map((color) => ['generic', size, color])
]);

module.exports = {
    getThemes
};
