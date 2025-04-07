
import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Feedback, SentimentType, ChartData } from '../types';

interface SentimentChartProps {
  feedbackData: Feedback[];
  chartType?: 'pie' | 'line';
}

const SentimentChart: React.FC<SentimentChartProps> = ({ 
  feedbackData, 
  chartType = 'pie' 
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [lineChartData, setLineChartData] = useState<any[]>([]);

  useEffect(() => {
    if (feedbackData.length === 0) return;

    // Process data for pie chart
    const sentimentCounts = {
      POSITIVE: 0,
      NEUTRAL: 0,
      NEGATIVE: 0
    };

    feedbackData.forEach(item => {
      sentimentCounts[item.sentiment]++;
    });

    const pieData = [
      { name: 'Positive', value: sentimentCounts.POSITIVE, color: '#10b981' },
      { name: 'Neutral', value: sentimentCounts.NEUTRAL, color: '#f59e0b' },
      { name: 'Negative', value: sentimentCounts.NEGATIVE, color: '#ef4444' }
    ];

    setChartData(pieData);

    // Process data for line chart
    if (chartType === 'line') {
      // Group by date and count sentiments
      const dateMap = new Map<string, { positive: number, neutral: number, negative: number }>();
      
      feedbackData.forEach(item => {
        const dateStr = new Date(item.createdAt).toLocaleDateString();
        
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, { positive: 0, neutral: 0, negative: 0 });
        }
        
        const currentValue = dateMap.get(dateStr)!;
        
        if (item.sentiment === 'POSITIVE') {
          currentValue.positive++;
        } else if (item.sentiment === 'NEUTRAL') {
          currentValue.neutral++;
        } else {
          currentValue.negative++;
        }
      });
      
      // Convert map to array for recharts
      const lineData = Array.from(dateMap.entries()).map(([date, counts]) => ({
        date,
        positive: counts.positive,
        neutral: counts.neutral,
        negative: counts.negative
      }));
      
      // Sort by date
      lineData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setLineChartData(lineData);
    }
  }, [feedbackData, chartType]);

  if (feedbackData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No feedback data available</p>
      </div>
    );
  }

  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={lineChartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="positive" 
          stroke="#10b981" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          type="monotone" 
          dataKey="neutral" 
          stroke="#f59e0b" 
        />
        <Line 
          type="monotone" 
          dataKey="negative" 
          stroke="#ef4444" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SentimentChart;
