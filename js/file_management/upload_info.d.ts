/**
 * @docid UploadInfo
 * @module file_management/upload_info
 * @namespace DevExpress.fileManagement
 * @export default
 * @prevFileNamespace DevExpress.fileManagement
 * @public
 */
export default interface UploadInfo {
    /**
     * @docid UploadInfo.bytesUploaded
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    bytesUploaded: number;

    /**
     * @docid UploadInfo.chunkCount
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkCount: number;

    /**
     * @docid UploadInfo.customData
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    customData: any;

    /**
     * @docid UploadInfo.chunkBlob
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkBlob: Blob;

    /**
     * @docid UploadInfo.chunkIndex
     * @prevFileNamespace DevExpress.fileManagement
     * @public
     */
    chunkIndex: number;
}
