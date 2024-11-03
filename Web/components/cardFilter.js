"use client";
import FilterListIcon from "@mui/icons-material/FilterList";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function CardFilter() {
  return (
    <div className="h-full px-3 py-2 bg-white rounded shadow-sm">
      <div className="flex items-center space-x-4">
        <div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 text-white">
            <FilterListIcon />
          </div>
        </div>
        <div>
          <div className="text-gray-400">Filter Map</div>
          <Divider />
          <div className="text-2xl font-bold text-gray-900"></div>
          {/* <Paper
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              listStyle: "none",
              p: 0.5,
              m: 0,
              minWidth: "20rem",
            }}
            component="ul"
          >
            <ListItem key={0}>
              <Chip icon={FilterListIcon} label={"Test"} onDelete={0} />
            </ListItem>
          </Paper> */}
        </div>
      </div>
    </div>
  );
}
