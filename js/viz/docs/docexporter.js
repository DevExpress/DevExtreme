/**
* @name dxexporter
* @publicName dxExporter
* @type object
* @inherits Component
* @deprecated
*/
var dxExporter = {
    /**
    * @name dxexporteroptions.sourceContainer
    * @publicName sourceContainer
    * @type string
    * @default undefined
    */
    sourceContainer: undefined,
    /**
    * @name dxexporteroptions.fileName
    * @publicName fileName
    * @type string
    * @default 'file'
    */
    fileName: 'file',
    /**
    * @name dxexporteroptions.serverUrl
    * @publicName serverUrl
    * @type string
    * @default undefined
    */
    serverUrl: undefined,
    /**
    * @name dxexporteroptions.exportFormat
    * @publicName exportFormat
    * @type Array<string>
    * @default ['PDF', 'PNG', 'SVG']
    * @acceptValues 'PNG'|'JPEG'|'GIF'|'PDF'|'SVG'
    */
    exportFormat: ['PDF', 'PNG', 'SVG'],
    /**
    * @name dxexporteroptions.printingEnabled
    * @publicName printingEnabled
    * @type boolean
    * @default true
    */
    printingEnabled: true,
    /**
    * @name dxexporteroptions.showMenu
    * @publicName showMenu
    * @type boolean
    * @default true
    */
    showMenu: true,
    /**
    * @name dxexportermethods.print
    * @publicName print()
    */
    print: function() { },
    /**
    * @name dxexportermethods.exportTo
    * @publicName exportTo(fileName, format)
    * @param1 fileName:string
    * @param2 format:string
    */
    exportTo: function() { }
}
