$(function() {
    $("#diagram").dxDiagram({
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "id",
                data: orgItems
            }),
            typeExpr: itemTypeExpr,
            textExpr: "name",
            widthExpr: itemWidthExpr,
            heightExpr: itemHeightExpr,
            textStyleExpr: itemTextStyleExpr,
            styleExpr: itemStyleExpr,
            autoLayout: {
                type: "tree",
                orientation: "horizontal"
            }
        },
        edges: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "id",
                data: orgLinks
            }),
            styleExpr: linkStyleExpr,
            fromLineEndExpr: linkFromLineEndExpr,
            toLineEndExpr: linkToLineEndExpr
        },
        toolbox: {
            groups: [ "general" ]
        }
    });

    function itemTypeExpr(obj, value) {
        if(value)
            obj.type = (value === "rectangle") ? undefined : "group";
        else
            return obj.type === "group" ? "ellipse" : "rectangle";
    }
    function itemWidthExpr(obj, value) {
        if(value)
            obj.width = value;
        else
            return obj.width || (obj.type === "group" && 1.5) || 1;
    }
    function itemHeightExpr(obj, value) {
        if(value)
            obj.height = value;
        else
            return obj.height || (obj.type === "group" && 1) || 0.75;
    }
    function itemTextStyleExpr(obj) {
        if(obj.level === "senior")
            return { "font-weight": "bold", "text-decoration": "underline" };
        return {};
    }
    function itemStyleExpr(obj) {
        let style = { "stroke": "#444444" };
        if(obj.type === "group")
            style["fill"] = "#f3f3f3";
        return style;
    }
    function linkStyleExpr(obj) {
        return { "stroke": "#444444" };
    }
    function linkFromLineEndExpr(obj) {
        return "none";
    }
    function linkToLineEndExpr(obj) {
        return "none";
    }
});
