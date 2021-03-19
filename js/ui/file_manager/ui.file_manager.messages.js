import messageLocalization from '../../localization/message';
import FileSystemErrorCodes from '../../file_management/error_codes';

export const FileManagerMessages = {
    get: (errorId, args) => {
        switch(errorId) {
            case FileSystemErrorCodes.NoAccess:
                return messageLocalization.format('dxFileManager-errorNoAccess');
            case FileSystemErrorCodes.FileExists:
                return messageLocalization.format('dxFileManager-errorFileExistsFormat', args);
            case FileSystemErrorCodes.FileNotFound:
                return messageLocalization.format('dxFileManager-errorFileNotFoundFormat', args);
            case FileSystemErrorCodes.DirectoryExists:
                return messageLocalization.format('dxFileManager-errorDirectoryExistsFormat', args);
            case FileSystemErrorCodes.DirectoryNotFound:
                return messageLocalization.format('dxFileManager-errorDirectoryNotFoundFormat', args);
            case FileSystemErrorCodes.WrongFileExtension:
                return messageLocalization.format('dxFileManager-errorWrongFileExtension');
            case FileSystemErrorCodes.MaxFileSizeExceeded:
                return messageLocalization.format('dxFileManager-errorMaxFileSizeExceeded');
            case FileSystemErrorCodes.InvalidSymbols:
                return messageLocalization.format('dxFileManager-errorInvalidSymbols');
        }

        return messageLocalization.format('dxFileManager-errorDefault');
    }
};
