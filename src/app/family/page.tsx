import { Suspense } from "react";
import FamilyPanel from "@/components/family/FamilyPanel";
import RoomGate from "@/components/RoomGate";

const FamilyPage = () => (
  <Suspense
    fallback={
      <div className="grid min-h-[100dvh] place-items-center bg-[#0b1220] text-slate-300">
        Loading family…
      </div>
    }
  >
    <RoomGate Panel={FamilyPanel} />
  </Suspense>
);

export default FamilyPage;
