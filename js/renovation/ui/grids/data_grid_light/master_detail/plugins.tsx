import { JSXTemplate } from '@devextreme-generator/declarations';
import { Key } from '../types';
import { createValue } from '../../../../utils/plugin/context';

export const SetExpanded = createValue<(key: Key, value: boolean) => void>();
export const IsExpanded = createValue<(key: Key) => boolean>();
export const MasterDetailTemplate = createValue<JSXTemplate>();
