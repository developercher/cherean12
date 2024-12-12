'use client';

interface PageViewsTableProps {
  data: {
    url: string;
    views: number;
    uniqueViews: number;
  }[];
}

export default function PageViewsTable({ data }: PageViewsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Page URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Views
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Unique Views
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((page) => (
            <tr key={page.url}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {page.url}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {page.views.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {page.uniqueViews.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 