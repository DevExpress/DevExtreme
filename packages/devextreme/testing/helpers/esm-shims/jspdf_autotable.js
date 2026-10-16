/**
 * jspdf-autotable side-effect import under native ESM.
 * The vendor build attaches itself through a CJS require call, which is
 * unavailable in the browser — call applyPlugin explicitly instead.
 *
 * Note: the `.mjs` build exports `autoTable` only as default
 * (`export { …, autoTable as default }`), not as a named export.
 */
import { jsPDF } from 'jspdf';
/* eslint-disable import/named -- vendor ESM re-exports include default + named applyPlugin */
import autoTable, {
    Cell,
    CellHookData,
    Column,
    Row,
    Table,
    __createTable,
    __drawTable,
    applyPlugin,
} from '../../../node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs';
/* eslint-enable import/named */

const JsPdfCtor = typeof jsPDF === 'function' ? jsPDF : jsPDF.jsPDF;
applyPlugin(JsPdfCtor);

export {
    Cell,
    CellHookData,
    Column,
    Row,
    Table,
    __createTable,
    __drawTable,
    applyPlugin,
    autoTable,
};
export default autoTable;
