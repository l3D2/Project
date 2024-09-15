import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function ListAdmin() {
    const [items, setItems] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [newItemName, setNewItemName] = React.useState("");

    const handleDelete = (index) => {
        setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    const handleAdd = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        setItems((prevItems) => [...prevItems, newItemName]);
        setNewItemName("");
        setOpen(false);
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
                            className="p-1"
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>

                    <List>
                        {items.map((value, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDelete(index)}
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
                                    primary={value}
                                    primaryTypographyProps={{ color: "black" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Demo>
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Item Name"
                        fullWidth
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
