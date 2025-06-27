import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DateRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  selectedRange,
  onRangeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const ranges = [
    { id: 'thisWeek', label: 'This Week' },
    { id: 'lastWeek', label: 'Last Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'last3Months', label: 'Last 3 Months' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const handleRangeSelect = (rangeId: string) => {
    onRangeChange(rangeId);
    setIsOpen(false);
  };

  const selectedRangeLabel = ranges.find(r => r.id === selectedRange)?.label || 'This Week';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          theme === 'dark'
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Calendar size={14} />
        <span>{selectedRangeLabel}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg border z-20 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="py-2">
              {ranges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => handleRangeSelect(range.id)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedRange === range.id
                      ? theme === 'synesthesia'
                        ? 'bg-purple-100 text-purple-700'
                        : theme === 'dark'
                          ? 'bg-orange-900/30 text-orange-400'
                          : 'bg-orange-100 text-orange-700'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangeSelector;