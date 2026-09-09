import { CheckCircle2, Circle } from 'lucide-react';
import { evaluatePasswordStrength } from '../utils/validators';

export default function PasswordStrengthIndicator({ password = '', showCriteria = true, className = '' }) {
  const { criteria, percent, label, color, barColor, isValid } = evaluatePasswordStrength(password);

  // If user hasn't typed anything yet, don't show the strength bar or show empty
  if (!password) {
    if (!showCriteria) return null;
    return (
      <div className={`mt-2.5 space-y-2 text-xs ${className}`}>
        <p className="text-gray-500 font-medium">Password must meet the following criteria:</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {criteria.map((item) => (
            <li key={item.id} className="flex items-center gap-1.5 text-gray-400">
              <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={`mt-2.5 space-y-2 text-xs ${className}`}>
      {/* Strength bar & label */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 bg-gray-200/80 rounded-full h-1.5 overflow-hidden flex gap-1 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={`font-semibold shrink-0 text-xs ${color}`}>
          {label}
        </span>
      </div>

      {/* Criteria checklist */}
      {showCriteria && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {criteria.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-1.5 transition-colors duration-150 ${
                item.met ? 'text-emerald-700 font-medium' : 'text-gray-400'
              }`}
            >
              {item.met ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              )}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
