import Scheduler from '../../../model/scheduler';
import { TReduce } from './types';

export const checkRegularAppointment = async (
  t: TestController,
  scheduler: Scheduler,
  title: string,
  index: number,
  reduceType: TReduce | undefined,
  height: number,
): Promise<void> => {
  const appointment = scheduler.getAppointment(title, index);
  const isReduced = reduceType !== undefined;

  await t
    .expect(appointment.reducedIcon.exists)
    .eql(isReduced)
    .expect(appointment.isReducedHead)
    .eql(reduceType === 'head')
    .expect(appointment.isReducedBody)
    .eql(reduceType === 'body')
    .expect(appointment.isReducedTail)
    .eql(reduceType === 'tail')
    .expect(appointment.element.clientHeight)
    .within(height - 1, height + 1);
};
