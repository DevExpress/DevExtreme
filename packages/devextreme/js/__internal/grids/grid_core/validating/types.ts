import type { dxElementWrapper } from '@js/core/renderer';
import type { PositioningEvent } from '@ts/ui/overlay/overlay';

export interface ValidatingEditorFactoryExtension {
  getOverlayBaseZIndex: () => number;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  overlayPositionedHandler(e: PositioningEvent, isOverlayVisible: boolean): void;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  getValidationMessageContainer($cell: dxElementWrapper): dxElementWrapper;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  getRevertButtonContainer($cell: dxElementWrapper): dxElementWrapper;
}
