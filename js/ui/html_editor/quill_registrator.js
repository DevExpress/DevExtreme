import { getQuill } from './quill_importer';

class QuillRegistrator {
    constructor() {
        if(QuillRegistrator.initialized) {
            return;
        }

        const quill = this.getQuill();

        const BaseTheme = require('./themes/base').default;
        const Image = require('./formats/image').default;
        const Link = require('./formats/link').default;
        const FontStyle = require('./formats/font').default;
        const SizeStyle = require('./formats/size').default;
        const AlignStyle = require('./formats/align').default;
        const Mention = require('./formats/mention').default;
        const Toolbar = require('./modules/toolbar').default;
        const DropImage = require('./modules/dropImage').default;
        const Variables = require('./modules/variables').default;
        const Resizing = require('./modules/resizing').default;
        const MentionsModule = require('./modules/mentions').default;

        const DirectionStyle = quill.import('attributors/style/direction');

        quill.register({
            'formats/align': AlignStyle,
            'formats/direction': DirectionStyle,
            'formats/font': FontStyle,
            'formats/size': SizeStyle,

            'formats/extendedImage': Image,
            'formats/link': Link,
            'formats/mention': Mention,

            'modules/toolbar': Toolbar,
            'modules/dropImage': DropImage,
            'modules/variables': Variables,
            'modules/resizing': Resizing,
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
