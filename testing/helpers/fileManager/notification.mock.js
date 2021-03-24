import $ from 'jquery';
import { extend } from 'core/utils/extend';
import { isString } from 'core/utils/type';
import FileManagerNotificationControl from 'ui/file_manager/ui.file_manager.notification';

export default class FileManagerNotificationControlMock extends FileManagerNotificationControl {

    _showPopup(content, errorMode) {
        let info = { errorMode };

        if(isString(content)) {
            info.commonText = content;
        } else {
            const contentInfo = this._getLogInfo($(content));
            info = extend(info, contentInfo);
        }

        this._logEvent('_showPopup', info);
    }

    _getLogInfo($content) {
        const commonText = $content.find('.dx-filemanager-notification-common').text();
        const detailsText = $content.find('.dx-filemanager-notification-details').text();
        return { commonText, detailsText };
    }

    _logEvent(type, info) {
        const logger = this.option('logger');
        if(logger) {
            type = 'notification-' + type;
            logger.addEntry(type, info);
        }
    }

    _getProgressPanelComponent() {
        const component = this.option('progressPanelComponent');
        return component ? component : super._getProgressPanelComponent();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            progressPanelComponent: null,
            logger: null,
            showProgressPanel: true,
            showNotificationPopup: true
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'progressPanelComponent':
            case 'logger':
                break;
            default:
                super._optionChanged(args);
        }
    }

}
