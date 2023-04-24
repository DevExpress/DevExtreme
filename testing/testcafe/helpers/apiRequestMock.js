import { RequestMock } from 'testcafe';
import asyncForEach from './asyncForEach';
import { extend } from '../../../js/core/utils/extend';
import ArrayStore from '../../../js/data/array_store';
import storeHelper from '../../../js/data/store_helper';
const queryByOptions = storeHelper.queryByOptions;
import { URL } from 'url';

const summarize = async(query, summaries) => {
    const result = [];
    await asyncForEach(summaries, async(summary) => {
        result.push(await query[summary.summaryType](summary.selector));
    });
    return result;
};

const MockStore = ArrayStore.inherit({
    _loadImpl: function(options) {
        const query = this.createQuery();

        return queryByOptions(query, options).enumerate().then(async(data) => {
            let result = { data };

            if(options.requireTotalCount) {
                result.totalCount = await queryByOptions(query, options, true).count();
            }

            if(options.requireGroupCount) {
                result.groupCount = await queryByOptions(query, {
                    filter: options.filter,
                    group: options.group
                }).count();
            }

            if(options.totalSummary) {
                result = extend({}, result, {
                    summary: await summarize(queryByOptions(query, options, true), options.totalSummary)
                });
            }

            if(options.group) {
                let level = 0;
                const postProcessGroup = async(groupedData) => {
                    level += 1;
                    const result = [];
                    await asyncForEach(groupedData, async(groupItem) => {
                        if(options.groupSummary) {
                            const filter = [options.group[level - 1].selector, groupItem.key];
                            groupItem = extend({}, groupItem, {
                                summary: await summarize(queryByOptions(query, { filter }), options.groupSummary)
                            });
                        }

                        if(options.group.length > 1 && !(options.requireGroupCount || options.group.length === level)) {
                            result.push(extend({}, groupItem, {
                                items: await postProcessGroup(groupItem.items)
                            }));
                        } else {
                            result.push(extend({}, groupItem, {
                                items: null,
                                count: groupItem.items.length
                            }));
                        }
                    });
                    return result;
                };

                result.data = await postProcessGroup(result.data);
            }

            return result;
        });
    },
});

export default function createRequestMock(data, key = 'ID') {
    const store = new MockStore({ key, data });

    return RequestMock()
        .onRequestTo(/\/api\/data/)
        .respond(async(request, result) => {
            const url = new URL(request.url);
            const params = Object.fromEntries(url.searchParams);
            const loadOptions = {};
            Object.keys(params).forEach(key => {
                loadOptions[key] = JSON.parse(params[key]);
            });
            const responseData = await store.load(loadOptions);

            result.setBody(responseData);
            result.headers['access-control-allow-origin'] = '*';
        });
}
