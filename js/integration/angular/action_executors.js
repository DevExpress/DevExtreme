import Action from '../../core/action';

Action.registerExecutor({
    'ngExpression': {
        execute: function(e) {
            if(typeof e.action === 'string') {
                e.context.$eval(e.action);
            }
        }
    }
});
