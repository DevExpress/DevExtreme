/**
* @name dxtreemapnode
* @publicName Node
*/
var Node = {
    /**
    * @name dxtreemapnodefields_level
    * @publicName level
    * @type number
    */
    level: undefined,
    /**
    * @name dxtreemapnodefields_index
    * @publicName index
    * @type number
    */
    index: undefined,
    /**
    * @name dxtreemapnodefields_data
    * @publicName data
    * @type object
    */
    data: undefined,
    /**
    * @name dxtreemapnodemethods_getparent
    * @publicName getParent()
    * @return dxtreemapnode
    */
    getParent: undefined,
    /**
    * @name dxtreemapnodemethods_getchildrencount
    * @publicName getChildrenCount()
    * @return number
    */
    getChildrenCount: undefined,
    /**
    * @name dxtreemapnodemethods_getallchildren
    * @publicName getAllChildren()
    * @return array
    */
    getAllChildren: undefined,
    /**
    * @name dxtreemapnodemethods_getallnodes
    * @publicName getAllNodes()
    * @return array
    */
    getAllNodes: undefined,
    /**
    * @name dxtreemapnodemethods_getchild
    * @publicName getChild(index)
    * @param1 index:number
    * @return dxtreemapnode
    */
    getChild: undefined,
    /**
    * @name dxtreemapnodemethods_value
    * @publicName value()
    * @return number
    */
    value: undefined,
    /**
    * @name dxtreemapnodemethods_label
    * @publicName label()
    * @return string
    */
    /**
    * @name dxtreemapnodemethods_label
    * @publicName label(label)
    * @param1 label:string
    */
    label: undefined,
    /**
    * @name dxtreemapnodemethods_customize
    * @publicName customize(options)
    * @param1 options:object
    */
    customize: undefined,
    /**
    * @name dxtreemapnodemethods_resetcustomization
    * @publicName resetCustomization()
    */
    resetCustomization: undefined,
    /**
    * @name dxtreemapnodemethods_isleaf
    * @publicName isLeaf()
    * @return boolean
    */
    isLeaf: undefined,
    /**
    * @name dxtreemapnodemethods_isactive
    * @publicName isActive()
    * @return boolean
    */
    isActive: undefined,
    /**
    * @name dxtreemapnodemethods_ishovered
    * @publicName isHovered()
    * @return boolean
    */
    isHovered: undefined,
    /**
    * @name dxtreemapnodemethods_select
    * @publicName select(state)
    * @param1 state:boolean
    */
    select: undefined,
    /**
    * @name dxtreemapnodemethods_isselected
    * @publicName isSelected()
    * @return boolean
    */
    isSelected: undefined,
    /**
    * @name dxtreemapnodemethods_showtooltip
    * @publicName showTooltip()
    */
    showTooltip: undefined,
    /**
    * @name dxtreemapnodemethods_drilldown
    * @publicName drillDown()
    */
    drillDown: undefined
};
