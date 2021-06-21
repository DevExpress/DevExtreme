/**
 * @docid
 * @public
 */
export type GroupDescriptor = Function | string | {
	[prop in 'getter' | 'field' | 'selector']?: Function | string;	
};

/**
 * @docid
 * @public
 */
export type SortDescriptor = GroupDescriptor | {
    [prop in 'desc' | 'dir']?: boolean | 'ascending' | 'descending';
};

/**
 * @docid
 * @public
 */
export type SelectDescriptor = Function | string;
/**
 * @docid
 * @public
 */
 export type FilterDescriptor = any;
