"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { EvidenceAnswer } from "@/lib/scoring";
import type { ProfileData, ProjectData } from "@/lib/schemas";

type ScanState = {
  profile: ProfileData;
  project: ProjectData;
  self: Record<string, number>;
  situational: Record<string, string>;
  evidence: Record<string, EvidenceAnswer>;
};

const initialState: ScanState = {
  profile: { studentName: "", grade: "3학년", major: "", careerPath: "", email: "" },
  project: { projectTitle: "", projectSummary: "", projectRole: "", projectChallenge: "", projectOutcome: "" },
  self: {},
  situational: {},
  evidence: {},
};

const ScanContext = createContext<{
  state: ScanState;
  update: (patch: Partial<ScanState>) => void;
  reset: () => void;
  ready: boolean;
} | null>(null);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("designer-inbody-scan");
    if (stored) setState(JSON.parse(stored));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("designer-inbody-scan", JSON.stringify(state));
  }, [state, ready]);

  const update = (patch: Partial<ScanState>) => setState((current) => ({ ...current, ...patch }));
  const reset = () => {
    setState(initialState);
    window.localStorage.removeItem("designer-inbody-scan");
  };

  return <ScanContext.Provider value={{ state, update, reset, ready }}>{children}</ScanContext.Provider>;
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) throw new Error("useScan must be used inside ScanProvider");
  return context;
}
