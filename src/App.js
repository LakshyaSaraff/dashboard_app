import React, { useEffect, useState } from "react";

const operators = ["Alice", "Bob", "Charlie"];
const chemicals = ["Acid", "Base", "Solvent"];

function generateDummyBatch() {
  return {
    time: new Date().toLocaleTimeString(),
    quality: Math.random() > 0.5 ? "Acceptable" : "Not Acceptable",
  };
}

function TankCard({ tank, index, updateTank }) {
  const [temperature, setTemperature] = useState(
    Math.floor(20 + Math.random() * 30)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const temp = Math.floor(20 + Math.random() * 30);
      setTemperature(temp);

      // Simulate a new batch every 10 seconds
      if (Math.random() > 0.85) {
        updateTank(index, {
          batches: [
            ...tank.batches,
            {
              time: new Date().toLocaleTimeString(),
              quality: tank.quality ? "Acceptable" : "Not Acceptable",
            },
          ],
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tank, index, updateTank]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow mb-6">
      <h2 className="text-lg font-bold mb-2">Tank {index + 1}</h2>

      <div className="mb-2">
        <span className="font-semibold">Temperature: </span>
        {temperature}°C
      </div>

      <div className="mb-2">
        <label className="font-semibold">Operator:</label>
        <select
          className="ml-2 border p-1 rounded"
          value={tank.operator}
          onChange={(e) =>
            updateTank(index, { operator: e.target.value })
          }
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
        >
          <option value="">Select</option>
          {chemicals.map((chem) => (
            <option key={chem} value={chem}>
              {chem}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="font-semibold mr-2">Quality Acceptable:</label>
        <input
          type="checkbox"
          checked={tank.quality}
          onChange={() =>
            updateTank(index, { quality: !tank.quality })
          }
        />
      </div>

      <div>
        <h3 className="font-semibold mt-4 mb-1">Today’s Batches</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">Time</th>
              <th className="border p-1">Quality</th>
            </tr>
          </thead>
          <tbody>
            {tank.batches.map((b, i) => (
              <tr key={i}>
                <td className="border p-1 text-center">{b.time}</td>
                <td className="border p-1 text-center">{b.quality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [tanks, setTanks] = useState([
    { operator: "", chemical: "", quality: true, batches: [] },
    { operator: "", chemical: "", quality: true, batches: [] },
    { operator: "", chemical: "", quality: true, batches: [] },
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
