// @ts-expect-error
import { editorFactoryModule } from '@js/ui/grid_core/ui.grid_core.editor_factory';
import treeListCore from '../module_core';

treeListCore.registerModule('editorFactory', editorFactoryModule);
