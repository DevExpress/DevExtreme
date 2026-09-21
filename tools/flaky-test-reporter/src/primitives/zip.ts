import zlib from 'node:zlib';

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const EOCD_MIN_SIZE = 22;

const STORED = 0;
const DEFLATED = 8;

function findEndOfCentralDirectory(zip: Buffer): number {
  for (let offset = zip.length - EOCD_MIN_SIZE; offset >= 0; offset -= 1) {
    if (zip.readUInt32LE(offset) === EOCD_SIGNATURE) {
      return offset;
    }
  }
  return -1;
}

/**
 * Reads a single file out of a ZIP held in memory. Artifact ZIPs are a handful of kilobytes,
 * so a dependency-free central-directory walk beats pulling in an archive library.
 *
 * Returns `null` when the archive does not hold the file. Throws when the buffer is not a
 * usable ZIP at all — a truncated download says nothing about the file's existence and must
 * be distinguishable by the caller.
 */
export function extractFileFromZip(zip: Buffer, filename: string): Buffer | null {
  const eocdOffset = findEndOfCentralDirectory(zip);
  if (eocdOffset === -1) {
    throw new Error('invalid ZIP: end of central directory not found');
  }

  const centralDirSize = zip.readUInt32LE(eocdOffset + 12);
  const centralDirOffset = zip.readUInt32LE(eocdOffset + 16);
  const centralDirEnd = centralDirOffset + centralDirSize;

  // Without this the walk below simply finds nothing and the caller reads a truncated
  // download as "the archive does not hold the file".
  if (centralDirEnd > zip.length) {
    throw new Error('invalid ZIP: central directory runs past the end of the buffer');
  }

  let offset = centralDirOffset;
  while (offset < centralDirEnd && offset + 46 <= zip.length) {
    if (zip.readUInt32LE(offset) !== CENTRAL_FILE_HEADER_SIGNATURE) {
      break;
    }

    const compressionMethod = zip.readUInt16LE(offset + 10);
    const compressedSize = zip.readUInt32LE(offset + 20);
    const fileNameLength = zip.readUInt16LE(offset + 28);
    const extraFieldLength = zip.readUInt16LE(offset + 30);
    const fileCommentLength = zip.readUInt16LE(offset + 32);
    const localHeaderOffset = zip.readUInt32LE(offset + 42);
    const entryName = zip.subarray(offset + 46, offset + 46 + fileNameLength).toString('utf-8');

    if (entryName === filename) {
      // The central directory records the entry's metadata, but the bytes live after the
      // local header, whose variable-length fields can differ from the central copy.
      const localFileNameLength = zip.readUInt16LE(localHeaderOffset + 26);
      const localExtraFieldLength = zip.readUInt16LE(localHeaderOffset + 28);
      const dataOffset = localHeaderOffset + 30 + localFileNameLength + localExtraFieldLength;
      const data = zip.subarray(dataOffset, dataOffset + compressedSize);

      if (compressionMethod === STORED) return Buffer.from(data);
      if (compressionMethod === DEFLATED) return zlib.inflateRawSync(data);
      throw new Error(`unsupported ZIP compression method: ${compressionMethod}`);
    }

    offset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
  }

  return null;
}
