import messageLocalization from '@js/localization/message';

export interface Options {
  editing?: {
    texts?: {
      addCard?: string;
    };
  };
}

export const defaultOptions = {
  editing: {
    texts: {
      addCard: messageLocalization.format('dxCardView-editingAddCard'),
    },
  },
} satisfies Options;
