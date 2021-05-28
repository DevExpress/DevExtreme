import $ from 'jquery';
import 'generic_light.css!';
import 'ui/gantt';

import './ganttParts/markup.tests.js';
import './ganttParts/options.tests.js';
import './ganttParts/events.tests.js';
import './ganttParts/actions.tests.js';
import './ganttParts/dialogs.tests.js';
import './ganttParts/toolbar.tests.js';
import './ganttParts/dataSource.tests.js';
import './ganttParts/clientSideEvents.tests.js';
import './ganttParts/editApi.tests.js';
import './ganttParts/mappingsConvert.tests.js';
import './ganttParts/contextMenu.tests.js';
import './ganttParts/stripLines.tests.js';
import './ganttParts/parentAutoCalculation.tests.js';
import './ganttParts/editDataSources.tests.js';
import './ganttParts/firstDayOfWeek.tests.js';
import './ganttParts/tooltipTemplate.tests.js';
import './ganttParts/taskTemplate.tests.js';
import './ganttParts/rootValue.tests.js';
import './ganttParts/fullScreenMode.tests.js';
import './ganttParts/repaint.tests.js';
import './ganttParts/validateDependencies.tests.js';


QUnit.testStart(() => {
    const markup = '<div id="gantt"></div>';
    $('#qunit-fixture').html(markup);
});
