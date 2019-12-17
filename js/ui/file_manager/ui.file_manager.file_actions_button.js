import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';

import Widget from '../widget/ui.widget';
import Button from '../button';

const FILE_MANAGER_FILE_ACTIONS_BUTTON = 'dx-filemanager-file-actions-button';
const FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED = 'dx-filemanager-file-actions-button-activated';
const ACTIVE_STATE_CLASS = 'dx-state-active';

class FileManagerFileActionsButton extends Widget {

    _initMarkup() {
        this._createClickAction();

        const $button = $('<div>');

        this.$element()
            .append($button)
            .addClass(FILE_MANAGER_FILE_ACTIONS_BUTTON);

        this._button = this._createComponent($button, Button, {
            text: '&vellip;',
            stylingMode: 'text',
            onClick: e => this._raiseClick(e),
            template: () => {
                return $('<i>').html('&vellip;');
            }
        });

        super._initMarkup();
    }

    _createClickAction() {
        this._clickAction = this._createActionByOption('onClick');
    }

    _raiseClick(e) {
        this._clickAction(e);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            cssClass: '',
            onClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'cssClass':
                this.repaint();
                break;
            case 'onClick':
                this._createClickAction();
                break;
            default:
                super._optionChanged(args);
        }
    }

    setActive(active) {
        this.$element().toggleClass(FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED, active);
        setTimeout(() => this._button.$element().toggleClass(ACTIVE_STATE_CLASS, active));
    }

}

module.exports = FileManagerFileActionsButton;
