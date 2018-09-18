import getQuill from "./quill_importer";

import BaseTheme from "./themes/base";
import Image from "./formats/image";
import Toolbar from "./modules/toolbar";

class QuillRegistrator {
    constructor() {
        if(QuillRegistrator.initialized) {
            return;
        }

        const quill = this.getQuill();

        const DirectionStyle = quill.import("attributors/style/direction");
        const AlignStyle = quill.import("attributors/style/align");
        const FontStyle = quill.import("attributors/style/font");
        const SizeStyle = quill.import("attributors/style/size");

        quill.register({
            "formats/align": AlignStyle,
            "formats/direction": DirectionStyle,
            "formats/font": FontStyle,
            "formats/size": SizeStyle,

            "formats/image": Image,

            "modules/toolbar": Toolbar,

            "themes/basic": BaseTheme
        },
            true
        );

        QuillRegistrator._initialized = true;
    }

    createEditor(container, config) {
        const quill = this.getQuill();

        return new quill(container, config);
    }

    registerModules(modulesConfig) {
        const quill = this.getQuill();

        quill.register(modulesConfig, true);
    }

    getQuill() {
        return getQuill();
    }
};

export { QuillRegistrator as default };
