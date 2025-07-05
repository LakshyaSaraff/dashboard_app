import React, { useState, useEffect } from "react";
import {
  Line,
  Doughnut
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const TankCard = ({ tank, onToggle, onExpand, onFinish }) => {
  const currentStatusColor =
    tank.status === "In Production"
      ? "bg-blue-200 text-blue-800"
      : tank.status === "OK"
      ? "bg-green-200 text-green-800"
      : "bg-red-200 text-red-800";

  const doughnutData = {
    labels: ["Temperature", "Remaining"],
    datasets: [
      {
        data: [tank.temperature, 200 - tank.temperature],
        backgroundColor: ["#3b82f6", "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow relative flex flex-col justify-between min-h-[600px] h-[750px]">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Tank {tank.id}</h2>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${currentStatusColor}`}>
            {tank.status}
          </span>
        </div>

        <div className="mt-2 space-y-1">
          <p><strong>Batch:</strong> {tank.batchNumber}</p>
          <p><strong>Incharge:</strong> {tank.incharge}</p>
          <p><strong>Material:</strong> {tank.material}</p>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <label className="font-semibold">Batch OK:</label>
          <input
            type="checkbox"
            checked={tank.ok}
            onChange={() => onToggle(tank.id)}
          />
        </div>
      </div>

      {/* Larger Doughnut chart with temperature in center */}
      <div className="flex justify-center mt-6 mb-2">
        <div className="w-110 h-110 relative flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-blue-700">{tank.temperature}°C</span>
            <span className="text-xs text-gray-500">Current Temp</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="text-sm text-blue-600 underline"
          onClick={() => onExpand(tank.id)}
        >
          Expand
        </button>
        <button
          className="text-sm text-red-600 underline"
          onClick={() => onFinish(tank.id)}
        >
          Finish Batch
        </button>
      </div>
    </div>
  );
};

const ExpandedTank = ({ tank, onClose }) => {
  const chartData = {
    labels: tank.temperatureHistory.map((entry) => entry.time),
    datasets: [
      {
        label: "Temperature (°C)",
        data: tank.temperatureHistory.map((entry) => entry.value),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-3xl">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Tank {tank.id} Details</h3>
          <button className="text-red-500" onClick={onClose}>Close</button>
        </div>
        <Line data={chartData} />
      </div>
    </div>
  );
};

const BatchForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    id: '',
    batchNumber: '',
    incharge: '',
    material: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Start New Batch</h2>
      <input name="id" value={form.id} onChange={handleChange} placeholder="Tank ID (1-3)" className="border p-2 w-full rounded" required />
      <input name="batchNumber" value={form.batchNumber} onChange={handleChange} placeholder="Batch Number" className="border p-2 w-full rounded" required />
      <input name="incharge" value={form.incharge} onChange={handleChange} placeholder="Incharge" className="border p-2 w-full rounded" required />
      <input name="material" value={form.material} onChange={handleChange} placeholder="Production Material" className="border p-2 w-full rounded" required />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Start Batch</button>
    </form>
  );
};

const App = () => {
  const [tanks, setTanks] = useState([
    { id: 1, batchNumber: "", incharge: "", material: "", temperature: 0, ok: true, status: "", temperatureHistory: [] },
    { id: 2, batchNumber: "", incharge: "", material: "", temperature: 0, ok: false, status: "", temperatureHistory: [] },
    { id: 3, batchNumber: "", incharge: "", material: "", temperature: 0, ok: true, status: "", temperatureHistory: [] },
  ]);

  const [expandedTankId, setExpandedTankId] = useState(null);
  const [tab, setTab] = useState("monitor");

  useEffect(() => {
    const interval = setInterval(() => {
      setTanks((prev) =>
        prev.map((tank) => {
          if (!tank.batchNumber) return tank;
          const temp = (Math.random() * 50).toFixed(2);
          const time = new Date().toLocaleTimeString();
          return {
            ...tank,
            temperature: temp,
            status: tank.ok ? "OK" : "Not OK",
            temperatureHistory: [...tank.temperatureHistory.slice(-19), { time, value: temp }],
          };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleBatchStatus = (id) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === id ? { ...tank, ok: !tank.ok, status: !tank.ok ? "OK" : "Not OK" } : tank
      )
    );
  };

  const expandTank = (id) => setExpandedTankId(id);
  const closeExpanded = () => setExpandedTankId(null);

  const finishBatch = (id) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === id ? { ...tank, batchNumber: "", incharge: "", material: "", status: "", temperatureHistory: [] } : tank
      )
    );
  };

  const handleStartBatch = ({ id, batchNumber, incharge, material }) => {
    const numId = parseInt(id);
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === numId
          ? {
              ...tank,
              batchNumber,
              incharge,
              material,
              status: "In Production",
              ok: true,
              temperature: 0,
              temperatureHistory: [],
            }
          : tank
      )
    );
    setTab("monitor");
  };

  const expandedTank = tanks.find((tank) => tank.id === expandedTankId);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chemical Tank Dashboard</h1>
        <div className="space-x-4">
          <button onClick={() => setTab("monitor")} className={`px-3 py-1 rounded ${tab === "monitor" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}>Monitor</button>
          <button onClick={() => setTab("entry")} className={`px-3 py-1 rounded ${tab === "entry" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}>Start Batch</button>
        </div>
      </div>

      {tab === "monitor" ? (
        <div className="grid md:grid-cols-3 gap-4">
          {tanks.map((tank) => (
            <TankCard
              key={tank.id}
              tank={tank}
              onToggle={toggleBatchStatus}
              onExpand={expandTank}
              onFinish={finishBatch}
            />
          ))}
        </div>
      ) : (
        <BatchForm onSubmit={handleStartBatch} />
      )}

      {expandedTank && <ExpandedTank tank={expandedTank} onClose={closeExpanded} />}
    </div>
  );
};

export default App;
