const DiagramToolbox = {
    groups: {
        "general": { category: "general", title: 'General' },
        "flowchart": { category: "flowchart", title: 'Flowchart' },
        "orgChart": { category: "orgChart", title: 'Org Chart' },
        "containers": { category: "containers", title: 'Containers' },
        "custom": { category: "custom", title: 'Custom' }
    },

    createDefaultGroups: function() {
        return [ this.groups["general"], this.groups["flowchart"], this.groups["orgChart"], this.groups["containers"] ];
    }
};

module.exports = DiagramToolbox;
