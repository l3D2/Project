"use client";

import { useSession } from "next-auth/react";
import axios from "axios";

//components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import DataTable from "@/components/dataTable";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

export default function Device() {
  const { data: session } = useSession();

  const fetchData = async () => {
    const res = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "datetime",
      headerName: "Register Time",
      type: "dateTime",
      valueGetter: (value) => value && new Date(value),
      width: 250,
      editable: false,
    },
    {
      field: "name",
      headerName: "Device Name",
      width: 90,
      type: "number",
      editable: false,
    },
    {
      field: "action",
      headerName: "Action",
      type: "action",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const rows = [
    { id: 1, DateTime: "11/11/11", firstName: "Jon", age: 14 },
    { id: 2, DateTime: "12/11/11", firstName: "Cersei", age: 31 },
  ];
  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Device Test"}
        <div>
          tasdw
          <DataTable columns={columns} rows={rows} />
        </div>
      </Content>
    </>
  );
}
