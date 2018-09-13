import Quill from "quill/core";


import { AlignStyle } from "quill/formats/align";
import {
  DirectionAttribute,
  DirectionStyle,
} from "quill/formats/direction";

import Header from "quill/formats/header";
import List from "quill/formats/list";

import { BackgroundStyle } from "quill/formats/background";
import { ColorStyle } from "quill/formats/color";
import { FontStyle } from "quill/formats/font";
import { SizeStyle } from "quill/formats/size";

import Bold from "quill/formats/bold";
import Italic from "quill/formats/italic";
import Link from "quill/formats/link";
import Strike from "quill/formats/strike";
import Underline from "quill/formats/underline";

import Syntax from "quill/modules/syntax";

class QuillRegistrator {
    constructor() {
        if(QuillRegistrator.initialized) {
            return;
        }

        QuillRegistrator.Quill.register({
            "attributors/attribute/direction": DirectionAttribute,
            "attributors/style/align": AlignStyle,
            "attributors/style/background": BackgroundStyle,
            "attributors/style/color": ColorStyle,
            "attributors/style/direction": DirectionStyle,
            "attributors/style/font": FontStyle,
            "attributors/style/size": SizeStyle
        },
            true
        );

        QuillRegistrator.Quill.register({
            "formats/align": AlignStyle,
            "formats/direction": DirectionStyle,

            "formats/background": BackgroundStyle,
            "formats/color": ColorStyle,
            "formats/font": FontStyle,
            "formats/size": SizeStyle,

            "formats/header": Header.default,
            "formats/list": List.default,

            "formats/bold": Bold.default,
            "formats/italic": Italic.default,
            "formats/link": Link.default,
            "formats/strike": Strike.default,
            "formats/underline": Underline.default,

            "modules/syntax": Syntax.default,
        },
            true
        );

        QuillRegistrator.initialized = true;
    }

    createEditor(container, config) {
        return new QuillRegistrator.Quill(container, config);
    }

    registerModules(modulesConfig) {
        QuillRegistrator.Quill.register(modulesConfig, true);
    }

    getQuill() {
        return QuillRegistrator.Quill;
    }
};

QuillRegistrator.Quill = Quill.default;

export { QuillRegistrator as default };
