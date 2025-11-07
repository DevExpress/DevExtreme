import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type { PopupProperties } from '@ts/ui/popup/m_popup';

const POINTERUP_EVENT_NAME = addNamespace(pointerEvents.up, 'dxDiagramPanel');
const PREVENT_REFOCUS_SELECTOR = '.dx-textbox';

interface Properties extends PopupProperties {
  onPointerUp?: (e: { component: DiagramPanel }) => void;
}

class DiagramPanel extends Widget<Properties> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onPointerUpAction!: any;

  _init(): void {
    super._init();
    this._createOnPointerUpAction();
  }

  _render(): void {
    super._render();
    this._attachPointerUpEvent();
  }

  _getPointerUpElements(): (dxElementWrapper | HTMLElement | undefined)[] {
    return [this.$element()];
  }

  _attachPointerUpEvent(): void {
    const elements = this._getPointerUpElements();
    elements.forEach((element) => {
      eventsEngine.off(element, POINTERUP_EVENT_NAME);
      eventsEngine.on(element, POINTERUP_EVENT_NAME, (e): void => {
        if (!$(e.target).closest(PREVENT_REFOCUS_SELECTOR).length) {
          this._onPointerUpAction();
        }
      });
    });
  }

  _createOnPointerUpAction(): void {
    this._onPointerUpAction = this._createActionByOption('onPointerUp');
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'onPointerUp':
        this._createOnPointerUpAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default DiagramPanel;
