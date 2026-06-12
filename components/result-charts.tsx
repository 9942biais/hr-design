"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function CategoryRadar({ data }: { data: { name: string; score: number }[] }) {
  const mounted = useMounted();
  return <div className="h-64 w-full min-w-0">{mounted && <ResponsiveContainer width="100%" height="100%" minWidth={0}><RadarChart data={data} outerRadius="72%"><PolarGrid stroke="#d8d5ce" /><PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} /><Radar dataKey="score" stroke="#7667f5" fill="#7667f5" fillOpacity={0.28} /><Tooltip /></RadarChart></ResponsiveContainer>}</div>;
}

export function IndicatorBars({ data }: { data: { name: string; score: number }[] }) {
  const mounted = useMounted();
  return <div className="h-[430px] w-full min-w-0">{mounted && <ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={data} layout="vertical" margin={{ left: 25, right: 15 }}><CartesianGrid horizontal={false} stroke="#e4e1da" /><XAxis type="number" domain={[0,100]} tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fontWeight: 700 }} /><Tooltip cursor={{ fill: "#f4f2ed" }} /><Bar dataKey="score" fill="#161616" radius={[0,5,5,0]} /></BarChart></ResponsiveContainer>}</div>;
}
