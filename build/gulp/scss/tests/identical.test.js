const fs = require('fs');
const path = require('path');
const cssom = require('cssom');

// TODO right exit codes
const SUCCESS = 0;
const ERROR = 1;

const themes = [
    'light',
    'material.blue.light'
];

const blackList = [
    '.dx-show-clear-button .dx-icon-clear'
];

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
    array.forEach(item => console.log(item + '\n'));
};

const printSelectorsErrors = (etalonDiff, targetDiff, theme) => {
    console.log(`${theme} theme selectors diff:\n\nEtalon diff:\n`);
    printArrayItems(etalonDiff);
    console.log('\nTarget diff:\n');
    printArrayItems(targetDiff);
};

const printRuleErrors = (ruleErrors, theme) => {
    console.log(`${theme} theme rule errors:\n\n`);
    ruleErrors.forEach(error => {
        console.log(`Selector:\n${error.selector}\nRules:`);
        printArrayItems(error.properties);
    });
};

const compareCssContent = (etalon, target, theme) => {
    const etalonCssom = cssom.parse(etalon);
    const targetCssom = cssom.parse(target);

    const etalonCssObject = readSelectors(etalonCssom.cssRules);
    const targetCssObject = readSelectors(targetCssom.cssRules);

    const etalonSelectors = Object.keys(etalonCssObject);
    const targetSelectors = Object.keys(targetCssObject);

    const diffs = compareSelectors(etalonSelectors, targetSelectors);

    if(diffs[0].length || diffs[1].length) {
        printSelectorsErrors(diffs[0], diffs[1], theme);
        return ERROR;
    }

    const ruleErrors = deepCompare(etalonCssObject, targetCssObject);

    if(ruleErrors.length) {
        printRuleErrors(ruleErrors, theme);
        return ERROR;
    }

    return SUCCESS;
};

let exitCode = SUCCESS;

themes.forEach(theme => {
    const compiledThemeFile = `dx.${theme}.css`;
    const artifactsPath = path.join(__dirname, '..', '..', '..', '..', 'artifacts');

    const lessFile = path.join(artifactsPath, 'css', compiledThemeFile);
    const scssFile = path.join(artifactsPath, 'scss-css', compiledThemeFile);

    const lessFileContent = fs.readFileSync(lessFile).toString();
    const scssFileContent = fs.readFileSync(scssFile).toString();

    if(compareCssContent(lessFileContent, scssFileContent, theme) === ERROR) {
        exitCode = ERROR;
    }
});

process.exit(exitCode);
