// import List from '../artifacts/transpiled/ui/list';
// new List(document.getElementById('el'), {
//     dataSource: [ 1, 2, 3],
//     allowItemDeleting: true
// });

import ListBase from '../artifacts/transpiled/ui/list/list_base';
import '../artifacts/transpiled/ui/list/list_edit';

new ListBase(document.getElementById('el'), {
    dataSource: [ 1, 2, 3],
    allowItemDeleting: true
});
