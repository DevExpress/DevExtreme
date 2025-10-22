import { getFileIconName } from '__internal/ui/file_uploader/file_uploader.utils';


QUnit.module('getFileIconName', () => {
    [
        { name: 'file.jpg', result: 'image' },
        { name: 'file.jpeg', result: 'image' },
        { name: 'file.gif', result: 'image' },
        { name: 'file.bmp', result: 'image' },
        { name: 'file.webp', result: 'image' },
        { name: 'file.mp4', result: 'video' },
        { name: 'file.mov', result: 'video' },
        { name: 'file.avi', result: 'video' },
        { name: 'file.webm', result: 'video' },
        { name: 'file.mkv', result: 'video' },
        { name: 'file.mp3', result: 'music' },
        { name: 'file.wav', result: 'music' },
        { name: 'file.ogg', result: 'music' },
        { name: 'file.m4a', result: 'music' },
        { name: 'file.flac', result: 'music' },
        { name: 'file.pdf', result: 'pdffile' },
        { name: 'file.doc', result: 'textdocument' },
        { name: 'file.docx', result: 'textdocument' },
        { name: 'file.txt', result: 'textdocument' },
        { name: 'file.rtf', result: 'textdocument' },
        { name: 'file.md', result: 'textdocument' },
        { name: 'file.xls', result: 'exportxlsx' },
        { name: 'file.xlsx', result: 'exportxlsx' },
        { name: 'file.csv', result: 'exportxlsx' },
        { name: 'file.ods', result: 'exportxlsx' },
        { name: 'file.zip', result: 'folder' },
        { name: 'file.rar', result: 'folder' },
        { name: 'file.7z', result: 'folder' },
        { name: 'file.tar', result: 'folder' },
        { name: 'file.gz', result: 'folder' },
        { name: 'file.exe', result: 'file' },
        { name: 'file.jpg.', result: 'file' },
        { name: 'file.png.bin', result: 'file' },
        { name: '', result: 'file' },
        { name: '...', result: 'file' },
        { name: 'jpg', result: 'file' },
    ].forEach(({ name, result }) => {
        QUnit.test(`should return ${result} icon name for ${name}`, function(assert) {
            const iconName = getFileIconName(name);

            assert.strictEqual(iconName, result);
        });
    });
});
