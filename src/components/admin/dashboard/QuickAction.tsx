import Link from 'next/link';

interface QuickActionProps {
  name: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

export default function QuickAction({ name, href, icon: Icon, color }: QuickActionProps) {
  const getColorClasses = (color: string) => ({
    bg: `bg-${color}-50 dark:bg-${color}-900/20`,
    hover: `hover:bg-${color}-100 dark:hover:bg-${color}-900/30`,
    text: `text-${color}-700 dark:text-${color}-300`,
    icon: `text-${color}-600`
  });

  const colors = getColorClasses(color);

  return (
    <Link
      href={href}
      className={`flex items-center p-4 ${colors.bg} rounded-lg ${colors.hover} transition-colors`}
    >
      <Icon className={`w-6 h-6 ${colors.icon} mr-3`} />
      <span className={`font-medium ${colors.text}`}>{name}</span>
    </Link>
  );
} 