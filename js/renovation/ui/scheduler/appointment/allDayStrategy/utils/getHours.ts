function getHours(date: Date, isSchedulerTimezoneSet: boolean): number {
  return isSchedulerTimezoneSet ? date.getUTCHours() : date.getHours();
}

export default getHours;
