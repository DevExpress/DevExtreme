import { Injectable } from '@angular/core';

export class FontSize {
  size: number;

  text: string;
}

export class LineHeight {
  lineHeight: number;

  text: string;
}

export class FontFamily {
  text: string;
}

export class Heading {
  text: string;
}

export class FontStyle {
  icon: string;

  hint: string;
}

export class TextAlign {
  icon: string;

  alignment: string;

  hint: string;
}

export class TextAlignExtended extends TextAlign {
  text: string;
}

export class ListType {
  icon: string;

  alignment: string;

  hint: string;
}

const fontSizes: FontSize[] = [
  { size: 10, text: '10px' },
  { size: 12, text: '12px' },
  { size: 14, text: '14px' },
  { size: 16, text: '16px' },
  { size: 18, text: '18px' },
];

const lineHeights: LineHeight[] = [
  { lineHeight: 1, text: '1' },
  { lineHeight: 1.35, text: '1.35' },
  { lineHeight: 1.5, text: '1.5' },
  { lineHeight: 2, text: '2' },
];

const fontFamilies: FontFamily[] = [
  { text: 'Arial' },
  { text: 'Courier New' },
  { text: 'Georgia' },
  { text: 'Impact' },
  { text: 'Lucida Console' },
  { text: 'Tahoma' },
  { text: 'Times New Roman' },
];

const headings: Heading[] = [
  { text: 'Normal text' },
  { text: 'Heading 1' },
  { text: 'Heading 2' },
  { text: 'Heading 3' },
  { text: 'Heading 4' },
  { text: 'Heading 5' },
];

const fontStyles: FontStyle[] = [
  {
    icon: 'bold',
    hint: 'Bold',
  },
  {
    icon: 'italic',
    hint: 'Italic',
  },
  {
    icon: 'underline',
    hint: 'Underlined',
  },
  {
    icon: 'strike',
    hint: 'Strikethrough',
  },
];

const textAlignsExtended: TextAlignExtended[] = [
  {
    icon: 'alignleft',
    alignment: 'left',
    hint: 'Align Left',
    text: 'Align left',
  },
  {
    icon: 'aligncenter',
    alignment: 'center',
    hint: 'Center',
    text: 'Center',
  },
  {
    icon: 'alignright',
    alignment: 'right',
    hint: 'Align Right',
    text: 'Align right',
  },
  {
    icon: 'alignjustify',
    alignment: 'justify',
    hint: 'Justify',
    text: 'Justify',
  },
];

const listTypes: ListType[] = [
  {
    icon: 'orderedlist',
    alignment: 'orderedlist',
    hint: 'Ordered',
  },
  {
    icon: 'bulletlist',
    alignment: 'bulletlist',
    hint: 'Bullet',
  },
];

@Injectable()
export class Service {
  getFontSizes(): FontSize[] {
    return fontSizes;
  }

  getLineHeights(): LineHeight[] {
    return lineHeights;
  }

  getFontFamilies(): FontFamily[] {
    return fontFamilies;
  }

  getHeadings(): Heading[] {
    return headings;
  }

  getFontStyles(): FontStyle[] {
    return fontStyles;
  }

  getTextAlign(): TextAlign[] {
    return textAlignsExtended.map(
      ({ icon, alignment, hint }) => ({ icon, alignment, hint }),
    );
  }

  getTextAlignExtended(): TextAlignExtended[] {
    return textAlignsExtended;
  }

  getListType(): ListType[] {
    return listTypes;
  }
}
