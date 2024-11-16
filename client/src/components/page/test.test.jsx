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

export default function Tester() {
  const [openUploads, setOpenuploads] = useState(false);
  const [openTextelement, setOpentextelement] = useState(false);
  const [openshapelement, setopenshapeelement] = useState(false);
  const [opentemplate, setopentemplate] = useState(false);
  const [openLayermanager, setopenLayermanager] = useState(false);
  // toolbar activities
  const [activeShape, setActiveShape] = useState(null);
  // const [activeAttributes, setActiveAttributes] = useState(null);
  const [activeAttributes, setActiveAttributes] = useState({
    translateY: 0,
    translateX: 0,
    scaleY: 1,
    scaleX: 1,
    rotate: 0,
    // starPoints: 5,
    name: "",
    numPoints: 5,
    fontFamily: "Arial",
    fontWeight: "normal",
    opacity: 1,
    fill: "#100a09",
    stroke: "#000000",
    strokeWidth: 0,
    shadowEnabled: false,
    shadowColor: "#000000",
    shadowBlur: 0,
    shadowX: 0,
    shadowY: 0,
    radius: 0,
    gussianBlurRange: 0,
    width: 100,
    height: 100,
    type: "text",
  });
  const [originalAttributes, setOriginalAttributes] = useState({});
  //locking seetings
  const [isSettingsVisible, setIsSettingsVisible] = useState(true);
  const [isScaleLock, setisScaleLock] = useState(false);
  // control function states
  const [handleBorderState, setHandleBorderState] = useState(false);
  const [handleShadowState, setHandleShadowState] = useState(false);
  // ref for the layer and stage
  const layerRef = useRef(null); // Defining the Layer ref
  const stageRef = useRef(null);

  const handleScaleLock = () => {
    setisScaleLock((prevState) => !prevState);
  };

  const toggleSettingsVisibility = () => {
    setIsSettingsVisible((prevState) => !prevState);
  };

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

  // element editing funtions zone
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

  const handleScaleYChange = (e) => {
    const newScaleY = parseFloat(e.target.value);
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      scaleY: newScaleY,
      scaleX: isScaleLock
        ? newScaleY * (prevAttributes.scaleX / prevAttributes.scaleY)
        : prevAttributes.scaleX,
    }));

    if (activeShape) {
      activeShape.scaleY(newScaleY);
      if (isScaleLock) {
        const newScaleX =
          newScaleY * (activeShape.scaleX() / activeShape.scaleY());
        activeShape.scaleX(newScaleX);
      }
      activeShape.getLayer().batchDraw();
    }
  };

  const handleScaleXChange = (e) => {
    const newScaleX = parseFloat(e.target.value);
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      scaleX: newScaleX,
      scaleY: isScaleLock
        ? newScaleX * (prevAttributes.scaleY / prevAttributes.scaleX)
        : prevAttributes.scaleY,
    }));

    if (activeShape) {
      activeShape.scaleX(newScaleX);
      if (isScaleLock) {
        const newScaleY =
          newScaleX * (activeShape.scaleY() / activeShape.scaleX());
        activeShape.scaleY(newScaleY);
      }
      activeShape.getLayer().batchDraw();
    }
  };

  const handleLocationYChange = (e) => {
    const newTranslateY = parseFloat(e.target.value);
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      translateY: newTranslateY,
    }));

    if (activeShape) {
      activeShape.y(newTranslateY);
      activeShape.getLayer().batchDraw();
    }
  };

  const handleLocationXChange = (e) => {
    const newTranslateX = parseFloat(e.target.value);
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      translateX: newTranslateX,
    }));

    if (activeShape) {
      activeShape.x(newTranslateX);
      activeShape.getLayer().batchDraw();
    }
  };

  const handleChangeStarPoints = (e) => {
    const newStarPoints = parseInt(e.target.value, 10);
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      numPoints: newStarPoints,
    }));

    if (activeShape && activeAttributes.type === "star") {
      activeShape.numPoints(newStarPoints);
      activeShape.getLayer().batchDraw(); // Redraw the layer to apply changes
    }
  };

  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      opacity: newOpacity,
    }));

    if (activeShape) {
      activeShape.opacity(newOpacity);
      activeShape.getLayer().batchDraw(); // Redraw the layer to apply changes
    }
  };

  const handleBorderColorChange = (e) => {
    const newBorderColor = e.target.value;
    if (handleBorderState === true) {
      setActiveAttributes((prevAttributes) => ({
        ...prevAttributes,
        borderColor: newBorderColor,
      }));

      if (activeShape) {
        activeShape.stroke(newBorderColor);
        activeShape.getLayer().batchDraw(); // Redraw the layer to apply changes
      }
    }
  };

  const handleBorderWidthChange = (e) => {
    const newBorderWidth = parseFloat(e.target.value);
    if (handleBorderState === true) {
      setActiveAttributes((prevAttributes) => ({
        ...prevAttributes,
        borderWidth: newBorderWidth,
      }));

      if (activeShape) {
        activeShape.strokeWidth(newBorderWidth);
        activeShape.getLayer().batchDraw(); // Redraw the layer to apply changes
      }
    }
  };

  const handleCornerRadiusChange = (event) => {
    const newRadius = event.target.value;
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      radius: newRadius,
    }));
  };

  const handleShadowColorChange = (event) => {
    const { value } = event.target;
    if (handleShadowState === true) {
      setActiveAttributes((prevAttributes) => ({
        ...prevAttributes,
        shadowEnabled: true,
        shadowColor: value,
      }));
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    console.log(newName);
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      name: newName,
    }));
    console.log(activeAttributes);

    if (activeShape) {
      // If the active shape is a text element, update its text content
      if (activeAttributes.type === "text") {
        activeShape.text(newName);
      }
      activeShape.getLayer().batchDraw(); // Redraw the layer to apply changes
    }
  };

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

    // Determine the type of the clicked element
    attributes.type = clickedElement.className;

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
        <div className="top-side-panel flex flex-row gap-2 border-b-[2px] border-b-accent py-2">
          <button
            onClick={toggleSettingsVisibility}
            className="w-full bg-accent rounded-md py-1"
          >
            Properties
          </button>
          <button
            onClick={toggleSettingsVisibility}
            className="w-full bg-accent rounded-md py-1"
          >
            Export
          </button>
        </div>

        {isSettingsVisible ? (
          <div className="settings-zone">
            <div className="position-controls">
              <input
                type="number"
                name="translateY"
                id="translate-y"
                placeholder="Translate Y"
                value={activeAttributes.translateY || ""}
                onChange={handleLocationYChange}
              />
              <input
                type="number"
                name="translateX"
                id="translate-x"
                placeholder="Translate X"
                value={activeAttributes.translateX || ""}
                onChange={handleLocationXChange}
              />
            </div>

            <div className="size-controls">
              <input
                type="number"
                name="scaleY"
                id="scale-y"
                placeholder="Scale Y"
                value={activeAttributes.scaleY || 1}
                onChange={handleScaleYChange}
              />
              <input
                type="number"
                name="scaleX"
                id="scale-x"
                placeholder="Scale X"
                value={activeAttributes.scaleX || 1}
                onChange={handleScaleXChange}
              />
              <button onClick={handleScaleLock}>
                {isScaleLock ? "Ratio Locked" : "Lock"}
              </button>
            </div>

            <div className="rotation-controls">
              <input
                value={activeAttributes.rotate || ""}
                type="range"
                name="rotate"
                id="rotate"
                min="0"
                max="360"
              />
            </div>

            <div className="object-editing">
              {activeAttributes.type === "star" && (
                <>
                  <label htmlFor="starPoint">star</label>
                  <input
                    type="range"
                    name="starPoints"
                    id="star-points"
                    min="3"
                    max="10"
                    value={activeAttributes.numPoints || 5}
                    onChange={handleChangeStarPoints}
                  />
                </>
              )}
              <input
                type="text"
                placeholder="element name......"
                id="element-name"
                name="elementName"
                value={activeAttributes.name || ""}
                onChange={handleNameChange}
              />

              <input
                type="range"
                name="corner-radius"
                id="corner-radius"
                placeholder="Corner Radius"
                value={activeAttributes.radius || 0}
                onChange={handleCornerRadiusChange}
              />

              {activeAttributes.type === "text" && (
                <div className="fontselector">
                  <div className="font-list-zone">
                    <div className="font-picker">
                      <select
                        name="fontFamily"
                        id="font-family-selector"
                        value={activeAttributes.fontFamily || "Arial"}
                      >
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Helvetica">Helvetica</option>
                      </select>
                    </div>
                    <div className="font-weight-selector">
                      <select
                        name="fontWeight"
                        id="font-weight-selector"
                        value={
                          activeAttributes && activeAttributes.fontWeight
                            ? activeAttributes.fontWeight
                            : "normal"
                        }
                      >
                        <option value="thin">Thin</option>
                        <option value="normal">Normal</option>
                        <option value="medium">Medium</option>
                        <option value="bold">Bold</option>
                        <option value="black">Black</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="opacity-controls">
              <input
                type="range"
                name="opacity"
                id="opacity"
                min="0"
                max="1"
                step="0.01"
                value={activeAttributes.opacity || 1}
                onChange={handleOpacityChange}
              />
            </div>

            <div className="color-controls">
              <input
                type="color"
                name="color"
                id="color"
                value={activeAttributes.fill || "#00000"}
                onChange={handleColorChange}
              />
            </div>

            <div className="border-controls">
              {/* only if this is checked thats is when border should be added */}
              <input
                type="checkbox"
                name="addBorder"
                id="add-border"
                checked={handleBorderState}
                onChange={() => setHandleBorderState(!handleBorderState)}
              />
              <input
                type="color"
                name="borderColor"
                id="border-color"
                value={activeAttributes.stroke || "#000000"}
                onChange={handleBorderColorChange}
              />
              <input
                type="range"
                name="borderWidth"
                id="border-width"
                value={activeAttributes.strokeWidth || 0}
                onChange={handleBorderWidthChange}
              />
            </div>

            <div className="effect-controls">
              <div className="shadow-controls">
                <input
                  type="checkbox"
                  name="addShadow"
                  id="add-shadow"
                  checked={handleShadowState || false}
                  onChange={() => setHandleShadowState(!handleShadowState)}
                />
                <input
                  type="color"
                  name="shadowColor"
                  id="shadow-color"
                  value={activeAttributes.shadowColor}
                  onChange={handleShadowColorChange}
                />
                <input
                  type="number"
                  name="shadowBlur"
                  id="shadow-blur"
                  placeholder="Shadow Blur"
                  value={activeAttributes.shadowBlur || 0}
                />
                <input
                  type="number"
                  name="shadowX"
                  id="shadow-x"
                  placeholder="Shadow X"
                  value={activeAttributes.shadowX || 0}
                />
                <input
                  type="number"
                  name="shadowY"
                  id="shadow-y"
                  placeholder="Shadow Y"
                  value={activeAttributes.shadowY || 0}
                />
              </div>

              <div className="blur-controls">
                <input
                  type="range"
                  name="gussianBlurRange"
                  id="gussian-blur-range"
                  value={activeAttributes.gussianBlurRange || 0}
                />
              </div>
            </div>

            <div className="delete-object">
              <button className="w-full p-2 py-1 bg-red-500 text-white">
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="export-zone">
            <div className="project-details">
              <input type="text" placeholder="Name your export" />
              <p>Width: {activeAttributes.width || 100}px</p>
              <p>Height: {activeAttributes.height || 100}px</p>
            </div>
            <div className="save-controls pt-5 flex flex-col gap-3">
              <button className="bg-green-500 w-full rounded-md py-1 p-2 text-center">
                Save to Cloud
              </button>
              <button className="bg-gray-500 w-full rounded-md py-1 p-2 text-center">
                Save as Template
              </button>
              <button className="bg-blue-500 w-full rounded-md py-1 p-2 text-center">
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
