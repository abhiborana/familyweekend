import { Suspense } from "react";
import HostPanel from "@/components/host/HostPanel";
import RoomGate from "@/components/RoomGate";

const HostPage = () => (
  <Suspense
    fallback={
      <div className="grid min-h-[100dvh] place-items-center bg-[#0b1220] text-slate-300">
        Loading host…
      </div>
    }
  >
    <RoomGate Panel={HostPanel} />
  </Suspense>
);

export default HostPage;
