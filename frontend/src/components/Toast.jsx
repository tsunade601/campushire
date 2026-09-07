import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const typeConfig = {
    success: { bg: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200', icon: CheckCircle2 },
    error: { bg: 'bg-rose-950/90 border-rose-500/50 text-rose-200', icon: AlertCircle },
    info: { bg: 'bg-blue-950/90 border-blue-500/50 text-blue-200', icon: Info }
  };

  const current = typeConfig[type] || typeConfig.info;
  const Icon = current.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-sm">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${current.bg}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors ml-auto">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
