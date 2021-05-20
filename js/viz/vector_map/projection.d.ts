/**
 * @docid
 * @type object
 */
export interface VectorMapProjectionConfig {
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aspectRatio?: number;
    /**
     * @docid
     * @type_function_param1 coordinates:Array<number>
     * @type_function_return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    from?: ((coordinates: Array<number>) => Array<number>);
    /**
     * @docid
     * @type_function_param1 coordinates:Array<number>
     * @type_function_return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    to?: ((coordinates: Array<number>) => Array<number>);
}

/**
 * @docid viz.map.projection
 * @publicName projection(data)
 * @param1 data:VectorMapProjectionConfig
 * @return object
 * @static
 * @namespace DevExpress.viz.map
 * @module viz/vector_map/projection
 * @export projection
 * @prevFileNamespace DevExpress.viz
 */
export const projection: {
    /**
     * @docid viz.map.projection.add
     * @publicName add(name, projection)
     * @param1 name:string
     * @param2 projection:VectorMapProjectionConfig|object
     * @namespace DevExpress.viz.map.projection
     * @static
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    add(name: string, projection: VectorMapProjectionConfig | any): void;

    /**
     * @docid viz.map.projection.get
     * @publicName get(name)
     * @param1 name:Enums.VectorMapProjection|string
     * @return object
     * @namespace DevExpress.viz.map.projection
     * @static
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    get(name: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | string): any;

    (data: VectorMapProjectionConfig): any;
}
