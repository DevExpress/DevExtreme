import { getDiagram } from "./diagram_importer";

const ShapeCategories = {
    load: function() {
        const ShapeCategory = getDiagram().ShapeCategory;
        return [
            {
                category: ShapeCategory.General,
                title: 'General'
            },
            {
                category: ShapeCategory.Flowchart,
                title: 'Flow Chart'
            }
        ];
    }
};

module.exports = ShapeCategories;
