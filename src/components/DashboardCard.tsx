//DashboardCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import Card from './ui/Card';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
  bgColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon: Icon,
  to,
  color,
  bgColor
}) => {
  return (
    <Link to={to} className="block transition-transform duration-200 hover:scale-105">
      <Card
        variant="elevated"
        className="h-full flex flex-col justify-between"
      >
        <div className="flex items-start mb-4">
          <div className={`p-3 rounded-full ${bgColor} mr-4`}>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <span className={`${color} text-sm font-medium`}>Access now →</span>
        </div>
      </Card>
    </Link>
  );
};

export default DashboardCard;