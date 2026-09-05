// Canvas and gradients need rgba(); Palette stores hex, so this is the only place a color is decomposed.
const expandHex = (hex: string): string => {
  const digits = hex.replace("#", "");
  return digits.length === 3
    ? digits
        .split("")
        .map((digit) => digit + digit)
        .join("")
    : digits;
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const value = Number.parseInt(expandHex(hex), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

/** Re-alphas any Palette token, whether it is stored as hex or as rgba(). */
export const withAlpha = (color: string, alpha: number): string => {
  if (color.startsWith("#")) return hexToRgba(color, alpha);
  const channels = color.replace(/rgba?\(/, "").replace(")", "").split(",");
  const [red, green, blue] = channels;
  if (red === undefined || green === undefined || blue === undefined) return color;
  return `rgba(${red.trim()}, ${green.trim()}, ${blue.trim()}, ${alpha})`;
};
