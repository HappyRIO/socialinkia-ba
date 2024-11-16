import {
  Shapes,
  SwatchBook,
  MonitorUp,
  CaseUpper,
  CopyX,
  Layers3,
  ArrowLeftToLine,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Stage, Layer, Rect } from "react-konva";
import Showtemplates from "../../../components/editor/ShowTemplate";
import Showshape from "../../../components/editor/Showshape";
import Showfonts from "../../../components/editor/Showfonts";
import ShowLayerManager from "../../../components/editor/Showlayermanager";
import Showuploads from "../../../components/editor/Showuploads";

export default function Tester() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const height = queryParams.get("height");
  const width = queryParams.get("width");
  const [openUploads, setOpenuploads] = useState(false);
  const [openTextelement, setOpentextelement] = useState(false);
  const [openshapelement, setopenshapeelement] = useState(false);
  const [opentemplate, setopentemplate] = useState(false);
  const [openLayermanager, setopenLayermanager] = useState(false);
  // toolbar activities
  const [activeShape, setActiveShape] = useState(null);
  const [activeAttributes, setActiveAttributes] = useState({
    translateY: 0,
    translateX: 0,
    scaleY: 1,
    scaleX: 1,
    rotate: 0,
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
    type: "",
  });
  const [originalAttributes, setOriginalAttributes] = useState({});
  //locking seetings
  const [isSettingsVisible, setIsSettingsVisible] = useState(true);
  const [isScaleLock, setisScaleLock] = useState(false);
  // control function states
  const [handleBorderState, setHandleBorderState] = useState(false);
  const [borderColor, setBorderColor] = useState("#000000"); // Default black
  const [borderWidth, setBorderWidth] = useState(1); // Default width of 1
  const [handleShadowState, setHandleShadowState] = useState(false);
  const [shadowColor, setShadowColor] = useState("#000000"); // Default shadow color
  const [shadowBlur, setShadowBlur] = useState(10); // Default blur
  const [shadowX, setShadowX] = useState(10); // Default X offset
  const [shadowY, setShadowY] = useState(10); // Default Y offset

  // ref for the layer and stage
  const [scaledWidth, setScaledWidth] = useState(window.innerWidth);
  const [scaledHeight, setScaledHeight] = useState(window.innerHeight);
  const layerRef = useRef(null); // Defining the Layer ref
  const stageRef = useRef(null);
  const parentRef = useRef(null); // Reference for the parent container

  // Handle window resize and parent container size changes
  const handleResize = () => {
    const parentWidth = parentRef.current.clientWidth;
    const parentHeight = parentRef.current.clientHeight;

    const aspectRatio = width / height;
    let newWidth = parentWidth;
    let newHeight = parentHeight;

    // Scale based on the aspect ratio and parent container size
    if (parentWidth / parentHeight > aspectRatio) {
      newWidth = parentHeight * aspectRatio;
    } else {
      newHeight = parentWidth / aspectRatio;
    }

    setScaledWidth(newWidth);
    setScaledHeight(newHeight);
  };

  useEffect(() => {
    // Initial resize calculation
    handleResize();

    // Add event listener for window resizing
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, height]);

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

  // Function for handling drag start
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
      stroke: target.stroke(), // Save the original stroke color
      strokeWidth: target.strokeWidth(), // Save the original stroke width
      shadowEnabled: target.shadowEnabled(), // Save whether shadow is enabled
      shadowColor: target.shadowColor(), // Save the original shadow color
      shadowBlur: target.shadowBlur(), // Save the original shadow blur
      scaleX: target.scaleX(), // Save the original scaleX
      scaleY: target.scaleY(), // Save the original scaleY
      rotation: target.rotation(), // Save the original rotation
      // x: target.x(), // Save the original x position
      // y: target.y(), // Save the original y position
    });

    // Apply temporary blue outline for drag feedback
    target.setAttrs({
      stroke: "blue",
      strokeWidth: 2,
      shadowEnabled: true, // Enable shadow while dragging (optional)
      shadowColor: "rgba(0, 0, 0, 0.5)", // Optional shadow effect during drag
      shadowBlur: 10, // Optional shadow blur during drag
    });

    // Set the dragged element as the active shape
    setActiveShape(target);
  };

  // Function to handle drag end and restore the original state
  const handleDragEnd = (e) => {
    const target = e.target;

    // Restore the original attributes
    target.setAttrs({
      stroke: originalAttributes.stroke || null, // Restore original stroke color
      strokeWidth: originalAttributes.strokeWidth || 0, // Reset stroke width
      shadowEnabled: originalAttributes.shadowEnabled || false, // Restore shadow state
      shadowColor: originalAttributes.shadowColor || null, // Restore shadow color
      shadowBlur: originalAttributes.shadowBlur || 0, // Restore shadow blur
      scaleX: originalAttributes.scaleX, // Restore original scaleX
      scaleY: originalAttributes.scaleY, // Restore original scaleY
      rotation: originalAttributes.rotation, // Restore original rotation
      // x: originalAttributes.x, // Restore original x position
      // y: originalAttributes.y, // Restore original y position
    });

    // Redraw the layer after restoring the attributes
    target.getLayer().batchDraw();

    // Set the dragged element as inactive after drag ends
    setActiveShape(null);

    console.log("Drag ends, original state restored.");
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

  const handleScaleXChange = (e) => {
    const newScaleX = parseFloat(e.target.value);
    if (activeShape) {
      if (isScaleLock) {
        // Apply the same scale to Y if the lock is on
        const currentScaleY = activeShape.scaleY();
        activeShape.scale({
          x: newScaleX,
          y: currentScaleY * (newScaleX / activeShape.scaleX()),
        });
        // Update state with the new values
        setActiveAttributes((prev) => ({
          ...prev,
          scaleX: newScaleX,
          scaleY: currentScaleY * (newScaleX / activeShape.scaleX()), // Adjust scaleY
        }));
      } else {
        // Apply only to X if lock is off
        activeShape.scaleX(newScaleX);
        setActiveAttributes((prev) => ({
          ...prev,
          scaleX: newScaleX,
        }));
      }
      activeShape.getLayer().batchDraw(); // Redraw the layer
    }
  };

  const handleScaleYChange = (e) => {
    const newScaleY = parseFloat(e.target.value);
    if (activeShape) {
      if (isScaleLock) {
        // Apply the same scale to X if the lock is on
        const currentScaleX = activeShape.scaleX();
        activeShape.scale({
          x: currentScaleX * (newScaleY / activeShape.scaleY()),
          y: newScaleY,
        });
        // Update state with the new values
        setActiveAttributes((prev) => ({
          ...prev,
          scaleX: currentScaleX * (newScaleY / activeShape.scaleY()), // Adjust scaleX
          scaleY: newScaleY,
        }));
      } else {
        // Apply only to Y if lock is off
        activeShape.scaleY(newScaleY);
        setActiveAttributes((prev) => ({
          ...prev,
          scaleY: newScaleY,
        }));
      }
      activeShape.getLayer().batchDraw(); // Redraw the layer
    }
  };

  const handleScaleLock = () => {
    setisScaleLock((prev) => !prev);
    if (isScaleLock) {
      // If scale lock is on, update both scales based on the current state
      activeShape.scale({
        x: activeAttributes.scaleX,
        y: activeAttributes.scaleY,
      });
      activeShape.getLayer().batchDraw(); // Redraw the layer
    }
  };

  const handleLocationYChange = (newY) => {
    if (!activeShape) {
      console.log("No active shape selected");
      return;
    }

    // Ensure the newY is a number
    const yValue = Number(newY);

    if (isNaN(yValue)) {
      console.error("Invalid Y position value");
      return;
    }

    // Set the new Y position
    activeShape.y(yValue);

    // Redraw the layer to reflect the change
    activeShape.getLayer().batchDraw();

    // Update the active attributes to reflect the new position
    const updatedAttributes = { ...activeAttributes, y: yValue };
    setActiveAttributes(updatedAttributes);

    console.log(`Object Y position changed to: ${yValue}`);
  };

  const handleLocationXChange = (newX) => {
    if (!activeShape) {
      console.log("No active shape selected");
      return;
    }

    // Ensure the newX is a number
    const xValue = Number(newX);

    if (isNaN(xValue)) {
      console.error("Invalid X position value");
      return;
    }

    // Set the new X position
    activeShape.x(xValue);

    // Redraw the layer to reflect the change
    activeShape.getLayer().batchDraw();

    // Update the active attributes to reflect the new position
    const updatedAttributes = { ...activeAttributes, x: xValue };
    setActiveAttributes(updatedAttributes);

    console.log(`Object X position changed to: ${xValue}`);
  };

  const handleRotationChange = (newRotation) => {
    if (!activeShape) {
      console.log("No active shape selected");
      return;
    }

    // Ensure the newRotation is a number
    const rotationValue = Number(newRotation);

    if (isNaN(rotationValue)) {
      console.error("Invalid rotation value");
      return;
    }

    // Set the rotation origin to the center of the shape
    activeShape.offsetX(activeShape.width() / 2);
    activeShape.offsetY(activeShape.height() / 2);

    // Apply the rotation
    activeShape.rotation(rotationValue);

    // Redraw the layer to reflect the change
    activeShape.getLayer().batchDraw();

    // Update the active attributes to reflect the new rotation
    const updatedAttributes = { ...activeAttributes, rotation: rotationValue };
    setActiveAttributes(updatedAttributes);

    console.log(`Object rotated to: ${rotationValue} degrees`);
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

  const handleBorderUpdate = () => {
    if (!activeShape) {
      console.log("No active shape selected");
      return;
    }

    if (handleBorderState) {
      // When the border is enabled (checkbox checked)
      activeShape.stroke(borderColor); // Set the stroke color
      activeShape.strokeWidth(borderWidth); // Set the stroke width
    } else {
      // If border is disabled (checkbox unchecked)
      activeShape.stroke(null); // Remove stroke (no border)
      activeShape.strokeWidth(0); // Remove stroke width
    }

    // Redraw the layer to reflect changes
    activeShape.getLayer().batchDraw();

    // Update the active attributes state with the new border properties
    const updatedAttributes = {
      ...activeAttributes,
      borderColor: handleBorderState ? borderColor : null,
      borderWidth: handleBorderState ? borderWidth : 0,
    };
    setActiveAttributes(updatedAttributes);
  };

  const handleChangeBorderRadius = (newRadius) => {
    if (!activeShape) {
      console.log("No active shape selected");
      return;
    }

    // Ensure the newRadius is a number
    const radiusValue = Number(newRadius);

    if (isNaN(radiusValue)) {
      console.error("Invalid radius value");
      return;
    }

    // Check if the active shape is a Rect (or similar object that supports cornerRadius)
    if (activeShape.className === "Rect") {
      activeShape.cornerRadius(radiusValue);
      activeShape.getLayer().batchDraw();
    }

    // If the active shape is an Image
    if (activeShape.className === "Image") {
      // Apply rounded corners by clipping the image with a rounded rectangle
      activeShape.cache(); // Cache the image for clipping
      activeShape.clipFunc((ctx) => {
        const { x, y, width, height } = activeShape.getClientRect();
        ctx.beginPath();
        ctx.moveTo(x + radiusValue, y);
        ctx.lineTo(x + width - radiusValue, y);
        ctx.arcTo(x + width, y, x + width, y + height, radiusValue);
        ctx.lineTo(x + width, y + height - radiusValue);
        ctx.arcTo(
          x + width,
          y + height,
          x + width - radiusValue,
          y + height,
          radiusValue
        );
        ctx.lineTo(x + radiusValue, y + height);
        ctx.arcTo(x, y + height, x, y + height - radiusValue, radiusValue);
        ctx.lineTo(x, y + radiusValue);
        ctx.arcTo(x, y, x + radiusValue, y, radiusValue);
        ctx.closePath();
        ctx.clip();
      });

      activeShape.getLayer().batchDraw(); // Re-draw the layer
    }

    // Update active attributes if necessary
    const updatedAttributes = {
      ...activeAttributes,
      cornerRadius: radiusValue,
    };
    setActiveAttributes(updatedAttributes);

    console.log(`Object border radius changed to: ${radiusValue}`);
  };

  const handleShadowUpdate = () => {
    if (!activeShape) {
      console.log("No active shape selected");
      return;
    }

    // Update shadow properties based on the current state
    if (handleShadowState) {
      activeShape.shadowColor(shadowColor); // Set shadow color
      activeShape.shadowBlur(shadowBlur); // Set shadow blur radius
      activeShape.shadowOffsetX(shadowX); // Set horizontal offset
      activeShape.shadowOffsetY(shadowY); // Set vertical offset
      activeShape.shadowEnabled(true); // Enable shadow
    } else {
      activeShape.shadowEnabled(false); // Disable the shadow
    }

    // Redraw the layer to reflect changes
    activeShape.getLayer().batchDraw();

    // Update the active attributes state with the new shadow properties
    const updatedAttributes = {
      ...activeAttributes,
      shadowColor: handleShadowState ? shadowColor : null,
      shadowBlur: handleShadowState ? shadowBlur : 0,
      shadowX: handleShadowState ? shadowX : 0,
      shadowY: handleShadowState ? shadowY : 0,
    };
    setActiveAttributes(updatedAttributes);
  };

  const handleFontUpdate = () => {
    const fontFamily = document.getElementById("font-family-selector").value;
    const fontWeight = document.getElementById("font-weight-selector").value;

    if (activeShape && activeShape.className === "Text") {
      activeShape.fontFamily(fontFamily); // Set the font family
      activeShape.fontWeight(fontWeight); // Set the font weight
      activeShape.getLayer().batchDraw(); // Redraw the layer to apply changes
    }
  };

  // name changing function
  const handleChangeObjectName = (newName) => {
    if (!activeShape) {
      console.log("No active shape selected");
      return;
    }

    // Check if the active shape is a Text object
    if (activeShape.className === "Text") {
      // If it's a Text element, change the text content as well
      activeShape.text(newName);
    }

    // Change the name of the object (element)
    activeShape.name(newName);

    // Redraw the layer to immediately apply the changes
    activeShape.getLayer().batchDraw();

    // Update active attributes if necessary
    const updatedAttributes = { ...activeAttributes, name: newName };
    setActiveAttributes(updatedAttributes);

    console.log(`Object name changed to: ${newName}`);
  };

  // delete function
  const handleDeleteObject = () => {
    if (!activeShape) {
      console.log("No active shape selected");
      return;
    }

    // Get the layer of the active shape
    const layer = activeShape.getLayer();

    // Remove the active shape from the layer
    activeShape.destroy();

    // Redraw the layer to immediately reflect the changes
    layer.batchDraw();

    // Reset the active shape state
    setActiveShape(null);
    setActiveAttributes({}); // Clear the attributes if any

    console.log("Active shape deleted:", activeShape);
  };

  // object selection function
  const handleObjectClick = (e) => {
    setisScaleLock(false);
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

  // export section zone
  const DownloadStageImage = () => {
    if (!stageRef.current) return;

    // Export the stage to a base64 image
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 20, // Optional: Set higher pixel ratio for better resolution
      backgroundColor: "transparent", // Optional: Set background color if needed
    });

    // Create an anchor element to trigger download
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "konva-image.png"; // Set the file name
    link.click();
  };

  const exportStageAsJson = () => {
    if (!stageRef.current) return;

    // Export the stage to JSON
    const jsonData = stageRef.current.toJSON();

    console.log(jsonData);

    // Create a Blob with the JSON data and trigger download
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "konva-stage.json"; // Set the file name
    link.click();
  };

  const saveImageToCloud = async () => {
    if (!stageRef.current) return;

    // Export the stage as a base64 image
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 3, // Increase the resolution if needed
      mimeType: "image/png", // Can change to image/jpeg if needed
    });

    try {
      // Convert base64 data URL to binary data
      const response = await fetch(dataURL);
      const blob = await response.blob();

      // Prepare FormData to send the image to Cloudinary
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "your_upload_preset"); // Use your Cloudinary upload preset
      formData.append("folder", "your_folder"); // Optional: Specify a folder in Cloudinary

      // Send the request to Cloudinary
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (cloudinaryData.secure_url) {
        // Successfully uploaded to Cloudinary
        console.log("Image uploaded successfully:", cloudinaryData.secure_url);
        return cloudinaryData.secure_url; // This is the URL of the uploaded image
      } else {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };

  const handleGoBack = () => {
    const confirmGoBack = window.confirm(
      "Are you sure you want to go back? changes you've made wont be saved"
    );
    if (confirmGoBack) {
      navigate(-1); // Go back to the previous page
    }
  };

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="elementsbar bg-background2 shadow-lg w-[80px] py-3 flex flex-col justify-evenly items-center">
        <div id="layer-manager sidebar">
          <button
            onClick={handleGoBack}
            className="flex flex-col justify-center items-center text-[15px] hover:text-red-500"
          >
            <ArrowLeftToLine />
            <p>back</p>
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
      <div className="board w-full flex flex-col gap-2 p-2 h-full">
        <div
          ref={parentRef}
          className="canvas w-full p-2 drop-shadow-lg h-full flex flex-col justify-center items-center rounded-lg"
        >
          <Stage
            width={scaledWidth}
            height={scaledHeight}
            ref={stageRef}
            onMouseDown={handleStageClick}
            style={{ backgroundColor: "lightgray" }}
          >
            <Layer ref={layerRef}>
              <Rect
                x={0} // X position of the rectangle
                y={0} // Y position of the rectangle
                width={width + 20} // Rectangle width
                height={height + 20} // Rectangle height
                fill="white" // Fill color of the rectangle
                name="background"
                onClick={handleObjectClick}
              />
            </Layer>
          </Stage>
        </div>
      </div>
      <div className="main-side-pannel overflow-y-scroll bg-background2 shadow-lg w-[400px] p-2">
        <div className="top-side-panel flex flex-row gap-2 border-b-[2px] border-b-accent py-2">
          <button
            onClick={toggleSettingsVisibility}
            className={`w-full rounded-md py-1 ${
              isSettingsVisible ? "bg-accent" : "bg-background"
            }`}
          >
            Properties
          </button>
          <button
            onClick={toggleSettingsVisibility}
            className={`w-full rounded-md py-1 ${
              isSettingsVisible ? "bg-background" : "bg-accent"
            }`}
          >
            Export
          </button>
        </div>
        {isSettingsVisible ? (
          <div className="settings-zone flex flex-col gap-3 justify-center items-center">
            <div className="position-controls flex flex-row gap-2 pt-3">
              <input
                className="rounded-lg p-1 w-full"
                type="number"
                name="translateY"
                id="translate-y"
                placeholder="Translate Y"
                value={activeAttributes.y || 0}
                onChange={(e) => handleLocationYChange(e.target.value)}
              />
              <input
                className="rounded-lg p-1 w-full"
                type="number"
                name="translateX"
                id="translate-x"
                placeholder="Translate X"
                value={activeAttributes.x || 0}
                onChange={(e) => handleLocationXChange(e.target.value)}
              />
            </div>

            <div className="size-controls flex flex-row gap-2">
              <input
                className="rounded-lg p-1 w-full"
                type="number"
                name="scaleY"
                id="scale-y"
                placeholder="Scale Y"
                value={activeAttributes.scaleY}
                onChange={handleScaleYChange}
              />
              <input
                className="rounded-lg p-1 w-full"
                type="number"
                name="scaleX"
                id="scale-x"
                placeholder="Scale X"
                value={activeAttributes.scaleX}
                onChange={handleScaleXChange}
              />
              <button onClick={handleScaleLock}>
                {isScaleLock ? "Ratio Locked" : "Lock"}
              </button>
            </div>

            <div className="rotation-controls flex flex-col w-full justify-center">
              <label htmlFor="rotate">rotation</label>
              <input
                value={activeAttributes.rotation || ""}
                type="range"
                name="rotate"
                id="rotate"
                min="0"
                max="360"
                onChange={(e) => handleRotationChange(e.target.value)}
              />
            </div>

            <div className="object-editing w-full flex flex-col gap-2 justify-center">
              <div className="flex flex-col w-full">
                <label htmlFor="starPoint">star points</label>
                <input
                  className="rounded-lg p-1 w-full"
                  type="range"
                  name="starPoints"
                  id="star-points"
                  min="3"
                  max="10"
                  value={activeAttributes.numPoints || 5}
                  onChange={handleChangeStarPoints}
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
              <input
                type="text"
                className="rounded-lg p-1 w-full"
                placeholder="element name......"
                id="element-name"
                name="elementName"
                value={activeAttributes.name || ""}
                onChange={(e) => handleChangeObjectName(e.target.value)}
              />

              <div className="fontselector w-full flex flex-col justify-center">
                <div className="font-list-zone flex flex-col gap-2 justify-center">
                  <div className="font-picker">
                    <select
                      className="rounded-lg p-1 w-full"
                      onChange={handleFontUpdate}
                      name="fontFamily"
                      id="font-family-selector"
                      value={activeAttributes.fontFamily}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Helvetica">Helvetica</option>
                    </select>
                  </div>
                  <div className="font-weight-selector">
                    <select
                      className="rounded-lg p-1 w-full"
                      onChange={handleFontUpdate}
                      name="fontWeight"
                      id="font-weight-selector"
                      value={activeAttributes.fontWeight}
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
            </div>

            <div className="opacity-controls">
              <label htmlFor="opacity">opacity</label>
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

            <div className="border-controls flex flex-col justify-center">
              {/* only if this is checked thats is when border should be added */}
              <div className="">
                <label htmlFor="corner-radius">border radius</label>
                <input
                  type="range"
                  name="corner-radius"
                  id="corner-radius"
                  placeholder="Corner Radius"
                  value={activeAttributes.cornerRadius || 0}
                  onChange={(e) => handleChangeBorderRadius(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <label htmlFor="addBorder">Add Border</label>
                <input
                  type="checkbox"
                  name="addBorder"
                  id="add-border"
                  checked={handleBorderState}
                  onChange={() => {
                    setHandleBorderState(!handleBorderState);
                    handleBorderUpdate(); // Update the border when toggling
                  }}
                />
              </div>

              <div className="flex flex-row gap-2 items-center">
                <label htmlFor="borderColor">Border Color</label>
                <input
                  type="color"
                  name="borderColor"
                  id="border-color"
                  value={borderColor}
                  onChange={(e) => {
                    setBorderColor(e.target.value);
                    handleBorderUpdate(); // Update the border color
                  }}
                />
              </div>

              <div className="flex flex-col justify-center">
                <label htmlFor="borderWidth">Border Width</label>
                <input
                  type="range"
                  name="borderWidth"
                  id="border-width"
                  min="1"
                  max="10"
                  value={borderWidth}
                  onChange={(e) => {
                    setBorderWidth(e.target.value);
                    handleBorderUpdate(); // Update the border width
                  }}
                />
              </div>
            </div>

            <div className="effect-controls w-full">
              <div className="shadow-controls w-full">
                <div className="flex flex-row gap-2 items-center">
                  <label htmlFor="addShadow">Add Shadow</label>
                  <input
                    type="checkbox"
                    name="addShadow"
                    id="add-shadow"
                    checked={handleShadowState || false}
                    onChange={() => {
                      const newState = !handleShadowState;
                      setHandleShadowState(newState);
                      handleShadowUpdate(); // Update shadow properties
                    }}
                  />
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <label htmlFor="shadowColor">Shadow Color</label>
                  <input
                    type="color"
                    name="shadowColor"
                    id="shadow-color"
                    value={shadowColor}
                    onChange={(e) => {
                      setShadowColor(e.target.value);
                      handleShadowUpdate(); // Update shadow color
                    }}
                  />
                </div>

                <div className="w-full flex flex-col justify-center">
                  <label htmlFor="shadowBlur w-full">Shadow Blur</label>
                  <input
                    type="number"
                    className="rounded-lg p-1 w-full"
                    name="shadowBlur"
                    id="shadow-blur"
                    value={shadowBlur}
                    onChange={(e) => {
                      setShadowBlur(e.target.value);
                      handleShadowUpdate(); // Update shadow blur
                    }}
                  />
                </div>

                <div className="w-full flex flex-col justify-center">
                  <label htmlFor="shadowX">Shadow X</label>
                  <input
                    className="rounded-lg p-1 w-full"
                    type="number"
                    name="shadowX"
                    id="shadow-x"
                    value={shadowX}
                    onChange={(e) => {
                      setShadowX(e.target.value);
                      handleShadowUpdate(); // Update shadow X offset
                    }}
                  />
                </div>

                <div className="w-full flex flex-col justify-center">
                  <label htmlFor="shadowY">Shadow Y</label>
                  <input
                    className="rounded-lg p-1 w-full"
                    type="number"
                    name="shadowY"
                    id="shadow-y"
                    value={shadowY}
                    onChange={(e) => {
                      setShadowY(e.target.value);
                      handleShadowUpdate(); // Update shadow Y offset
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="delete-object">
              <button
                onClick={handleDeleteObject}
                className="w-full p-2 py-1 bg-red-500 text-white"
              >
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
            <div className="export-name">
              <input type="text" name="project_name" id="project_name" />
            </div>
            <div className="save-controls pt-5 flex flex-col gap-3">
              <button
                onClick={saveImageToCloud}
                className="bg-green-500 w-full rounded-md py-1 p-2 text-center"
              >
                Save image to Cloud
              </button>
              <button
                onClick={exportStageAsJson}
                className="bg-gray-500 w-full rounded-md py-1 p-2 text-center"
              >
                Save as Template
              </button>
              <button
                onClick={DownloadStageImage}
                className="bg-blue-500 w-full rounded-md py-1 p-2 text-center"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
