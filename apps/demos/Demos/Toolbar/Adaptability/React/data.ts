export const fontSizes = [
  { size: 10, text: '10px' },
  { size: 12, text: '12px' },
  { size: 14, text: '14px' },
  { size: 16, text: '16px' },
  { size: 18, text: '18px' },
];

export const lineHeights = [
  { lineHeight: 1, text: '1' },
  { lineHeight: 1.35, text: '1.35' },
  { lineHeight: 1.5, text: '1.5' },
  { lineHeight: 2, text: '2' },
];

export const fontFamilies = [
  { text: 'Arial' },
  { text: 'Courier New' },
  { text: 'Georgia' },
  { text: 'Impact' },
  { text: 'Lucida Console' },
  { text: 'Tahoma' },
  { text: 'Times New Roman' },
];

export const headings = [
  { text: 'Normal text' },
  { text: 'Heading 1' },
  { text: 'Heading 2' },
  { text: 'Heading 3' },
  { text: 'Heading 4' },
  { text: 'Heading 5' },
];

export const fontStyles = [
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

export const textAlignItemsExtended = [
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

export const textAlignItems = textAlignItemsExtended.map((item) => {
  const { icon, alignment, hint } = item;

  return {
    icon,
    alignment,
    hint,
  };
});

export const listTypes = [
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

export const fontInputAttr = { 'aria-label': 'Font' };
export const textStyleInputAttr = { 'aria-label': 'Text Style' };
