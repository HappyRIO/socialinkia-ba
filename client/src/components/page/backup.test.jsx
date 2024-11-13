import {
  Shapes,
  SwatchBook,
  MonitorUp,
  CaseUpper,
  CopyX,
  Layers3,
} from "lucide-react";
import { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import Showtemplates from "../editor/ShowTemplate";
import Showshape from "../editor/Showshape";
import Showfonts from "../editor/Showfonts";
import ShowLayerManager from "../editor/Showlayermanager";
import Showuploads from "../editor/Showuploads";
import EditingPanel from "../editor/Editingpanel";

export default function Tester() {
  const [openUploads, setOpenuploads] = useState(false);
  const [openTextelement, setOpentextelement] = useState(false);
  const [openshapelement, setopenshapeelement] = useState(false);
  const [opentemplate, setopentemplate] = useState(false);
  const [openLayermanager, setopenLayermanager] = useState(false);
  // toolbar activities
  const [activeShape, setActiveShape] = useState(null);
  const [activeAttributes, setActiveAttributes] = useState(null);
  const [originalAttributes, setOriginalAttributes] = useState({});

  // ref for the layer and stage
  const layerRef = useRef(null); // Defining the Layer ref
  const stageRef = useRef(null);

  function handleCloseSideBarMenu() {
    setOpenuploads(false);
    setOpentextelement(false);
    setopenshapeelement(false);
    setopentemplate(false);
    setopenLayermanager(false);
  }
  function handleopentemplate() {
    setOpenuploads(false);
    setopenLayermanager(false);
    setOpentextelement(false);
    setopenshapeelement(false);
    setopentemplate(!opentemplate);
  }
  function handleopenuploads() {
    setOpentextelement(false);
    setopenshapeelement(false);
    setopentemplate(false);
    setopenLayermanager(false);
    setOpenuploads(!openUploads);
  }
  function handleopenshape() {
    setOpenuploads(false);
    setOpentextelement(false);
    setopentemplate(false);
    setopenLayermanager(false);
    setopenshapeelement(!openshapelement);
  }
  function handleopentext() {
    setOpenuploads(false);
    setopentemplate(false);
    setopenshapeelement(false);
    setopenLayermanager(false);
    setOpentextelement(!openTextelement);
  }
  function handleopenlayermanager() {
    setOpenuploads(false);
    setOpentextelement(false);
    setopenshapeelement(false);
    setopentemplate(false);
    setopenLayermanager(!openLayermanager);
  }

  //function for draging elements
  const handleDragStart = (e) => {
    const target = e.target;

    // Deactivate any previously active shape before setting the new active shape
    if (activeShape && activeShape !== target) {
      activeShape.stroke(null); // Remove outline color
      activeShape.strokeWidth(0); // Reset outline width
      activeShape.shadowEnabled(false); // Remove shadow
      activeShape.getLayer().batchDraw(); // Redraw layer for immediate effect
    }

    // Store the original attributes so they can be restored on drag end
    setOriginalAttributes({
      // Only store attributes needed for restoring outlines
      stroke: target.stroke(),
      strokeWidth: target.strokeWidth(),
    });

    // Determine the stroke color based on the element's current color
    const outlineColor = target.fill() === "blue" ? "red" : "blue";

    // Apply temporary attributes for drag start feedback (only outline)
    target.setAttrs({
      stroke: outlineColor,
      strokeWidth: 2,
    });

    // Set the dragged element as the active shape
    setActiveShape(target);
  };

  // Function to handle drag end
  const handleDragEnd = (e) => {
    const target = e.target;

    // Immediately reset outline attributes before animation
    target.stroke(originalAttributes.stroke || null); // Restore original stroke color
    target.strokeWidth(originalAttributes.strokeWidth || 0); // Reset stroke width

    // Restore other original attributes with animation (if needed)
    target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      ...originalAttributes, // Restore all stored attributes
    });

    // Set the dragged element as inactive after drag ends
    setActiveShape(null);
    console.log("drag ends");
    console.log("reset active element to null");
    console.log(activeShape);
  };

  // Function to handle stage click to clear selection
  const handleStageClick = () => {
    if (activeShape) {
      // Remove outline, shadow, and other styling from the active shape
      activeShape.stroke(null);
      activeShape.strokeWidth(0);
      activeShape.shadowEnabled(false);
      activeShape.getLayer().batchDraw(); // Redraw layer for immediate effect

      // Clear active shape selection
      setActiveShape(null);
    }
    console.log("Selection cleared");
  };

  const handleAddImage = (url) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous"; // To avoid CORS issues for exporting
    img.src = url;
    img.onload = () => {
      const imageNode = new Konva.Image({
        x: 50,
        y: 50,
        image: img,
        width: img.width / 2,
        height: img.height / 2,
        draggable: true,
      });

      imageNode.on("click", handleObjectClick);
      imageNode.on("dragstart", handleDragStart);
      imageNode.on("dragend", handleDragEnd);

      layerRef.current.add(imageNode);
      layerRef.current.batchDraw();
    };
  };

  function handleAddTextWithFont(font) {
    const newText = "simple text ..... ";
    const textNode = new window.Konva.Text({
      text: newText,
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: font.style.fontFamily, // Apply selected font family
      fill: "black",
      draggable: true,
    });

    // Attach event handlers if needed
    textNode.on("click", handleObjectClick);
    textNode.on("dragstart", handleDragStart);
    textNode.on("dragend", handleDragEnd);

    // Add the text node to the layer
    layerRef.current.add(textNode);
    layerRef.current.batchDraw();
  }

  function handleAddShape(shape) {
    let shapeNode;

    if (shape.type === "rect") {
      shapeNode = new window.Konva.Rect({
        x: 50,
        y: 50,
        width: shape.width,
        height: shape.height,
        fill: shape.color,
        draggable: true,
      });
    } else if (shape.type === "circle") {
      shapeNode = new window.Konva.Circle({
        x: 50,
        y: 50,
        radius: shape.radius,
        fill: shape.color,
        draggable: true,
      });
    } else if (shape.type === "ellipse") {
      shapeNode = new window.Konva.Ellipse({
        x: 50,
        y: 50,
        radiusX: shape.radiusX,
        radiusY: shape.radiusY,
        fill: shape.color,
        draggable: true,
      });
    } else if (shape.type === "line") {
      shapeNode = new window.Konva.Line({
        x: 50,
        y: 50,
        points: shape.points,
        stroke: shape.stroke,
        strokeWidth: shape.strokeWidth,
        draggable: true,
      });
    } else if (shape.type === "polygon") {
      shapeNode = new window.Konva.Line({
        x: 50,
        y: 50,
        points: shape.points,
        closed: true,
        fill: shape.color,
        draggable: true,
      });
    } else if (shape.type === "star") {
      shapeNode = new window.Konva.Star({
        x: 50,
        y: 50,
        numPoints: shape.numPoints,
        innerRadius: shape.innerRadius,
        outerRadius: shape.outerRadius,
        fill: shape.color,
        draggable: true,
      });
    } else if (shape.type === "text") {
      shapeNode = new window.Konva.Text({
        x: 50,
        y: 50,
        text: shape.text,
        fontSize: shape.fontSize,
        fill: shape.color,
        draggable: true,
      });
    } else if (shape.type === "arrow") {
      shapeNode = new window.Konva.Arrow({
        x: 50,
        y: 50,
        points: shape.points,
        pointerLength: shape.pointerLength,
        pointerWidth: shape.pointerWidth,
        fill: shape.color,
        draggable: true,
      });
    }

    // Attach event handlers
    if (shapeNode) {
      shapeNode.on("click", handleObjectClick);
      shapeNode.on("dragstart", handleDragStart);
      shapeNode.on("dragend", handleDragEnd);

      // Add shape to the layer
      layerRef.current.add(shapeNode);
      layerRef.current.batchDraw();
    }
  }

  // object selection function
  const handleObjectClick = (e) => {
    const clickedElement = e.target;

    // Reset the outline of the previously active element, if any
    if (activeShape && activeShape !== clickedElement) {
      activeShape.stroke(null); // Remove outline color
      activeShape.strokeWidth(0); // Reset outline width
      activeShape.shadowEnabled(false); // Remove shadow
      activeShape.getLayer().batchDraw(); // Redraw layer for immediate effect
    }

    // Set the clicked element as the active shape
    setActiveShape(clickedElement);

    // Initialize an object to hold all attributes
    const attributes = {};

    // Loop through each attribute of the clicked element and capture them
    const attrs = clickedElement.attrs;
    for (let key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        // Capture function-returning attributes by calling them
        attributes[key] =
          typeof attrs[key] === "function" ? attrs[key]() : attrs[key];
      }
    }

    // Manually set common attributes that may not be in attrs
    attributes.x = clickedElement.x();
    attributes.y = clickedElement.y();
    attributes.width = clickedElement.width();
    attributes.height = clickedElement.height();
    attributes.scaleX = clickedElement.scaleX();
    attributes.scaleY = clickedElement.scaleY();
    attributes.rotation = clickedElement.rotation();
    attributes.opacity = clickedElement.opacity();
    attributes.fill = clickedElement.fill() || "#000000";
    attributes.stroke = clickedElement.stroke() || "#000000";
    attributes.strokeWidth = clickedElement.strokeWidth() || 0;
    attributes.shadowColor = clickedElement.shadowColor() || "#000000";
    attributes.shadowBlur = clickedElement.shadowBlur() || 0;
    attributes.shadowOffsetX = clickedElement.shadowOffsetX() || 0;
    attributes.shadowOffsetY = clickedElement.shadowOffsetY() || 0;

    // Special handling for Text objects
    if (clickedElement.className === "Text") {
      attributes.fontFamily = clickedElement.fontFamily() || "Arial";
      attributes.fontSize = clickedElement.fontSize() || 24;
      attributes.fontStyle = clickedElement.fontStyle() || "normal";
      attributes.text = clickedElement.text() || "";
      attributes.align = clickedElement.align() || "left";
    }

    // Special handling for Star objects
    if (clickedElement.className === "Star") {
      attributes.numPoints = clickedElement.numPoints() || 5;
      attributes.innerRadius = clickedElement.innerRadius() || 0;
      attributes.outerRadius = clickedElement.outerRadius() || 0;
    }

    // Add unique name or identifier if available
    attributes.name = clickedElement.name() || "";

    // Update state with the gathered attributes for editing
    setActiveAttributes(attributes);

    // Apply a blue outline to indicate active selection
    clickedElement.stroke("blue");
    clickedElement.strokeWidth(2);
    clickedElement.getLayer().batchDraw(); // Redraw layer to apply changes

    console.log("Active element:", clickedElement);
    console.log("Captured attributes:", attributes);
  };

  // Function to update properties of the active shape
  const updateActiveShapeAttributes = (updatedAttribute) => {
    if (!activeShape) return;

    // Update specific attributes of the active shape
    Object.keys(updatedAttribute).forEach((key) => {
      if (typeof activeShape[key] === "function") {
        activeShape[key](updatedAttribute[key]); // Set values for function-valued attributes
      } else {
        activeShape.setAttr(key, updatedAttribute[key]); // Set other attributes
      }
    });

    // Redraw layer for immediate effect
    activeShape.getLayer().batchDraw();

    // Update state with the merged attributes
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      ...updatedAttribute,
    }));
  };

  return (
    <div className="w-full h-screen flex flex-row bg-green-200">
      <div className="elementsbar bg-green-500 w-[80px] py-3 flex flex-col justify-evenly items-center">
        <div id="layer-manager sidebar">
          <button
            onClick={handleopenlayermanager}
            className="flex flex-col justify-center items-center text-[15px] hover:text-red-500"
          >
            <Layers3 />
            <p>layer</p>
          </button>
        </div>
        <div id="layer-manager sidebar">
          <button
            onClick={handleopenlayermanager}
            className="flex flex-col justify-center items-center text-[15px] hover:text-red-500"
          >
            <Layers3 />
            <p>layer</p>
          </button>
        </div>
        <div id="design sidebar">
          <button
            onClick={handleopentemplate}
            className="flex flex-col justify-center items-center text-[15px] hover:text-red-500"
          >
            <SwatchBook />
            <p>design</p>
          </button>
        </div>
        <div id="elements sidebar">
          <button
            onClick={handleopenshape}
            className="flex flex-col justify-center items-center text-[15px] hover:text-red-500"
          >
            <Shapes />
            <p>elements</p>
          </button>
        </div>
        <div id="text sidebar">
          <button
            onClick={handleopentext}
            className="flex flex-col justify-center items-center text-[15px] hover:text-red-500"
          >
            <CaseUpper />
            <p>text</p>
          </button>
        </div>
        <div id="uploads sidebar">
          <button
            onClick={handleopenuploads}
            className="flex flex-col justify-center items-center text-[15px] hover:text-red-500"
          >
            <MonitorUp />
            <p>uploads</p>
          </button>
        </div>
      </div>
      {/* openLayermanager */}
      {openLayermanager && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] absolute overflow-x-hidden bg-background shadow-lg w-full rounded-lg  h-screen max-h-[97%] max-w-[400px] my-[1%]">
          <div className="topinnerspace w-full flex justify-end items-center p-4">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <ShowLayerManager stageRef={stageRef} layerRef={layerRef} />
        </div>
      )}
      {openUploads && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] absolute overflow-x-hidden bg-background shadow-lg w-full rounded-lg  h-screen max-h-[97%] max-w-[400px] my-[1%]">
          <div className="topinnerspace w-full flex justify-end items-center p-4">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showuploads onClick={handleAddImage} />
        </div>
      )}
      {openTextelement && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] absolute overflow-x-hidden bg-background shadow-lg w-full rounded-lg  h-screen max-h-[97%] max-w-[400px] my-[1%]">
          <div className="topinnerspace w-full flex justify-end items-center p-4">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <div className="fonts-lister-zone w-full flex justify-center items-center">
            <Showfonts onFontClick={(font) => handleAddTextWithFont(font)} />
          </div>
        </div>
      )}
      {openshapelement && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] absolute overflow-x-hidden bg-background shadow-lg w-full rounded-lg  h-screen max-h-[97%] max-w-[400px] my-[1%]">
          <div className="topinnerspace w-full flex justify-end items-center p-4">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showshape onShapeClick={handleAddShape} />
        </div>
      )}
      {opentemplate && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] absolute overflow-x-hidden bg-background shadow-lg w-full rounded-lg  h-screen max-h-[97%] max-w-[400px] my-[1%]">
          <div className="topinnerspace w-full flex justify-end items-center p-4">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showtemplates />
        </div>
      )}
      <div className="board w-full bg-red-900 flex flex-col gap-2 p-2 h-full">
        <div className="canvas w-full h-full flex flex-col justify-center items-center rounded-lg bg-yellow-500">
          <Stage
            width={400}
            height={600}
            ref={stageRef}
            onMouseDown={handleStageClick}
            style={{ backgroundColor: "lightgray" }}
          >
            <Layer ref={layerRef}></Layer>
          </Stage>
        </div>
      </div>
      <div className="main-side-pannel w-full max-w-[400px] p-2">
        <EditingPanel
          activeAttributes={activeAttributes || {}} // Default to an empty object if null
          onUpdateAttributes={updateActiveShapeAttributes}
        />
      </div>
    </div>
  );
}
