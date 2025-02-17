/**
 * An object that provides information about the file upload session.
 */
export default interface UploadInfo {
    /**
     * The number of bytes that is uploaded to the server.
     */
    bytesUploaded: number;

    /**
     * The number of uploaded chunks and chunks that are to be uploaded.
     */
    chunkCount: number;

    /**
     * Custom information that you can pass during file upload. For instance, you can specify a custom file ID when the first part of a file is being uploaded.
     */
    customData: any;

    /**
     * The binary content of the uploading chunk.
     */
    chunkBlob: Blob;

    /**
     * The index of the uploading chunk.
     */
    chunkIndex: number;
}
