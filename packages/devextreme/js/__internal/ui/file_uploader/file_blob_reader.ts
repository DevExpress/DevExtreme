import type { FileBlobChunk } from '@ts/ui/file_uploader/file_uploader.types';

export class FileBlobReader {
  file?: File | null;

  chunkSize: number;

  index: number;

  constructor(file: File, chunkSize: number) {
    this.file = file;
    this.chunkSize = chunkSize;
    this.index = 0;
  }

  read(): FileBlobChunk | null {
    if (!this.file) {
      return null;
    }
    const result = this.createBlobResult(this.file, this.index, this.chunkSize);
    if (result.isCompleted) {
      this.file = null;
    }

    this.index += 1;

    return result;
  }

  createBlobResult(file: File, index: number, chunkSize: number): FileBlobChunk {
    const currentPosition = index * chunkSize;
    return {
      blob: this.sliceFile(file, currentPosition, chunkSize),
      index,
      isCompleted: currentPosition + chunkSize >= file.size,
    };
  }

  sliceFile(file: File, startPos: number, length: number): Blob | null {
    if (file.slice) {
      return file.slice(startPos, startPos + length);
    }
    if ('webkitSlice' in file && typeof file.webkitSlice === 'function') {
      return file.webkitSlice(startPos, startPos + length) as Blob;
    }

    return null;
  }
}
