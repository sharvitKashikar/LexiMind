import { Bar, Radar, Line } from "recharts";
import { BarChart, RadarChart, LineChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const BarChartComponent = ({
  data,
  xKey = "name",
  yKey = "value",
  height = 300,
  colors = ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#a78bfa"],
  xlabel = "Keywords",
  ylabel = "TF-IDF Score",
}: {
  data: any[];
  xKey?: string;
  yKey?: string;
  height?: number;
  colors?: string[];
  xlabel?: string;
  ylabel?: string;
}) => {
  // Assign colors to data points
  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={dataWithColors} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={xKey} 
          label={{ value: xlabel, position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: ylabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Bar dataKey={yKey} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const RadarChartComponent = ({
  data,
  categories,
  height = 300,
  datasets,
}: {
  data: any[];
  categories: string[];
  height?: number;
  datasets: Array<{
    name: string;
    color: string;
    fillColor: string;
  }>;
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        {datasets.map((dataset, index) => (
          <Radar
            key={index}
            name={dataset.name}
            dataKey={`value${index + 1}`}
            stroke={dataset.color}
            fill={dataset.fillColor}
            fillOpacity={0.2}
          />
        ))}
        <Legend />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const LineChartComponent = ({
  data,
  xKey = "name",
  lines,
  height = 300,
  xlabel = "X Axis",
  ylabel = "Y Axis",
}: {
  data: any[];
  xKey?: string;
  lines: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  height?: number;
  xlabel?: string;
  ylabel?: string;
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xKey} 
          label={{ value: xlabel, position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: ylabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            name={line.name}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
