const getWednesdayThisWeek = () => {
    const WEDNESDAY_INDEX = 3;

    const date = new Date();

    const currentDay = date.getDay();
    const distance = WEDNESDAY_INDEX - currentDay;
    date.setDate(date.getDate() + distance);

    date.setHours(11, 35, 0, 0);

    return date;
}

MockDate.set(getWednesdayThisWeek());