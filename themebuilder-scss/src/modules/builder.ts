
import normalize from './config-normalizer';

export default class Builder {
  static buildTheme(config: ConfigSettings): void {
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
