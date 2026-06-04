import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import Action from '@js/core/action';
import config from '@js/core/config';
import devices from '@js/core/devices';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { ensureDefined } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import { value as getViewport } from '@js/core/utils/view_port';
import { getWindow } from '@js/core/utils/window';
import type { EventInfo } from '@js/events';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import type {
  alert as alertFunc,
  confirm as confirmFunc,
  CustomDialogOptions,
} from '@js/ui/dialog';
import type { ToolbarItem } from '@js/ui/popup';
import { current, isFluent } from '@js/ui/themes';
import errors from '@js/ui/widget/ui.errors';
import domUtils from '@ts/core/utils/m_dom';
import type { PopupProperties } from '@ts/ui/popup/m_popup';
import Popup from '@ts/ui/popup/m_popup';

export interface BaseDialog {
  show: () => Promise<unknown>;
  hide: (value: boolean) => void;
}

export interface DialogParams extends CustomDialogOptions, PopupProperties {
  popupOptions?: PopupProperties;
}

const window = getWindow();

const DX_DIALOG_CLASSNAME = 'dx-dialog';
const DX_DIALOG_WRAPPER_CLASSNAME = 'dx-dialog-wrapper';
const DX_DIALOG_ROOT_CLASSNAME = 'dx-dialog-root';
const DX_DIALOG_CONTENT_CLASSNAME = 'dx-dialog-content';
const DX_DIALOG_MESSAGE_CLASSNAME = 'dx-dialog-message';
const DX_DIALOG_BUTTONS_CLASSNAME = 'dx-dialog-buttons';
const DX_DIALOG_BUTTON_CLASSNAME = 'dx-dialog-button';

const DX_BUTTON_CLASSNAME = 'dx-button';

const DEFAULT_HORIZONTAL_OFFSET = 10;
const DEFAULT_VERTICAL_OFFSET = 0;

const DEFAULT_BOUNDARY_OFFSET = {
  h: DEFAULT_HORIZONTAL_OFFSET,
  v: DEFAULT_VERTICAL_OFFSET,
};

const DEFAULT_BUTTON_OPTIONS: ButtonProperties = {
  text: messageLocalization.format('OK'),
  onClick: (): boolean => true,
};

const getApplyButtonConfig = (): ButtonProperties => {
  if (isFluent(current())) {
    return {
      stylingMode: 'contained',
      type: 'default',
    };
  }

  return {};
};

const getCancelButtonConfig = (): ButtonProperties => {
  if (isFluent(current())) {
    return {
      stylingMode: 'outlined',
      type: 'normal',
    };
  }

  return {};
};

export const custom = (params: DialogParams): BaseDialog => {
  const {
    buttons,
    dragEnabled,
    message,
    messageHtml,
    popupOptions,
    showCloseButton,
    showTitle,
    title = '',
    width,
    position,
  } = params ?? {};

  const isMessageDefined = isDefined(message);

  if (isMessageDefined) {
    errors.log('W1013');
  }

  const isMessageHtmlDefined = isDefined(messageHtml);

  const messageMarkup = String(isMessageHtmlDefined ? messageHtml : message);
  const messageId = title ? null : new Guid().toString();

  const deferred = Deferred();

  const $element = $('<div>')
    .addClass(DX_DIALOG_CLASSNAME)
    .appendTo(getViewport());

  const $message = $('<div>')
    .addClass(DX_DIALOG_MESSAGE_CLASSNAME)
    .html(messageMarkup)
    .attr('id', messageId);

  const onContentReady: PopupProperties['onContentReady'] = (e) => {
    const component = e.component as Popup;

    component.$content()
      ?.addClass(DX_DIALOG_CONTENT_CLASSNAME)
      .append($message);

    if (messageId) {
      component.$overlayContent().attr('aria-labelledby', messageId);
    }
  };

  const onShowing: PopupProperties['onShowing'] = (e) => {
    const component = e.component as Popup;
    const bottomToolbar = component.bottomToolbar();

    bottomToolbar
      ?.addClass(DX_DIALOG_BUTTONS_CLASSNAME)
      .find(`.${DX_BUTTON_CLASSNAME}`)
      .addClass(DX_DIALOG_BUTTON_CLASSNAME);

    domUtils.resetActiveElement();
  };

  const onShown: PopupProperties['onShown'] = (e) => {
    const component = e.component as Popup;
    const bottomToolbar = component.bottomToolbar();

    const $firstButton = bottomToolbar
      ?.find(`.${DX_BUTTON_CLASSNAME}`)
      .first();

    // @ts-expect-error trigger should be typed on type 'EventsEngineType'
    eventsEngine.trigger($firstButton, 'focus');
  };

  const animation = {
    show: {
      type: 'pop',
      duration: 400,
    },
    hide: {
      type: 'pop',
      duration: 400,
      to: {
        opacity: 0,
        scale: 0,
      },
      from: {
        opacity: 1,
        scale: 1,
      },
    },
  };

  let popupInstance: Popup | null = null;

  const show = (): Promise<unknown> => {
    if (devices.real().deviceType === 'phone') {
      const isPortrait = getHeight(window) > getWidth(window);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const width = isPortrait ? '90%' : '60%';

      popupInstance?.option({ width });
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    popupInstance?.show();

    return deferred.promise();
  };

  const hide = (value: boolean): void => {
    deferred.resolve(value);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    popupInstance?.hide();
  };

  const buttonOptions = buttons ?? [DEFAULT_BUTTON_OPTIONS];

  const toolbarItems = buttonOptions.map((configuration) => {
    const { onClick } = configuration;

    const action = new Action(onClick, {
      context: popupInstance,
    });

    const buttonItem: ToolbarItem = {
      toolbar: 'bottom',
      location: devices.current().android ? 'after' : 'center',
      widget: 'dxButton',
      options: {
        ...configuration,
        onClick: (e: ClickEvent): void => {
          const result = action.execute(e);

          hide(result);
        },
      },
    };

    return buttonItem;
  });

  const popupPosition = position ?? {
    boundaryOffset: { ...DEFAULT_BOUNDARY_OFFSET },
  };

  const configuration: PopupProperties = {
    // @ts-expect-error animation should be typed correctly in popup.d.ts
    animation,
    // @ts-expect-error container should be typed correctly in popup.d.ts
    container: $element,
    // @ts-expect-error dragAndResizeArea should be typed correctly in popup.d.ts
    dragAndResizeArea: window,
    dragEnabled: ensureDefined(dragEnabled, true),
    height: 'auto',
    ignoreChildEvents: false,
    onContentReady,
    onHiding: (): void => { deferred.reject(); },
    onShowing,
    onShown,
    // @ts-expect-error position should be typed correctly in popup.d.ts
    position: popupPosition,
    rtlEnabled: config().rtlEnabled,
    showCloseButton: showCloseButton ?? false,
    showTitle: ensureDefined(showTitle, true),
    title,
    toolbarItems,
    visualContainer: window,
    width,
  };

  const options = {
    ...configuration,
    ...popupOptions,
    onHidden: (e: EventInfo<Popup>): void => {
      $(e.element).remove();
      popupOptions?.onHidden?.(e);
    },
  };

  // @ts-expect-error Incorrect constructor usage
  popupInstance = new Popup($element, options);

  popupInstance.$wrapper()
    ?.addClass(DX_DIALOG_WRAPPER_CLASSNAME)
    .addClass(DX_DIALOG_ROOT_CLASSNAME);

  const dialog: BaseDialog = {
    show,
    hide,
  };

  return dialog;
};

const isCustomDialogOptions = (
  options: unknown,
): options is CustomDialogOptions => isPlainObject(options);

// @ts-expect-error params and return types should be fixed in dialog.d.ts
export const alert: typeof alertFunc = (
  messageHtml: CustomDialogOptions['messageHtml'],
  title: CustomDialogOptions['title'],
  showTitle: CustomDialogOptions['showTitle'],
) => {
  const titleValue = title ?? '';

  const options = isCustomDialogOptions(messageHtml)
    ? messageHtml
    : {
      title: titleValue,
      messageHtml,
      showTitle,
      buttons: [
        {
          ...DEFAULT_BUTTON_OPTIONS,
          ...getApplyButtonConfig(),
        },
      ],
      dragEnabled: showTitle,
    };

  return custom(options).show();
};

// @ts-expect-error params and return types should be fixed in dialog.d.ts
export const confirm: typeof confirmFunc = (
  messageHtml: CustomDialogOptions['messageHtml'],
  title: CustomDialogOptions['title'],
  showTitle: CustomDialogOptions['showTitle'],
) => {
  const titleValue = title ?? '';

  const options = isCustomDialogOptions(messageHtml)
    ? messageHtml
    : {
      title: titleValue,
      messageHtml,
      showTitle,
      buttons: [
        {
          text: messageLocalization.format('Yes'),
          onClick: (): boolean => true,
          ...getApplyButtonConfig(),
        },
        {
          text: messageLocalization.format('No'),
          onClick: (): boolean => false,
          ...getCancelButtonConfig(),
        },
      ],
      dragEnabled: showTitle,
    };

  return custom(options).show();
};
