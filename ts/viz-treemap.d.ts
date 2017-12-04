declare module DevExpress.viz.treeMap {
    export interface dxTreeMapOptions extends viz.core.BaseWidgetOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        

        /** Specifies the origin of data for the widget. */
        dataSource?: any;

        /** Specifies the name of the data source field that provides nested items for a group. Applies to hierarchical data sources only. */
        childrenField?: string;

        /** Specifies the name of the data source field that provides values for tiles. */
        valueField?: string;

        /** Specifies the name of the data source field that provides colors for tiles. */
        colorField?: string;

        /** Specifies the name of the data source field that provides texts for tile and group labels. */
        labelField?: string;

        /** Specifies the name of the data source field that provides IDs for items. Applies to plain data sources only. */
        idField?: string;

        /** Specifies the name of the data source field that provides parent IDs for items. Applies to plain data sources only. */
        parentField?: string;

        /** Specifies the layout algorithm. */
        layoutAlgorithm?: any;

        /** Specifies the direction in which the items will be laid out. */
        layoutDirection?: string;

        /** Decides whether those labels that overflow their tile/group should be hidden or truncated with ellipsis. */
        resolveLabelOverflow?: string;

        /** Configures tiles. */
        tile?: {

            /** Configures the tile borders. */
            border?: {

                /** Specifies the width of the tile borders in pixels. */
                width?: number;

                /** Colors the tile borders. */
                color?: string;
            };

            /** Specifies a single color for all tiles. */
            color?: string;

            /** Specifies the appearance of tiles in the hover state. */
            hoverStyle?: {

                /** Configures the appearance of the tile borders in the hover state. */
                border?: {

                    /** Specifies the width of the tile borders in pixels. Applies to a tile in the hover state. */
                    width?: number;

                    /** Colors the tile borders in the hover state. */
                    color?: string;
                };

                /** Colors tiles in the hover state. */
                color?: string;
            };

            /** Specifies the appearance of tiles in the selected state. */
            selectionStyle?: {

                /** Configures the appearance of the tile borders in the selected state. */
                border?: {

                    /** Specifies the width of the tile borders in pixels. Applies to a tile in the selected state. */
                    width?: number;

                    /** Colors the tile borders in the selected state. */
                    color?: string;
                };

                /** Colors tiles in the selected state. */
                color?: string;
            };

            /** Configures the tile labels. */
            label?: {

                /** Changes the visibility of the tile labels. */
                visible?: boolean;

                /** Specifies the font settings of the tile labels. */
                font?: viz.core.Font;
            };
        };

        /** Configures groups. */
        group?: {

            /** Specifies the height of the group headers in pixels. */
            headerHeight?: number;

            /** Configures the group borders. */
            border?: {

                /** Specifies the width of the group borders in pixels. */
                width?: number;

                /** Colors the group borders. */
                color?: string;
            };

            /** Colors the group headers. */
            color?: string;

            /** Specifies the appearance of groups in the hover state. */
            hoverStyle?: {

                /** Configures the appearance of the group borders in the hover state. */
                border?: {

                    /** Specifies the width of the group borders in pixels. Applies to a group in the hover state. */
                    width?: number;

                    /** Colors the group borders in the hover state. */
                    color?: string;
                };

                /** Colors the group headers in the hover state. */
                color?: string;
            };

            /** Specifies the appearance of groups in the selected state. */
            selectionStyle?: {

                /** Configures the appearance of the group borders in the selected state. */
                border?: {

                    /** Specifies the width of the group borders in pixels. Applies to a group in the selected state. */
                    width?: number;

                    /** Colors the group borders in the selected state. */
                    color?: string;
                };

                /** Colors the group headers in the selected state. */
                color?: string;
            };

            /** Configures the group labels. */
            label?: {

                /** Changes the visibility of the group labels. */
                visible?: boolean;

                /** Specifies the font settings of the group labels. */
                font?: viz.core.Font;
            };

            /** Specifies whether groups change their style when a user pauses on them. */
            hoverEnabled?: boolean;
        };

        /** Manages the color settings. */
        colorizer?: {

            /** Specifies the colorizing algorithm. */
            type?: string;

            /** Sets the palette to be used for colorizing tiles. */
            palette?: any;

            /** Specifies whether or not all tiles in a group must be colored uniformly. Applies only if the type option is "discrete". */
            colorizeGroups?: boolean;

            /** Allows you to paint tiles with similar values uniformly. Applies only if the type option is "gradient" or "range". */
            range?: Array<number>;

            /** Specifies the name of the data source field whose values define the color of a tile. Applies only if the type option is "gradient" or "range". */
            colorCodeField?: string;
        };

        /** Specifies whether tiles and groups change their style when a user pauses on them. */
        hoverEnabled?: boolean;

        /** Specifies whether a single or multiple nodes can be in the selected state simultaneously. */
        selectionMode?: string;

        /** Specifies how many hierarchical levels must be visualized. */
        maxDepth?: number;

        /** Specifies whether the user will interact with a single tile or its group. */
        interactWithGroup?: boolean;

        
        tooltip?: viz.core.Tooltip;

        /** A handler for the nodesInitialized event. */
        onNodesInitialized?: (e: {
            component: dxTreeMap;
            element: Element;
            root: TreeMapNode
        }) => void;

        /** A handler for the nodesRendering event. */
        onNodesRendering?: (e: {
            component: dxTreeMap;
            element: Element;
            node: TreeMapNode
        }) => void;

        /** A handler for the click event. */
        onClick?: any;

        /** A handler for the hoverChanged event. */
        onHoverChanged?: (e: {
            component: dxTreeMap;
            element: Element;
            node: TreeMapNode;
        }) => void;

        /** A handler for the selectionChanged event. */
        onSelectionChanged?: (e: {
            component: dxTreeMap;
            element: Element;
            node: TreeMapNode;
        }) => void;

        /** A handler for the drill event. */
        onDrill?: (e: {
            component: dxTreeMap;
            element: Element;
            node: TreeMapNode
        }) => void;
    }

    /** This section describes the Node object, which represents a treemap node. */
    export interface TreeMapNode {

        /** The level that the current node occupies in the hierarchy of nodes. */
        level: number;

        /** The index of the current node in the array of all nodes on the same level. */
        index: number;

        /** The object from the data source visualized by the node. */
        data: Object;

        /** Returns the parent node of the current node. */
        getParent(): TreeMapNode;

        /** Indicates how many direct descendants the current node has. */
        getChildrenCount(): number;

        /** Returns all nodes nested in the current node. */
        getAllChildren(): Array<TreeMapNode>;

        /** Returns all descendant nodes. */
        getAllNodes(): Array<TreeMapNode>;

        /** Gets a specific node from a collection of direct descendants. */
        getChild(index: number): TreeMapNode;

        /** Gets the raw value of the node. */
        value(): number;

        /** Returns the label of the node. */
        label(): string;

        /** Sets the label to the node. */
        label(label: string): void;

        /** Customizes the node. */
        customize(options: any): void;

        /** Reverts the appearance of the node to the initial state. */
        resetCustomization(): void;

        /** Indicates whether the node is in the hover state or not. */
        isHovered(): boolean;

        /** Sets the selection state of a node. */
        select(state: boolean): void;

        /** Indicates whether the node is selected or not. */
        isSelected(): boolean;

        /** Indicates whether the node is visualized by a tile or a group of tiles. */
        isLeaf(): boolean;

        /** Indicates whether the current node is active. */
        isActive(): boolean;

        /** Shows the tooltip. */
        showTooltip(): void;

        /** Drills down into the node. */
        drillDown(): void;
    }
}

declare module DevExpress.viz {
    /** The TreeMap is a widget that displays hierarchical data by using nested rectangles. */
    export class dxTreeMap extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.treeMap.dxTreeMapOptions);
        constructor(element: Element, options?: DevExpress.viz.treeMap.dxTreeMapOptions);

        /** Returns the root node. */
        getRootNode(): DevExpress.viz.treeMap.TreeMapNode;

        /** Returns the current node. */
        getCurrentNode(): DevExpress.viz.treeMap.TreeMapNode;

        /** Deselects all nodes in the widget. */
        clearSelection(): void;

        /** Hides the tooltip. */
        hideTooltip(): void;

        /** Drills one level up. */
        drillUp(): void;

        /** Resets the drill down level. */
        resetDrillDown(): void;

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** Returns the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
}
