import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const operators = ["Alice", "Bob", "Charlie"];
const chemicals = ["Acid", "Base", "Solvent"];

function TankCard({ tank, index, updateTank }) {
  const handleQualityToggle = () => {
    const newQuality = !tank.quality;
    const newHistory = [
      ...tank.history,
      {
        time: new Date().toLocaleTimeString(),
        quality: newQuality ? 1 : 0,
      },
    ];
    updateTank(index, { quality: newQuality, history: newHistory });
  };

  const handleStatusToggle = () => {
    updateTank(index, { active: !tank.active });
  };

  const latestStatus = tank.quality ? "Acceptable" : "Not Acceptable";
  const statusColor = tank.quality ? "bg-green-200" : "bg-red-200";
  const statusTextColor = tank.quality ? "text-green-800" : "text-red-800";

  const tankStatusColor = tank.active ? "bg-green-200" : "bg-gray-300";
  const tankStatusTextColor = tank.active ? "text-green-800" : "text-gray-800";

  return (
    <div className="bg-white rounded-2xl p-4 shadow mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Tank {index + 1}</h2>
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${tankStatusColor} ${tankStatusTextColor}`}
        >
          {tank.active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mb-2">
        <label className="font-semibold mr-2">Tank Status:</label>
        <input
          type="checkbox"
          checked={tank.active}
          onChange={handleStatusToggle}
        />
      </div>

      <div className="mb-2">
        <label className="font-semibold">Operator:</label>
        <select
          className="ml-2 border p-1 rounded"
          value={tank.operator}
          onChange={(e) =>
            updateTank(index, { operator: e.target.value })
          }
          disabled={!tank.active}
        >
          <option value="">Select</option>
          {operators.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="font-semibold">Chemical:</label>
        <select
          className="ml-2 border p-1 rounded"
          value={tank.chemical}
          onChange={(e) =>
            updateTank(index, { chemical: e.target.value })
          }
          disabled={!tank.active}
        >
          <option value="">Select</option>
          {chemicals.map((chem) => (
            <option key={chem} value={chem}>
              {chem}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2 flex items-center gap-4">
        <div>
          <label className="font-semibold mr-2">Quality Acceptable:</label>
          <input
            type="checkbox"
            checked={tank.quality}
            onChange={handleQualityToggle}
            disabled={!tank.active}
          />
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor} ${statusTextColor}`}
        >
          {latestStatus}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-1">Batch Quality History</h3>
        {tank.history.length === 0 ? (
          <p className="text-sm text-gray-500">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={tank.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={10} />
              <YAxis
                ticks={[0, 1]}
                domain={[0, 1]}
                tickFormatter={(val) => (val === 1 ? "✔" : "✖")}
              />
              <Tooltip
                formatter={(val) => (val === 1 ? "Acceptable" : "Not Acceptable")}
              />
              <Line
                type="monotone"
                dataKey="quality"
                stroke="#0f766e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function App() {
  const [tanks, setTanks] = useState([
    { operator: "", chemical: "", quality: true, active: true, history: [] },
    { operator: "", chemical: "", quality: true, active: true, history: [] },
    { operator: "", chemical: "", quality: true, active: true, history: [] },
  ]);

  const updateTank = (index, updates) => {
    const newTanks = [...tanks];
    newTanks[index] = { ...newTanks[index], ...updates };
    setTanks(newTanks);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Chemical Tank Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tanks.map((tank, index) => (
          <TankCard
            key={index}
            tank={tank}
            index={index}
            updateTank={updateTank}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
