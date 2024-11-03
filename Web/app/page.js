import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Container from "../components/container";

export default function Home() {
  return (
    <>
      {/* Titile zone */}
      <div className="relative warp" id="home">
        <Container>
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
          </div>
          <div className="relative h-full pt-16 ml-auto my-auto">
            <div className="lg:w-2/3 text-center mx-auto">
              <h1 className="text-gray-900 dark:text-white font-bold text-4xl md:text-5xl xl:text-6xl">
                Water Quality Monitoring and Alert System for
                <p className="type-title1 dark:text-green-300"></p>
              </h1>
              <p className="mt-7 text-3xl text-gray-700 dark:text-gray-300">
                ระบบตรวจวัดและแจ้งเตือนคุณภาพน้ำ สำหรับพื้นที่เกษตรกรรม
              </p>
              <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                <a
                  href="/dashboard"
                  className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                >
                  <span className="relative text-base font-semibold text-primary dark:text-white">
                    Dashboard
                  </span>
                </a>
              </div>
              {/* <div className="hidden py-8 mt-16 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between">
                <div className="text-left">
                  <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                    Easy to use
                  </h6>
                  <p className="mt-2 text-gray-500">ง่ายต่อการใช้งาน</p>
                </div>
                <div className="text-left">
                  <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                    The fastest on the market
                  </h6>
                  <p className="mt-2 text-gray-500">Some text here</p>
                </div>
                <div className="text-left">
                  <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                    The most loved
                  </h6>
                  <p className="mt-2 text-gray-500">Some text here</p>
                </div>
              </div> */}
            </div>
            {/* <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
              <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
                <img
                  src="https://img5.pic.in.th/file/secure-sv1/devicebc568d80fac22cfb.png"
                  className="h-12 w-auto mx-auto"
                ></img>
              </div>
              <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
                <img
                  src="https://th.bing.com/th/id/OIG4.LgUj9FIjzUbdTSMn0mRg"
                  className="h-12 w-auto mx-auto"
                ></img>
              </div>
            </div> */}
          </div>
        </Container>
        {/* <Footer></Footer> */}
      </div>
    </>
  );
}
