import DataGrid from "devextreme-testcafe-models/dataGrid";
import { createWidget } from "../../../helpers/createWidget";
import url from "../../../helpers/getPageUrl";
import { getData } from "../helpers/generateDataSourceData";

fixture.disablePageReloads`HoveringRows`.page(
  url(__dirname, "../../container.html")
);

test("Hover over a row in DataGrid", async (t) => {
  const dataGrid = new DataGrid("#container");
  const firstRow = dataGrid.getDataRow(0);

  await t
    .hover(firstRow.element)
    .expect(firstRow.element.hasClass("dx-state-hover"))
    .ok();
}).before(async () => {
  await createWidget(
    "dxDataGrid",
    {
      dataSource: getData(5, 3),
      hoverStateEnabled: true,
    },
    "#container"
  );
});
