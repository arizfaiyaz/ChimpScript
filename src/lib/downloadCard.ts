import type { TypingResult } from "../types";
import { getAttemptsByDate, getCurrentYearActivityGrid, getProfileStats } from "./profileStats";

const CARD_WIDTH = 820;
const CARD_HEIGHT = 570;
const graphColors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

function getGraphColor(attempts: number) {
  if (attempts >= 7) {
    return graphColors[4];
  }

  if (attempts >= 4) {
    return graphColors[3];
  }

  if (attempts >= 2) {
    return graphColors[2];
  }

  if (attempts === 1) {
    return graphColors[1];
  }

  return graphColors[0];
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  stroke?: string,
) {
  drawRoundedRect(context, x, y, width, height, radius);
  context.fillStyle = fill;
  context.fill();

  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = 1;
    context.stroke();
  }
}

function setFont(context: CanvasRenderingContext2D, size: number, weight = 500) {
  context.font = `${weight} ${size}px "JetBrains Mono", Consolas, monospace`;
}

function drawStat(
  context: CanvasRenderingContext2D,
  label: string,
  value: string | number,
  x: number,
  y: number,
  width: number,
) {
  fillRoundedRect(context, x, y, width, 58, 8, "rgba(255,255,255,0.045)", "rgba(255,255,255,0.10)");
  context.fillStyle = "#71717a";
  setFont(context, 10, 600);
  context.fillText(label.toUpperCase(), x + 12, y + 20);
  context.fillStyle = "#ffffff";
  setFont(context, 18, 700);
  context.fillText(String(value), x + 12, y + 44);
}

function drawDownloadLink(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

export async function downloadProfileCardAsPng(results: TypingResult[], filename: string) {
  await document.fonts?.ready;

  const scale = 2;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a canvas context.");
  }

  canvas.width = CARD_WIDTH * scale;
  canvas.height = CARD_HEIGHT * scale;
  context.scale(scale, scale);

  const stats = getProfileStats(results);
  const attemptsByDate = getAttemptsByDate(results);
  const graph = getCurrentYearActivityGrid(attemptsByDate);
  const hasResults = results.length > 0;

  const background = context.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  background.addColorStop(0, "#0f1a0c");
  background.addColorStop(0.38, "#090d0a");
  background.addColorStop(1, "#070a08");
  context.fillStyle = background;
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  fillRoundedRect(context, 0.5, 0.5, CARD_WIDTH - 1, CARD_HEIGHT - 1, 8, "rgba(9,13,10,0)", "rgba(190,242,100,0.22)");
  context.fillStyle = "rgba(190,242,100,0.10)";
  context.beginPath();
  context.arc(72, 32, 210, 0, Math.PI * 2);
  context.fill();

  fillRoundedRect(context, 24, 24, 42, 42, 8, "rgba(190,242,100,0.12)", "rgba(190,242,100,0.42)");
  context.fillStyle = "#bef264";
  setFont(context, 16, 800);
  context.fillText("</>", 32, 51);

  context.fillStyle = "#bef264";
  setFont(context, 11, 700);
  context.fillText("DEVELOPER TYPING PROFILE", 80, 42);
  context.fillStyle = "#ffffff";
  setFont(context, 28, 800);
  context.fillText("ChimpScript", 80, 70);

  if (hasResults) {
    const tileGap = 10;
    const tileWidth = (CARD_WIDTH - 48 - tileGap * 3) / 4;
    const statsY = 98;
    const statItems: Array<[string, string | number]> = [
      ["attempts", formatNumber(stats.totalAttempts)],
      ["best wpm", stats.bestWpm],
      ["avg wpm", stats.averageWpm],
      ["avg accuracy", `${stats.averageAccuracy}%`],
      ["correct words", formatNumber(stats.totalCorrectWords)],
      ["typed chars", formatNumber(stats.totalTypedCharacters)],
      ["current streak", `${stats.currentStreak}d`],
      ["longest streak", `${stats.longestStreak}d`],
    ];

    statItems.forEach(([label, value], index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);
      drawStat(context, label, value, 24 + column * (tileWidth + tileGap), statsY + row * 68, tileWidth);
    });

    const infoY = 238;
    const infoWidth = (CARD_WIDTH - 48 - tileGap * 2) / 3;
    [
      ["most used category", stats.mostUsedCategory],
      ["best time mode", stats.bestTimeMode],
      ["share line", `${stats.bestWpm} wpm peak`],
    ].forEach(([label, value], index) => {
      const x = 24 + index * (infoWidth + tileGap);
      fillRoundedRect(context, x, infoY, infoWidth, 56, 8, "rgba(0,0,0,0.20)", "rgba(255,255,255,0.10)");
      context.fillStyle = "#71717a";
      setFont(context, 10, 700);
      context.fillText(label.toUpperCase(), x + 12, infoY + 21);
      context.fillStyle = "#ffffff";
      setFont(context, 14, 700);
      context.fillText(value, x + 12, infoY + 43);
    });
  } else {
    fillRoundedRect(context, 24, 98, CARD_WIDTH - 48, 154, 8, "rgba(0,0,0,0.20)", "rgba(190,242,100,0.22)");
    context.fillStyle = "#ffffff";
    setFont(context, 22, 800);
    context.fillText("No attempts yet", 308, 164);
    context.fillStyle = "#a1a1aa";
    setFont(context, 13, 500);
    context.fillText("Complete a typing test to build your ChimpScript profile.", 218, 190);
  }

  const graphY = hasResults ? 316 : 280;
  const graphHeight = 166;
  fillRoundedRect(context, 24, graphY, CARD_WIDTH - 48, graphHeight, 8, "rgba(0,0,0,0.25)", "rgba(255,255,255,0.10)");

  context.fillStyle = "#71717a";
  setFont(context, 10, 700);
  context.fillText("ACTIVITY", 38, graphY + 24);
  context.fillStyle = "#ffffff";
  setFont(context, 15, 800);
  context.fillText(`${graph.year} activity`, 38, graphY + 46);

  context.fillStyle = "#71717a";
  setFont(context, 10, 500);
  context.fillText("LESS", CARD_WIDTH - 160, graphY + 26);
  graphColors.forEach((color, index) => {
    fillRoundedRect(context, CARD_WIDTH - 124 + index * 18, graphY + 17, 11, 11, 2, color);
  });
  context.fillStyle = "#71717a";
  context.fillText("MORE", CARD_WIDTH - 52, graphY + 26);

  const graphX = 38;
  const monthY = graphY + 68;
  const cellY = graphY + 84;
  const gap = 3;
  const cellSize = 11;

  context.fillStyle = "#71717a";
  setFont(context, 9, 500);
  graph.monthLabels.forEach((month) => {
    context.fillText(month.label, graphX + (month.column - 1) * (cellSize + gap), monthY);
  });

  graph.cells.forEach((day, index) => {
    if (day.isPadding) {
      return;
    }

    const column = Math.floor(index / 7);
    const row = index % 7;
    fillRoundedRect(
      context,
      graphX + column * (cellSize + gap),
      cellY + row * (cellSize + gap),
      cellSize,
      cellSize,
      2,
      getGraphColor(day.attempts),
    );
  });

  context.strokeStyle = "rgba(255,255,255,0.10)";
  context.beginPath();
  context.moveTo(24, CARD_HEIGHT - 52);
  context.lineTo(CARD_WIDTH - 24, CARD_HEIGHT - 52);
  context.stroke();

  context.fillStyle = "#71717a";
  setFont(context, 11, 500);
  context.fillText("Built with ", 24, CARD_HEIGHT - 25);
  context.fillStyle = "#bef264";
  context.fillText("ChimpScript", 90, CARD_HEIGHT - 25);
  context.fillStyle = "#71717a";
  context.fillText("https://chimpscript.vercel.app/", CARD_WIDTH - 228, CARD_HEIGHT - 25);

  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not generate the profile card PNG."));
        return;
      }

      drawDownloadLink(blob, filename);
      resolve();
    }, "image/png");
  });
}
