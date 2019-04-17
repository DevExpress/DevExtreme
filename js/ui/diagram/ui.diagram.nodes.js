import Component from "../../core/component";
import DataHelperMixin from "../../data_helper";

class NodesOption extends Component {
    constructor(diagramWidget) {
        super();
        this._diagramWidget = diagramWidget;
    }
    _dataSourceChangedHandler(newItems, e) {
        this._diagramWidget._nodesDataSourceChanged(newItems);
    }
}
NodesOption.include(DataHelperMixin);

module.exports = NodesOption;
