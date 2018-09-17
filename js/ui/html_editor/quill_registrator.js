import Quill from "quill/core";

import BaseTheme from "./themes/base";
import { AlignStyle } from "quill/formats/align";
import {
  DirectionAttribute,
  DirectionStyle,
} from "quill/formats/direction";

import Header from "quill/formats/header";
import List, { ListItem } from "quill/formats/list";
import { IndentClass as Indent } from "quill/formats/indent";

import { BackgroundStyle } from "quill/formats/background";
import { ColorStyle } from "quill/formats/color";
import { FontStyle } from "quill/formats/font";
import { SizeStyle } from "quill/formats/size";

import Bold from "quill/formats/bold";
import Italic from "quill/formats/italic";
import Link from "quill/formats/link";
import Strike from "quill/formats/strike";
import Underline from "quill/formats/underline";

import Image from "./formats/image";

import Syntax from "quill/modules/syntax";
import Toolbar from "./modules/toolbar";

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
            "formats/indent": Indent,

            "formats/background": BackgroundStyle,
            "formats/color": ColorStyle,
            "formats/font": FontStyle,
            "formats/size": SizeStyle,

            "formats/header": Header,
            "formats/list": List,
            "formats/list/item": ListItem,

            "formats/bold": Bold,
            "formats/italic": Italic,
            "formats/link": Link,
            "formats/strike": Strike,
            "formats/underline": Underline,

            "formats/image": Image,

            "modules/syntax": Syntax,
            "modules/toolbar": Toolbar,

            "themes/basic": BaseTheme
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

QuillRegistrator.Quill = Quill;

export { QuillRegistrator as default };
