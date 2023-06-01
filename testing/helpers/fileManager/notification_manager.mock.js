import { NotificationManager } from 'ui/file_manager/ui.file_manager.notification_manager';

export default class FileManagerNotificationManagerMock extends NotificationManager {
    constructor(options) {
        super(options);
        if(options.progressPanelComponent) {
            this._progressPanelComponent = options.progressPanelComponent;
        }
        if(options.logger) {
            this._logger = options.logger;
        }
    }

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

    _getProgressPanelComponent() {
        return this._progressPanelComponent || super._getProgressPanelComponent();
    }

}
