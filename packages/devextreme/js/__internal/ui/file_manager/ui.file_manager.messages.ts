import messageLocalization from '@js/common/core/localization/message';
import ErrorCode from '@ts/file_management/error_codes';

export const FileManagerMessages = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get: (errorCode, args): string => {
    switch (errorCode) {
      case ErrorCode.NoAccess:
        return messageLocalization.format('dxFileManager-errorNoAccess');
      case ErrorCode.FileExists:
        return messageLocalization.format(
          'dxFileManager-errorFileExistsFormat',
          // @ts-expect-error ts-error
          args,
        );
      case ErrorCode.FileNotFound:
        return messageLocalization.format(
          'dxFileManager-errorFileNotFoundFormat',
          // @ts-expect-error ts-error
          args,
        );
      case ErrorCode.DirectoryExists:
        return messageLocalization.format(
          'dxFileManager-errorDirectoryExistsFormat',
          // @ts-expect-error ts-error
          args,
        );
      case ErrorCode.DirectoryNotFound:
        return messageLocalization.format(
          'dxFileManager-errorDirectoryNotFoundFormat',
          // @ts-expect-error ts-error
          args,
        );
      case ErrorCode.WrongFileExtension:
        return messageLocalization.format(
          'dxFileManager-errorWrongFileExtension',
        );
      case ErrorCode.MaxFileSizeExceeded:
        return messageLocalization.format(
          'dxFileManager-errorMaxFileSizeExceeded',
        );
      case ErrorCode.InvalidSymbols:
        return messageLocalization.format('dxFileManager-errorInvalidSymbols');
      default:
        break;
    }

    return messageLocalization.format('dxFileManager-errorDefault');
  },
};

export { ErrorCode };
