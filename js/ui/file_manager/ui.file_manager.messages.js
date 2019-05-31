import messageLocalization from "../../localization/message";

const ErrorCode = {
    NoAccess: 0,
    FileExists: 1,
    FileNotFound: 2,
    DirectoryExists: 3
};

export const FileManagerMessages = {
    get: (errorId, args) => {
        switch(errorId) {
            case ErrorCode.NoAccess:
                return messageLocalization.format("dxFileManager-errorNoAccess");
            case ErrorCode.FileExists:
                return messageLocalization.format("dxFileManager-errorFileExistsFormat", args);
            case ErrorCode.FileNotFound:
                return messageLocalization.format("dxFileManager-errorFileNotFoundFormat", args);
            case ErrorCode.DirectoryExists:
                return messageLocalization.format("dxFileManager-errorDirectoryExistsFormat", args);
        }

        return messageLocalization.format("dxFileManager-errorDefault");
    }
};
