
import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useTranslation } from '../App';

const data = [
  { name: 'Mon', count: 400, efficiency: 80 },
  { name: 'Tue', count: 300, efficiency: 85 },
  { name: 'Wed', count: 600, efficiency: 75 },
  { name: 'Thu', count: 800, efficiency: 92 },
  { name: 'Fri', count: 500, efficiency: 88 },
  { name: 'Sat', count: 200, efficiency: 95 },
  { name: 'Sun', count: 100, efficiency: 98 },
];

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
  vsMonthText: string;
}> = ({ title, value, change, isPositive, icon: Icon, color, vsMonthText }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <div className={`mt-2 flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
        <span className="text-gray-400 ml-1">{vsMonthText}</span>
      </div>
    </div>
    <div className={`${color} p-3 rounded-lg bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const d = t.dashboard;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={d.aldCount} 
          value="1,284" 
          change="+12.5%" 
          isPositive={true} 
          icon={TrendingUp} 
          color="bg-blue-500"
          vsMonthText={d.vsMonth}
        />
        <StatCard 
          title={d.alerts} 
          value="3" 
          change="-45.0%" 
          isPositive={true} 
          icon={AlertTriangle} 
          color="bg-yellow-500"
          vsMonthText={d.vsMonth}
        />
        <StatCard 
          title={d.resolveRate} 
          value="98.2%" 
          change="+2.4%" 
          isPositive={true} 
          icon={CheckCircle2} 
          color="bg-green-500"
          vsMonthText={d.vsMonth}
        />
        <StatCard 
          title={d.activity} 
          value="854" 
          change="+1.2%" 
          isPositive={true} 
          icon={Activity} 
          color="bg-purple-500"
          vsMonthText={d.vsMonth}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">{d.weeklyStats}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">{d.efficiencyCurve}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="efficiency" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
