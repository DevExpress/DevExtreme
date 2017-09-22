/**
* @name dxexporter
* @publicName dxExporter
* @type object
* @inherits Component
* @deprecated
* @groupName Helpers
*/
var dxExporter = {
    /**
    * @name dxexporteroptions_sourceContainer
    * @publicName sourceContainer
    * @type string
    * @default undefined
    */
    sourceContainer: undefined,
    /**
    * @name dxexporteroptions_fileName
    * @publicName fileName
    * @type string
    * @default 'file'
    */
    fileName: 'file',
    /**
    * @name dxexporteroptions_serverUrl
    * @publicName serverUrl
    * @type string
    * @default undefined
    */
    serverUrl: undefined,
    /**
    * @name dxexporteroptions_exportFormat
    * @publicName exportFormat
    * @type Array<string>
    * @default ['PDF', 'PNG', 'SVG']
    * @acceptValues 'PNG'|'JPEG'|'GIF'|'PDF'|'SVG'
    */
    exportFormat: ['PDF', 'PNG', 'SVG'],
    /**
    * @name dxexporteroptions_printingEnabled
    * @publicName printingEnabled
    * @type boolean
    * @default true
    */
    printingEnabled: true,
    /**
    * @name dxexporteroptions_showMenu
    * @publicName showMenu
    * @type boolean
    * @default true
    */
    showMenu: true,
    /**
    * @name dxexportermethods_print
    * @publicName print()
    */
    print: function() { },
    /**
    * @name dxexportermethods_exportTo
    * @publicName exportTo(fileName, format)
    * @param1 fileName:string
    * @param2 format:string
    */
    exportTo: function() { }
}
