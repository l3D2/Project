"use client";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import React from "react";
import { useMarkers } from "@/context/FilterMap";

import Switch from "@mui/material/Switch";
//Icon
import CircleIcon from "@mui/icons-material/Circle";

export default function CardDevice({ rdata }) {
  const [open, setOpen] = React.useState({});
  const [data, setData] = React.useState([]);
  const { markers, setMarkers } = useMarkers();
  React.useEffect(() => {
    setData(rdata);
    setMarkers(rdata);
  }, [rdata]);
  const handleClick = (index) => {
    setOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const updateMarker = (uid) => {
    const updatedData = data.map((item) =>
      item.id === uid ? { ...item, blip: !item.blip } : item
    );
    setData(updatedData); // Update the state with the new data
    setMarkers(updatedData); // Update the state with the new data
  };

  const groupedData = data.reduce((acc, item) => {
    const land = item.land === null ? "Other" : `${item.land_name}`;
    if (!acc[land]) {
      acc[land] = [];
    }
    acc[land].push(item);
    return acc;
  }, {});

  return (
    <Card className="w-full p-4">
      <div className="flex justify-between px-1 mb-1">
        <h1>Devices</h1>
        <a href="/devices" className="text-blue-500">
          view all
        </a>
      </div>
      <Divider />
      <List>
        {Object.keys(groupedData).map((land, index) => (
          <React.Fragment key={index}>
            <ListItemButton onClick={() => handleClick(index)}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={land} />
              {open[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[index]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {groupedData[land].map((subItem, subIndex) => (
                  <ListItem key={subIndex} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <CircleIcon
                        sx={{
                          color: subItem.status == 0 ? "gray" : "green",
                          width: "20px",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={subItem.name} />
                    <Switch
                      edge="end"
                      onChange={() => {
                        updateMarker(subItem.id);
                      }}
                      checked={subItem.blip}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
}
