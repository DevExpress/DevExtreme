const dateUtils = require('../../core/utils/date');
const days = [0, 1, 2, 3, 4, 5, 6];

function getWeekendDays(workdays) {
    return days.filter(function(day) {
        return !workdays.some(function(workDay) {
            return workDay === day;
        });
    });
}

function getNextDayIndex(dayIndex) {
    return (dayIndex + 1) % 7;
}

function dayBetweenWeekend(weekend, day) {
    let start = weekend.start;
    const end = weekend.end;

    while(start !== end) {
        if(start === day) {
            return true;
        }
        start = getNextDayIndex(start);
    }

    return false;
}

function getDaysDistance(day, end) {
    let length = 0;

    while(day !== end) {
        day = getNextDayIndex(day);
        length++;
    }

    return length;
}

function separateBreak(scaleBreak, day) {
    const result = [];
    const dayEnd = new Date(day);

    dayEnd.setDate(day.getDate() + 1);

    if(day > scaleBreak.from) {
        result.push({
            from: scaleBreak.from,
            to: day
        });
    }

    if(dayEnd < scaleBreak.to) {
        result.push({
            from: dayEnd,
            to: scaleBreak.to
        });
    }

    return result;
}

function getWeekEndDayIndices(workDays) {
    const indices = getWeekendDays(workDays);

    if(indices.length < 7) {
        while(getNextDayIndex(indices[indices.length - 1]) === indices[0]) {
            indices.unshift(indices.pop());
        }
    }

    return indices;
}

function generateDateBreaksForWeekend(min, max, weekendDayIndices) {
    let day = min.getDate();
    const breaks = [];
    const weekends = weekendDayIndices.reduce(function(obj, day) {
        let currentWeekEnd = obj[1];
        if(currentWeekEnd.start === undefined) {
            currentWeekEnd = {
                start: day,
                end: getNextDayIndex(day)
            };
            obj[0].push(currentWeekEnd);
            return [obj[0], currentWeekEnd];
        } else if(currentWeekEnd.end === day) {
            currentWeekEnd.end = getNextDayIndex(day);
            return obj;
        }
        currentWeekEnd = {
            start: day,
            end: getNextDayIndex(day)
        };
        obj[0].push(currentWeekEnd);
        return [obj[0], currentWeekEnd];

    }, [[], {}]);

    weekends[0].forEach(function(weekend) {
        let currentDate = new Date(min);
        currentDate = dateUtils.trimTime(currentDate);

        while(currentDate < max) {
            day = currentDate.getDay();

            const date = currentDate.getDate();

            if(dayBetweenWeekend(weekend, day)) {
                const from = new Date(currentDate);
                var to;

                currentDate.setDate(date + getDaysDistance(day, weekend.end));

                to = new Date(currentDate);

                breaks.push({
                    from: from,
                    to: to
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return breaks;
}

function excludeWorkDaysFromWeekEndBreaks(breaks, exactWorkDays) {
    const result = breaks.slice();
    let i;
    const processWorkDay = function(workday) {
        workday = dateUtils.trimTime(new Date(workday));
        if(result[i].from <= workday && result[i].to > workday) {
            const separatedBreak = separateBreak(result[i], workday);
            if(separatedBreak.length === 2) {
                result.splice(i, 1, separatedBreak[0], separatedBreak[1]);
            } else if(separatedBreak.length === 1) {
                result.splice(i, 1, separatedBreak[0]);
            } else {
                result.splice(i, 1);
            }
        }
    };

    for(i = 0; i < result.length; i++) {
        exactWorkDays.forEach(processWorkDay);
    }

    return result;
}

function generateBreaksForHolidays(min, max, holidays, weekendDayIndices) {
    let day;
    const dayInWeekend = function(dayIndex) {
        return dayIndex === day;
    };
    const adjustedMin = dateUtils.trimTime(min);
    const adjustedMax = dateUtils.trimTime(max);

    adjustedMax.setDate(max.getDate() + 1);

    return holidays.reduce(function(breaks, holiday) {
        let holidayStart;
        let holidayEnd;

        holiday = new Date(holiday);
        day = holiday.getDay();

        if(!weekendDayIndices.some(dayInWeekend) && holiday >= adjustedMin && holiday <= adjustedMax) {
            holidayStart = dateUtils.trimTime(holiday);
            holidayEnd = new Date(holidayStart);
            holidayEnd.setDate(holidayStart.getDate() + 1);

            breaks.push({
                from: holidayStart,
                to: holidayEnd
            });
        }
        return breaks;
    }, []);
}

function calculateGaps(breaks) {
    return breaks.map(function(b) {
        return {
            from: b.from,
            to: b.to,
            gapSize: dateUtils.convertMillisecondsToDateUnits(b.to - b.from)
        };
    });
}

exports.generateDateBreaks = function(min, max, workWeek, singleWorkdays, holidays) {
    const weekendDayIndices = getWeekEndDayIndices(workWeek);
    const breaks = generateDateBreaksForWeekend(min, max, weekendDayIndices);

    breaks.push.apply(breaks, generateBreaksForHolidays(min, max, holidays || [], weekendDayIndices));

    return calculateGaps(excludeWorkDaysFromWeekEndBreaks(breaks, singleWorkdays || []));
};
