/**
* @name viz
* @namespace DevExpress
*/
const staticMethods = {
    /**
    * @name vizmethods.currentTheme
    * @publicName currentTheme(theme)
    * @param1 theme:string
    * @static
    * @module viz/themes
    * @export currentTheme
    */
    /**
    * @name vizmethods.currentTheme
    * @publicName currentTheme(platform, colorScheme)
    * @param1 platform:string
    * @param2 colorScheme:string
    * @static
    * @module viz/themes
    * @export currentTheme
    */
    /**
    * @name vizmethods.currentTheme
    * @publicName currentTheme()
    * @return string
    * @static
    * @module viz/themes
    * @export currentTheme
    */
    currentTheme: function() { },
    /**
    * @name vizmethods.registerTheme
    * @publicName registerTheme(customTheme, baseTheme)
    * @param1 customTheme:object
    * @param2 baseTheme:string
    * @static
    * @module viz/themes
    * @export registerTheme
    */
    registerTheme: function() { },
    /**
    * @name vizmethods.refreshTheme
    * @publicName refreshTheme()
    * @static
    * @module viz/themes
    * @export refreshTheme
    */
    refreshTheme: function() { },
    /**
    * @name vizmethods.getTheme
    * @publicName getTheme(theme)
    * @param1 theme:string
    * @return object
    * @static
    * @module viz/themes
    * @export getTheme
    */
    getTheme: function() { },
    /**
    * @name vizmethods.exportWidgets
    * @publicName exportWidgets(widgetInstances)
    * @param1 widgetInstances:Array<Array<DOMComponent>>
    * @static
    * @module viz/export
    * @export exportWidgets
    */
    exportWidgets: function() { },
    /**
    * @name vizmethods.exportWidgets
    * @publicName exportWidgets(widgetInstances, options)
    * @param1 widgetInstances:Array<Array<DOMComponent>>
    * @param2 options:object
    * @param2_field1 fileName:string
    * @param2_field2 format:Enums.ExportFormat
    * @param2_field3 backgroundColor:string
    * @param2_field4 margin:number
    * @param2_field5 gridLayout:boolean
    * @param2_field6 verticalAlignment:Enums.VerticalAlignment
    * @param2_field7 horizontalAlignment:Enums.HorizontalAlignment
    * @param2_field8 proxyUrl:string:deprecated
    * @param2_field9 onExporting:function(e)
    * @param2_field10 onExported:function
    * @param2_field11 onFileSaving:function(e)
    * @param2_field12 svgToCanvas: function(svg, canvas)
    * @static
    * @module viz/export
    * @export exportWidgets
    */
    exportWidgets: function() { },
    /**
    * @name vizmethods.exportFromMarkup
    * @publicName exportFromMarkup(markup, options)
    * @param1 markup:string
    * @param2 options:object
    * @param2_field1 fileName:string
    * @param2_field2 format:string
    * @param2_field3 backgroundColor:string
    * @param2_field4 proxyUrl:string:deprecated
    * @param2_field5 width:number
    * @param2_field6 height:number
    * @param2_field7 onExporting:function(e)
    * @param2_field8 onExported:function
    * @param2_field9 onFileSaving:function(e)
    * @param2_field10 margin:number
    * @param2_field11 svgToCanvas: function(svg, canvas)
    * @static
    * @module viz/export
    * @export exportFromMarkup
    */
    exportFromMarkup: function() { },
    /**
    * @name vizmethods.getMarkup
    * @publicName getMarkup(widgetInstances)
    * @param1 widgetInstances:Array<DOMComponent>
    * @return string
    * @static
    * @module viz/export
    * @export getMarkup
    */
    getMarkup: function() { },
    /**
    * @name vizmethods.currentPalette
    * @publicName currentPalette()
    * @return string
    * @static
    * @module viz/palette
    * @export currentPalette
    */
    currentPalette: function() { },
    /**
    * @name vizmethods.currentPalette
    * @publicName currentPalette(paletteName)
    * @param1 paletteName:string
    * @static
    * @module viz/palette
    * @export currentPalette
    */
    currentPalette: function() { },
    /**
    * @name vizmethods.getPalette
    * @publicName getPalette(paletteName)
    * @param1 paletteName:string
    * @return object
    * @static
    * @module viz/palette
    * @export getPalette
    */
    getPalette: function() { },
    /**
    * @name vizmethods.generateColors
    * @publicName generateColors(palette, count, options)
    * @param1 palette:Enums.VizPalette|Array<string>
    * @param2 count:number
    * @param3 options:object
    * @param3_field1 paletteExtensionMode:Enums.VizPaletteExtensionMode
    * @param3_field2 baseColorSet:Enums.VizPaletteColorSet
    * @return Array<string>
    * @static
    * @module viz/palette
    * @export generateColors
    */
    generateColors: function() { },
    /**
    * @name vizmethods.registerPalette
    * @publicName registerPalette(paletteName, palette)
    * @param1 paletteName:string
    * @param2 palette:object
    * @static
    * @module viz/palette
    * @export registerPalette
    */
    registerPalette: function() { },
    /**
    * @name vizmethods.refreshPaths
    * @publicName refreshPaths()
    * @static
    * @module viz/utils
    * @export refreshPaths
    */
    refreshPaths: function() { },
    /**
    * @name viz.map
    * @static
    */
    map: {
        /**
        * @name viz.mapmethods.projection
        * @publicName projection(data)
        * @param1 data:VectorMapProjectionConfig
        * @return object
        * @static
        * @namespace DevExpress.viz.map
        * @module viz/vector_map/projection
        * @export projection
        * @hidden
        */
        /**
        * @name viz.map.projection
        * @namespace DevExpress.viz.map
        * @module viz/vector_map/projection
        * @export projection
        */
        /**
        * @name viz.map.projectionmethods.get
        * @publicName get(name)
        * @param1 name:Enums.VectorMapProjection|string
        * @return object
        * @namespace DevExpress.viz.map.projection
        * @static
        * @hidden
        */
        /**
        * @name viz.map.projectionmethods.add
        * @publicName add(name, projection)
        * @param1 name:string
        * @param2 projection:VectorMapProjectionConfig|object
        * @namespace DevExpress.viz.map.projection
        * @static
        */
    }
};
