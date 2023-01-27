import registerComponent from './core/component_registrator';
import { compileGetter } from './core/utils/data';
import ComponentWrapper from './renovation/component_wrapper/common/component';
import type { ItemLike } from './ui/collection/ui.collection_widget.base';
import ValidationEngine from './ui/validation_engine';

export { registerComponent, ComponentWrapper, ItemLike, compileGetter, ValidationEngine };
export { getWindow } from './core/utils/window';
