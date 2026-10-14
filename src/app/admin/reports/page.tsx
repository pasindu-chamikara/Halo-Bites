"use client";

import React from 'react';
import { ArrowUpRight, TrendingUp, BarChart3, PieChart } from 'lucide-react';

const MONTHLY_DATA = [
  { month: 'Jan', revenue: 40 },
  { month: 'Feb', revenue: 55 },
  { month: 'Mar', revenue: 45 },
  { month: 'Apr', revenue: 70 },
  { month: 'May', revenue: 65 },
  { month: 'Jun', revenue: 85 },
  { month: 'Jul', revenue: 100 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-md p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Gross Revenue</h3>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-full"><TrendingUp size={16} /></div>
          </div>
          <div className="text-3xl font-black mb-1">Rs. 45,294.00</div>
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight size={14} /> +15.3% from last month
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Avg Order Value</h3>
            <div className="p-2 bg-[#E91E63]/10 text-[#E91E63] rounded-full"><BarChart3 size={16} /></div>
          </div>
          <div className="text-3xl font-black mb-1">Rs. 52.40</div>
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight size={14} /> +3.2% from last month
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Conversion Rate</h3>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-full"><PieChart size={16} /></div>
          </div>
          <div className="text-3xl font-black mb-1">4.8%</div>
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight size={14} /> +1.1% from last month
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8">
        <h2 className="text-xl font-black uppercase tracking-tight mb-8">Revenue Overview</h2>
        <div className="h-64 flex items-end justify-between gap-2 px-2">
          {MONTHLY_DATA.map((data, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4 flex-1">
              <div className="w-full bg-white/5 rounded-t-sm relative group flex justify-center h-48">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#E91E63]/50 to-[#E91E63] rounded-t-sm transition-all duration-500 hover:opacity-80"
                  style={{ height: `${data.revenue}%` }}
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black border border-white/10 text-xs font-bold py-1 px-2 whitespace-nowrap transition-opacity z-10">
                  Rs. {(data.revenue * 142).toFixed(0)}
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top Products Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-x-auto">
        <div className="p-6 border-b border-white/10">
          <h3 className="font-black uppercase tracking-tight text-lg">Top Performing Products</h3>
        </div>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-black/20 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <th className="p-4 pl-6 border-b border-white/5">Product Name</th>
              <th className="p-4 border-b border-white/5">Units Sold</th>
              <th className="p-4 border-b border-white/5 text-right pr-6">Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
              <td className="p-4 pl-6 font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center text-xs">🍰</div>
                Signature Velvet Cake
              </td>
              <td className="p-4 text-zinc-300">342</td>
              <td className="p-4 text-right pr-6 font-bold text-[#E91E63]">Rs. 15,390.00</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
              <td className="p-4 pl-6 font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center text-xs">🍩</div>
                Glazed Donut Box (6-Pack)
              </td>
              <td className="p-4 text-zinc-300">215</td>
              <td className="p-4 text-right pr-6 font-bold text-[#E91E63]">Rs. 3,870.00</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
              <td className="p-4 pl-6 font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center text-xs">🍪</div>
                Assorted Macarons
              </td>
              <td className="p-4 text-zinc-300">189</td>
              <td className="p-4 text-right pr-6 font-bold text-[#E91E63]">Rs. 4,536.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
