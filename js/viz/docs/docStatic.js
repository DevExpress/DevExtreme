/**
* @name viz
* @namespace DevExpress
*/
var staticMethods = {
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
    * @name vizmethods.exportFromMarkup
    * @publicName exportFromMarkup(markup, options)
    * @param1 markup:string
    * @param2 options:object
    * @param2_field1 fileName:string
    * @param2_field2 format:string
    * @param2_field3 backgroundColor:string
    * @param2_field4 proxyUrl:string
    * @param2_field5 width:number
    * @param2_field6 height:number
    * @param2_field7 onExporting:function(e)
    * @param2_field8 onExported:function
    * @param2_field9 onFileSaving:function(e)
    * @param2_field10 margin:number
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
        * @param1 data:object
        * @param1_field1 to:function(coordinates)
        * @param1_field2 from:function(coordinates)
        * @param1_field3 aspectRatio:number
        * @return object
        * @static
        * @namespace DevExpress.viz.map
        * @module viz/vector_map/projection
        * @export projection
        */
        /**
        * @name viz.mapmethods.projection.get
        * @publicName get(name)
        * @param1 name:string
        * @return object
        * @namespace DevExpress.viz.map.projection
        * @static
        */
        /**
        * @name viz.mapmethods.projection.add
        * @publicName add(name, projection)
        * @param1 name:string
        * @param2 projection:object
        * @namespace DevExpress.viz.map.projection
        * @static
        */
    }
};
