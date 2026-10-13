"use client";

import { useEffect, useState } from "react";

export type FinalDragPreview = {
  order: string[];
  dragFrom: number | null;
  dragTo: number | null;
  draggingText: string | null;
};

type FinalOrderDndProps = {
  items: string[];
  onChange: (preview: FinalDragPreview) => void;
  onDragEnd: () => void;
};

const reorder = (list: string[], from: number, to: number): string[] => {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = [...list];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
};

const FinalOrderDnd = ({ items, onChange, onDragEnd }: FinalOrderDndProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    if (dragIndex === null) {
      setLocalItems(items);
    }
  }, [items, dragIndex]);

  return (
    <ul className="flex flex-col gap-2">
      {localItems.map((item, index) => (
        <li
          key={`${item}-${index}`}
          draggable
          onDragStart={() => {
            setDragIndex(index);
            onChange({
              order: localItems,
              dragFrom: index,
              dragTo: index,
              draggingText: item,
            });
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (dragIndex === null || dragIndex === index) return;
            const from = dragIndex;
            const movedText = localItems[from] ?? item;
            const next = reorder(localItems, from, index);
            setLocalItems(next);
            setDragIndex(index);
            onChange({
              order: next,
              dragFrom: from,
              dragTo: index,
              draggingText: movedText,
            });
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragIndex(null);
            onDragEnd();
          }}
          onDragEnd={() => {
            setDragIndex(null);
            onDragEnd();
          }}
          className={`flex cursor-grab items-center gap-3 rounded-xl border px-3 py-3 transition-all duration-150 active:cursor-grabbing ${
            dragIndex === index
              ? "scale-[1.02] border-amber-300/70 bg-amber-400/20 shadow-lg shadow-amber-500/10"
              : "border-white/15 bg-black/30"
          }`}
        >
          <span className="w-6 font-mono text-slate-500">{index + 1}</span>
          <span className="flex-1 font-medium">{item}</span>
          <span className="text-xs text-slate-500">Drag</span>
        </li>
      ))}
    </ul>
  );
};

export default FinalOrderDnd;
