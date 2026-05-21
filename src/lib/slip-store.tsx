import { createContext, useContext, useState, type ReactNode } from "react";

export interface SlipPick {
  id: string;
  label: string;
  detail: string;
  odds: number;
  book?: string;
  confidence?: number;
}

interface SlipCtx {
  picks: SlipPick[];
  add: (p: SlipPick) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<SlipCtx | null>(null);

export function SlipProvider({ children }: { children: ReactNode }) {
  const [picks, setPicks] = useState<SlipPick[]>([]);
  return (
    <Ctx.Provider
      value={{
        picks,
        add: (p) => setPicks((cur) => (cur.find((x) => x.id === p.id) ? cur : [...cur, p])),
        remove: (id) => setPicks((cur) => cur.filter((x) => x.id !== id)),
        clear: () => setPicks([]),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSlip() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSlip outside SlipProvider");
  return c;
}