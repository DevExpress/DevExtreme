import { DataSourceLike } from '../../data/data_source';

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type DataControllerProperties = {
  /**
   * @docid
   * @default undefined
   * @type string | Array<any> | Store | DataSource | DataSourceOptions
   * @public
   */
  dataSource?: DataSourceLike<any, any>;
  /**
   * @docid
   * @public
   */
  paging?: {
      /**
       * @docid
       * @public
       */
      pageSize?: number;
      /**
       * @docid
       * @public
       */
      pageIndex?: number;
  };
};
