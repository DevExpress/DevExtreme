import registerComponent from '../../core/component_registrator';
import { getModule } from '../../core/modules_registry';
import { ListBase } from './ui.list.base';

const ListEdit = getModule('ui/list/ui.list.edit.search');
const List = ListEdit || ListBase;

registerComponent('dxList', List);

export default List;
