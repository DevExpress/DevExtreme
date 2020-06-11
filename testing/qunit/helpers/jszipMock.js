class Folder {
    constructor() {
        this.children = {};
    }
    file(name, content) {
        let file = this.children[name];
        if(!file) {
            file = {};
            this.children[name] = file;
        }
        if(arguments.length > 1) {
            file.content = content;
        }
        return file;
    }
    folder(name) {
        let folder = this.children[name];
        if(!folder) {
            folder = new Folder();
            this.children[name] = folder;
        }
        return folder;
    }
}

export default class JSZipMock extends Folder {
    constructor() {
        super();
        this.generateAsync = false;
        JSZipMock.lastCreatedInstance = this;
    }
    generate() {}
}
