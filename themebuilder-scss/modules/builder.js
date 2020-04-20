
// const themes = require('./themes.js');
const normalize = require('./config-normalizer');
// const Compiler = require('./compiler');
// const compiler = new Compiler();

class Builder {
    constructor() {}

    buildTheme(config) {
        normalize(config);
    }
}

module.exports = Builder;
