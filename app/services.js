// services.js
// Dummy datasets + business logic + simple simulator to emulate streaming data (ESP32)

const MAX_POINTS = 24; // maksimal jumlah point yg disimpan per series

// --- Initial dummy datasets (hourly-like labels) ---
function makeInitialLabels(count = 7) {
  const days = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
  const labels = [];
  for (let i = 0; i < count; i++) labels.push(days[i % days.length]);
  return labels;
}

const labels = makeInitialLabels(14);

export let temperatureData = labels.map((d, i) => ({
  day: d + (i >= 7 ? ` ${i-6}` : ""),
  value: 24 + Math.round(Math.sin(i/2) * 3) + (i % 3)
}));

export let co2Data = labels.map((d, i) => ({
  day: d + (i >= 7 ? ` ${i-6}` : ""),
  value: 280 + Math.round(Math.cos(i/3) * 40) + (i % 5) * 3
}));

export let ammoniaData = labels.map((d, i) => ({
  day: d + (i >= 7 ? ` ${i-6}` : ""),
  value: 180 + Math.round(Math.sin(i/1.7) * 25) + (i % 4) * 5
}));

// --- Helpers / Business logic (exported) ---
export function last(arr) {
  return Array.isArray(arr) && arr.length ? arr[arr.length - 1].value : null;
}

export function levelFor(type, value) {
  if (value === null || value === undefined) return "good";
  if (type === "temp") {
    if (value >= 35) return "bad";
    if (value >= 31) return "warn";
    return "good";
  }
  if (type === "nh3") {
    if (value >= 600) return "bad";
    if (value >= 301) return "warn";
    return "good";
  }
  if (type === "co2") {
    if (value >= 1500) return "bad";
    if (value >= 1001) return "warn";
    return "good";
  }
  return "good";
}

export function overallLevelFromLevels(tempLevel, co2Level, nh3Level) {
  const arr = [tempLevel, co2Level, nh3Level];
  if (arr.includes("bad")) return "bad";
  if (arr.includes("warn")) return "warn";
  return "good";
}

export function statusTextFromOverall(overallLevel) {
  return overallLevel === "good"
    ? "Kualitas Udara Anda baik"
    : overallLevel === "warn"
    ? "Kualitas Udara anda kurang baik"
    : "Kualitas Udara anda tidak baik";
}

export function getCircleGradient(overallLevel) {
  if (overallLevel === "good") {
    return { from: "#34D399", to: "#047857", text: "#047857", border: "#34D399" };
  }
  if (overallLevel === "warn") {
    return { from: "#B59B00", to: "#7C6B00", text: "#7C6B00", border: "#B59B00" };
  }
  return { from: "#F87171", to: "#B91C1C", text: "#B91C1C", border: "#F87171" };
}

export function colorForLevel(lvl) {
  if (lvl === "good") return "#047857";
  if (lvl === "warn") return "#92400E";
  return "#B91C1C";
}

// --- Simple simulator to mimic incoming data from ESP32 ---
// Usage:
//   const sim = startSimulation((updated) => { /* handle update */ }, { intervalMs: 2000 });
//   sim.stop();
let _simInterval = null;
let _simOptions = {};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

export function startSimulation(onUpdate, opts = {}) {
  const intervalMs = opts.intervalMs || 2000;
  const maxPoints = opts.maxPoints || MAX_POINTS;
  const jitter = opts.jitter || {
    temp: { min: 1, max: 1.2 },
    co2: { min: -20, max: 20 },
    nh3: { min: -8, max: 8 },
  };

  stopSimulation();
  _simOptions = { intervalMs, maxPoints, jitter };

  _simInterval = setInterval(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const label = `${hh}:${mm}`;

    const prevTemp = last(temperatureData) ?? 26;
    const deltaT = (Math.random() * (jitter.temp.max - jitter.temp.min)) + jitter.temp.min;
    let nextTemp = Math.round((prevTemp + deltaT) * 10) / 10;
    nextTemp = clamp(nextTemp, -10, 60);

    const prevCo2 = last(co2Data) ?? 300;
    const deltaCo2 = Math.round((Math.random() * (jitter.co2.max - jitter.co2.min)) + jitter.co2.min);
    let nextCo2 = prevCo2 + deltaCo2;
    nextCo2 = clamp(nextCo2, 0, 10000);

    const prevNh3 = last(ammoniaData) ?? 200;
    const deltaNh3 = Math.round((Math.random() * (jitter.nh3.max - jitter.nh3.min)) + jitter.nh3.min);
    let nextNh3 = prevNh3 + deltaNh3;
    nextNh3 = clamp(nextNh3, 0, 10000);

    temperatureData = [...temperatureData, { day: label, value: Number(nextTemp.toFixed(1)) }];
    co2Data = [...co2Data, { day: label, value: Math.round(nextCo2) }];
    ammoniaData = [...ammoniaData, { day: label, value: Math.round(nextNh3) }];

    if (temperatureData.length > maxPoints) temperatureData = temperatureData.slice(-maxPoints);
    if (co2Data.length > maxPoints) co2Data = co2Data.slice(-maxPoints);
    if (ammoniaData.length > maxPoints) ammoniaData = ammoniaData.slice(-maxPoints);

    if (typeof onUpdate === "function") {
      onUpdate({
        temperatureData: [...temperatureData],
        co2Data: [...co2Data],
        ammoniaData: [...ammoniaData],
      });
    }
  }, intervalMs);

  return {
    stop: stopSimulation,
    options: _simOptions,
  };
}

export function stopSimulation() {
  if (_simInterval) {
    clearInterval(_simInterval);
    _simInterval = null;
  }
}
