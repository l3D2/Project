import * as React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

export default function DataTable({ columns, rows }) {
  return (
    <div style={{ width: "100%" }}>
      <div className="text-white">
        <DataGrid
          className="text-white"
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
          sx={{
            boxShadow: 1.5,
            border: 2,
            borderColor: "gray",
            color: "white",
            "& .MuiDataGrid-row": {
              backgroundColor: "#37465c",
              color: "white",
              "&:hover": {
                backgroundColor: "lightgrey",
                color: "black",
              },
            },
            "& .super-app-theme--header": {
              backgroundColor: "#37465c",
              color: "white",
            },
            "& .MuiIconButton-root": {
              backgroundColor: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "black",
            },
            "& .MuiDataGrid-footerContainer,.MuiTablePagination-root": {
              backgroundColor: "#37465c",
              color: "white",
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
