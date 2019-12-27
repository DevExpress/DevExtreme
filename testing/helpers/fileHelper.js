const createBlobFile = function(name, size, type) {
    return {
        name: name,
        size: size,
        type: type || 'image/png',
        blob: (function(size) {
            let str = '';
            while(str.length < size) {
                str += 'a';
            }
            return new Blob([str], { type: 'application/octet-binary' });
        })(size),
        slice: function(startPos, endPos) {
            return this.blob.slice(startPos, endPos);
        },
        lastModifiedDate: (new Date).getTime()
    };
};

exports.createBlobFile = createBlobFile;
