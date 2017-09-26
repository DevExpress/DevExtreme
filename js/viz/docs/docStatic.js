/**
* @name viz
* @publicName viz
*/
var staticMethods = {
    /**
    * @name vizmethods_currentTheme
    * @publicName currentTheme(theme)
    * @param1 theme:string
    * @module viz/themes
    * @export currentTheme
    */
    /**
    * @name vizmethods_currentTheme
    * @publicName currentTheme(platform, colorScheme)
    * @param1 platform:string
    * @param2 colorScheme:string
    * @module viz/themes
    * @export currentTheme
    */
    currentTheme: function() { },
    /**
    * @name vizmethods_registerTheme
    * @publicName registerTheme(customTheme, baseTheme)
    * @param1 customTheme:object
    * @param2 baseTheme:string
    * @module viz/themes
    * @export registerTheme
    */
    registerTheme: function() { },
    /**
    * @name vizmethods_refreshTheme
    * @publicName refreshTheme()
    * @module viz/themes
    * @export refreshTheme
    */
    refreshTheme: function() { },
    /**
    * @name vizmethods_exportFromMarkup
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
    * @module viz/export
    * @export exportFromMarkup
    */
    exportFromMarkup: function() { },
    /**
    * @name vizmethods_getMarkup
    * @publicName getMarkup(widgetInstances)
    * @param1 widgetInstances:array
    * @return string
    * @module viz/export
    * @export getMarkup
    */
    getMarkup: function() { },
    /**
    * @name vizmethods_currentPalette
    * @publicName currentPalette(paletteName)
    * @param1 paletteName:string
    * @module viz/palette
    * @export currentPalette
    */
    currentPalette: function() { },
    /**
    * @name vizmethods_getPalette
    * @publicName getPalette(paletteName)
    * @param1 paletteName:string
    * @return object
    * @module viz/palette
    * @export getPalette
    */
    getPalette: function() { },
    /**
    * @name vizmethods_registerPalette
    * @publicName registerPalette(paletteName, palette)
    * @param1 paletteName:string
    * @param2 palette:object
    * @module viz/palette
    * @export registerPalette
    */
    registerPalette: function() { },
    /**
    * @name vizmethods_refreshPaths
    * @publicName refreshPaths()
    * @module viz/utils
    * @export refreshPaths
    */
    refreshPaths: function() { },
    /**
    * @name viz_core
    * @publicName core
    * @deprecated viz
    * @extend_doc
    */
    core: {
        /**
        * @name viz_coremethods_currentTheme
        * @publicName currentTheme(theme)
        * @deprecated vizmethods_currentTheme
        * @extend_doc
        */
        /**
        * @name viz_coremethods_currentTheme
        * @publicName currentTheme(platform, colorScheme)
        * @deprecated vizmethods_currentTheme
        * @extend_doc
        */
        currentTheme: function() { },
        /**
        * @name viz_coremethods_registerTheme
        * @publicName registerTheme(customTheme, baseTheme)
        * @deprecated vizmethods_registerTheme
        * @extend_doc
        */
        registerTheme: function() { },
        /**
        * @name viz_coremethods_currentPalette
        * @publicName currentPalette(paletteName)
        * @deprecated vizmethods_currentPalette
        * @extend_doc
        */
        currentPalette: function() { },
        /**
        * @name viz_coremethods_getPalette
        * @publicName getPalette(paletteName)
        * @deprecated vizmethods_getPalette
        * @extend_doc
        */
        getPalette: function() { },
        /**
        * @name viz_coremethods_registerPalette
        * @publicName registerPalette(paletteName, palette)
        * @deprecated vizmethods_registerPalette
        * @extend_doc
        */
        registerPalette: function() { }
    },
    /**
    * @name viz_map
    * @publicName map
    */
    map: {
        /**
        * @name viz_mapmethods_projection
        * @publicName projection(data)
        * @return object
        * @param1 data:object
        * @param1_field1 to:function(coordinates)
        * @param1_field2 from:function(coordinates)
        * @param1_field3 aspectRatio:number
        * @module viz/vector_map/projection
        * @export projection
        */
        /**
        * @name viz_mapmethods_projection_get
        * @publicName get(name)
        * @return object
        * @param1 name:string
        */
        /**
        * @name viz_mapmethods_projection_add
        * @publicName add(name, projection)
        * @param1 name:string
        * @param2 projection:object
        */
    }
};
