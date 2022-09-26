const fontSizes = [
  { size: 10, text: '10px' },
  { size: 12, text: '12px' },
  { size: 14, text: '14px' },
  { size: 16, text: '16px' },
  { size: 18, text: '18px' },
];

const lineHeights = [
  { lineHeight: 1, text: '1' },
  { lineHeight: 1.35, text: '1.35' },
  { lineHeight: 1.5, text: '1.5' },
  { lineHeight: 2, text: '2' },
];

const fontFamilies = [
  { text: 'Arial' },
  { text: 'Courier New' },
  { text: 'Georgia' },
  { text: 'Impact' },
  { text: 'Lucida Console' },
  { text: 'Tahoma' },
  { text: 'Times New Roman' },
];

const fontStyles = [
  {
    icon: 'bold',
    style: 'bold',
    hint: 'Bold',
  },
  {
    icon: 'italic',
    style: 'italic',
    hint: 'Italic',
  },
  {
    icon: 'underline',
    style: 'underline',
    hint: 'Underlined',
  },
  {
    icon: 'strike',
    style: 'strike',
    hint: 'Strikethrough',
  },
];

const textAlignItemsExtended = [
  {
    icon: 'alignleft',
    alignment: 'left',
    hint: 'Align left',
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
    hint: 'Align right',
    text: 'Align right',
  },
  {
    icon: 'alignjustify',
    alignment: 'justify',
    hint: 'Justify',
    text: 'Justify',
  },
];

const textAlignItems = textAlignItemsExtended.map((item) => {
  const { icon, alignment, hint } = item;

  return {
    icon,
    alignment,
    hint,
  };
});

const listTypes = [
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
