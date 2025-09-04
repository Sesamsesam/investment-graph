'use client';

import { useEffect, useState } from 'react';
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
  const INFLATION_RATE = 0.04; // 4% annual inflation
  
  // Pre-defined final values as provided by user
  const FINAL_VALUES = {
    regularSavings: {
      actual: 1200000,
      todaysPower: 547850
    },
    investment7Percent: {
      actual: 2459700,
      todaysPower: 1122500
    },
    investment20Percent: {
      actual: 11201310,
      todaysPower: 5112000
    },
    investment30Percent: {
      actual: 37809798,
      todaysPower: 17255000
    }
  };

  // Calculate disparity between 30% and 0% growth
  const disparityAmount = FINAL_VALUES.investment30Percent.todaysPower - FINAL_VALUES.regularSavings.todaysPower;
  
  // Format disparity with Danish formatting
  const formatDisparityDKK = (value: number) => {
    // Danish formatting uses periods for thousands separators
    return new Intl.NumberFormat('da-DK', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(value) + ' kr';
  };

  // Generate linear interpolation between 0 and final value for each year
  const generateLinearData = (finalValue: number, years: number): number[] => {
    return Array.from({ length: years + 1 }, (_, i) => (finalValue / years) * i);
  };

  // Generate exponential growth data (more realistic compound interest curve)
  const generateExponentialData = (finalValue: number, years: number, growthRate: number): number[] => {
    const values: number[] = [0]; // Start with 0
    
    for (let year = 1; year <= years; year++) {
      // Using the formula: P * (1 + r)^t where r is the growth rate and t is time in years
      const factor = Math.pow(1 + growthRate, year) / Math.pow(1 + growthRate, years);
      values.push(finalValue * factor);
    }
    
    return values;
  };

  // Generate data for all scenarios - using today's purchasing power values
  const generateData = () => {
    const labels = Array.from({ length: YEARS + 1 }, (_, i) => i); // 0..20
    
    // Regular savings (linear growth)
    const regularSavingsActual = generateLinearData(FINAL_VALUES.regularSavings.actual, YEARS);
    const regularSavingsPower = generateLinearData(FINAL_VALUES.regularSavings.todaysPower, YEARS);
    
    // Investments with compound interest - using exponential growth for more realistic curves
    const investment7PercentActual = generateExponentialData(FINAL_VALUES.investment7Percent.actual, YEARS, 0.07);
    const investment7PercentPower = generateExponentialData(FINAL_VALUES.investment7Percent.todaysPower, YEARS, 0.07);
    
    const investment20PercentActual = generateExponentialData(FINAL_VALUES.investment20Percent.actual, YEARS, 0.20);
    const investment20PercentPower = generateExponentialData(FINAL_VALUES.investment20Percent.todaysPower, YEARS, 0.20);
    
    const investment30PercentActual = generateExponentialData(FINAL_VALUES.investment30Percent.actual, YEARS, 0.30);
    const investment30PercentPower = generateExponentialData(FINAL_VALUES.investment30Percent.todaysPower, YEARS, 0.30);

    return {
      labels,
      regularSavingsActual,
      regularSavingsPower,
      investment7PercentActual,
      investment7PercentPower,
      investment20PercentActual,
      investment20PercentPower,
      investment30PercentActual,
      investment30PercentPower,
    };
  };

  const data = generateData();

  // Format DKK currency
  const formatDKK = (value: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Chart data showing today's purchasing power values
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Inflation-Base-loser - (0% interest)',
        data: data.regularSavingsPower,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
        borderDash: [5, 5],
        tension: 0.1,
        borderWidth: 3,
      },
      {
        label: '7% Annual Return (Today\'s Purchasing Power)',
        data: data.investment7PercentPower,
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: '20% Annual Return (Today\'s Purchasing Power)',
        data: data.investment20PercentPower,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: '30% Annual Return (Today\'s Purchasing Power)',
        data: data.investment30PercentPower,
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
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Compound Effect vs. Inflation: How 5,000 DKK/month Grows Over 20 Years',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 10,
        },
        color: 'white',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatDKK(context.parsed.y);
            }
            return label;
          }
        }
      },
      annotation: {
        annotations: {
          /* Vertical disparity line at year 20 */
          disparityLine: {
            type: 'line',
            yMin: data.regularSavingsPower[YEARS],
            yMax: data.investment30PercentPower[YEARS],
            xMin: YEARS,
            xMax: YEARS,
            borderColor: '#22c55e',         // bright green (30 % line colour)
            borderWidth: 3,
            borderDash: [10, 5],
            label: {
              display: true,
              content: `${formatDisparityDKK(disparityAmount)} difference in purchasing power`,
              position: 'start',           // top of vertical line
              backgroundColor: '#1877f2',  // Facebook blue
              color: '#ffd700',            // gold text
              font: {
                size: 14,
                weight: 'bold',
              },
              padding: 8,
              xAdjust: -80,
              yAdjust: -20,                // lift above point
            },
          },
          /* Short horizontal connector from label to vertical line */
          horizontalConnector: {
            type: 'line',
            yMin: data.investment30PercentPower[YEARS],
            yMax: data.investment30PercentPower[YEARS],
            xMin: YEARS - 2,               // small horizontal segment
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
          text: 'Value in Today\'s Purchasing Power (DKK)',
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
      {/* Inflation Indicator */}
      <div className="bg-red-500/20 text-center py-2 px-4 rounded-lg mb-4 border border-red-500/30">
        <p className="text-red-300 font-bold text-lg">4% Annual Inflation Rate</p>
      </div>
      {/* Information Description */}
      <div className="bg-slate-800/50 p-4 rounded-lg mb-6 border border-slate-700/50 text-slate-300 text-sm">
        <p>
          This calculation assumes a starting balance of 0 DKK with monthly deposits of 5,000 DKK (totaling 60,000 DKK annually) over 20 years. 
          Growth rates (0%, 7%, 20%, 30%) are applied as annual compound interest on the accumulated balance, while a 4% annual inflation rate 
          adjusts the future values to today's purchasing power (as of September 2025). The actual amount in 20 years reflects the nominal value 
          with growth, and the value in today's purchasing power accounts for inflation over the 20-year period.
        </p>
      </div>
      
      {/* Chart */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 h-[600px] shadow-inner">
        <Line data={chartData} options={options} className="max-w-full" />
      </div>
      
      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 0% BASELINE */}
        <div className="bg-red-500/20 p-4 rounded-lg border-2 border-black">
          <h3 className="font-bold text-red-400 text-lg">0% Annual Return</h3>
          <p className="text-white/80 text-sm mt-2">20 year saving:</p>
          <p className="text-white text-lg font-bold">{formatDKK(FINAL_VALUES.regularSavings.actual)}</p>
          <p className="text-white/80 text-sm mt-2">Purchase power:</p>
          <p className="text-white text-lg font-bold">{formatDKK(FINAL_VALUES.regularSavings.todaysPower)}</p>
          <p className="text-white/80 text-sm mt-2">Lost to inflation:</p>
          <p className="text-red-500 text-lg font-bold border border-black inline-block px-1">
            {formatDKK(FINAL_VALUES.regularSavings.actual - FINAL_VALUES.regularSavings.todaysPower)}
          </p>
        </div>
        
        {/* 7% */}
        <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
          <h3 className="font-bold text-yellow-400 text-lg">7% Annual Return</h3>
          <p className="text-white/80 text-sm mt-2">20 year saving:</p>
          <p className="text-white text-lg font-bold">{formatDKK(FINAL_VALUES.investment7Percent.actual)}</p>
          <p className="text-white/80 text-sm mt-2">Purchase power:</p>
          <p className="text-white text-lg font-bold">{formatDKK(FINAL_VALUES.investment7Percent.todaysPower)}</p>
        </div>
        
        {/* 20% */}
        <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
          <h3 className="font-bold text-purple-400 text-lg">20% Annual Return</h3>
          <p className="text-white/80 text-sm mt-2">20 year saving:</p>
          <p className="text-white text-lg font-bold">{formatDKK(FINAL_VALUES.investment20Percent.actual)}</p>
          <p className="text-white/80 text-sm mt-2">Purchase power:</p>
          <p className="text-white text-lg font-bold">{formatDKK(FINAL_VALUES.investment20Percent.todaysPower)}</p>
        </div>
        
        {/* 30% */}
        <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
          <h3 className="font-bold text-green-400 text-lg">30% Annual Return</h3>
          <p className="text-white/80 text-sm mt-2">20 year saving:</p>
          <p className="text-white text-lg font-bold">{formatDKK(FINAL_VALUES.investment30Percent.actual)}</p>
          <p className="text-white/80 text-sm mt-2">Purchase power:</p>
          <p className="text-white text-lg font-bold">{formatDKK(FINAL_VALUES.investment30Percent.todaysPower)}</p>
        </div>
      </div>
    </div>
  );
};

export default CompoundChart;
