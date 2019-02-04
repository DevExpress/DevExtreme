import Class from "../../core/class";

var FileManagerItem = Class.inherit({
    ctor: function(parentPath, name) {
        this.parentPath = parentPath;
        this.name = name;
        this.relativeName = this.parentPath + "/" + this.name;

        this.length = 0;
        this.lastWriteTime = Date.now();
    }
});

module.exports = FileManagerItem;
