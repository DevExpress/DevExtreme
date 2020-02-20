import * as Gantt from 'devexpress-gantt';
import { addLibrary } from '../core/registry';

Gantt?.default && addLibrary('gantt', Gantt);
