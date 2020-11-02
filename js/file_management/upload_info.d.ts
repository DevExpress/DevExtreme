/**
 * @docid
 * @type object
 * @module file_management/upload_info
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default interface UploadInfo {
    /**
     * @docid
     * @type Number
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    bytesUploaded: number;

    /**
     * @docid
     * @type Number
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkCount: number;

    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    customData: any;

    /**
     * @docid
     * @type Blob
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkBlob: Blob;

    /**
     * @docid
     * @type Number
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkIndex: number;
}
