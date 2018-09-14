import Theme from "quill/core/theme";

class BaseTheme extends Theme {
    constructor(quill, options) {

        super(quill, options);
        this.quill.root.classList.add("dx-htmlEditor-content");

        // add keyboard bindings
        // this.options.modules.keyboard.bindings = {
        // };
    }
}

export { BaseTheme as default };
