import messageLocalization from '../../localization/message';
import FileSystemErrorCode from '../../file_management/error_codes';

export const FileManagerMessages = {
    get: (errorId, args) => {
        switch(errorId) {
            case FileSystemErrorCode.NoAccess:
                return messageLocalization.format('dxFileManager-errorNoAccess');
            case FileSystemErrorCode.FileExists:
                return messageLocalization.format('dxFileManager-errorFileExistsFormat', args);
            case FileSystemErrorCode.FileNotFound:
                return messageLocalization.format('dxFileManager-errorFileNotFoundFormat', args);
            case FileSystemErrorCode.DirectoryExists:
                return messageLocalization.format('dxFileManager-errorDirectoryExistsFormat', args);
            case FileSystemErrorCode.DirectoryNotFound:
                return messageLocalization.format('dxFileManager-errorDirectoryNotFoundFormat', args);
            case FileSystemErrorCode.WrongFileExtension:
                return messageLocalization.format('dxFileManager-errorWrongFileExtension');
            case FileSystemErrorCode.MaxFileSizeExceeded:
                return messageLocalization.format('dxFileManager-errorMaxFileSizeExceeded');
            case FileSystemErrorCode.InvalidSymbols:
                return messageLocalization.format('dxFileManager-errorInvalidSymbols');
        }

        return messageLocalization.format('dxFileManager-errorDefault');
    }
};
