"use client";
import Navbar from "@/components/navbar";
import Content from "@/components/content";
import CardStat from "@/components/cardStatus";
import Divider from "@mui/material/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserLocationContext } from "@/context/context";
import CardAdmin from "@/components/cardAdmin";
import AdminChart from "@/components/AdminChart";
import dayjs from "dayjs";

//Icon
import DevicesIcon from "@mui/icons-material/Devices";
import CloudIcon from "@mui/icons-material/Cloud";
import ApiIcon from "@mui/icons-material/Api";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import { Button, Modal, Box } from "@mui/material";

import QrCodeGenerator from "@/components/QrCodeGenarate";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { location } = useContext(UserLocationContext);
  const [lastUpdateTime, setLastUpdateTime] = useState(dayjs());

  const [qrCodeGenerateOpen, setQrCodeGenerateOpen] = useState(false);
  const handleQrCodeGenerateOpen = () => setQrCodeGenerateOpen(true);
  const handleQrCodeGenerateClose = () => setQrCodeGenerateOpen(false);

  useEffect(() => {
    if (session && session.user) {
    }
    const interval = setInterval(() => {
      fetchCountDevices();
      setLastUpdateTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, [session]);

  // Check status session
  if (status === "loading") {
    return null; // Loading indicator
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  } else if (session?.user?.role == "U") {
    router.replace("/dashboard");
  }
  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Dashboard"}
        <div className="bg-gray-200">
          <div className="grid grid-cols-4 gap-x-2">
            <div className="grid grid-cols-4 gap-2 col-span-4">
              <CardStat className="col-span-1">
                <DevicesIcon />
                {"Stock Device"}
                {"100"}
              </CardStat>
              <CardStat className="col-span-1">
                <CloudIcon />
                {"Cloud"}
                {"100"}
              </CardStat>
              <CardStat className="col-span-1">
                <ApiIcon />
                {"API"}
                {"100"}
              </CardStat>
              <CardStat className="col-span-1">
                <DevicesIcon />
                {"LINE"}
                {"100"}
              </CardStat>
            </div>
          </div>

          <div className="my-2">
            <Divider className="bg-gray-600" style={{ height: "2px" }} />
          </div>
          <AdminChart />
        </div>
        <div className="grid w-full gap-2 bg-gray-300">
          <CardAdmin>
            <AdminPanelSettingsIcon />
            {"Administrator"}
          </CardAdmin>
          <p className="text-center pb-2">
            Last Update {lastUpdateTime.format("HH:mm")}
          </p>
          <Modal
            open={qrCodeGenerateOpen}
            onClose={handleQrCodeGenerateClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <QrCodeGenerator />
              {/* Add your QR code generation logic here */}
            </Box>
          </Modal>
        </div>
      </Content>
      <div className=" absolute bottom-5 right-5">
        <Button
          variant="contained"
          onClick={handleQrCodeGenerateOpen}
          className="bg-gray-400 rounded-full p-2 shadow-sm"
        >
          <QrCode2Icon />
        </Button>
      </div>
    </>
  );
}
