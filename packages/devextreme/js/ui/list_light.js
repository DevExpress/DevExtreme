import ListEdit from '../__internal/ui/list/m_list.edit.search';
import registerComponent from '../core/component_registrator';

// STYLE list

registerComponent('dxList', ListEdit);

export default ListEdit;

/**
 * @name dxListOptions.selectedIndex
 * @type number
 * @default -1
 * @hidden
 */

/**
 * @name dxListOptions.selectedItem
 * @hidden
 */

/**
 * @name dxList.getItemElementByFlatIndex
 * @publicName getItemElementByFlatIndex(flatIndex)
 * @param1 flatIndex:Number
 * @return Element
 * @hidden
 */

/**
 * @name dxList.getFlatIndexByItemElement
 * @publicName getFlatIndexByItemElement(itemElement)
 * @param1 itemElement:Element
 * @return object
 * @hidden
 */

/**
 * @name dxList.getItemByIndex
 * @publicName getItemByIndex(index)
 * @param1 index:Number
 * @return object
 * @hidden
 */
