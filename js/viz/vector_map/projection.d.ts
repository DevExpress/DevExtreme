import {
    VectorMapProjection,
} from '../../docEnums';

/**
 * @docid
 * @namespace DevExpress.viz
 * @type object
 */
export interface VectorMapProjectionConfig {
    /**
     * @docid
     * @default 1
     * @public
     */
    aspectRatio?: number;
    /**
     * @docid
     * @type_function_param1 coordinates:Array<number>
     * @type_function_return Array<number>
     * @public
     */
    from?: ((coordinates: Array<number>) => Array<number>);
    /**
     * @docid
     * @type_function_param1 coordinates:Array<number>
     * @type_function_return Array<number>
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
 */
// eslint-disable-next-line @typescript-eslint/init-declarations
export const projection: {
    /**
     * @docid viz.map.projection.add
     * @publicName add(name, projection)
     * @param1 name:string
     * @param2 projection:VectorMapProjectionConfig|object
     * @namespace DevExpress.viz.map.projection
     * @static
     * @public
     */
    add(name: string, projection: VectorMapProjectionConfig | any): void;

    /**
     * @docid viz.map.projection.get
     * @publicName get(name)
     * @return object
     * @namespace DevExpress.viz.map.projection
     * @static
     * @hidden
     */
    get(name: VectorMapProjection | string): any;

    (data: VectorMapProjectionConfig): any;
};
