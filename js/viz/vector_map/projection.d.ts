export interface VectorMapProjectionConfig {
    /**
     * @docid VectorMapProjectionConfig.aspectRatio
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aspectRatio?: number;
    /**
     * @docid VectorMapProjectionConfig.from
     * @type function
     * @type_function_param1 coordinates:Array<number>
     * @type_function_return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    from?: ((coordinates: Array<number>) => Array<number>);
    /**
     * @docid VectorMapProjectionConfig.to
     * @type function
     * @type_function_param1 coordinates:Array<number>
     * @type_function_return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    to?: ((coordinates: Array<number>) => Array<number>);
}


/**
 * @docid viz.mapmethods.projection
 * @publicName projection(data)
 * @param1 data:VectorMapProjectionConfig
 * @return object
 * @static
 * @namespace DevExpress.viz.map
 * @module viz/vector_map/projection
 * @export projection
 * @hidden
 * @prevFileNamespace DevExpress.viz
 */
export function projection(data: VectorMapProjectionConfig): any;

/**
 * @docid viz.map.projectionmethods.add
 * @publicName add(name, projection)
 * @param1 name:string
 * @param2 projection:VectorMapProjectionConfig|object
 * @namespace DevExpress.viz.map.projection
 * @static
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export function add(name: string, projection: VectorMapProjectionConfig | any): void;

/**
 * @docid viz.map.projectionmethods.get
 * @publicName get(name)
 * @param1 name:Enums.VectorMapProjection|string
 * @return object
 * @namespace DevExpress.viz.map.projection
 * @static
 * @hidden
 * @prevFileNamespace DevExpress.viz
 */
export function get(name: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | string): any;
