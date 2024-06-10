import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import CardDevice from "@/components/cardDevice";
import GoogleMapView from "@/components/map";

export default function Dashboard() {
  const child2 = <CardDevice />;
  return (
    <>
      <Content>
        <GoogleMapView />
        {child2}
      </Content>
    </>
  );
}
