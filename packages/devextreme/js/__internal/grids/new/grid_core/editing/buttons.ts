/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-namespace */
import type * as Button from '@js/ui/button';

import type { PredefinedToolbarItem } from '../toolbar/types';

namespace addCard {
  export interface Props {
    onClick: () => void;
    hintText: string;
  }
}

export const addCard = ({ onClick, hintText }: addCard.Props): PredefinedToolbarItem => ({
  widget: 'dxButton',
  options: {
    // @ts-expect-error
    cssClass: 'dx-cardview-toolbar-addcard',
    icon: 'add',
    onClick,
    text: hintText,
    hint: hintText,
  } satisfies Button.Properties,
  showText: 'inMenu',
  name: 'addCardButton',
  location: 'after',
  locateInMenu: 'auto',
});
