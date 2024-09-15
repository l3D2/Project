import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

function generate(element) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        })
    );
}

const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function ListAdmin() {
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [items, setItems] = React.useState([0, 1, 2]);

    const handleDelete = (value) => {
        setItems((prevItems) => prevItems.filter((item) => item !== value));
    };

    const handleAdd = () => {
        setItems((prevItems) => [...prevItems, prevItems.length]);
    };

    return (
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Grid item xs={12} md={6}>
                <Demo>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ padding: "10px" }}
                    >
                        <div>Add Administrator</div>
                        <IconButton
                            color="primary"
                            aria-label="add"
                            onClick={handleAdd}
                            className="p-1" // ลด padding ของ IconButton
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>

                    <List dense={dense}>
                        {items.map((value) => (
                            <ListItem
                                key={value}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDelete(value)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar className="bg-gray-600 text-white">
                                        <SupervisorAccountIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`Item ${value}`}
                                    secondary={
                                        secondary ? "Secondary text" : null
                                    }
                                    primaryTypographyProps={{ color: "black" }}
                                    secondaryTypographyProps={{
                                        color: "black",
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Demo>
            </Grid>
        </Box>
    );
}
