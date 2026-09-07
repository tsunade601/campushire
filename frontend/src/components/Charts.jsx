import React from 'react';

/**
 * Native Animated Horizontal Bar Chart
 */
export function BarChart({ data = [], labelKey = 'label', valueKey = 'value', color = 'brand', height = 240 }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-slate-500 text-sm">No data available</div>;
  }

  const maxValue = Math.max(...data.map(d => Number(d[valueKey]) || 0), 1);

  return (
    <div className="w-full space-y-3 py-2" style={{ minHeight: height }}>
      {data.map((item, idx) => {
        const val = Number(item[valueKey]) || 0;
        const pct = Math.round((val / maxValue) * 100);
        return (
          <div key={idx} className="group">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-300 group-hover:text-brand-300 transition-colors">
                {item[labelKey]}
              </span>
              <span className="font-semibold text-slate-400 group-hover:text-white">
                {val.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
              <div 
                className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(pct, 4)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Native Animated Circular Donut Chart
 */
export function DonutChart({ data = [], labelKey = 'name', valueKey = 'value' }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-slate-500 text-sm">No data available</div>;
  }

  const total = data.reduce((acc, d) => acc + (Number(d[valueKey]) || 0), 0) || 1;
  const colors = ['#0ea5e9', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

  let accumulated = 0;
  const slices = data.map((d, i) => {
    const val = Number(d[valueKey]) || 0;
    const pct = val / total;
    const startAngle = accumulated * 360;
    accumulated += pct;
    const endAngle = accumulated * 360;
    return {
      ...d,
      val,
      pct: Math.round(pct * 100),
      color: colors[i % colors.length],
      startAngle,
      endAngle
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
      <div className="relative w-44 h-44 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
          {slices.map((slice, i) => {
            const strokeDash = `${slice.pct} 100`;
            const strokeOffset = -slices.slice(0, i).reduce((sum, s) => sum + s.pct, 0);
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke={slice.color}
                strokeWidth="16"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-500 hover:opacity-80"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-white">{total.toLocaleString()}</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 text-xs">
        {slices.slice(0, 6).map((slice, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="text-slate-300 truncate max-w-[130px]">{slice[labelKey]}</span>
            <span className="text-slate-400 font-semibold ml-auto">{slice.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Funnel Stage Chart
 */
export function FunnelChart({ stages = [] }) {
  return (
    <div className="space-y-3 py-3">
      {stages.map((st, i) => {
        const widthPct = Math.max(100 - i * 14, 25);
        return (
          <div key={i} className="flex flex-col items-center">
            <div 
              className="glass-panel py-2 px-4 rounded-xl flex items-center justify-between border border-slate-700/60 shadow-md transition-all duration-300 hover:border-brand-400"
              style={{ width: `${widthPct}%` }}
            >
              <span className="text-xs font-semibold text-slate-200">{st.label}</span>
              <span className="text-sm font-bold text-brand-300">{st.value.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
