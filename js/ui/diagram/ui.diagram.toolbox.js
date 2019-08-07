const DiagramToolbox = {
    groups: {
        general: {
            category: "general",
            title: 'General'
        },
        flowchart: {
            category: "flowchart",
            title: 'Flowchart'
        },
        orgChart: {
            category: "orgChart",
            title: 'Org Chart'
        },
        containers: {
            category: "containers",
            title: 'Containers'
        },
        custom: {
            category: "custom",
            title: 'Custom'
        }
    },

    getGroups: function(groups) {
        var defaultGroups = this.groups;
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
