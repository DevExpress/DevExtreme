const fs = require('fs');
const path = require('path');
const cssom = require('cssom');

const themes = [
    'light'
];

const readSelector = item => item.selectorText && item.selectorText
    .replace(/"/g, '\'')
    .split(',')
    .map(i => i.trim())
    .sort()
    .join(',');

const readSelectors = cssom => cssom.map(readSelector);

const compareCssContent = (etalon, target) => {
    const etalonCssom = cssom.parse(etalon);
    const targetCssom = cssom.parse(target);

    const etalonSelectors = readSelectors(etalonCssom.cssRules);
    const targetSelectors = readSelectors(targetCssom.cssRules);

    const sameSelectors = etalonSelectors.filter(item => targetSelectors.indexOf(item) >= 0);
    const etalonDiff = etalonSelectors.filter(item => sameSelectors.indexOf(item) < 0);
    const targetDiff = targetSelectors.filter(item => sameSelectors.indexOf(item) < 0);

    fs.writeFileSync('etdif.txt', etalonDiff.join('\n'));
    fs.writeFileSync('tardif.txt', targetDiff.join('\n'));

    // etalonCssom.cssRules[0].style - array-object (object byt has lenght and [0], [1], [2] ...)
};

themes.forEach(theme => {
    const compiledThemeFile = `dx.${theme}.css`;
    const artifactsPath = path.join(__dirname, '..', '..', '..', '..', 'artifacts');

    const lessFile = path.join(artifactsPath, 'css', compiledThemeFile);
    const scssFile = path.join(artifactsPath, 'scss-css', compiledThemeFile);

    const lessFileContent = fs.readFileSync(lessFile).toString();
    const scssFileContent = fs.readFileSync(scssFile).toString();

    compareCssContent(lessFileContent, scssFileContent);
});
