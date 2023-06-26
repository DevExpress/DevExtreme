import $ from '../../../core/renderer';
import devices from '../../../core/devices';
import registerComponent from '../../../core/component_registrator';

import Widget from '../../widget/ui.widget';
import Popover from '../../popover/ui.popover';
import Popup from '../../popup/ui.popup';
import Calendar from '../../calendar';
import Scrollable from '../../scroll_view/ui.scrollable';

const CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
const CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';

export default class SchedulerCalendar extends Widget {
    show(target) {
        if(!this._isMobileLayout()) {
            this._overlay.option('target', target);
        }
        this._overlay.show();
    }

    hide() {
        this._overlay.hide();
    }

    _keyboardHandler(opts) {
        this._calendar?._keyboardHandler(opts);
    }

    _init() {
        super._init();
        this.$element();
    }

    _render() {
        super._render();
        this._renderOverlay();
    }

    _renderOverlay() {
        this.$element().addClass(CALENDAR_POPOVER_CLASS);

        const isMobileLayout = this._isMobileLayout();

        const overlayType = isMobileLayout ? Popup : Popover;

        this._overlay = this._createComponent(this.$element(), overlayType, {
            contentTemplate: () => this._createOverlayContent(),
            onShown: () => this._calendar.focus(),
            defaultOptionsRules: [
                {
                    device: () => isMobileLayout,
                    options: {
                        fullScreen: true,
                        showCloseButton: false,
                        toolbarItems: [{ shortcut: 'cancel' }],
                    }
                }
            ],
        });
    }

    _createOverlayContent() {
        const result = $('<div>').addClass(CALENDAR_CLASS);
        this._calendar = this._createComponent(result, Calendar, this._getCalendarOptions());

        if(this._isMobileLayout()) {
            const scrollable = this._createScrollable(result);
            return scrollable.$element();
        }

        return result;
    }

    _createScrollable(content) {
        const result = this._createComponent('<div>', Scrollable, {
            direction: 'vertical'
        });
        result.$content().append(content);

        return result;
    }

    _optionChanged({ name, value }) {
        switch(name) {
            case 'value':
                this._calendar?.option('value', value);
                break;
            default:
                break;
        }
    }

    _getCalendarOptions() {
        return {
            value: this.option('value'),
            min: this.option('min'),
            max: this.option('max'),
            firstDayOfWeek: this.option('firstDayOfWeek'),
            focusStateEnabled: this.option('focusStateEnabled'),
            onValueChanged: this.option('onValueChanged'),
            skipFocusCheck: true,
            tabIndex: this.option('tabIndex'),
        };
    }

    _isMobileLayout() {
        return !devices.current().generic;
    }
}

registerComponent('dxSchedulerCalendarPopup', SchedulerCalendar);
