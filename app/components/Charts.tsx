// components/Charts.tsx

"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'chart.js/auto';


const API_URL = process.env.NEXT_BASE_COMMERCE_API_URL || "http://localhost:4000/api";

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

const Charts = () => {
  const [chartData, setChartData] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
  
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(`${API_URL}/purchase/barchart`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming you're storing token in local storage
          },
        });
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        setChartData(result.data); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Number of Purchases',
        data: chartData.data,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '700px', height: '700px' }}>
      <h1>Purchase Records Bar Chart</h1>
      <Bar data={data} />
    </div>
  );
};

export default Charts;
