import {
  DataTypes,
} from 'devextreme-internal-tools/metadata';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PATHS } from './paths';

export function cleanArtifacts(...files: string[]) {
  console.log(`Cleaning the artifacts dir: ${PATHS.artifactsDir}`);
  for (const file of files) {
    const path = join(PATHS.artifactsDir, file);
    if (existsSync(path)) {
      unlinkSync(path);
      console.log(`${file} removed`);
    }
  }
}

export const types = {
  array(...itemTypes: DataTypes.Array['itemTypes']): DataTypes.Array {
    return { kind: 'array', itemTypes };
  },

  uidRef(uid: string, ambient: boolean = false): DataTypes.UidRef {
    return { kind: 'uidRef', uid, ambient };
  },

  object: { kind: 'object' } as DataTypes.Object,
};
