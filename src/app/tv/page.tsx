import { Suspense } from "react";
import RoomGate from "@/components/RoomGate";
import TvPanel from "@/components/tv/TvPanel";

const TvPage = () => (
  <Suspense
    fallback={
      <div className="grid min-h-[100dvh] place-items-center bg-[#070b16] text-slate-300">
        Loading TV…
      </div>
    }
  >
    <RoomGate Panel={TvPanel} />
  </Suspense>
);

export default TvPage;
