export class GanttDataChangesProcessingHelper {
    constructor() {
        this._waitingForGanttViewReady = false;
        this._waitingForTreeListReady = false;
        this._completionActions = [];
    }
    onGanttViewReady() {
        this._stopWaitForGanttViewReady();
        this.executeActionsIfPossible();
    }
    onTreeListReady() {
        this._stopWaitForTreeListReady();
        this.executeActionsIfPossible();
    }
    addCompletionAction(action, waitGanttViewReady, waitTreeListReady) {
        if(action) {
            if(waitGanttViewReady) { this._startWaitForGanttViewReady(); }
            if(waitTreeListReady) { this._startWaitForTreeListReady(); }
            this._completionActions.push(action);
        }
    }
    executeActionsIfPossible() {
        if(this._canExecuteActions()) {
            this._completionActions.forEach(act => act());
            this._completionActions = [];
        }
    }
    _startWaitForGanttViewReady() {
        this._waitingForGanttViewReady = true;
    }
    _stopWaitForGanttViewReady() {
        this._waitingForGanttViewReady = false;
    }
    _startWaitForTreeListReady() {
        this._waitingForTreeListReady = true;
    }
    _stopWaitForTreeListReady() {
        this._waitingForTreeListReady = false;
    }
    _canExecuteActions() {
        return !(this._waitingForGanttViewReady || this._waitingForTreeListReady);
    }
}
