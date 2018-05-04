/**
* @name dxTreeMapNode
* @publicName Node
*/
var Node = {
    /**
    * @name dxTreeMapNodefields.level
    * @publicName level
    * @type number
    */
    level: undefined,
    /**
    * @name dxTreeMapNodefields.index
    * @publicName index
    * @type number
    */
    index: undefined,
    /**
    * @name dxTreeMapNodefields.data
    * @publicName data
    * @type object
    */
    data: undefined,
    /**
    * @name dxTreeMapNodemethods.getparent
    * @publicName getParent()
    * @return dxTreeMapNode
    */
    getParent: undefined,
    /**
    * @name dxTreeMapNodemethods.getchildrencount
    * @publicName getChildrenCount()
    * @return number
    */
    getChildrenCount: undefined,
    /**
    * @name dxTreeMapNodemethods.getallchildren
    * @publicName getAllChildren()
    * @return Array<dxTreeMapNode>
    */
    getAllChildren: undefined,
    /**
    * @name dxTreeMapNodemethods.getallnodes
    * @publicName getAllNodes()
    * @return Array<dxTreeMapNode>
    */
    getAllNodes: undefined,
    /**
    * @name dxTreeMapNodemethods.getchild
    * @publicName getChild(index)
    * @param1 index:number
    * @return dxTreeMapNode
    */
    getChild: undefined,
    /**
    * @name dxTreeMapNodemethods.value
    * @publicName value()
    * @return number
    */
    value: undefined,
    /**
    * @name dxTreeMapNodemethods.label
    * @publicName label()
    * @return string
    */
    /**
    * @name dxTreeMapNodemethods.label
    * @publicName label(label)
    * @param1 label:string
    */
    label: undefined,
    /**
    * @name dxTreeMapNodemethods.customize
    * @publicName customize(options)
    * @param1 options:object
    */
    customize: undefined,
    /**
    * @name dxTreeMapNodemethods.resetcustomization
    * @publicName resetCustomization()
    */
    resetCustomization: undefined,
    /**
    * @name dxTreeMapNodemethods.isleaf
    * @publicName isLeaf()
    * @return boolean
    */
    isLeaf: undefined,
    /**
    * @name dxTreeMapNodemethods.isactive
    * @publicName isActive()
    * @return boolean
    */
    isActive: undefined,
    /**
    * @name dxTreeMapNodemethods.ishovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: undefined,
    /**
    * @name dxTreeMapNodemethods.select
    * @publicName select(state)
    * @param1 state:boolean
    */
    select: undefined,
    /**
    * @name dxTreeMapNodemethods.isselected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: undefined,
    /**
    * @name dxTreeMapNodemethods.showtooltip
    * @publicName showTooltip()
    */
    showTooltip: undefined,
    /**
    * @name dxTreeMapNodemethods.drilldown
    * @publicName drillDown()
    */
    drillDown: undefined
};
