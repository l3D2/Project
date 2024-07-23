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
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

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

    return (
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Grid item xs={12} md={6}>
                <Demo>
                    <List dense={dense}>
                        {generate(
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete">
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
                                    primary="Single-line item"
                                    secondary={
                                        secondary ? "Secondary text" : null
                                    }
                                    primaryTypographyProps={{ color: "black" }}
                                    secondaryTypographyProps={{
                                        color: "black",
                                    }}
                                />
                            </ListItem>
                        )}
                    </List>
                </Demo>
            </Grid>
        </Box>
    );
}
