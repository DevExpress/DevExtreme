
import normalize from './config-normalizer';

export class Builder {
    constructor() {}

    buildTheme(config: ConfigSettings): void {
        normalize(config);
        // TODO return promise with
        // compiledmetadata - compiler (+)
        // css - compiler (+),
        // swatchSelector - compiler (+),
        // version - metadata (+),
        // widgets - ?
        // unusedWidgets - ?
    }
}
