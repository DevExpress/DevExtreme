import dateUtils from '../../../../../core/utils/date';

const getDatesWithoutTime = (min: Date, max: Date): [Date, Date] => {
  const newMin = dateUtils.trimTime(min) as Date;
  const newMax = dateUtils.trimTime(max) as Date;

  newMax.setDate(newMax.getDate() + 1);

  return [newMin, newMax];
};

export default getDatesWithoutTime;
