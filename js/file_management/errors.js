const ErrorCode = {
    NoAccess: 0,
    FileExists: 1,
    FileNotFound: 2,
    DirectoryExists: 3,
    DirectoryNotFound: 4,
    WrongFileExtension: 5,
    MaxFileSizeExceeded: 6,
    InvalidSymbols: 7,
    LocationUnavailable: 8,
    Other: 32767
};

module.exports = ErrorCode;
