import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

// const columns = [
//   { field: "id", headerName: "ID", width: 80 },
//   {
//     field: "DateTime",
//     headerName: "DateTime",
//     type: "dateTime",
//     valueGetter: (value) => value && new Date(value),
//     width: 250,
//     editable: false,
//   },
//   {
//     field: "EC",
//     headerName: "EC",
//     width: 90,
//     type: "number",
//     editable: false,
//   },
//   {
//     field: "PH",
//     headerName: "PH",
//     width: 90,
//     type: "number",
//     editable: false,
//   },
//   {
//     field: "tempW",
//     headerName: "Temperature💧",
//     type: "number",
//     width: 150,
//     editable: false,
//   },
//   {
//     field: "tempA",
//     headerName: "Temperature🌡️",
//     type: "number",
//     width: 150,
//     editable: false,
//   },
// ];

// const rows = [
//   { id: 1, DateTime: "11/11/11", firstName: "Jon", age: 14 },
//   { id: 2, DateTime: "12/11/11", firstName: "Cersei", age: 31 },
// ];

export default function DataTable({ columns, rows }) {
  return (
    <div style={{ width: "100%" }}>
      <div>
        <DataGrid
          className="text-black bg-white"
          columns={columns}
          rows={rows}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
