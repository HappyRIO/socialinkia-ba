import { useState } from "react";
//for making shapes and pre-rendering them for users
// eslint-disable-next-line react/prop-types
function Showshape({ onShapeClick }) {
  const [shapes] = useState([
    { type: "rect", width: 100, height: 100, color: "gray" },
    { type: "circle", radius: 50, color: "gray" },
    { type: "ellipse", radiusX: 60, radiusY: 40, color: "lightblue" },
    { type: "line", points: [0, 0, 100, 100], stroke: "black", strokeWidth: 10 },
    { type: "polygon", points: [30, 10, 80, 80, 10, 80], color: "purple" },
    {
      type: "star",
      numPoints: 5,
      innerRadius: 20,
      outerRadius: 40,
      color: "gold",
    },
    { type: "text", text: "Sample Text", fontSize: 24, color: "black" },
    {
      type: "arrow",
      points: [0, 0, 100, 50],
      pointerLength: 10,
      pointerWidth: 20,
      color: "red",
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
