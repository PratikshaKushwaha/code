import { Routes, Route, useNavigate } from "react-router-dom";
import { ThreePageCurl } from "./components/ThreePageCurl";
import { Archive } from "./components/Archive";
import { CuriosityCabinet } from "./components/CuriosityCabinet";
import { Us } from "./components/Us";

export function CoverView() {
  const navigate = useNavigate();

  return (
    <main className="relative w-screen h-dvh bg-[#101820] text-[#d8d0c4] flex flex-col justify-center items-center overflow-hidden select-none p-0">
      {/* Ambient background atmosphere: deep obsidian with subtle mist */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_#34404b25_0%,_#101820_90%)] z-0" />
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_bottom_right,_#d69a6230_0%,_transparent_65%)] z-0" />

      {/* 100% Full-Screen Edge-to-Edge 3D Folio Viewport */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <ThreePageCurl
          onPageChange={(page) => {
            if (page === 1) {
              navigate("/archive");
            }
          }}
        />
      </div>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CoverView />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/cabinet" element={<CuriosityCabinet />} />
      <Route path="/us" element={<Us />} />
      <Route path="*" element={<CoverView />} />
    </Routes>
  );
}

export default App;
