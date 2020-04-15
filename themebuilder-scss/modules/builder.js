
// const themes = require('./themes.js');
const normalize = require('./config-normalizer');

const buildTheme = config => {
    normalize(config);

};

module.exports = {
    buildTheme: buildTheme
};
