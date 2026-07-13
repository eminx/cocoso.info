const palette = [
  { name: "coral", base: "#FF6F59", soft: "#FFE3DD", deep: "#0F3D3E" },
  { name: "marigold", base: "#FFB84C", soft: "#FFF1D6", deep: "#1B2A4A" },
  { name: "leaf", base: "#3FA772", soft: "#DFF3E7", deep: "#3D1220" },
  { name: "sky", base: "#3DA9FC", soft: "#DDEFFF", deep: "#4A2A12" },
  { name: "iris", base: "#8C6FF7", soft: "#EAE3FF", deep: "#2E3B12" },
  { name: "magenta", base: "#F45D9E", soft: "#FFE1EF", deep: "#123324" },
  { name: "teal", base: "#2EC4B6", soft: "#DBF6F3", deep: "#3D1810" },
  { name: "berry", base: "#D7263D", soft: "#FBDEE1", deep: "#0E3B36" },
  { name: "sun", base: "#F2B705", soft: "#FFF6D9", deep: "#1B1642" },
  { name: "ocean", base: "#1B7F9E", soft: "#DAF0F6", deep: "#4A1E12" },
];

function getAccent(index) {
  return palette[index % palette.length];
}

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 70%, 82%, ${opacity})`;
}

function withAlpha(hex, alpha = "cc") {
  return `${hex}${alpha}`;
}

export default palette;
export { getAccent, getHSL, withAlpha };
