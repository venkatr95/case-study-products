/** Color tokens. Keep in sync with styles.css and contrast.test.ts. */
export const TOKENS = {
  ink: "#1b1914",
  inkSoft: "#4e463c",
  paper: "#f3eee4",
  card: "#fffcf8",
  line: "#d9d0c3",
  teal: "#0c5c46",
  tealInk: "#f4fbf8",
  tealSoft: "#e5f3ee",
  amber: "#6b4308",
  amberSoft: "#f8ecd4",
  slate: "#243140",
  slateSoft: "#e7edf2",
  danger: "#8c2f2f",
  dangerInk: "#fff8f7",
  focus: "#0b4f9c",
} as const;

export const CONTRAST_PAIRS: Array<{ name: string; fg: string; bg: string; min: number }> = [
  { name: "body on paper", fg: TOKENS.ink, bg: TOKENS.paper, min: 7 },
  { name: "body on card", fg: TOKENS.ink, bg: TOKENS.card, min: 7 },
  { name: "secondary on paper", fg: TOKENS.inkSoft, bg: TOKENS.paper, min: 4.5 },
  { name: "secondary on card", fg: TOKENS.inkSoft, bg: TOKENS.card, min: 4.5 },
  { name: "primary button", fg: TOKENS.tealInk, bg: TOKENS.teal, min: 4.5 },
  { name: "teal text on card", fg: TOKENS.teal, bg: TOKENS.card, min: 4.5 },
  { name: "teal text on soft", fg: TOKENS.teal, bg: TOKENS.tealSoft, min: 4.5 },
  { name: "partial chip", fg: TOKENS.amber, bg: TOKENS.amberSoft, min: 4.5 },
  { name: "missing chip", fg: TOKENS.slate, bg: TOKENS.slateSoft, min: 4.5 },
  { name: "danger button", fg: TOKENS.dangerInk, bg: TOKENS.danger, min: 4.5 },
  { name: "focus is not a text pair", fg: TOKENS.focus, bg: TOKENS.card, min: 4.5 },
];
