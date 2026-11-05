import '@js/ui/text_area';

import TextArea from '@ts/ui/text_area';

class ToolCallTextArea extends TextArea {
  _getAdjustedMaxHeight(maxHeight: number): number {
    return maxHeight;
  }

  _getMaxHeight(): number | undefined {
    const cssValue = this._input().css('maxHeight');

    if (!cssValue || cssValue === 'none') {
      return undefined;
    }

    return parseFloat(cssValue);
  }
}

export default ToolCallTextArea;
