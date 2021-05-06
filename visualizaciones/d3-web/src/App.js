import React, { useState, useEffect } from "react";
import LineChart from "./components/LineChart";
import axios from "axios";

import "./App.css";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    regenerateData();
  }, []);

  function regenerateData() {
    axios.get(`http://localhost:5000/empresas/SAN`).then((res) => {
      console.log(res.data);
      res.data.shift();
      const tempData = res.data.map((x) => {
        x[0] = new Date(x[0]).getTime();
        return x;
      });
      setData(tempData);
    });
  }

  return (
    <div className="App">
      <button onClick={regenerateData}>Change Data</button>
      {data.length > 0 && <LineChart data={data} width={400} height={300} />}
    </div>
  );
}

export default App;
