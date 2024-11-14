
const handleColorChange = (e) => {
  const newColor = e.target.value;
  setActiveAttributes((prevAttributes) => ({
    ...prevAttributes,
    fill: newColor,
  }));

  // Apply the color change to the active shape
  if (activeShape) {
    activeShape.fill(newColor);
    activeShape.getLayer().batchDraw(); // Redraw the layer to apply changes
  }
};

export { handleColorChange };
