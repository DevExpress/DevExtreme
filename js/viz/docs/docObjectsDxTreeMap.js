/**
* @name dxTreeMapNode
* @publicName Node
*/
const Node = {
    /**
    * @name dxTreeMapNodeFields.level
    * @type number
    */
    level: undefined,
    /**
    * @name dxTreeMapNodeFields.index
    * @type number
    */
    index: undefined,
    /**
    * @name dxTreeMapNodeFields.data
    * @type object
    */
    data: undefined,
    /**
    * @name dxTreeMapNodeMethods.getParent
    * @publicName getParent()
    * @return dxTreeMapNode
    */
    getParent: undefined,
    /**
    * @name dxTreeMapNodeMethods.getChildrenCount
    * @publicName getChildrenCount()
    * @return number
    */
    getChildrenCount: undefined,
    /**
    * @name dxTreeMapNodeMethods.getAllChildren
    * @publicName getAllChildren()
    * @return Array<dxTreeMapNode>
    */
    getAllChildren: undefined,
    /**
    * @name dxTreeMapNodeMethods.getAllNodes
    * @publicName getAllNodes()
    * @return Array<dxTreeMapNode>
    */
    getAllNodes: undefined,
    /**
    * @name dxTreeMapNodeMethods.getChild
    * @publicName getChild(index)
    * @param1 index:number
    * @return dxTreeMapNode
    */
    getChild: undefined,
    /**
    * @name dxTreeMapNodeMethods.value
    * @publicName value()
    * @return number
    */
    value: undefined,
    /**
    * @name dxTreeMapNodeMethods.label
    * @publicName label()
    * @return string
    */
    /**
    * @name dxTreeMapNodeMethods.label
    * @publicName label(label)
    * @param1 label:string
    */
    label: undefined,
    /**
    * @name dxTreeMapNodeMethods.customize
    * @publicName customize(options)
    * @param1 options:object
    */
    customize: undefined,
    /**
    * @name dxTreeMapNodeMethods.resetCustomization
    * @publicName resetCustomization()
    */
    resetCustomization: undefined,
    /**
    * @name dxTreeMapNodeMethods.isleaf
    * @publicName isLeaf()
    * @return boolean
    */
    isLeaf: undefined,
    /**
    * @name dxTreeMapNodeMethods.isActive
    * @publicName isActive()
    * @return boolean
    */
    isActive: undefined,
    /**
    * @name dxTreeMapNodeMethods.isHovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: undefined,
    /**
    * @name dxTreeMapNodeMethods.select
    * @publicName select(state)
    * @param1 state:boolean
    */
    select: undefined,
    /**
    * @name dxTreeMapNodeMethods.isSelected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: undefined,
    /**
    * @name dxTreeMapNodeMethods.showTooltip
    * @publicName showTooltip()
    */
    showTooltip: undefined,
    /**
    * @name dxTreeMapNodeMethods.drillDown
    * @publicName drillDown()
    */
    drillDown: undefined
};
