import { useEffect, useState } from "react";
//for fetching templates from the server
function Showtemplates() {
  const [template, setTemplate] = useState([]);

  useEffect(() => {
    fetch("/api/templates") // adjust API path as needed
      .then((response) => response.json())
      .then((data) => setTemplate(data))
      .catch((error) => console.error("Error fetching templates:", error));
  }, []);

  return (
    <div>
      <h1>Templates</h1>
      <ul>
        {template.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Showtemplates;
