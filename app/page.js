"use client";

import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Home() {
  // Data dummy untuk tiap grafik
  const temperatureData = [
    { day: "Senin", value: 26 },
    { day: "Selasa", value: 27 },
    { day: "Rabu", value: 28 },
    { day: "Kamis", value: 29 },
    { day: "Jumat", value: 30 },
    { day: "Sabtu", value: 31 },
    { day: "Minggu", value: 29 },
  ];

  const co2Data = [
    { day: "Senin", value: 300 },
    { day: "Selasa", value: 310 },
    { day: "Rabu", value: 290 },
    { day: "Kamis", value: 320 },
    { day: "Jumat", value: 305 },
    { day: "Sabtu", value: 315 },
    { day: "Minggu", value: 300 },
  ];

  const ammoniaData = [
    { day: "Senin", value: 270 },
    { day: "Selasa", value: 280 },
    { day: "Rabu", value: 260 },
    { day: "Kamis", value: 290 },
    { day: "Jumat", value: 275 },
    { day: "Sabtu", value: 285 },
    { day: "Minggu", value: 270 },
  ];

  // Tooltip custom
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
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-green-600 animate-pulse-ring"></div>

          <div className="absolute bottom-0 overflow-hidden rounded-full w-full h-full">
            <svg
              className="absolute bottom-0"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
            >
              <path
                className="wave"
                d="M0 30 Q 75 10, 150 30 T 300 30 T 450 30 T 600 30 V100 H0 Z"
                fill="rgba(255,255,255,0.5)"
              />
            </svg>

            <svg
              className="absolute bottom-0 opacity-60"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
            >
              <path
                className="wave2"
                d="M0 30 Q 75 10, 150 30 T 300 30 T 450 30 T 600 30 V100 H0 Z"
                fill="rgba(255,255,255,0.3)"
              />
            </svg>

            <svg
              className="absolute bottom-0 opacity-40"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
            >
              <path
                className="wave3"
                d="M0 32 Q 75 12, 150 32 T 300 32 T 450 32 T 600 32 V100 H0 Z"
                fill="rgba(255,255,255,0.2)"
              />
            </svg>
          </div>

          <div className="absolute inset-0 rounded-full border-[10px] border-green-300 opacity-30"></div>
        </div>

        <p className="mt-4 text-lg font-medium text-green-700">
          Kualitas Udara Anda Baik
        </p>
      </div>

      {/* Data Cards */}
      <div className="grid grid-cols-2 gap-4 my-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Suhu lingkungan</p>
          <p className="text-xl font-bold text-green-700">27°C</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Karbon dioksida</p>
          <p className="text-xl font-bold text-green-700">300ppm</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Amonia</p>
          <p className="text-xl font-bold text-green-700">280ppm</p>
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
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Riwayat Temperatur Suhu (°C)
          </p>
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
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickLine={false}
                  width={30}
                  label={{
                    value: "°C",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#6B7280",
                    fontSize: 12,
                  }}
                />

                <Tooltip content={<CustomTooltip color="#047857" title="Suhu" />} />

                <Area type="monotone" dataKey="value" stroke="#047857" strokeWidth={2} fill="url(#tempColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2 */}
        <div className="bg-white p-4 rounded-lg shadow-sm min-w-[520px]">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Riwayat Kadar Karbon Dioksida (ppm)
          </p>
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
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickLine={false}
                  width={40}
                  label={{
                    value: "ppm",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#6B7280",
                    fontSize: 12,
                  }}
                />

                <Tooltip content={<CustomTooltip color="#2563EB" title="Kadar" />} />

                <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fill="url(#co2Color)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Amonia */}
        <div className="bg-white p-4 rounded-lg shadow-sm min-w-[520px]">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Riwayat Kadar Amonia (ppm)
          </p>
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
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickLine={false}
                  width={40}
                  label={{
                    value: "ppm",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#6B7280",
                    fontSize: 12,
                  }}
                />

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
