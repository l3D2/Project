"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

//Components
import Navbar from "@/components/navbar";
import Content from "@/components/content";
import Card from "@/components/card";
//MUI
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Input = styled(MuiInput)`
  width: 65px;
`;

export default function Notification() {
  const { data: session, status } = useSession();
  const [valuePH, setValuePH] = useState({
    state: false,
    min: 0,
    max: 0,
  });
  const [valueEC, setValueEC] = useState({
    state: false,
    min: 0,
    max: 0,
  });
  const [valueTemp, setValueTemp] = useState({
    state: false,
    min: 0,
    max: 0,
  });
  const [valueTempW, setValueTempW] = useState({
    state: false,
    min: 0,
    max: 0,
  });
  const [valueH, setValueH] = useState({
    state: false,
    min: 0,
    max: 0,
  });

  const fetchNoti = async () => {
    const id = session.user.id;
    const res = await fetch(
      `https://api.bd2-cloud.net/api/notification/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await res.json();
    if (res.ok) {
      setValueEC({
        min: json[0].ec_min,
        max: json[0].ec_max,
        state: json[0].notify_ec,
      });
      setValuePH({
        min: json[0].ph_min,
        max: json[0].ph_max,
        state: json[0].notify_ph,
      });
      setValueTemp({
        min: json[0].temp_min,
        max: json[0].temp_max,
        state: json[0].notify_temp,
      });
      setValueTempW({
        min: json[0].tempw_min,
        max: json[0].tempw_max,
        state: json[0].notify_tempw,
      });
      setValueH({
        min: json[0].humi_min,
        max: json[0].humi_max,
        state: json[0].notify_humi,
      });
    } else {
      console.log("Failed to submit report", valuePH);
    }
  };

  const handleUpdate = async () => {
    const id = session.user.id;
    const res = await fetch(
      `https://api.bd2-cloud.net/api/notification/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ec_min: valueEC.min,
          ec_max: valueEC.max,
          notify_ec: valueEC.state,
          ph_min: valuePH.min,
          ph_max: valuePH.max,
          notify_ph: valuePH.state,
          temp_min: valueTemp.min,
          temp_max: valueTemp.max,
          notify_temp: valueTemp.state,
          tempw_min: valueTempW.min,
          tempw_max: valueTempW.max,
          notify_tempw: valueTempW.state,
          humi_min: valueH.min,
          humi_max: valueH.max,
          notify_humi: valueH.state,
        }),
      }
    );
  };

  useEffect(() => {
    if (session && session.user) {
      // Fetch data from API
      fetchNoti();
      console.log("Fetching data from API", valueEC);
    }
  }, [session]);

  // Check status session
  if (status === "loading") {
    return null; // Loading indicator
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  } else if (session?.user?.role !== "U") {
    router.replace("/admin/dashboard");
  }

  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Notification Settings"}
        <div>
          <div className="grid grid-cols-3 gap-2">
            <Card>
              <NotificationsIcon />
              <div className="flex justify-between items-center">
                <span>PH Notification</span>
                <Switch
                  edge="end"
                  onChange={(e) => {
                    setValuePH((prev) => ({
                      state: !valuePH.state,
                    }));
                  }}
                  checked={valuePH.state}
                />
              </div>
              <div className="w-5/6 text-gray-500">
                <span>Min</span>
                <div className="flex space-x-4">
                  <Slider
                    value={typeof valuePH.min === "number" ? valuePH.min : 0}
                    onChange={(e) => {
                      setValuePH((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valuePH.min}
                    size="small"
                    onChange={(e) => {
                      setValuePH((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 5,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
                <span>Max</span>
                <div className="flex space-x-5">
                  <Slider
                    value={typeof valuePH.max === "number" ? valuePH.max : 0}
                    onChange={(e) => {
                      setValuePH((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valuePH.max}
                    size="small"
                    onChange={(e) => {
                      setValuePH((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 10,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
              </div>
            </Card>
            <Card>
              <NotificationsIcon />
              <div className="flex justify-between items-center">
                <span>EC Notification</span>
                <Switch
                  edge="end"
                  onChange={(e) => {
                    setValueEC((prev) => ({
                      state: !valueEC.state,
                    }));
                  }}
                  checked={valueEC.state}
                />
              </div>
              <div className="w-5/6 text-gray-500">
                <span>Min</span>
                <div className="flex space-x-4">
                  <Slider
                    value={typeof valueEC.min === "number" ? valueEC.min : 0}
                    onChange={(e) => {
                      setValueEC((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valueEC.min}
                    size="small"
                    onChange={(e) => {
                      setValueEC((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 5,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
                <span>Max</span>
                <div className="flex space-x-5">
                  <Slider
                    value={typeof valueEC.max === "number" ? valueEC.max : 0}
                    onChange={(e) => {
                      setValueEC((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valueEC.max}
                    size="small"
                    onChange={(e) => {
                      setValueEC((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 10,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
              </div>
            </Card>
            <Card>
              <NotificationsIcon />
              <div className="flex justify-between items-center">
                <span>Temp Notification</span>
                <Switch
                  edge="end"
                  onChange={(e) => {
                    setValueTemp((prev) => ({
                      state: !valueTemp.state,
                    }));
                  }}
                  checked={valueTemp.state}
                />
              </div>
              <div className="w-5/6 text-gray-500">
                <span>Min</span>
                <div className="flex space-x-4">
                  <Slider
                    value={
                      typeof valueTemp.min === "number" ? valueTemp.min : 0
                    }
                    onChange={(e) => {
                      setValueTemp((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valueTemp.min}
                    size="small"
                    onChange={(e) => {
                      setValueTemp((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 5,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
                <span>Max</span>
                <div className="flex space-x-5">
                  <Slider
                    value={
                      typeof valueTemp.max === "number" ? valueTemp.max : 0
                    }
                    onChange={(e) => {
                      setValueTemp((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valueTemp.max}
                    size="small"
                    onChange={(e) => {
                      setValueTemp((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 10,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
              </div>
            </Card>
            <Card>
              <NotificationsIcon />
              <div className="flex justify-between items-center">
                <span>Temp Water Notification</span>
                <Switch
                  edge="end"
                  onChange={(e) => {
                    setValueTempW((prev) => ({
                      state: !valueTempW.state,
                    }));
                  }}
                  checked={valueTempW.state}
                />
              </div>
              <div className="w-5/6 text-gray-500">
                <span>Min</span>
                <div className="flex space-x-4">
                  <Slider
                    value={
                      typeof valueTempW.min === "number" ? valueTempW.min : 0
                    }
                    onChange={(e) => {
                      setValueTempW((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valueTempW.min}
                    size="small"
                    onChange={(e) => {
                      setValueTempW((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 5,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
                <span>Max</span>
                <div className="flex space-x-5">
                  <Slider
                    value={
                      typeof valueTempW.max === "number" ? valueTempW.max : 0
                    }
                    onChange={(e) => {
                      setValueTempW((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valueTempW.max}
                    size="small"
                    onChange={(e) => {
                      setValueTempW((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 10,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
              </div>
            </Card>
            <Card>
              <NotificationsIcon />
              <div className="flex justify-between items-center">
                <span>Temp Water Notification</span>
                <Switch
                  edge="end"
                  onChange={(e) => {
                    setValueH((prev) => ({
                      state: !valueH.state,
                    }));
                  }}
                  checked={valueH.state}
                />
              </div>
              <div className="w-5/6 text-gray-500">
                <span>Min</span>
                <div className="flex space-x-4">
                  <Slider
                    value={typeof valueH.min === "number" ? valueH.min : 0}
                    onChange={(e) => {
                      setValueH((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valueH.min}
                    size="small"
                    onChange={(e) => {
                      setValueH((prev) => ({
                        ...prev,
                        min: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 5,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
                <span>Max</span>
                <div className="flex space-x-5">
                  <Slider
                    value={typeof valueH.max === "number" ? valueH.max : 0}
                    onChange={(e) => {
                      setValueH((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                  <Input
                    value={valueH.max}
                    size="small"
                    onChange={(e) => {
                      setValueH((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }));
                    }}
                    inputProps={{
                      step: 10,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
          <div className="flex justify-center my-5">
            <button
              type="button"
              className="bg-green-300 rounded-md p-2 hover:bg-green-400"
              onClick={handleUpdate}
            >
              Save
            </button>
          </div>
        </div>
      </Content>
    </>
  );
}
