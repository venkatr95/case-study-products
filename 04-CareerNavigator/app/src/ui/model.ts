import type { Comparison } from "../lib/compare";
import type { PlanSuggestion } from "../lib/roadmap";
import type { ResolvedRole } from "../lib/role-resolve";
import type { Route } from "../lib/routes";
import type { Action, ActionStatus, CompareFilter, ExtractResult, Persisted } from "../types";

export type DialogModel =
  | { type: "delete-all" }
  | { type: "remove-skill"; id: string; name: string }
  | { type: "remove-action"; id: string; title: string }
  | { type: "load-sample" }
  | { type: "start-fresh" }
  | { type: "reset-sample" }
  | { type: "change-goal"; id: string; from: string; to: string }
  | { type: "discard-paste" }
  | { type: "backup"; json: string };

export type ToastModel = {
  message: string;
  undoId?: string;
  undoStatus?: ActionStatus;
};

export type View = {
  route: Route;
  state: Persisted;
  online: boolean;
  loadProblem: string | null;
  toast: ToastModel | null;
  dialog: DialogModel | null;
  filter: CompareFilter;
  formError: string | null;
  importText: string;
  importResult: ExtractResult | null;
  role: ResolvedRole | null;
  comparison: Comparison | null;
  suggestions: PlanSuggestion[];
  roleActions: Action[];
};
