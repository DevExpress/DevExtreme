declare module DevExpress.viz.treeMap {
    /** @docid dxtreemap_options */
    export interface dxTreeMapOptions extends viz.core.BaseWidgetOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /** @docid_ignore dxtreemapoptions_margin */

        /** @docid dxtreemapoptions_datasource */
        dataSource?: any;

        /** @docid dxtreemapoptions_childrenfield */
        childrenField?: string;

        /** @docid dxtreemapoptions_valuefield */
        valueField?: string;

        /** @docid dxtreemapoptions_colorfield */
        colorField?: string;

        /** @docid dxtreemapoptions_labelfield */
        labelField?: string;

        /** @docid dxtreemapoptions_idfield */
        idField?: string;

        /** @docid dxtreemapoptions_parentfield */
        parentField?: string;

        /** @docid dxtreemapoptions_layoutalgorithm */
        layoutAlgorithm?: any;

        /** @docid dxtreemapoptions_layoutdirection */
        layoutDirection?: string;

        /** @docid dxtreemapoptions_resolvelabeloverflow */
        resolveLabelOverflow?: string;

        /** @docid dxtreemapoptions_tile */
        tile?: {

            /** @docid dxtreemapoptions_tile_border */
            border?: {

                /** @docid dxtreemapoptions_tile_border_width */
                width?: number;

                /** @docid dxtreemapoptions_tile_border_color */
                color?: string;
            };

            /** @docid dxtreemapoptions_tile_color */
            color?: string;

            /** @docid dxtreemapoptions_tile_hoverstyle */
            hoverStyle?: {

                /** @docid dxtreemapoptions_tile_hoverstyle_border */
                border?: {

                    /** @docid dxtreemapoptions_tile_hoverstyle_border_width */
                    width?: number;

                    /** @docid dxtreemapoptions_tile_hoverstyle_border_color */
                    color?: string;
                };

                /** @docid dxtreemapoptions_tile_hoverstyle_color */
                color?: string;
            };

            /** @docid dxtreemapoptions_tile_selectionstyle */
            selectionStyle?: {

                /** @docid dxtreemapoptions_tile_selectionstyle_border */
                border?: {

                    /** @docid dxtreemapoptions_tile_selectionstyle_border_width */
                    width?: number;

                    /** @docid dxtreemapoptions_tile_selectionstyle_border_color */
                    color?: string;
                };

                /** @docid dxtreemapoptions_tile_selectionstyle_color */
                color?: string;
            };

            /** @docid dxtreemapoptions_tile_label */
            label?: {

                /** @docid dxtreemapoptions_tile_label_visible */
                visible?: boolean;

                /** @docid dxtreemapoptions_tile_label_font */
                font?: viz.core.Font;
            };
        };

        /** @docid dxtreemapoptions_group */
        group?: {

            /** @docid dxtreemapoptions_group_headerheight */
            headerHeight?: number;

            /** @docid dxtreemapoptions_group_border */
            border?: {

                /** @docid dxtreemapoptions_group_border_width */
                width?: number;

                /** @docid dxtreemapoptions_group_border_color */
                color?: string;
            };

            /** @docid dxtreemapoptions_group_color */
            color?: string;

            /** @docid dxtreemapoptions_group_hoverstyle */
            hoverStyle?: {

                /** @docid dxtreemapoptions_group_hoverstyle_border */
                border?: {

                    /** @docid dxtreemapoptions_group_hoverstyle_border_width */
                    width?: number;

                    /** @docid dxtreemapoptions_group_hoverstyle_border_color */
                    color?: string;
                };

                /** @docid dxtreemapoptions_group_hoverstyle_color */
                color?: string;
            };

            /** @docid dxtreemapoptions_group_selectionstyle */
            selectionStyle?: {

                /** @docid dxtreemapoptions_group_selectionstyle_border */
                border?: {

                    /** @docid dxtreemapoptions_group_selectionstyle_border_width */
                    width?: number;

                    /** @docid dxtreemapoptions_group_selectionstyle_border_color */
                    color?: string;
                };

                /** @docid dxtreemapoptions_group_selectionstyle_color */
                color?: string;
            };

            /** @docid dxtreemapoptions_group_label */
            label?: {

                /** @docid dxtreemapoptions_group_label_visible */
                visible?: boolean;

                /** @docid dxtreemapoptions_group_label_font */
                font?: viz.core.Font;
            };

            /** @docid dxtreemapoptions_group_hoverenabled */
            hoverEnabled?: boolean;
        };

        /** @docid dxtreemapoptions_colorizer */
        colorizer?: {

            /** @docid dxtreemapoptions_colorizer_type */
            type?: string;

            /** @docid dxtreemapoptions_colorizer_palette */
            palette?: any;

            /** @docid dxtreemapoptions_colorizer_colorizegroups */
            colorizeGroups?: boolean;

            /** @docid dxtreemapoptions_colorizer_range */
            range?: Array<number>;

            /** @docid dxtreemapoptions_colorizer_colorcodefield */
            colorCodeField?: string;
        };

        /** @docid dxtreemapoptions_hoverenabled */
        hoverEnabled?: boolean;

        /** @docid dxtreemapoptions_selectionmode */
        selectionMode?: string;

        /** @docid dxtreemapoptions_maxdepth */
        maxDepth?: number;

        /** @docid dxtreemapoptions_interactwithgroup */
        interactWithGroup?: boolean;

        /** @docid dxtreemapoptions_tooltip */
        tooltip?: viz.core.Tooltip;

        /** @docid dxtreemapoptions_onnodesinitialized */
        onNodesInitialized?: (e: {
            component: dxTreeMap;
            element: Element;
            root: TreeMapNode
        }) => void;

        /** @docid dxtreemapoptions_onnodesrendering */
        onNodesRendering?: (e: {
            component: dxTreeMap;
            element: Element;
            node: TreeMapNode
        }) => void;

        /** @docid dxtreemapoptions_onclick */
        onClick?: any;

        /** @docid dxtreemapoptions_onhoverchanged */
        onHoverChanged?: (e: {
            component: dxTreeMap;
            element: Element;
            node: TreeMapNode;
        }) => void;

        /** @docid dxtreemapoptions_onselectionchanged */
        onSelectionChanged?: (e: {
            component: dxTreeMap;
            element: Element;
            node: TreeMapNode;
        }) => void;

        /** @docid dxtreemapoptions_ondrill */
        onDrill?: (e: {
            component: dxTreeMap;
            element: Element;
            node: TreeMapNode
        }) => void;
    }

    /** @docid dxtreemapnode */
    export interface TreeMapNode {

        /** @docid dxtreemapnodefields_level */
        level: number;

        /** @docid dxtreemapnodefields_index */
        index: number;

        /** @docid dxtreemapnodefields_data */
        data: Object;

        /** @docid dxtreemapnodemethods_getparent */
        getParent(): TreeMapNode;

        /** @docid dxtreemapnodemethods_getchildrencount */
        getChildrenCount(): number;

        /** @docid dxtreemapnodemethods_getallchildren */
        getAllChildren(): Array<TreeMapNode>;

        /** @docid dxtreemapnodemethods_getallnodes */
        getAllNodes(): Array<TreeMapNode>;

        /** @docid dxtreemapnodemethods_getchild */
        getChild(index: number): TreeMapNode;

        /** @docid dxtreemapnodemethods_value */
        value(): number;

        /** @docid dxtreemapnodemethods_label#label() */
        label(): string;

        /** @docid dxtreemapnodemethods_label#label(label) */
        label(label: string): void;

        /** @docid dxtreemapnodemethods_customize */
        customize(options: any): void;

        /** @docid dxtreemapnodemethods_resetcustomization */
        resetCustomization(): void;

        /** @docid dxtreemapnodemethods_ishovered */
        isHovered(): boolean;

        /** @docid dxtreemapnodemethods_select */
        select(state: boolean): void;

        /** @docid dxtreemapnodemethods_isselected */
        isSelected(): boolean;

        /** @docid dxtreemapnodemethods_isleaf */
        isLeaf(): boolean;

        /** @docid dxtreemapnodemethods_isactive */
        isActive(): boolean;

        /** @docid dxtreemapnodemethods_showtooltip */
        showTooltip(): void;

        /** @docid dxtreemapnodemethods_drilldown */
        drillDown(): void;
    }
}

declare module DevExpress.viz {
    /** @docid dxtreemap */
    export class dxTreeMap extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.treeMap.dxTreeMapOptions);
        constructor(element: Element, options?: DevExpress.viz.treeMap.dxTreeMapOptions);

        /** @docid dxtreemapmethods_getrootnode */
        getRootNode(): DevExpress.viz.treeMap.TreeMapNode;

        /** @docid dxtreemapmethods_getcurrentnode */
        getCurrentNode(): DevExpress.viz.treeMap.TreeMapNode;

        /** @docid dxtreemapmethods_clearselection */
        clearSelection(): void;

        /** @docid dxtreemapmethods_hidetooltip */
        hideTooltip(): void;

        /** @docid dxtreemapmethods_drillup */
        drillUp(): void;

        /** @docid dxtreemapmethods_resetdrilldown */
        resetDrillDown(): void;

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** @docid dxtreemapmethods_getdatasource */
        getDataSource(): DevExpress.data.DataSource;
    }
}
