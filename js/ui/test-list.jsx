import registerComponent from '../core/component_registrator';
import Widget from './widget/ui.widget';
import { extend } from '../core/utils/extend';
import * as Preact from 'preact';

export default class Button extends Widget {
    // _init() {
    //     super._init();
    //     document.addEventListener("pointerup", this.onPointerUp.bind(this));
    // }

    _renderContent() {
        Preact.render(viewFunction(viewModelFunction(Object.assign(
            {},
            this.option(),
            {
                selectHandler: this.selectHandler.bind(this),
                onItemMove: this.onItemMove.bind(this)
            }
        ))), this.$element().get(0), this.$element().children().length === 0 ? this.$element().get(0) : undefined);
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            //height: "400px",
            hoveredItemKey: "",
            focusStateEnabled: true,
            items: [],
            displayExpr: "value",
            keyExpr: "value",
        });
    }

    onItemMove(key) {
        this.option("hoveredItemKey", key);
    }

    selectHandler(key) {
        const index = this.option("selectedItems").findIndex(item => item[this.option("keyExpr")] === key);
        let newValue = [];
        if (index >= 0) {
            newValue = this.option("selectedItems").filter(item => item[this.option("keyExpr")] !== key);
        } else {
            newValue = this.option("selectedItems").concat(this.option("items").find(item => item[this.option("keyExpr")] === key));
        }

        this.option("selectedItems", newValue);
    }

    _optionChanged() {
        this._invalidate();
    }

    _refresh() {
        this._renderComponent();
    }
}

function viewModelFunction(model) {
    const viewModel = Object.assign({}, model, {
        style: {
            width: model.width,
            height: model.height
        }
    });

    viewModel.items = viewModel.items.map((item) => {
        const selected = (model.selectedItems || []).findIndex((selectedItem) => selectedItem[model.keyExpr] === item[model.keyExpr]) !== -1;
        return Object.assign({}, item, {
            text: item[model.displayExpr],
            key: item[model.keyExpr],
            selected,
            hovered: !selected && viewModel.hoveredItemKey === item[model.keyExpr]
        });
    });

    return viewModel;
}

function viewFunction(viewModel) {
    const items = viewModel.items.map((item) => {
        return (
            <div
                key={item.key}
                className={["dx-list-item"].concat(item.selected ? "dx-state-selected" : "", item.hovered ? "dx-state-hover" : "").join(" ")}
                onClick={viewModel.selectHandler.bind(null, item.key)}
                onPointerMove={viewModel.onItemMove.bind(null, item.key)}
            >
                {item.text}
            </div>
        );
    });

    return (
        <div
            className="dx-widget dx-list"
            style={viewModel.style}
            title={viewModel.hint}>
            <div className="dx-list-content">
                {items}
            </div>
        </div>
    );
}

registerComponent("dxTestList", Button);