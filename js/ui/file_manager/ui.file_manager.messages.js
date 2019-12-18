import messageLocalization from '../../localization/message';
import { ErrorCode } from './ui.file_manager.common';

export const FileManagerMessages = {
    get: (errorId, args) => {
        switch(errorId) {
            case ErrorCode.NoAccess:
                return messageLocalization.format('dxFileManager-errorNoAccess');
            case ErrorCode.FileExists:
                return messageLocalization.format('dxFileManager-errorFileExistsFormat', args);
            case ErrorCode.FileNotFound:
                return messageLocalization.format('dxFileManager-errorFileNotFoundFormat', args);
            case ErrorCode.DirectoryExists:
                return messageLocalization.format('dxFileManager-errorDirectoryExistsFormat', args);
        }

        return messageLocalization.format('dxFileManager-errorDefault');
    }
};

module.exports.ErrorCode = ErrorCode;
