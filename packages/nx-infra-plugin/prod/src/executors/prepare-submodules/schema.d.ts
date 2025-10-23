import { PackParam } from '../../utils/types';
export interface PrepareSubmodulesExecutorSchema {
    distDirectory?: string;
    submoduleFolders?: PackParam[];
}
