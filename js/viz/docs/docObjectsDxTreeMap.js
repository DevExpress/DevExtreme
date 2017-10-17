/**
* @name dxTreeMapNode
* @publicName Node
*/
var Node = {
    /**
    * @name dxTreeMapNodefields_level
    * @publicName level
    * @type number
    */
    level: undefined,
    /**
    * @name dxTreeMapNodefields_index
    * @publicName index
    * @type number
    */
    index: undefined,
    /**
    * @name dxTreeMapNodefields_data
    * @publicName data
    * @type object
    */
    data: undefined,
    /**
    * @name dxTreeMapNodemethods_getparent
    * @publicName getParent()
    * @return dxTreeMapNode
    */
    getParent: undefined,
    /**
    * @name dxTreeMapNodemethods_getchildrencount
    * @publicName getChildrenCount()
    * @return number
    */
    getChildrenCount: undefined,
    /**
    * @name dxTreeMapNodemethods_getallchildren
    * @publicName getAllChildren()
    * @return Array<dxTreeMapNode>
    */
    getAllChildren: undefined,
    /**
    * @name dxTreeMapNodemethods_getallnodes
    * @publicName getAllNodes()
    * @return Array<dxTreeMapNode>
    */
    getAllNodes: undefined,
    /**
    * @name dxTreeMapNodemethods_getchild
    * @publicName getChild(index)
    * @param1 index:number
    * @return dxTreeMapNode
    */
    getChild: undefined,
    /**
    * @name dxTreeMapNodemethods_value
    * @publicName value()
    * @return number
    */
    value: undefined,
    /**
    * @name dxTreeMapNodemethods_label
    * @publicName label()
    * @return string
    */
    /**
    * @name dxTreeMapNodemethods_label
    * @publicName label(label)
    * @param1 label:string
    */
    label: undefined,
    /**
    * @name dxTreeMapNodemethods_customize
    * @publicName customize(options)
    * @param1 options:object
    */
    customize: undefined,
    /**
    * @name dxTreeMapNodemethods_resetcustomization
    * @publicName resetCustomization()
    */
    resetCustomization: undefined,
    /**
    * @name dxTreeMapNodemethods_isleaf
    * @publicName isLeaf()
    * @return boolean
    */
    isLeaf: undefined,
    /**
    * @name dxTreeMapNodemethods_isactive
    * @publicName isActive()
    * @return boolean
    */
    isActive: undefined,
    /**
    * @name dxTreeMapNodemethods_ishovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: undefined,
    /**
    * @name dxTreeMapNodemethods_select
    * @publicName select(state)
    * @param1 state:boolean
    */
    select: undefined,
    /**
    * @name dxTreeMapNodemethods_isselected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: undefined,
    /**
    * @name dxTreeMapNodemethods_showtooltip
    * @publicName showTooltip()
    */
    showTooltip: undefined,
    /**
    * @name dxTreeMapNodemethods_drilldown
    * @publicName drillDown()
    */
    drillDown: undefined
};
