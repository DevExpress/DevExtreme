export const getFileIconName = (filename: string = ''): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    
    if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
        return 'file';
    }

    const extension = filename.slice(lastDotIndex + 1);

    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'webp':
            return 'image';
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'webm':
        case 'mkv':
            return 'video';
        case 'mp3':
        case 'wav':
        case 'ogg':
        case 'm4a':
        case 'flac':
            return 'music';
        case 'pdf':
            return 'pdffile';
        case 'doc':
        case 'docx':
        case 'txt':
        case 'rtf':
        case 'md':
            return 'textdocument';
        case 'xls':
        case 'xlsx':
        case 'csv':
        case 'ods':
            return 'exportxlsx';
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return 'folder';
        default:
            return 'file';
    }
}
