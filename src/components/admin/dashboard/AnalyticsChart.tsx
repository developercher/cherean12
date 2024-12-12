'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AnalyticsChartProps {
  data: Array<{
    createdAt: string;
    _sum: {
      views: number;
    };
  }>;
}

export default function AnalyticsChart({ data = [] }: AnalyticsChartProps) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Page Views',
        data: data.map((item) => item._sum.views),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
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
      }}
    />
  );
} 