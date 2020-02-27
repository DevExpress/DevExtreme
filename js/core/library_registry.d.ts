/**
 * @docid addLibrary
 * @publicName addLibrary(libraryName, library)
 * @param1 libraryName:string
 * @param2 library:any
 * @namespace DevExpress
 * @module core/library_registry
 * @export addLibrary
 * @prevFileNamespace DevExpress.core
 * @public
 */
declare function addLibrary(libraryName: string, library: any): void;

/**
 * @docid getLibrary
 * @publicName getLibrary(libraryName)
 * @param1 libraryName:string
 * @return any
 * @namespace DevExpress
 * @module core/library_registry
 * @export getLibrary
 * @prevFileNamespace DevExpress.core
 * @public
 */
declare function getLibrary(libraryName: string): any;

/**
 * @docid resetLibraryRegistry
 * @publicName resetLibraryRegistry()
 * @namespace DevExpress
 * @module core/library_registry
 * @export resetLibraryRegistry
 * @prevFileNamespace DevExpress.core
 * @public
 */
declare function resetLibraryRegistry(libraryName: string): any;


export { 
    addLibrary,
    getLibrary,
    resetLibraryRegistry
};
