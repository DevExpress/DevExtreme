export const makeDateFilter = (min, max, dataAccessors) => {
    const {
        startDateExpr,
        endDateExpr,
        recurrenceRuleExpr
    } = dataAccessors.expr;

    const dateFilter = [
        [
            [endDateExpr, '>=', min],
            [startDateExpr, '<', max]
        ],
        'or',
        [recurrenceRuleExpr, 'startswith', 'freq'],
        'or',
        [
            [endDateExpr, min],
            [startDateExpr, min]
        ]
    ];

    if(!recurrenceRuleExpr) {
        dateFilter.splice(1, 2);
    }

    dateFilter.name = 'dateFilter';

    return dateFilter;
};
