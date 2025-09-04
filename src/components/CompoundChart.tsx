'use client';

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const CompoundChart = () => {
  // Constants
  const YEARS = 20;
  
  // Chart reference for potential future interactions
  const chartRef = useRef(null);
  
  // Exact yearly values as provided by user
  const yearlyValues = {
    // Base 0% - linear progression (60k per year)
    base: [0, 60000, 120000, 180000, 240000, 300000, 360000, 420000, 480000, 540000, 600000, 
           660000, 720000, 780000, 840000, 900000, 960000, 1020000, 1080000, 1140000, 1200000],
    
    // 7% annual return values
    sevenPercent: [0, 64200, 132894, 206396.58, 285044.3406, 369197.4444, 459241.2656, 
                  555588.1541, 658679.3249, 768986.8777, 887015.9591, 1013307.076, 
                  1148438.572, 1293029.272, 1447741.321, 1613283.213, 1790413.038, 
                  1979941.951, 2182737.887, 2399729.539, 2631910.607],
    
    // 20% annual return values
    twentyPercent: [0, 72000, 158400, 262080, 386496, 535795.2, 714954.24, 929945.088, 
                   1187934.106, 1497520.927, 1869025.112, 2314830.134, 2849796.161, 
                   3491755.394, 4262106.472, 5186527.767, 6295833.32, 7626999.984, 
                   9224399.981, 11141279.98, 13441535.97],
    
    // 30% annual return values
    thirtyPercent: [0, 78000, 179400, 311220, 482586, 705361.8, 994970.34, 1371461.442, 
                   1860899.875, 2497169.837, 3324320.788, 4399617.024, 5797502.132, 
                   7614752.771, 9977178.603, 13048332.18, 17040831.84, 22231081.39, 
                   28978405.81, 37749927.55, 49152905.81]
  };
  
  // Pre-defined final values as provided by user
  const FINAL_VALUES = {
    regularSavings: {
      actual: 1200000,
      todaysPower: 547850
    },
    investment7Percent: {
      actual: 2631910,      // updated actual 20-year saving at 7 %
      todaysPower: 1122500
    },
    investment20Percent: {
      actual: 13441535,     // updated actual 20-year saving at 20 %
      todaysPower: 5112000
    },
    investment30Percent: {
      actual: 49152905,     // updated actual 20-year saving at 30 %
      todaysPower: 17255000
    }
  };

  // Calculate disparity between 30% and 0% growth
  const disparityAmount = FINAL_VALUES.investment30Percent.actual - FINAL_VALUES.regularSavings.actual;
  
  // Format disparity with Danish formatting
  const formatDisparityDKK = (value: number) => {
    // Danish formatting uses periods for thousands separators
    return new Intl.NumberFormat('da-DK', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(value) + ' kr';
  };

  // Format DKK currency
  const formatDKK = (value: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Chart data showing actual investment values
  const chartData = {
    labels: Array.from({ length: YEARS + 1 }, (_, i) => i), // 0..20
    datasets: [
      {
        label: 'Base (0% annual interest)',
        data: yearlyValues.base,
        borderColor: '#f43f5e',                     // rose-500 to match box theme
        backgroundColor: 'rgba(244, 63, 94, 0.3)',
        borderDash: [5, 5],
        tension: 0.1,
        borderWidth: 3,
      },
      {
        label: '7% (annual return)',
        data: yearlyValues.sevenPercent,
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: '20% (annual return)',
        data: yearlyValues.twentyPercent,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: '30% (annual return)',
        data: yearlyValues.thirtyPercent,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1,
        borderWidth: 4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000, // 2 seconds animation
      easing: 'easeOutQuart', // Smooth easing function
    },
    plugins: {
      legend: {
        display: false, // Hide the built-in legend
      },
      title: {
        display: false, // Hide the built-in title
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return `Year ${context[0].label}`;
          },
          label: function(context) {
            const year = parseInt(context.label);
            const datasetIndex = context.datasetIndex;
            const value = context.raw as number;
            
            // Calculate accumulated payments
            const accumulatedPayment = year * 60000;
            
            // Get dataset label
            const label = context.dataset.label || '';
            
            // Return formatted tooltip
            return [
              `${label}`,
              `Accumulated payments: ${formatDKK(accumulatedPayment)}`,
              `Investment value: ${formatDKK(value)}`
            ];
          }
        }
      },
      annotation: {
        annotations: {
          /* Vertical disparity line at year 20 */
          disparityLine: {
            type: 'line',
            yMin: yearlyValues.base[YEARS],
            yMax: yearlyValues.thirtyPercent[YEARS],
            xMin: YEARS,
            xMax: YEARS,
            borderColor: '#ffffff',         // white vertical line
            borderWidth: 3,
            borderDash: [10, 5],
            label: {
              display: true,
              content: `${formatDisparityDKK(disparityAmount)} difference in value`,
              position: 'end',             // top of vertical line (30% point)
              backgroundColor: '#1877f2',  // Facebook blue
              color: '#ffffff',            // white text
              font: {
                size: 14,
                weight: 'bold',
              },
              padding: 8,
              xAdjust: -8,
              yAdjust: 0,
            },
          },
          /* Short horizontal connector from label to vertical line */
          horizontalConnector: {
            type: 'line',
            yMin: yearlyValues.thirtyPercent[YEARS],
            yMax: yearlyValues.thirtyPercent[YEARS],
            xMin: YEARS - 2.5,
            xMax: YEARS,
            borderColor: '#ffffff',
            borderWidth: 2,
            borderDash: [5, 5],
          },
        },
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Years',
          font: {
            weight: 'bold',
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value, index) {
            // Only show "Year" prefix for 0 and 20
            if (index === 0) return 'Year 0';
            if (index === YEARS) return 'Year 20';
            return index;
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value (DKK)',
          font: {
            weight: 'bold',
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return formatDKK(value as number);
          }
        },
      },
    },
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl p-6">
      {/* Title Card */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 mb-5 border border-slate-700/50 shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">
          How 5,000 DKK/month Invested Wisely Grows over 20 years
        </h2>
      </div>
      
      {/* Summary Cards - moved above chart */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total payment box – redesigned */}
        <div className="bg-slate-800 bg-gradient-to-b from-slate-800 to-slate-900 p-5 rounded-lg border-2 border-amber-400/50 flex flex-col items-center gap-2 shadow-md
                        transition transform duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-amber-400/50">
          {/* Main title */}
          <h3 className="text-white font-extrabold text-xl text-center">
            Total payment: 1.200.000
          </h3>

          {/* Subtitle */}
          <h4 className="text-white font-semibold text-sm text-center">
            4% inflation · 20 years
          </h4>

          {/* Highlighted value */}
          <span
            className="text-green-400 font-black text-2xl drop-shadow-lg"
          >
            {formatDKK(FINAL_VALUES.regularSavings.todaysPower)}
          </span>
        </div>

        {/* 7% */}
        <div className="p-5 rounded-lg border-2 border-yellow-300 bg-gradient-to-b from-yellow-400 to-yellow-600 flex flex-col items-center justify-center gap-2 shadow-md
                        transition transform duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-yellow-300/60">
          <h3 className="font-bold text-white text-lg text-center">7% Annual Return</h3>
          <span className="font-extrabold text-white text-2xl drop-shadow-lg">
            {formatDKK(FINAL_VALUES.investment7Percent.actual)}
          </span>
          {/* 20 th year label */}
          <span className="text-white/80 text-xs tracking-wide">
            20<span className="align-super text-[0.6rem]">th</span> year
          </span>
        </div>

        {/* 20% */}
        <div className="p-5 rounded-lg border-2 border-blue-300 bg-gradient-to-b from-blue-500 to-blue-700 flex flex-col items-center justify-center gap-2 shadow-md
                        transition transform duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-blue-400/60">
          <h3 className="font-bold text-white text-lg text-center">20% Annual Return</h3>
          <span className="font-extrabold text-white text-2xl drop-shadow-lg">
            {formatDKK(FINAL_VALUES.investment20Percent.actual)}
          </span>
          {/* 20 th year label */}
          <span className="text-white/80 text-xs tracking-wide">
            20<span className="align-super text-[0.6rem]">th</span> year
          </span>
        </div>

        {/* 30% */}
        <div className="p-5 rounded-lg border-2 border-amber-400 bg-gradient-to-b from-green-500 to-green-700 flex flex-col items-center justify-center gap-2 shadow-md
                        transition transform duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-green-400/60">
          <h3 className="font-bold text-white text-lg text-center">30% Annual Return</h3>
          <span className="font-extrabold text-white text-2xl drop-shadow-lg">
            {formatDKK(FINAL_VALUES.investment30Percent.actual)}
          </span>
          {/* 20 th year label */}
          <span className="text-white/80 text-xs tracking-wide">
            20<span className="align-super text-[0.6rem]">th</span> year
          </span>
        </div>
      </div>
      
      {/* Chart Card - Now contains only the pure chart */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 h-[600px] shadow-inner">
        <Line data={chartData} options={options} className="max-w-full" ref={chartRef} />
      </div>
    </div>
  );
};

export default CompoundChart;
