import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient'; // adjust the path if needed

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF4081'];

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTypeData = async () => {
      const { data: announcements, error } = await supabase
        .from('announcements')
        .select('type');

      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }

      const countByType = {};
      announcements.forEach((a) => {
        countByType[a.type] = (countByType[a.type] || 0) + 1;
      });

      const formatted = Object.keys(countByType).map((type) => ({
        name: type,
        value: countByType[type],
      }));

      setData(formatted);
    };

    fetchTypeData();
  }, []);

  // custom label function to show percent
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Announcement Types</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
