import { Column, ColumnConfiguration, ColumnSettings } from "./types";

function applyDataType(column: ColumnSettings): ColumnSettings {
  
}

export function normalizeColumn(column: ColumnConfiguration): Column {
  if (typeof column === 'string') {
    return {
      dataField: column
    }
  }
}