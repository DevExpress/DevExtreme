export default function executeAction(action, args) {
    return typeof action === 'function' ? action(args) : action.execute(args);
}
