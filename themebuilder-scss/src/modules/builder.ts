
// const themes = require('./themes.js');
import normalize from './config-normalizer';
// const Compiler = require('./compiler');
// const compiler = new Compiler();

export class Builder {
    constructor() {}

    buildTheme(config: ConfigSettings): void {
        normalize(config);
        // TODO return promise with
        // compiledmetadata - compiler (+)
        // css - compiler (+),
        // swatchSelector - compiler (+),
        // version - metadata (+),
        // widgets - HZ
        // unusedWidgets - HZ
    }
}
