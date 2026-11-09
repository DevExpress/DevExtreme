import AlignStyle from './formats/align';
import FontStyle from './formats/font';
import Image from './formats/image';
import Link from './formats/link';
import SizeStyle from './formats/size';
import DropImage from './modules/dropImage';
import ImageCursor from './modules/imageCursor';
import ImageUpload from './modules/imageUpload';
import MentionsModule from './modules/mentions';
import Resizing from './modules/resizing';
import TableContextMenu from './modules/tableContextMenu';
import TableResizing from './modules/tableResizing';
import Toolbar from './modules/toolbar';
import Variables from './modules/variables';
import { getQuill } from './quill_importer';
import BaseTheme from './themes/base';
import type { QuillInstance, QuillOptions, QuillStatic } from './types/quill';

class QuillRegistrator {
  private readonly _customModules: string[] = [];

  constructor() {
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
  }

  createEditor(container: string | Element, config: QuillOptions): QuillInstance {
    const QuillConstructor = this.getQuill();

    return new QuillConstructor(container, config);
  }

  registerModules(modulesConfig: Record<string, unknown>): void {
    const isModule = RegExp('modules/*');
    const quill = this.getQuill();
    const isRegisteredModule = (modulePath: string): boolean => Boolean(quill.imports[modulePath]);

    // eslint-disable-next-line no-restricted-syntax
    for (const modulePath in modulesConfig) {
      if (isModule.test(modulePath) && !isRegisteredModule(modulePath)) {
        this._customModules.push(modulePath.slice(8));
      }
    }

    quill.register(modulesConfig, true);
  }

  getRegisteredModuleNames(): string[] {
    return this._customModules;
  }

  getQuill(): QuillStatic {
    return getQuill();
  }
}

export default QuillRegistrator;
