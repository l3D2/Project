import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import CardDevice from "@/components/cardDevice";

export default function Dashboard() {
  const child1 = <h1>TEST</h1>;
  const child2 = <CardDevice />;
  return (
    <>
      <Content>
        {child1}
        {child2}
      </Content>
    </>
  );
}
