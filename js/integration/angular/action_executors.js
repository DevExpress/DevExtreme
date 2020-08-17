import Action from '../../core/action';
// eslint-disable-next-line no-restricted-imports
import angular from 'angular';

if(angular) {
    Action.registerExecutor({
        'ngExpression': {
            execute: function(e) {
                if(typeof e.action === 'string') {
                    e.context.$eval(e.action);
                }
            }
        }
    });
}
