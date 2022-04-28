import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { getWindow } from '../../core/utils/window';
import messageLocalization from '../../localization/message';
import { isDefined } from '../../core/utils/type';
import LoadPanel from '../../ui/load_panel';


const EXPORT_LOAD_PANEL_CLASS = 'dx-export-loadpanel';
class ExportLoadPanel {
    constructor(component, $targetElement, $container, options) {
        this._$targetElement = $targetElement;
        this._$container = $container;

        this._loadPanel = component._createComponent($('<div>').addClass(EXPORT_LOAD_PANEL_CLASS).appendTo(this._$container), LoadPanel, this.getOptions(options));
    }

    getDefaultOptions() {
        return {
            animation: null,
            shading: false,
            height: 90,
            width: 200,
            position: () => {
                const $window = $(getWindow());
                if(this._$targetElement.height() > $window.height()) {
                    return {
                        of: $window,
                        boundary: this._$targetElement,
                        collision: 'fit'
                    };
                }
                return { of: this._$targetElement };
            },
            container: this._$container
        };
    }

    getOptions(options) {
        if(isDefined(options.text)) {
            options.message = options.text;
        } else {
            options.message = messageLocalization.format('dxDataGrid-exporting');
        }

        return extend(this.getDefaultOptions(), options);
    }

    show() {
        this._loadPanel.show();
    }

    dispose() {
        $(this._loadPanel.element()).remove();
        delete this._loadPanel;
    }
}

export { ExportLoadPanel };
