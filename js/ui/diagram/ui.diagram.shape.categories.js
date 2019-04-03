import { getDiagram } from "./diagram_importer";

const ShapeCategory = getDiagram().ShapeCategory;

const ShapeCategories = [
    {
        category: ShapeCategory.General,
        title: 'General'
    },
    {
        category: ShapeCategory.Flowchart,
        title: 'Flow Chart'
    }
];

module.exports = ShapeCategories;
