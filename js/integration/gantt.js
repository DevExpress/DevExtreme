import { GanttView } from 'devexpress-gantt';
import { addLibrary } from '../core/registry';

GanttView && addLibrary('gantt', { GanttView });
