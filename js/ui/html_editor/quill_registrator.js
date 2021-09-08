import { getQuill } from './quill_importer';
import BaseTheme from './themes/base';
import Image from './formats/image';
import Link from './formats/link';
import FontStyle from './formats/font';
import SizeStyle from './formats/size';
import AlignStyle from './formats/align';
import Toolbar from './modules/toolbar';
import DropImage from './modules/dropImage';
import Variables from './modules/variables';
import Resizing from './modules/resizing';
import TableResizing from './modules/tableResizing';
import MentionsModule from './modules/mentions';

class QuillRegistrator {
    constructor() {
        if(QuillRegistrator.initialized) {
            return;
        }

        const quill = this.getQuill();
        const DirectionStyle = quill.import('attributors/style/direction');

        quill.register({
            'formats/align': AlignStyle,
            'formats/direction': DirectionStyle,
            'formats/font': FontStyle,
            'formats/size': SizeStyle,

            'formats/extendedImage': Image,
            'formats/link': Link,

            'modules/toolbar': Toolbar,
            'modules/dropImage': DropImage,
            'modules/variables': Variables,
            'modules/resizing': Resizing,
            'modules/tableResizing': TableResizing,
            'modules/mentions': MentionsModule,

            'themes/basic': BaseTheme
        },
        true
        );

        this._customModules = [];
        QuillRegistrator._initialized = true;
    }

    createEditor(container, config) {
        const quill = this.getQuill();

        return new quill(container, config);
    }

    registerModules(modulesConfig) {
        const isModule = RegExp('modules/*');
        const quill = this.getQuill();
        const isRegisteredModule = (modulePath) => {
            return !!quill.imports[modulePath];
        };

        for(const modulePath in modulesConfig) {
            if(isModule.test(modulePath) && !isRegisteredModule(modulePath)) {
                this._customModules.push(modulePath.slice(8));
            }
        }

        quill.register(modulesConfig, true);
    }

    getRegisteredModuleNames() {
        return this._customModules;
    }

    getQuill() {
        return getQuill();
    }
}

export default QuillRegistrator;
