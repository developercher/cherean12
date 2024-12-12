'use client';
import { Doughnut } from 'react-chartjs-2';

interface DeviceStatsProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export default function DeviceStats({ data }: DeviceStatsProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          '#3B82F6', // Blue
          '#F59E0B', // Yellow
          '#10B981', // Green
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
} 