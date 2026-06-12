"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { EvidenceAnswer } from "@/lib/scoring";
import type { ProfileData, ProjectData } from "@/lib/schemas";

export type ScanState = {
  profile: ProfileData;
  project: ProjectData;
  self: Record<string, number>;
  situational: Record<string, string>;
  evidence: Record<string, EvidenceAnswer>;
};

export const initialState: ScanState = {
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
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<ScanState>;
        setState({
          ...initialState,
          ...parsed,
          profile: { ...initialState.profile, ...parsed.profile },
          project: { ...initialState.project, ...parsed.project },
          self: parsed.self ?? {},
          situational: parsed.situational ?? {},
          evidence: parsed.evidence ?? {},
        });
      } catch {
        window.localStorage.removeItem("designer-inbody-scan");
      }
    }
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<ScanState>) => {
    setState((current) => {
      const next = { ...current, ...patch };
      if (ready) window.localStorage.setItem("designer-inbody-scan", JSON.stringify(next));
      return next;
    });
  }, [ready]);
  const reset = useCallback(() => {
    setState(initialState);
    window.localStorage.removeItem("designer-inbody-scan");
  }, []);

  return <ScanContext.Provider value={{ state, update, reset, ready }}>{children}</ScanContext.Provider>;
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) throw new Error("useScan must be used inside ScanProvider");
  return context;
}
