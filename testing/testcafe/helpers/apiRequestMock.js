import { RequestMock } from 'testcafe';
import arrayQuery from '../../../js/data/query';
import { normalizeSortingInfo } from '../../../js/data/utils';
import { extend } from '../../../js/core/utils/extend';
import url from 'url';

export default function createRequestMock(data) {
    const processData = async(data, options) => {
        const result = {};

        let query = arrayQuery(data);
        options = options || {};

        const filter = options.filter;
        const requireTotalCount = options.requireTotalCount;

        if(filter) {
            query = query.filter(filter);
        }

        if(requireTotalCount) {
            result.totalCount = await query.count();
        }

        let sort = options.sort;
        const select = options.select;
        let group = options.group;
        const skip = options.skip;
        const take = options.take;
        const totalSummary = options.totalSummary ?? [];
        const groupSummary = options.groupSummary ?? [];
        const requireGroupCount = options.requireGroupCount;

        if(totalSummary.length > 0) {
            result.summary = [];
            await Promise.all(totalSummary.map(async(s) => {
                result.summary.push(await query[s.summaryType](s.selector));
            }));
        }

        if(group) {
            group = normalizeSortingInfo(group);
            group.keepInitialKeyOrder = !!options.group.keepInitialKeyOrder;
        }

        if(sort || group) {
            sort = normalizeSortingInfo(sort || []);
            if(group && !group.keepInitialKeyOrder) {
                const filteredGroup = [];
                group.forEach((g) => {
                    const collision = sort.filter((s) => {
                        g.selector === s.selector;
                    });

                    if(collision.length < 1) {
                        filteredGroup.push(g);
                    }
                });
                sort = filteredGroup.concat(sort);
            }
            sort.forEach((sort, index) => {
                query = query[index ? 'thenBy' : 'sortBy'](sort.selector, sort.desc, sort.compare);
            });
        }

        if(select) {
            query = query.select(select);
        }

        if(group) {
            const multiLevelGroup = async(query, groupInfo, groupSummary) => {
                query = query.groupBy(groupInfo[0].selector);

                if(groupSummary.length > 0 || requireGroupCount) {
                    const groupedData = await Promise.all(query.toArray().map(async(g) => {
                        const groupQuery = arrayQuery([...g.items]);
                        const summary = [];
                        await Promise.all(groupSummary.map(async(s) => {
                            summary.push(await groupQuery[s.summaryType](s.selector));
                        }));
                        return extend({}, g, {
                            count: groupInfo.length > 1 ? undefined : g.items.length,
                            items: groupInfo.length > 1 ? g.items : null,
                            summary: summary.length > 1 ? summary : undefined
                        });
                    }));
                    query = arrayQuery(groupedData);
                }

                if(groupInfo.length > 1) {
                    query = query.select(function(g) {
                        return extend({}, g, {
                            items: multiLevelGroup(arrayQuery(g.items), groupInfo.slice(1), groupSummary).toArray()
                        });
                    });
                }

                return query;
            };

            query = await multiLevelGroup(query, group, groupSummary);
        }

        if(requireGroupCount) {
            result.groupCount = await query.count();
        }

        if(take || skip) {
            query = query.slice(skip || 0, take);
        }

        result.data = query.toArray();

        return result;
    };

    return RequestMock()
        .onRequestTo(/\/api\/data/)
        .respond(async(request, result) => {
            const parsedUrl = url.parse(request.url, true);
            const loadOptions = {};
            Object.keys(parsedUrl.query).forEach(key => {
                loadOptions[key] = JSON.parse(parsedUrl.query[key]);
            });
            const responseData = await processData(data, loadOptions);

            result.setBody(responseData);
            result.headers['access-control-allow-origin'] = '*';
        });
}
