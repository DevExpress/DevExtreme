export class GanttDataChangesProcessingHelper {
  _waitingForGanttViewReady: boolean;

  _waitingForTreeListReady: boolean;

  _completionActions: (() => void)[];

  constructor() {
    this._waitingForGanttViewReady = false;
    this._waitingForTreeListReady = false;
    this._completionActions = [];
  }

  onGanttViewReady(): void {
    this._stopWaitForGanttViewReady();
    this.executeActionsIfPossible();
  }

  onTreeListReady(): void {
    this._stopWaitForTreeListReady();
    this.executeActionsIfPossible();
  }

  addCompletionAction(
    action: () => void,
    waitGanttViewReady: boolean,
    waitTreeListReady: boolean,
  ): void {
    if (action) {
      if (waitGanttViewReady) {
        this._startWaitForGanttViewReady();
      }
      if (waitTreeListReady) {
        this._startWaitForTreeListReady();
      }
      this._completionActions.push(action);
    }
  }

  executeActionsIfPossible(): void {
    if (this._canExecuteActions()) {
      this._completionActions.forEach((act) => act());
      this._completionActions = [];
    }
  }

  _startWaitForGanttViewReady(): void {
    this._waitingForGanttViewReady = true;
  }

  _stopWaitForGanttViewReady(): void {
    this._waitingForGanttViewReady = false;
  }

  _startWaitForTreeListReady(): void {
    this._waitingForTreeListReady = true;
  }

  _stopWaitForTreeListReady(): void {
    this._waitingForTreeListReady = false;
  }

  _canExecuteActions(): boolean {
    return !(this._waitingForGanttViewReady || this._waitingForTreeListReady);
  }
}
