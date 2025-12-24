import React, { useCallback, useState } from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import type { FileUploaderTypes } from 'devextreme-react/file-uploader';
import type { Chunk } from './types.ts';

function getValueInKb(value: number): string {
  return `${(value / 1024).toFixed(0)}kb`;
}

export default function App() {
  const [chunks, setChunks] = useState<Chunk[]>([]);

  const onUploadProgress = useCallback((e: FileUploaderTypes.ProgressEvent): void => {
    const chunk = {
      segmentSize: e.segmentSize,
      bytesLoaded: e.bytesLoaded,
      bytesTotal: e.bytesTotal,
    };
    setChunks([...chunks, chunk]);
  }, [chunks]);

  const onUploadStarted = useCallback(() => {
    setChunks([]);
  }, []);

  return (
    <>
      <FileUploader
        name="file"
        accept="image/*"
        uploadUrl="https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/ChunkUpload"
        chunkSize={200000}
        onUploadStarted={onUploadStarted}
        onProgress={onUploadProgress}
      />
      <span className="note">Allowed file extensions: <span>.jpg, .jpeg, .gif, .png</span>.</span>
      <span className="note">Maximum file size: <span>4 MB.</span></span>
      <div className="chunk-panel">
        {
          chunks.map((chunk: Chunk, index: number) => (
            <div key={index}>
              <span>Chunk size:</span>
              <span className="segment-size">{getValueInKb(chunk.segmentSize)}</span>
              <span>, Uploaded:</span>
              <span className="loaded-size">{getValueInKb(chunk.bytesLoaded)}</span>
              <span>/</span>
              <span className="total-size">{getValueInKb(chunk.bytesTotal)}</span>
            </div>
          ))
        }
      </div>
    </>
  );
}
