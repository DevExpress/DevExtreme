import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getImageContainer } from '@js/core/utils/icon';

import { AI_CHAT_SPARKLE_OUTLINE, CLASSES } from './const';

export const createChatSparkleOutlineIcon = (): dxElementWrapper => getImageContainer(
  AI_CHAT_SPARKLE_OUTLINE,
) as dxElementWrapper;

export const createAIHeaderContainer = (): dxElementWrapper => $('<div>').addClass(CLASSES.aiColumnHeaderContent);
