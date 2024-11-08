import {
  Shapes,
  SwatchBook,
  MonitorUp,
  CaseUpper,
  CopyX,
  Layers3,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";

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

//for making shapes and pre-rendering them for users
function Showshape({ onShapeClick }) {
  const [shapes, setShapes] = useState([
    { type: "rect", width: 100, height: 100, color: "blue" },
    { type: "circle", radius: 30, color: "green" },
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

// Showfonts component to display font options for users to add to the canvas
function Showfonts({ onFontClick }) {
  const [fonts, setFonts] = useState([
    { name: "Arial", style: { fontFamily: "Arial" } },
    { name: "Courier", style: { fontFamily: "Courier" } },
  ]);

  return (
    <div>
      <h1>Fonts</h1>
      {fonts.map((font, index) => (
        <div
          key={index}
          style={{
            ...font.style,
            padding: "10px",
            margin: "5px",
            cursor: "pointer",
          }}
          onClick={() => onFontClick(font)}
        >
          {font.name}
        </div>
      ))}
    </div>
  );
}

//for displaying files uploaded to the database by the user
// eslint-disable-next-line react/prop-types
function Showuploads({ onClick }) {
  const [uploads, setUploads] = useState([]);
  const [loadingUrl, setLoadingUrl] = useState("");

  useEffect(() => {
    const fake = [
      {
        id: 1,
        image: "https://placehold.co/600x400?text=Sample%20Editor%201.png",
      },
      {
        id: 2,
        image: "https://placehold.co/600x400?text=Sample%20Editor%202.png",
      },
      {
        id: 3,
        image: "https://placehold.co/600x400?text=Sample%20Editor%203.png",
      },
      {
        id: 4,
        image: "https://placehold.co/600x400?text=Sample%20Editor%204.png",
      },
      {
        id: 5,
        image: "https://placehold.co/600x400?text=Sample%20Editor%205.png",
      },
      {
        id: 6,
        image: "https://placehold.co/600x400?text=Sample%20Editor%206.png",
      },
      {
        id: 7,
        image: "https://placehold.co/600x400?text=Sample%20Editor%207.png",
      },
      {
        id: 8,
        image: "https://placehold.co/600x400?text=Sample%20Editor%208.png",
      },
      {
        id: 9,
        image: "https://placehold.co/600x400?text=Sample%20Editor%209.png",
      },
      {
        id: 10,
        image: "https://placehold.co/600x400?text=Sample%20Editor%2010.png",
      },
    ];
    setUploads(fake); // Set the "fake" data as uploads
  }, []);

  // Function to handle loading image from URL on Enter key press
  const handleUrlInput = (e) => {
    if (e.key === "Enter" && loadingUrl) {
      onClick(loadingUrl); // Trigger the image insertion function with URL
      setLoadingUrl(""); // Reset the input field
    }
  };

  return (
    <div className="w-full flex flex-col justify-end items-center">
      <div className="title">
        <h1>Uploads</h1>
      </div>
      <div className="loadfromurl">
        <input
          id="loadfromurl"
          type="text"
          value={loadingUrl}
          onChange={(e) => setLoadingUrl(e.target.value)}
          onKeyDown={handleUrlInput}
          placeholder="Enter image URL and press Enter"
        />
      </div>
      <div className="w-full grid grid-cols-3">
        {uploads.map((file) => (
          <img
            className="rounded-lg overflow-hidden"
            key={file.id}
            onClick={() => onClick(file.image)} // Pass image URL to handleAddImage
            src={file.image}
            alt={`Upload ${file.id}`}
            width="100"
            height="100"
          />
        ))}
      </div>
    </div>
  );
}

// Layer Manager component to list and reorder layers
const ShowLayermanager = ({}) => {
  return <></>;
};

export default function Tester() {
  const [openUploads, setOpenuploads] = useState(false);
  const [openTextelement, setOpentextelement] = useState(false);
  const [openshapelement, setopenshapeelement] = useState(false);
  const [opentemplate, setopentemplate] = useState(false);
  const [openLayermanager, setopenLayermanager] = useState(false);
  // toolbar activities
  const [activeShape, setActiveShape] = useState(null);
  const [newText, setNewText] = useState("simple text here..."); // For the input field
  const [activeAttributes, setActiveAttributes] = useState(null);
  const [opentexttoolbar, setOpentexttoolbar] = useState(false);
  const [openelementtoolbar, setOpenelementtoolbar] = useState(false);
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

  // Function to handle drag start
  const handleDragStart = (e) => {
    const target = e.target;

    // Store the original attributes so they can be restored on drag end
    setOriginalAttributes({
      shadowOffset: target.shadowOffset(),
      scaleX: target.scaleX(),
      scaleY: target.scaleY(),
      stroke: target.stroke(),
      strokeWidth: target.strokeWidth(),
      shadowEnabled: target.shadowEnabled(),
      shadowBlur: target.shadowBlur(),
    });

    // Apply temporary attributes for drag start feedback
    target.setAttrs({
      shadowOffset: { x: 15, y: 15 },
      scaleX: 1.1,
      scaleY: 1.1,
      stroke: "blue",
      strokeWidth: 2,
      shadowEnabled: true,
      shadowBlur: 5,
    });
  };

  // Function to handle drag end
  const handleDragEnd = (e) => {
    const target = e.target;

    // Restore original attributes after drag ends
    target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      ...originalAttributes,
    });
  };

  // Function to handle element click for selection and toolbar control
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

    // Capture the current attributes of the clicked element
    const attributes = {
      fill: clickedElement.fill ? clickedElement.fill() : "#000000",
      stroke: clickedElement.stroke ? clickedElement.stroke() : null,
      strokeWidth: clickedElement.strokeWidth
        ? clickedElement.strokeWidth()
        : 0,
      scaleX: clickedElement.scaleX ? clickedElement.scaleX() : 1,
      scaleY: clickedElement.scaleY ? clickedElement.scaleY() : 1,
      ...(clickedElement.className === "Text" && {
        fontFamily: clickedElement.fontFamily
          ? clickedElement.fontFamily()
          : "Arial",
        fontSize: clickedElement.fontSize ? clickedElement.fontSize() : 24,
      }),
    };

    setActiveAttributes(attributes);

    // Show outline and determine toolbar
    clickedElement.stroke("blue");
    clickedElement.strokeWidth(2);
    clickedElement.shadowEnabled(true);
    clickedElement.shadowBlur(5);

    setOpentexttoolbar(clickedElement.className === "Text");
    setOpenelementtoolbar(clickedElement.className !== "Text");

    console.log("Active element:", clickedElement);
  };

  // Function to handle stage click to clear selection
  const handleStageClick = () => {
    if (activeShape.className === "Text") {
      setOpenelementtoolbar(false);
      setOpentexttoolbar(true); // Close toolbars
    }
    if (activeShape.className !== "Text") {
      setOpenelementtoolbar(true);
      setOpentexttoolbar(false); // Close toolbars
    }
    if (activeShape) {
      activeShape.stroke(null); // Remove outline color
      activeShape.strokeWidth(0); // Reset outline width
      activeShape.shadowEnabled(false); // Remove shadow
      activeShape.getLayer().batchDraw(); // Redraw layer for immediate effect
      setActiveShape(null); // Clear active shape
    }
  };

  const handleAttributeChange = (attribute, value) => {
    if (activeShape) {
      // Dynamically set the attribute on the active shape
      if (attribute in activeShape) {
        activeShape[attribute](value);
      }

      // Redraw the layer to reflect changes
      layerRef.current.batchDraw();

      // Update the `activeAttributes` state to reflect the new attribute values
      setActiveAttributes((prev) => ({
        ...prev,
        [attribute]: value,
      }));
    }
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

  // Function to update the text content of the active Text element
  const updateTextContent = () => {
    if (activeShape && activeShape.className === "Text") {
      activeShape.text(newText); // Update the text of the active text element
      layerRef.current.batchDraw(); // Redraw the layer to reflect changes
    }
  };

  // Handle input field change and update text in real time
  const handleTextInputChange = (e) => {
    setNewText(e.target.value); // Update state with the new text input
    updateTextContent(); // Update text immediately on input change
  };

  function handleAddTextWithFont(font) {
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

  function handleaddshape(shape) {
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
    }

    // Attach event handlers
    shapeNode.on("click", handleObjectClick);
    shapeNode.on("dragstart", handleDragStart);
    shapeNode.on("dragend", handleDragEnd);

    // Add shape to the layer
    layerRef.current.add(shapeNode);
    layerRef.current.batchDraw();
  }

  const deleteActiveShape = () => {
    if (activeShape) {
      activeShape.remove(); // Remove the shape from the layer
      activeShape.getLayer().batchDraw(); // Redraw the layer to reflect changes
      setActiveShape(null); // Clear active shape
      setOpentexttoolbar(false); // Close toolbars if open
      setOpenelementtoolbar(false);
      console.log("Shape deleted.");
    } else {
      console.log("No active shape to delete.");
    }
  };

  const exportCanvasAsImage = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL(); // Export canvas as base64 image
      console.log("Exported Image Data URL:", dataURL);

      // Optional: Create a download link to save the image
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("No canvas found to export.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-row bg-green-200">
      <div className="elementsbar bg-green-500 w-[80px] py-3 flex flex-col justify-evenly items-center">
        <div id="design sidebar">
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
        <div className="sidebarmenu z-[9999999] translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <ShowLayermanager />
        </div>
      )}
      {openUploads && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showuploads onClick={handleAddImage} />
        </div>
      )}
      {openTextelement && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showfonts onFontClick={(font) => handleAddTextWithFont(font)} />
        </div>
      )}
      {openshapelement && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showshape onShapeClick={handleaddshape} />
        </div>
      )}
      {opentemplate && (
        <div className="sidebarmenu z-[9999999] translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showtemplates />
        </div>
      )}
      <div className="board w-full bg-red-900 flex flex-col gap-2 p-2 h-full">
        {opentexttoolbar && (
          <div className="toolbar w-full rounded-lg h-10 bg-red-400 gap-2 flex flex-row justify-center items-center">
            <div className="font">
              <label htmlFor="font-family">Font Family</label>
              <select
                name="font-family"
                id="font-family"
                aria-label="Font Family"
                value={activeAttributes.fontFamily}
                onChange={(e) =>
                  handleAttributeChange("fontFamily", e.target.value)
                }
              >
                <option value="Arial">Arial</option>
                <option value="Courier">Courier</option>
                <option value="Helvetica">Helvetica</option>
              </select>
            </div>

            <div className="font-style">
              <select name="font-style" id="font-style" aria-label="Font Style">
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="italic">Italic</option>
                <option value="underline">Underline</option>
              </select>
            </div>

            <div className="color-input">
              <label htmlFor="textcolor" className="sr-only">
                Text Color
              </label>
              <input
                type="color"
                name="textcolor"
                id="textcolor"
                value={activeAttributes.fill}
                onChange={(e) => handleAttributeChange("fill", e.target.value)}
                aria-label="Text Color"
              />
            </div>

            <div className="border-edit z-[999999]">
              <details className="open">
                <summary className="block cursor-pointer">
                  <p>Border</p>
                </summary>

                <div className="bg-white z-[999999] rounded-2xl w-[50%] h-[40%] my-auto mx-auto absolute inset-0 text-gray-600 p-4 py-8">
                  <div className="border-menu w-fit flex flex-col gap-2 px-2 py-2">
                    <div className="border-style">
                      <select
                        name="border-style"
                        id="border-style"
                        aria-label="Border Style"
                      >
                        <option value="dashed">Dashed</option>
                        <option value="solid">Solid</option>
                      </select>
                    </div>
                    <div className="borderSize">
                      <label htmlFor="bodre-thickness" className="sr-only">
                        Border thickness
                      </label>
                      <input
                        type="range"
                        name="bodre-thickness"
                        id="bodre-thickness"
                      />
                    </div>
                    <div className="border-color">
                      <label htmlFor="bordercolor" className="sr-only">
                        Border Color
                      </label>
                      <input
                        type="color"
                        name="bordercolor"
                        id="bordercolor"
                        aria-label="Border Color"
                      />
                    </div>
                  </div>
                </div>
              </details>
            </div>
            <input
              type="text"
              value={newText} // Bind input to state
              onChange={handleTextInputChange} // Update state on input change
              placeholder="Edit text"
            />

            <div className="align-text">
              <select
                name="text-alginment"
                id="text-alignment"
                aria-label="text alignment"
              >
                <option value="center">center</option>
                <option value="left">left</option>
                <option value="right">left</option>
              </select>
            </div>

            <div className="size">
              <label htmlFor="textsize">Size</label>
              <input
                type="range"
                name="size"
                id="textsize"
                value={activeAttributes.fontSize}
                onChange={(e) =>
                  handleAttributeChange("fontSize", parseInt(e.target.value))
                }
              />
              <input
                className="w-10"
                type="number"
                name="size"
                id="textmanualsize"
                value={activeAttributes.fontSize}
                onChange={(e) =>
                  handleAttributeChange("fontSize", parseInt(e.target.value))
                }
              />
            </div>
            <div className="deletezone">
              <button className="text-red-500" onClick={deleteActiveShape}>
                Delete
              </button>
            </div>
            <div className="exportimage">
              <button onClick={exportCanvasAsImage}>Export</button>
            </div>
          </div>
        )}
        {openelementtoolbar && (
          <div className="toolbar w-full rounded-lg h-10 bg-red-400 gap-2 flex flex-row justify-center items-center">
            <div className="color-input">
              <label htmlFor="shapecolor" className="sr-only">
                Shape Color
              </label>
              <div className="color-input">
                <label htmlFor="shape-color">Color</label>
                <input
                  type="color"
                  id="shape-color"
                  value={activeAttributes.fill}
                  onChange={(e) =>
                    handleAttributeChange("fill", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="border-edit z-[999999]">
              <details className="open">
                <summary className="block cursor-pointer">
                  <p>Border</p>
                </summary>

                <div className="bg-white rounded-2xl w-[50%] h-[40%] my-auto mx-auto absolute inset-0 text-gray-600 p-4 py-8">
                  <div className="border-menu w-fit flex flex-col gap-2 px-2 py-2">
                    <div className="border-style">
                      <select
                        name="border-style"
                        id="border-style"
                        aria-label="Border Style"
                      >
                        <option value="dashed">Dashed</option>
                        <option value="solid">Solid</option>
                      </select>
                    </div>
                    <div className="borderSize">
                      <label htmlFor="bodre-thickness" className="sr-only">
                        Border thickness
                      </label>
                      <input
                        type="range"
                        name="bodre-thickness"
                        id="bodre-thickness"
                      />
                    </div>
                    <div className="border-color">
                      <label htmlFor="bordercolor" className="sr-only">
                        Border Color
                      </label>
                      <input
                        type="color"
                        name="bordercolor"
                        id="bordercolor"
                        aria-label="Border Color"
                      />
                    </div>
                  </div>
                </div>
              </details>
            </div>

            <div className="align-text">
              <select
                name="text-alignment"
                id="text-alignment"
                aria-label="Text Alignment"
              >
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className="scale">
              <label htmlFor="scale-x">Scale X</label>
              <input
                type="range"
                id="scale-x"
                min="0.1"
                max="2"
                step="0.1"
                value={activeAttributes.scaleX}
                onChange={(e) =>
                  handleAttributeChange("scaleX", parseFloat(e.target.value))
                }
              />
              <label htmlFor="scale-y">Scale Y</label>
              <input
                type="range"
                id="scale-y"
                min="0.1"
                max="2"
                step="0.1"
                value={activeAttributes.scaleY}
                onChange={(e) =>
                  handleAttributeChange("scaleY", parseFloat(e.target.value))
                }
              />
            </div>
            <div className="deletezone">
              <button className="text-red-500" onClick={deleteActiveShape}>
                Delete
              </button>
            </div>
            <div className="exportimage">
              <button onClick={exportCanvasAsImage}>Export</button>
            </div>
          </div>
        )}
        <div className="canvas flex flex-col justify-center items-center rounded-lg bg-yellow-500">
          <Stage
            width={400}
            height={600}
            ref={stageRef}
            onMouseDown={handleStageClick}
            style={{ backgroundColor: "lightgray" }}
          >
            <Layer ref={layerRef}>
              <Rect
                x={20}
                y={50}
                width={100}
                height={100}
                fill="red"
                shadowEnabled={false}
                draggable
                onClick={handleObjectClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
