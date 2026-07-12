"use client";

export type ForestTree = { kind: "ship" | "deskCheck"; key: string };

type RGB = { r: number; g: number; b: number };

const CANOPY_GREEN: RGB = { r: 47, g: 111, b: 94 }; // floor-green
const SPROUT_BLUE: RGB = { r: 59, g: 95, b: 138 }; // floor-blue
const FAR_MIX: RGB = { r: 247, g: 239, b: 226 }; // floor-panel, used to fade distant trees
const TRUNK = "#6b4f36";
const SPROUT_STEM = "#4a7a3d";

function mix(a: RGB, b: RGB, t: number) {
  return `rgb(${Math.round(a.r + (b.r - a.r) * t)}, ${Math.round(a.g + (b.g - a.g) * t)}, ${Math.round(a.b + (b.b - a.b) * t)})`;
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function TreeShape({ variant, canopyColor }: { variant: number; canopyColor: string }) {
  if (variant === 0) {
    return (
      <svg viewBox="0 0 40 48" width="100%" height="100%" aria-hidden="true">
        <rect x="17" y="28" width="6" height="18" rx="2" fill={TRUNK} />
        <circle cx="20" cy="18" r="16" fill={canopyColor} />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <svg viewBox="0 0 40 48" width="100%" height="100%" aria-hidden="true">
        <rect x="17" y="30" width="6" height="16" rx="2" fill={TRUNK} />
        <circle cx="13" cy="21" r="11" fill={canopyColor} />
        <circle cx="27" cy="21" r="11" fill={canopyColor} />
        <circle cx="20" cy="12" r="12" fill={canopyColor} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 48" width="100%" height="100%" aria-hidden="true">
      <rect x="17" y="34" width="6" height="12" rx="2" fill={TRUNK} />
      <path d="M20 2 L34 26 L6 26 Z" fill={canopyColor} />
      <path d="M20 13 L31 34 L9 34 Z" fill={canopyColor} />
    </svg>
  );
}

function SproutShape({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 32" width="100%" height="100%" aria-hidden="true">
      <rect x="10.5" y="18" width="3" height="12" rx="1.5" fill={SPROUT_STEM} />
      <path d="M12 20 C4 20 2 12 2 8 C10 8 12 14 12 20 Z" fill={color} />
      <path d="M12 16 C20 16 22 8 22 4 C14 4 12 10 12 16 Z" fill={color} />
    </svg>
  );
}

const COLS = 6;
const ROW_STEP = 40;
const BASE_HEIGHT = 130;

export function AchievementForest({
  trees,
  shipLabel,
  deskCheckLabel,
}: {
  trees: ForestTree[];
  shipLabel: string;
  deskCheckLabel: string;
}) {
  const rows = Math.max(1, Math.ceil(trees.length / COLS));
  const height = BASE_HEIGHT + (rows - 1) * ROW_STEP;

  return (
    <div
      className="relative mt-5 overflow-hidden rounded border border-floor-line"
      style={{
        height,
        background: "linear-gradient(180deg, #fbf5e8 0%, #f2ead8 55%, #e3ecd9 100%)",
      }}
    >
      {trees.map((tree, index) => {
        const seed = hashString(tree.key);
        const row = Math.floor(index / COLS);
        const col = index % COLS;
        const depth = rows <= 1 ? 0 : row / (rows - 1); // 0 = nearest row, 1 = furthest row
        const rowOffset = row % 2 === 1 ? 0.5 : 0; // brick-lay alternate rows so they peek between the row in front
        const jitterX = (pseudoRandom(seed) - 0.5) * 0.7; // fraction of a column width
        const jitterY = (pseudoRandom(seed + 1) - 0.5) * 18;
        const leftPct = Math.min(97, Math.max(3, ((col + 0.5 + rowOffset + jitterX) / COLS) * 100));
        const bottom = 12 + row * ROW_STEP + jitterY;
        const isShip = tree.kind === "ship";
        const scale = isShip ? 1 - depth * 0.35 : 0.55 - depth * 0.15;
        const variant = seed % 3;
        const canopyColor = isShip
          ? mix(CANOPY_GREEN, FAR_MIX, depth * 0.5)
          : mix(SPROUT_BLUE, FAR_MIX, depth * 0.5);
        const size = isShip ? 46 : 30;

        return (
          <div
            key={tree.key}
            title={isShip ? shipLabel : deskCheckLabel}
            className="absolute"
            style={{
              left: `${leftPct}%`,
              bottom,
              width: size,
              height: size * 1.2,
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: "bottom center",
              zIndex: Math.round((1 - depth) * 100) + (isShip ? 10 : 0),
            }}
          >
            {isShip ? <TreeShape variant={variant} canopyColor={canopyColor} /> : <SproutShape color={canopyColor} />}
          </div>
        );
      })}
    </div>
  );
}
