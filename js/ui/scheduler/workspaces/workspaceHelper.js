import { getInstanceFactory } from '../instanceFactory';

export default class WorkspaceHelper { // TODO extract by viewModels
    getCellGroups(groupIndex, groups) {
        const result = [];

        if(this.getGroupCount(groups)) {
            if(groupIndex < 0) {
                return;
            }

            const path = getInstanceFactory().resourceManager._getPathToLeaf(groupIndex, groups);

            for(let i = 0; i < groups.length; i++) {
                result.push({
                    name: groups[i].name,
                    id: path[i]
                });
            }

        }

        return result;
    }

    getGroupCount(groups) { // TODO replace with viewDataProvider method
        let result = 0;

        for(let i = 0, len = groups.length; i < len; i++) {
            if(!i) {
                result = groups[i].items.length;
            } else {
                result *= groups[i].items.length;
            }
        }

        return result;
    }
}
