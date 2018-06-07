/**
* @name dxExporter
* @type object
* @inherits Component
* @deprecated
*/
var dxExporter = {
    /**
    * @name dxExporterOptions.sourceContainer
    * @type string
    * @default undefined
    */
    sourceContainer: undefined,
    /**
    * @name dxExporterOptions.fileName
    * @type string
    * @default 'file'
    */
    fileName: 'file',
    /**
    * @name dxExporterOptions.serverUrl
    * @type string
    * @default undefined
    */
    serverUrl: undefined,
    /**
    * @name dxExporterOptions.exportFormat
    * @type Array<Enums.ExportFormat>
    * @default ['PDF', 'PNG', 'SVG']
    */
    exportFormat: ['PDF', 'PNG', 'SVG'],
    /**
    * @name dxExporterOptions.printingEnabled
    * @type boolean
    * @default true
    */
    printingEnabled: true,
    /**
    * @name dxExporterOptions.showMenu
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
