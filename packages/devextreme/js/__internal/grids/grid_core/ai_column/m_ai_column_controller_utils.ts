import { AI_COLUMN_NAME, CLASSES } from './const';

export const getAiCommandColumnOptions = () => ({
  type: AI_COLUMN_NAME,
  command: AI_COLUMN_NAME,
  cssClass: CLASSES.aiColumn,
  width: 'auto',
});
