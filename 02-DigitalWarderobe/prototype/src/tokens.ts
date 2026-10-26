/** Single source for color tokens. styles.css must contain the same hex values. */
export const tokens = {
  paper: "#F4EFE8",
  surface: "#FFFCF8",
  ink: "#1C1916",
  muted: "#5C534A",
  line: "#E0D5C8",
  accent: "#8C3B16",
  accentInk: "#FFFCF8",
  olive: "#234237",
  oliveInk: "#F4EFE8",
  danger: "#8A2E28",
  dangerInk: "#FFFCF8",
  focus: "#1C1916",
  chip: "#F7F1EA",
} as const;

export const colorSwatches: Record<string, string> = {
  black: "#1C1916",
  white: "#F7F4EF",
  navy: "#1E3354",
  blue: "#3E6CA8",
  green: "#3E5C45",
  brown: "#6B4632",
  beige: "#CDB89A",
  grey: "#8A847C",
  red: "#8E3A34",
  pink: "#C47A86",
  yellow: "#C4922A",
  purple: "#5E4A73",
  orange: "#C46A32",
  multi: "#1E3354",
};

export function contrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const n = hex.replace("#", "");
    const channels = [0, 2, 4].map((index) => {
      const value = parseInt(n.slice(index, index + 2), 16) / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const a = lum(hex1);
  const b = lum(hex2);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}
