import { useState } from "react";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

const setTheme = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function ListAdmin() {
    const [items, setItems] = useState([
        {
            name: "John Doe",
            lastAccessed: "21/09/2024, 14:30:00",
            online: true,
        },
        {
            name: "Jane Doe",
            lastAccessed: "20/09/2024, 12:30:30",
            online: false,
        },
    ]);
    const [open, setOpen] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = (index) => {
        setDeleteIndex(index);
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmDelete = () => {
        setItems((prevItems) => prevItems.filter((_, i) => i !== deleteIndex));
        setConfirmOpen(false);
    };

    const handleAdd = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const newItem = {
            name: newItemName,
            lastAccessed: new Date().toLocaleString("en-GB", {
                hour12: false,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
            online: Math.random() < 0.5, // Randomly set online status for demonstration
        };
        setItems((prevItems) => [...prevItems, newItem]);
        setNewItemName("");
        setOpen(false);
    };

    return (
        <div className="w-full">
            <Box sx={{ flexGrow: 1, maxWidth: 900 }}>
                <Grid item xs={12} md={6}>
                    <setTheme>
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
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <TableContainer
                            component={Paper}
                            sx={{ width: "100%", overflowX: "auto" }}
                        >
                            <Table>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor:
                                                                    item.online
                                                                        ? "green"
                                                                        : "gray",
                                                                marginRight: 2,
                                                            }}
                                                        >
                                                            <SupervisorAccountIcon />
                                                        </Avatar>
                                                    </Box>
                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="bold"
                                                        >
                                                            {item.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                        >
                                                            {`Last accessed: ${item.lastAccessed}`}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() =>
                                                            handleDelete(index)
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </setTheme>
                </Grid>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add New Administrator</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Email Address"
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
                <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this administrator?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmClose}>Cancel</Button>
                        <Button onClick={handleConfirmDelete}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
}
