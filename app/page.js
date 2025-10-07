"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  temperatureData as initialTemperatureData,
  co2Data as initialCo2Data,
  ammoniaData as initialAmmoniaData,
  startSimulation,
  stopSimulation,
  last,
  levelFor,
  overallLevelFromLevels,
  statusTextFromOverall,
  getCircleGradient,
  colorForLevel,
} from "./services.js";

export default function Home() {
  // state for datasets
  const [temperatureData, setTemperatureData] = useState(initialTemperatureData);
  const [co2Data, setCo2Data] = useState(initialCo2Data);
  const [ammoniaData, setAmmoniaData] = useState(initialAmmoniaData);

  // keep sim ref to stop on unmount
  const simRef = useRef(null);

  useEffect(() => {
    // start simulator, update state on each tick
    simRef.current = startSimulation(
      ({ temperatureData: t, co2Data: c, ammoniaData: a }) => {
        setTemperatureData(t);
        setCo2Data(c);
        setAmmoniaData(a);
      },
      { intervalMs: 2500, maxPoints: 24 } // adjust interval if needed
    );

    return () => {
      if (simRef.current && typeof simRef.current.stop === "function") {
        simRef.current.stop();
      } else {
        stopSimulation();
      }
    };
  }, []);

  // compute latest & levels
  const tempLatest = last(temperatureData);
  const co2Latest = last(co2Data);
  const nh3Latest = last(ammoniaData);

  const tempLevel = levelFor("temp", tempLatest);
  const co2Level = levelFor("co2", co2Latest);
  const nh3Level = levelFor("nh3", nh3Latest);

  const overallLevel = overallLevelFromLevels(tempLevel, co2Level, nh3Level);
  const statusText = statusTextFromOverall(overallLevel);
  const circleGradient = getCircleGradient(overallLevel);

  // Custom Tooltip (same as before)
  const CustomTooltip = ({ active, payload, label, color, title }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-md shadow-md p-2"
          style={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: color, marginBottom: "2px" }}>
            {label}
          </p>
          <p className="text-sm" style={{ color: "#047857" }}>
            {title} : <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F6FAF6] p-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Sistem Monitoring Kualitas Udara
        </h1>
      </div>

      {/* Air Quality Status */}
      <div className="flex flex-col items-center justify-center my-8">
        <div
          className="relative w-48 h-48 flex items-center justify-center rounded-full"
        >
          {/* gradient circle (inline style agar dinamis) */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{
              background: `linear-gradient(135deg, ${circleGradient.from} 0%, ${circleGradient.to} 100%)`,
            }}
          />

          {/* Efek gelombang air (tetap seperti semula) */}
          <div className="absolute bottom-0 overflow-hidden rounded-full w-full h-full">
            <svg className="absolute bottom-0" viewBox="0 0 200 100" preserveAspectRatio="none">
              <path className="wave" d="M0 30 Q 75 10, 150 30 T 300 30 T 450 30 T 600 30 V100 H0 Z" fill="rgba(255,255,255,0.5)" />
            </svg>

            <svg className="absolute bottom-0 opacity-60" viewBox="0 0 200 100" preserveAspectRatio="none">
              <path className="wave2" d="M0 30 Q 75 10, 150 30 T 300 30 T 450 30 T 600 30 V100 H0 Z" fill="rgba(255,255,255,0.3)" />
            </svg>

            <svg className="absolute bottom-0 opacity-40" viewBox="0 0 200 100" preserveAspectRatio="none">
              <path className="wave3" d="M0 32 Q 75 12, 150 32 T 300 32 T 450 32 T 600 32 V100 H0 Z" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>

          {/* border outer */}
          <div className="absolute inset-0 rounded-full opacity-30" style={{ border: `10px solid ${circleGradient.border}` }} />
        </div>

        <p className="mt-4 text-lg font-medium" style={{ color: circleGradient.text }}>
          {statusText}
        </p>
      </div>

      {/* Data Cards */}
      <div className="grid grid-cols-2 gap-4 my-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Suhu lingkungan</p>
          <p className="text-xl font-bold" style={{ color: colorForLevel(tempLevel) }}>
            {tempLatest ?? "-"}°C
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Karbon dioksida</p>
          <p className="text-xl font-bold" style={{ color: colorForLevel(co2Level) }}>
            {co2Latest ?? "-"}ppm
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Amonia</p>
          <p className="text-xl font-bold" style={{ color: colorForLevel(nh3Level) }}>
            {nh3Latest ?? "-"}ppm
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Status Kipas</p>
          <p className="text-xl font-bold text-green-700">Aktif</p>
        </div>
      </div>

      {/* Charts Scrollable Section */}
      <div className="overflow-x-auto flex space-x-4 pb-4">
        {/* Suhu */}
        <div className="bg-white p-4 rounded-lg shadow-sm min-w-[520px]">
          <p className="text-lg font-semibold text-gray-800 mb-4">Riwayat Temperatur Suhu (°C)</p>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickLine={false} width={30} label={{ value: "°C", angle: -90, position: "insideLeft", fill: "#6B7280", fontSize: 12 }} />

                <Tooltip content={<CustomTooltip color="#047857" title="Suhu" />} />

                <Area type="monotone" dataKey="value" stroke="#047857" strokeWidth={2} fill="url(#tempColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2 */}
        <div className="bg-white p-4 rounded-lg shadow-sm min-w-[520px]">
          <p className="text-lg font-semibold text-gray-800 mb-4">Riwayat Kadar Karbon Dioksida (ppm)</p>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={co2Data}>
                <defs>
                  <linearGradient id="co2Color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickLine={false} width={40} label={{ value: "ppm", angle: -90, position: "insideLeft", fill: "#6B7280", fontSize: 12 }} />

                <Tooltip content={<CustomTooltip color="#2563EB" title="Kadar" />} />

                <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fill="url(#co2Color)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Amonia */}
        <div className="bg-white p-4 rounded-lg shadow-sm min-w-[520px]">
          <p className="text-lg font-semibold text-gray-800 mb-4">Riwayat Kadar Amonia (ppm)</p>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ammoniaData}>
                <defs>
                  <linearGradient id="amoniaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickLine={false} width={40} label={{ value: "ppm", angle: -90, position: "insideLeft", fill: "#6B7280", fontSize: 12 }} />

                <Tooltip content={<CustomTooltip color="#CA8A04" title="Kadar" />} />

                <Area type="monotone" dataKey="value" stroke="#CA8A04" strokeWidth={2} fill="url(#amoniaColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
