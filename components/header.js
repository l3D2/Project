import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function Header({ children }) {
  return (
    <div className="flex justify-between items-center px-3 py-2 mb-1 rounded bg-gray-800">
      <div>{children}</div>
      <Box
        sx={{
          width: 500,
          maxWidth: "100%",
        }}
      >
        <TextField fullWidth size="small" label="Search" id="fullWidth" />
      </Box>
      <div>
        <button className="relative border rounded-xl p-2">
          <NotificationsNoneIcon />
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
            1
          </div>
        </button>
      </div>
    </div>
  );
}
