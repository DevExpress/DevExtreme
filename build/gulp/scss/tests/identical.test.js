'use strict';

const fs = require('fs');
const path = require('path');
const cssom = require('cssom');

const SUCCESS = 0;
const ERROR = 1;

const blackList = [
    '.dx-show-clear-button .dx-icon-clear',
    // dx.common.css
    '.dx-radiobutton'
];

const artifactsPath = path.join(__dirname, '..', '..', '..', '..', 'artifacts');
const scssPath = path.join(artifactsPath, 'scss-css');

const normalizeSelector = selector => selector
    .replace(/"/g, '\'')
    .replace(/@charset 'UTF-8';/, '')
    .split(',')
    .map(i => i.trim())
    .sort()
    .join(',');

const normalizeRule = rule => rule
    .replace(/"/g, '\'')
    .replace(/\.3333333333px/, '.33333333px')
    .replace(/gray/, 'grey')

    // colors rounding (mix, darken)
    .replace(/#dd5841/, '#dc5840')
    .replace(/#101010/, '#111')
    .replace(/#1d9e92/, '#1c9e92')
    .replace(/#8c49ff/, '#8c4aff')
    .replace(/#6c7986/, '#6c7987')
    .replace(/#529893/, '#529793')
    .replace(/#d43300/, '#d53300')
    .replace(/#3794e1/, '#3895e1')
    .replace(/#bddbf5/, '#bddcf5')
    .replace(/rgba\(140,73,255,\.(1|4)\)/, 'rgba(140,74,255,.$1)')
    .replace(/rgba\(107,22,255,.8\)/, 'rgba(107,23,255,.8)')
    .replace(/rgba\(55,148,225,.8\)/, 'rgba(56,149,225,.8)')

    // replace color in inlined svg
    .replace(/(%3A|%22)%23000000/g, '$1black')

    // dx.common.css
    .replace(/transparent/, 'rgba(0, 0, 0, 0)')
    .replace(/14\.14227125px/, '14.1422712488px')
    .replace(/9\.89958987px/, '9.8995898741px')

    .replace(/'(.)'/, (_, letter) => {
        // utf char to escaped notation
        const codePoint = letter.codePointAt(0);
        return codePoint > 127 ? `'\\${codePoint.toString(16).toLowerCase()}'` : `'${letter}'`;
    });

const readSelector = item => {
    if(!item.selectorText) return;
    const selector = normalizeSelector(item.selectorText);
    const styles = [];

    for(let i = 0; i < item.style.length; i++) {
        styles[i] = item.style[i] + ':' + normalizeRule(item.style[item.style[i]]);
    }

    return { selector, styles };
};

const readSelectors = cssom => {
    const cssObject = {};
    cssom.map(readSelector).forEach(selectorItem => {
        if(selectorItem) {
            cssObject[selectorItem.selector] = cssObject[selectorItem.selector] || [];
            // css can contain the number of same selectors
            Array.prototype.push.apply(cssObject[selectorItem.selector], selectorItem.styles);
        }
    });

    return cssObject;
};

const compareSelectors = (etalonSelectors, targetSelectors) => {
    const sameSelectors = etalonSelectors.filter(item => targetSelectors.indexOf(item) >= 0);
    const etalonDiff = etalonSelectors.filter(item => sameSelectors.indexOf(item) < 0);
    const targetDiff = targetSelectors.filter(item => sameSelectors.indexOf(item) < 0);

    return [etalonDiff, targetDiff];
};

const compareProperties = (etalonProperties, targetProperties) => {
    const compareInfo = [];
    etalonProperties.forEach((property, index) => {
        const targetProperty = targetProperties[index];
        if(property !== targetProperty) {
            compareInfo[index] = `    -${property} +${targetProperty}`;
        }
    });

    return compareInfo;
};

const deepCompare = (etalonCssObject, targetCssObject) => {
    const errors = [];

    Object.keys(etalonCssObject).forEach(etalonKey => {
        const etalonProperties = etalonCssObject[etalonKey];
        const targetProperties = targetCssObject[etalonKey];

        const compareInfo = compareProperties(etalonProperties, targetProperties);

        if(compareInfo.length && blackList.indexOf(etalonKey) < 0) {
            errors.push({ selector: etalonKey, properties: compareInfo });
        }
    });

    return errors;
};

const printArrayItems = (array) => {
    array.forEach(item => console.error(item + '\n'));
};

const printSelectorsErrors = (etalonDiff, targetDiff, themeFile) => {
    console.error(`${themeFile} bundle selectors diff:\n\nEtalon diff:\n`);
    printArrayItems(etalonDiff);
    console.error('\nTarget diff:\n');
    printArrayItems(targetDiff);
};

const printRuleErrors = (ruleErrors, themeFile) => {
    console.error(`${themeFile} bundle rule errors:\n\n`);
    ruleErrors.forEach(error => {
        console.error(`Selector:\n${error.selector}\nRules:`);
        printArrayItems(error.properties);
    });
};

const compareCssContent = (etalon, target, themeFile) => {
    const etalonCssom = cssom.parse(etalon);
    const targetCssom = cssom.parse(target);

    const etalonCssObject = readSelectors(etalonCssom.cssRules);
    const targetCssObject = readSelectors(targetCssom.cssRules);

    const etalonSelectors = Object.keys(etalonCssObject);
    const targetSelectors = Object.keys(targetCssObject);

    const diffs = compareSelectors(etalonSelectors, targetSelectors);

    if(diffs[0].length || diffs[1].length) {
        printSelectorsErrors(diffs[0], diffs[1], themeFile);
        return ERROR;
    }

    const ruleErrors = deepCompare(etalonCssObject, targetCssObject);

    if(ruleErrors.length) {
        printRuleErrors(ruleErrors, themeFile);
        return ERROR;
    }

    return SUCCESS;
};

let exitCode = SUCCESS;

const files = fs.readdirSync(scssPath);

files.forEach(file => {
    const lessFile = path.join(artifactsPath, 'css', file);
    const scssFile = path.join(artifactsPath, 'scss-css', file);

    const lessFileContent = fs.readFileSync(lessFile).toString();
    const scssFileContent = fs.readFileSync(scssFile).toString();

    if(compareCssContent(lessFileContent, scssFileContent, file) === ERROR) {
        exitCode = ERROR;
    }
});

process.exit(exitCode); // eslint-disable-line no-process-exit
