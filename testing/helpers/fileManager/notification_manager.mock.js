import { extend } from 'core/utils/extend';
import { NotificationManagerReal } from 'ui/file_manager/ui.file_manager.notification_manager';

export default class FileManagerNotificationManagerMock extends NotificationManagerReal {

    createErrorDetailsProgressBox($container, item, errorText) {
        const itemInfo = {
            commonText: item.commonText,
            imageUrl: item.imageUrl
        };
        this._logEvent('createErrorDetailsProgressBox', {
            item: itemInfo,
            errorText
        });
        super.createErrorDetailsProgressBox($container, item, errorText);
    }

    renderError($container, errorText) {
        this._logEvent('renderError', {
            errorText
        });
        super.renderError($container, errorText);
    }

    _logEvent(type, info) {
        const logger = this._logger;
        if(logger) {
            type = 'notification_manager-' + type;
            logger.addEntry(type, info);
        }
    }

    _getProgressPanelComponent() { // TODO
        const component = this.option('progressPanelComponent');
        return component ? component : super._getProgressPanelComponent();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            progressPanelComponent: null,
            logger: null
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
