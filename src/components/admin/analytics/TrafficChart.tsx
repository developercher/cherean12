'use client';
import { Line } from 'react-chartjs-2';

interface TrafficChartProps {
  data: {
    labels: string[];
    pageviews: number[];
    visitors: number[];
  };
}

export default function TrafficChart({ data }: TrafficChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Page Views',
        data: data.pageviews,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Unique Visitors',
        data: data.visitors,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-[400px]">
      <Line data={chartData} options={options} />
    </div>
  );
} 