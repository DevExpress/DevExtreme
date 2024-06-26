const fontAwesome = '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" />';
const polyfillMin = '<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>';
interface resorceLinksType {
    [Widget: string]: {
        [Name: string]: {
            resources: Resource[];
        };
    };
}
interface Resource {
    link?: string;
    title?: string;
    frameworks: ("React" | "Vue" | "Angular")[];
}
export const resourceLinks: resorceLinksType = {
    Button: {
        Icons: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue", "Angular"],
                },
            ],
        },
    },
    Calendar: {
        MultipleSelection: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        Overview: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    Charts: {
        Doughnut: {
            resources: [
                {
                    link: polyfillMin,
                    frameworks: [],
                },
            ],
        },
    },
    CheckBox: {
        Overview: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    DateRangeBox: {
        Overview: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React"],
                },
            ],
        },
    },
    Diagram: {
        Adaptability: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        AdvancedDataBinding: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        Containers: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        CustomShapesWithIcons: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        CustomShapesWithTemplates: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        CustomShapesWithTemplatesWithEditing: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        CustomShapesWithTexts: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        ImagesInShapes: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        ItemSelection: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        NodesAndEdgesArrays: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        NodesArrayHierarchicalStructure: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        NodesArrayPlainStructure: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        OperationRestrictions: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        Overview: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        ReadOnly: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        SimpleView: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        UICustomization: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        WebAPIService: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    Drawer: {
        LeftOrRightPosition: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["Angular"],
                },
            ],
        },
        TopOrBottomPosition: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["Angular"],
                },
            ],
        },
    },
    FilterBuilder: {
        Customization: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["Angular"],
                },
            ],
        },
        WithDataGrid: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["Angular"],
                },
            ],
        },
        WithList: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["Angular"],
                },
            ],
        },
    },
    Form: {
        ColumnsAdaptability: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        CustomizeItem: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        GroupedFields: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        Overview: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        UpdateItemsDynamically: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        Validation: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    Lookup: {
        Templates: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    PivotGrid: {
        ChartIntegration: {
            resources: [
                {
                    link: polyfillMin,
                    frameworks: [],
                },
            ],
        },
        Overview: {
            resources: [
                {
                    link: polyfillMin,
                    frameworks: [],
                },
            ],
        },
    },
    SelectBox: {
        GroupedItems: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
        SearchAndEditing: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    Slider: {
        Overview: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    Sortable: {
        Customization: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    TagBox: {
        GroupedItems: {
            resources: [
                {
                    link: fontAwesome,
                    frameworks: ["React", "Vue"],
                },
            ],
        },
    },
    TileView: {
        ItemTemplate: {
            resources: [
                {
                    link: polyfillMin,
                    frameworks: [],
                },
            ],
        },
    },
};
