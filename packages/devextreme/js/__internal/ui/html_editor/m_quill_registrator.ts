import AlignStyle from './formats/m_align';
import FontStyle from './formats/m_font';
import Image from './formats/m_image';
import Link from './formats/m_link';
import SizeStyle from './formats/m_size';
import { getQuill } from './m_quill_importer';
import DropImage from './modules/m_dropImage';
import ImageCursor from './modules/m_imageCursor';
import ImageUpload from './modules/m_imageUpload';
import MentionsModule from './modules/m_mentions';
import Resizing from './modules/m_resizing';
import TableContextMenu from './modules/m_tableContextMenu';
import TableResizing from './modules/m_tableResizing';
import Toolbar from './modules/m_toolbar';
import Variables from './modules/m_variables';
import BaseTheme from './themes/m_base';

class QuillRegistrator {
  _customModules: any[] = [];

  constructor() {
    // @ts-expect-error
    if (QuillRegistrator.initialized) {
      return;
    }

    const quill = this.getQuill();
    const DirectionStyle = quill.import('attributors/style/direction');

    quill.register(
      {
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
        'modules/tableContextMenu': TableContextMenu,
        'modules/imageUpload': ImageUpload,
        'modules/imageCursor': ImageCursor,
        'modules/mentions': MentionsModule,

        'themes/basic': BaseTheme,
      },
      true,
    );

    this._customModules = [];
    // @ts-expect-error
    QuillRegistrator._initialized = true;
  }

  createEditor(container, config) {
    const quill = this.getQuill();

    // eslint-disable-next-line new-cap
    return new quill(container, config);
  }

  registerModules(modulesConfig) {
    const isModule = RegExp('modules/*');
    const quill = this.getQuill();
    const isRegisteredModule = (modulePath) => !!quill.imports[modulePath];

    // eslint-disable-next-line no-restricted-syntax
    for (const modulePath in modulesConfig) {
      if (isModule.test(modulePath) && !isRegisteredModule(modulePath)) {
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
