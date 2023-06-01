/** @public */
export type VectorMapProjection = 'equirectangular' | 'lambert' | 'mercator' | 'miller';

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
     * @public
     */
    from?: ((coordinates: Array<number>) => Array<number>);
    /**
     * @docid
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
 */
// eslint-disable-next-line @typescript-eslint/init-declarations
export const projection: {
    /**
     * @docid viz.map.projection.add
     * @publicName add(name, projectionConfig)
     * @param2 projectionConfig:VectorMapProjectionConfig|object
     * @namespace DevExpress.viz.map.projection
     * @static
     * @public
     */
    add(name: string, projectionConfig: VectorMapProjectionConfig | any): void;

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
