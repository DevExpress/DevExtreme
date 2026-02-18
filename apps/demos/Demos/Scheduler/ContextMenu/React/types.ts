import type { SchedulerTypes } from 'devextreme-react/scheduler';
import type { ContextMenuTypes } from 'devextreme-react/context-menu';

export type Appointment = SchedulerTypes.Appointment & { roomId: number[] };

export type Resource = {
  id?: number;
  text: string;
  color?: string;
};

export type ContextMenuItem = ContextMenuTypes.Item & Partial<Resource> & { onItemClick?: (e: ContextMenuTypes.ItemClickEvent<ContextMenuItem>) => void };
