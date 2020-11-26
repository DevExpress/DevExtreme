/**
 * @docid
 * @module file_management/upload_info
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default interface UploadInfo {
    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    bytesUploaded: number;

    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkCount: number;

    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    customData: any;

    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkBlob: Blob;

    /**
     * @docid
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkIndex: number;
}
