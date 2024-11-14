import { useState } from "react";
//for making shapes and pre-rendering them for users
// eslint-disable-next-line react/prop-types
function Showshape({ onShapeClick }) {
  const [shapes] = useState([
    { type: "rect", width: 100, height: 100, color: "#100a09" },
    { type: "circle", radius: 50, color: "#100a09" },
    { type: "ellipse", radiusX: 60, radiusY: 40, color: "#100a09" },
    {
      type: "line",
      points: [0, 0, 100, 100],
      stroke: "#100a09",
      strokeWidth: 10,
    },
    { type: "polygon", points: [30, 10, 80, 80, 10, 80], color: "#100a09" },
    {
      type: "star",
      numPoints: 5,
      innerRadius: 20,
      outerRadius: 40,
      color: "#100a09",
    },
    { type: "text", text: "Sample Text", fontSize: 24, color: "#100a09" },
    {
      type: "arrow",
      points: [0, 0, 100, 50],
      pointerLength: 10,
      pointerWidth: 20,
      color: "#100a09",
    },
  ]);

  return (
    <div>
      <h1>Shapes</h1>
      {shapes.map((shape, index) => (
        <div
          key={index}
          style={{
            backgroundColor: shape.color,
            padding: "10px",
            margin: "5px",
            cursor: "pointer",
            color: "white",
          }}
          onClick={() => onShapeClick(shape)}
        >
          {shape.type}
        </div>
      ))}
    </div>
  );
}

export default Showshape;
