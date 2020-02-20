import * as Diagram from 'devexpress-diagram';
import { addLibrary } from '../core/registry';

Diagram?.default && addLibrary('diagram', Diagram);
