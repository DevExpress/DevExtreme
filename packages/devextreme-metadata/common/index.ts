import {
  AddMutation,
  DataType,
  DataTypes,
  Mutation,
  RemoveMutation,
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

export function removeMembers(uidPattern: RegExp): RemoveMutation {
  return { kind: 'remove', uid: uidPattern };
}

export function addMember({ uid, name, parent, types }: Omit<AddMutation, 'kind'>): AddMutation {
  return { kind: 'add', uid, name, parent, types };
}

export function replaceTypes({ uid, types }: { uid: string; types: DataType[] }): Mutation[] {
  return [
    { kind: 'remove', uid: new RegExp(uid) },
    { kind: 'add', uid, types },
  ];
}

export const types = {
  array(...itemTypes: DataTypes.Array['itemTypes']): DataTypes.Array {
    return { kind: 'array', itemTypes };
  },

  uidRef(uid: string): DataTypes.UidRef {
    return { kind: 'uidRef', uid };
  },

  object: { kind: 'object' } as DataTypes.Object,
};
