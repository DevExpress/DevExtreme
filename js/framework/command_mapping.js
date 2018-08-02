var Class = require("../core/class"),
    grep = require("../core/utils/common").grep,
    extend = require("../core/utils/extend").extend,
    each = require("../core/utils/iterator").each,
    inArray = require("../core/utils/array").inArray,
    errors = require("./errors");

var CommandMapping = Class.inherit({
    ctor: function() {
        this._commandMappings = {};
        this._containerDefaults = {};
    },
    setDefaults: function(containerId, defaults) {
        this._containerDefaults[containerId] = defaults;
        return this;
    },
    mapCommands: function(containerId, commandMappings) {
        var that = this;
        each(commandMappings, function(index, commandMapping) {
            if(typeof commandMapping === "string") {
                commandMapping = { id: commandMapping };
            }
            var commandId = commandMapping.id;
            var mappings = that._commandMappings[containerId] || {};
            mappings[commandId] = extend({ showIcon: true, showText: true }, that._containerDefaults[containerId] || {}, commandMapping);
            that._commandMappings[containerId] = mappings;
        });
        this._initExistingCommands();
        return this;
    },
    unmapCommands: function(containerId, commandIds) {
        var that = this;
        each(commandIds, function(index, commandId) {
            var mappings = that._commandMappings[containerId] || {};
            if(mappings) {
                delete mappings[commandId];
            }
        });
        this._initExistingCommands();
    },
    getCommandMappingForContainer: function(commandId, containerId) {
        return (this._commandMappings[containerId] || {})[commandId];
    },
    checkCommandsExist: function(commands) {
        var that = this,
            result = grep(commands, function(commandName, index) {
                return inArray(commandName, that._existingCommands) < 0 && inArray(commandName, commands) === index;
            });
        if(result.length !== 0) {
            // https://js.devexpress.com/Documentation/ApiReference/SPA_Framework/HtmlApplication/Configuration/#commandMapping
            throw errors.Error("E3005", result.join("', '"), (result.length === 1 ? " is" : "s are"));
        }
    },
    load: function(config) {
        if(!config) return;
        var that = this;
        each(config, function(name, container) {
            that.setDefaults(name, container.defaults);
            that.mapCommands(name, container.commands);
        });
        return this;
    },
    _initExistingCommands: function() {
        var that = this;
        this._existingCommands = [];
        each(that._commandMappings, function(name, _commands) {
            each(_commands, function(index, command) {
                if(inArray(command.id, that._existingCommands) < 0) {
                    that._existingCommands.push(command.id);
                }
            });
        });
    }
});

CommandMapping.defaultMapping = {
    "global-navigation": {
        defaults: { showIcon: true, showText: true },
        commands: []
    },
    "ios-header-toolbar": {
        defaults: { showIcon: false, showText: true, location: "after" },
        commands: [
            "edit", "save",
            { id: "back", location: "before" },
            { id: "cancel", location: "before" },
            { id: "create", showIcon: true, showText: false }
        ]
    },
    "ios-action-sheet": {
        defaults: { showIcon: false, showText: true },
        commands: []
    },
    "ios-view-footer": {
        defaults: { showIcon: false, showText: true },
        commands: [
            { id: "delete", type: "danger" }
        ]
    },
    "android-header-toolbar": {
        defaults: { showIcon: true, showText: false, location: "after" },
        commands: [
            { id: "back", showIcon: false, location: "before" },
            "create",
            { id: "save", showText: true, showIcon: false, location: "after" },
            { id: "edit", showText: false, location: "after" },
            { id: "cancel", showText: false, location: "before" },
            { id: "delete", showText: false, location: "after" }
        ]
    },
    "android-simple-toolbar": {
        defaults: { showIcon: true, showText: false, location: "after" },
        commands: [
            { id: "back", showIcon: false, location: "before" },
            { id: "create" },
            { id: "save", showText: true, showIcon: false, location: "after" },
            { id: "edit", showText: false, location: "after" },
            { id: "cancel", showText: false, location: "before" },
            { id: "delete", showText: false, location: "after" }
        ]
    },
    "android-footer-toolbar": {
        defaults: { location: "after" },
        commands: [
            { id: "create", showText: false, location: "center" },
            { id: "edit", showText: false, location: "before" },
            { id: "delete", locateInMenu: "always" },
            { id: "save", showIcon: false, location: "before" }
        ]
    },
    "generic-header-toolbar": {
        defaults: { showIcon: false, showText: true, location: "after" },
        commands: [
            "edit", "save",
            { id: "back", location: "before" },
            { id: "cancel", location: "before" },
            { id: "create", showIcon: true, showText: false }
        ]
    },
    "generic-view-footer": {
        defaults: { showIcon: false, showText: true },
        commands: [
            { id: "delete", type: "danger" }
        ]
    },
    "win8-appbar": {
        defaults: { location: "after" },
        commands: [
            "edit", "cancel", "save", "delete",
            { id: "create", location: "before" },
            { id: "refresh", location: "before" }
        ]
    },
    "win8-toolbar": {
        defaults: { showText: false, location: "before" },
        commands: [
            { id: "previousPage" }
        ]
    },
    "win8-phone-appbar": {
        defaults: { location: "center" },
        commands: [
            "create", "edit", "cancel", "save", "refresh", { id: "delete", locateInMenu: "always" }
        ]
    },
    "win8-split-toolbar": {
        defaults: { showIcon: true, showText: false, location: "after" },
        commands: [
            { id: "back", showIcon: false, location: "before" },
            { id: "create" },
            { id: "save", showText: true, location: "before" },
            { id: "edit", showText: true, locateInMenu: "always" },
            { id: "cancel", showText: true, locateInMenu: "always" },
            { id: "delete", showText: true, locateInMenu: "always" }
        ]
    },
    "win8-master-detail-toolbar": {
        defaults: {
            showText: false,
            location: "before"
        },
        commands: ["back"]
    },
    "win10-appbar": {
        defaults: {
            showText: false,
            location: "after"
        },
        commands: [
            { id: "back", location: "before" },
            "edit", "cancel", "save", "delete", "create", "refresh"
        ]
    },
    "win10-phone-appbar": {
        defaults: {
            location: "after"
        },
        commands: [
            "create", "edit", "cancel", "save", "refresh", { id: "delete", locateInMenu: "always" }
        ]
    },
    "desktop-toolbar": {
        defaults: { showIcon: false, showText: true, location: "after" },
        commands: [
            "cancel", "create", "edit", "save",
            { id: "delete", type: "danger" }
        ]
    }
};

module.exports = CommandMapping;
