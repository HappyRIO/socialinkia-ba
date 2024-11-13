import { Logs } from "lucide-react";
import { useState } from "react";
// Layer Manager component to list and reorder layers
// eslint-disable-next-line react/prop-types
function ShowLayerManager({ layerRef }) {
  // eslint-disable-next-line react/prop-types
  const layerChildren = layerRef.current.getChildren();

  // Convert the layerChildren to a state to update UI on reordering
  const [children, setChildren] = useState(layerChildren);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (draggedIndex === targetIndex) return;

    // Rearrange children based on the drag-and-drop action
    const reorderedChildren = [...children];
    const [draggedChild] = reorderedChildren.splice(draggedIndex, 1);
    reorderedChildren.splice(targetIndex, 0, draggedChild);

    // Update the state to trigger UI re-render
    setChildren(reorderedChildren);

    // Update the layer with the new order
    reorderedChildren.forEach((child, index) => {
      child.zIndex(index); // Update z-index on Konva layer
    });
    // eslint-disable-next-line react/prop-types
    layerRef.current.batchDraw();
  };

  return (
    <ul className="flex flex-col gap-2 px-2">
      {children.map((child, index) => (
        <div
          key={child._id} // Ensure each Konva object has a unique ID
          className="px-2 py-2 bg-gray-300 flex flex-row gap-2 cursor-pointer rounded-lg shadow-md"
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <div className="w-fit cursor-pointer">
            <Logs />
          </div>
          <li>
            {child.className} - {child.attrs.name || `Object ${index + 1}`}
          </li>
        </div>
      ))}
    </ul>
  );
}

export default ShowLayerManager;
