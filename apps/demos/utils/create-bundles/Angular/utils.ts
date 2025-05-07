import { join } from 'path';
import { getDestinationPathByDemo } from '../helper';
import { Demo } from '../helper/types';

export const getProjectNameByDemo = (Demo: Demo) => (`${Demo.Widget.toLowerCase()}-${Demo.Name.toLowerCase()}`);
export const getIndexHtmlPath = (Demo: Demo) => (join(getDestinationPathByDemo(Demo, 'Angular'), '..', 'AngularTemplates'));
