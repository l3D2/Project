import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import CardDevice from "@/components/cardDevice";
import GoogleMapView from "@/components/map";
import CardStat from "@/components/cardStatus";
import CardFilter from "@/components/cardFilter";
import Divider from "@mui/material/Divider";
import CardReport from "@/components/cardReport";

//Icon
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import WaterIcon from "@mui/icons-material/Water";
import BoltIcon from "@mui/icons-material/Bolt";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import DevicesIcon from "@mui/icons-material/Devices";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <Content>
        <div>
          {/* <div className="grid grid-cols-4 gap-x-2">
            <div className="grid grid-rows-2 grid-cols-2 col-span-2 gap-2">
              <CardStat>
                <DevicesIcon />
                {"Device"}
                {"100"}
              </CardStat>
              <CardStat>
                <DevicesIcon />
                {"Lands"}
                {"100"}
              </CardStat>
              <CardStat>
                <DevicesIcon />
                {"Device"}
                {"100"}
              </CardStat>
              <CardStat>
                <DevicesIcon />
                {"Lands"}
                {"100"}
              </CardStat>
            </div>
            <div className="col-span-2 row-span-2">
              <CardFilter />
            </div>
          </div> */}
          <Divider className="my-1 bg-gray-600" style={{ height: "1.5px" }} />
          <GoogleMapView />
        </div>
        <div className="grid w-full gap-2">
          {/* <CardDevice /> */}
          <CardReport>
            <ThermostatIcon />
            {"Temperature"}
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center">
                <WaterIcon className="sm:max-xl:text-sm" />
                10 °C
              </span>
              <span className="inline-flex items-center">
                <AirIcon className="sm:max-xl:text-sm" />
                10 °C
              </span>
            </div>
          </CardReport>
          <CardReport>
            <BoltIcon />
            {"Electrical Conductivity"}
            <span className="inline-flex items-center">99 µS/cm</span>
          </CardReport>
          <CardReport>
            <WaterDropIcon />
            {"Potential of Hydrogen"}
            <div className="flex items-center">
              <div className=" h-5 w-20 rounded bg-green-300"></div>
              <span className="ml-2">10</span>
            </div>
          </CardReport>
          <CardReport>
            <AirIcon />
            {"Humidity"}
            <span className="inline-flex items-center">99 %</span>
          </CardReport>
          <p className="text-center">Last Update xx:xx</p>
        </div>
      </Content>
    </>
  );
}
