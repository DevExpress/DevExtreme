import Component from "../../core/component";
import DataHelperMixin from "../../data_helper";

class EdgesOptions extends Component {
    constructor(diagramWidget) {
        super();
        this._diagramWidget = diagramWidget;
    }
    _dataSourceChangedHandler(newItems, e) {
        this._diagramWidget._edgesDataSourceChanged(newItems);
    }
}
EdgesOptions.include(DataHelperMixin);

module.exports = EdgesOptions;
