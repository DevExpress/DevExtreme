type KeySelector<T> = string | ((source: T) => string);

type BaseGroupDescriptor<T> = {
	selector: KeySelector<T>;	
};

/**
 * @docid
 * @public
 */
export type GroupDescriptor<T> = KeySelector<T> | BaseGroupDescriptor<T> & {
    desc?: boolean;
};

/**
 * @docid
 * @public
 */
export type SortDescriptor<T> = GroupDescriptor<T>;

/**
 * @docid
 * @public
 */
export type SelectDescriptor<T> = KeySelector<T>;
/**
 * @docid
 * @public
 */
 export type FilterDescriptor = any;

 /** 
 * @docid
 * @public
 */
type SummaryDescriptor<T> = KeySelector<T> | BaseGroupDescriptor<T> & {
    summaryType?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}
