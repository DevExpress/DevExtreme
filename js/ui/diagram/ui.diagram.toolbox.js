import messageLocalization from "../../localization/message";

const DiagramToolbox = {
    getDefaultGroups() {
        return this._groups ||
            (this._groups = {
                general: {
                    category: "general",
                    title: messageLocalization.format("dxDiagram-categoryGeneral")
                },
                flowchart: {
                    category: "flowchart",
                    title: messageLocalization.format("dxDiagram-categoryFlowchart")
                },
                orgChart: {
                    category: "orgChart",
                    title: messageLocalization.format("dxDiagram-categoryOrgChart")
                },
                containers: {
                    category: "containers",
                    title: messageLocalization.format("dxDiagram-categoryContainers")
                },
                custom: {
                    category: "custom",
                    title: messageLocalization.format("dxDiagram-categoryCustom")
                }
            });
    },

    getGroups: function(groups) {
        var defaultGroups = this.getDefaultGroups();
        if(groups) {
            return groups.map(function(g) {
                if(typeof g === "string") {
                    return {
                        category: g,
                        title: (defaultGroups[g] && defaultGroups[g].title) || g
                    };
                }
                return g;
            }).filter(function(g) { return g; });
        }
        return [
            defaultGroups["general"],
            defaultGroups["flowchart"],
            defaultGroups["orgChart"],
            defaultGroups["containers"]
        ];
    }
};

module.exports = DiagramToolbox;
