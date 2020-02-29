import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import eventsEngine from '../../events/core/events_engine';
import * as eventUtils from '../../events/utils';
import pointerEvents from '../../events/pointer';

const POINTERUP_EVENT_NAME = eventUtils.addNamespace(pointerEvents.up, 'dxDiagramPanel');
const PREVENT_REFOCUS_SELECTOR = '.dx-textbox';

class DiagramPanel extends Widget {
    _init() {
        super._init();
        this._createOnPointerUpAction();
    }
    _render() {
        super._render();
        this._attachPointerUpEvent();
    }
    _getPointerUpElement() {
        return this.$element();
    }
    _attachPointerUpEvent() {
        eventsEngine.off(this._getPointerUpElement(), POINTERUP_EVENT_NAME);
        eventsEngine.on(this._getPointerUpElement(), POINTERUP_EVENT_NAME, (e) => {
            if(!$(e.target).closest(PREVENT_REFOCUS_SELECTOR).length) {
                this._onPointerUpAction();
            }
        });
    }
    _createOnPointerUpAction() {
        this._onPointerUpAction = this._createActionByOption('onPointerUp');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onPointerUp':
                this._createOnPointerUpAction();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

module.exports = DiagramPanel;
