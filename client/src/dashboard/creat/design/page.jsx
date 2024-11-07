import { Shapes, SwatchBook, MonitorUp, CaseUpper, CopyX } from "lucide-react";
import { useState } from "react";
import { Stage, Layer, Rect, Circle, Image, Text } from "react-konva";

//for fetching template from server
function Showtemplates() {
  const [template, setTemplate] = useState([]);
  return (
    <div>
      <h1>Templates</h1>
    </div>
  );
}

//for making shapes and prerendring them for users
function Showshape() {
  const [shapes, setshapes] = useState([]);
  return (
    <div>
      <h1>shapes</h1>
    </div>
  );
}

//for showing fonts and text to add to canvas
function Showfonts() {
  const [fontelements, setfontelements] = useState([]);
  return (
    <div>
      <h1>fonts</h1>
    </div>
  );
}

//for displaying files uploaded to database by the user
function Showuploads() {
  const [uploadelements, setuploadelements] = useState([]);
  return (
    <div className="">
      <h1>uploads</h1>
    </div>
  );
}

export default function CreateDesign() {
  const [openUploads, setOpenuploads] = useState(false);
  const [openTextelement, setOpentextelement] = useState(false);
  const [openshapelement, setopenshapeelement] = useState(false);
  const [opentemplate, setopentemplate] = useState(false);
  //for switching tools for elements
  const [openelementtoolbar, setopenelementtoolbar] = useState(false);
  //for switching tools for text
  const [opentexttoolbar, setopentexttoolbar] = useState(false);
  // active elements
  const [activeShape, setActiveShape] = useState(null);
  const [activeText, setActiveText] = useState(null);

  function handleCloseSideBarMenu() {
    setOpenuploads(false);
    setOpentextelement(false);
    setopenshapeelement(false);
    setopentemplate(false);
  }
  function handleopentemplate() {
    setOpenuploads(false);
    setOpentextelement(false);
    setopenshapeelement(false);
    setopentemplate(!opentemplate);
  }
  function handleopenuploads() {
    setOpentextelement(false);
    setopenshapeelement(false);
    setopentemplate(false);
    setOpenuploads(!openUploads);
  }
  function handleopenshape() {
    setOpenuploads(false);
    setOpentextelement(false);
    setopentemplate(false);
    setopenshapeelement(!openshapelement);
  }
  function handleopentext() {
    setOpenuploads(false);
    setopentemplate(false);
    setopenshapeelement(false);
    setOpentextelement(!openTextelement);
  }
  const handleShapeClick = (shape) => {
    setActiveShape(shape);
    console.log("Active shape:", shape);
  };
  const handleDragStart = (e) => {
    e.target.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15,
      },
      scaleX: 1.1,
      scaleY: 1.1,
    });
  };
  const handleDragEnd = (e) => {
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    });
  };
  return (
    <div className="w-full h-screen flex flex-row bg-green-200">
      <div className="elementsbar bg-green-500 w-[80px] py-3 flex flex-col justify-evenly items-center">
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
      {openUploads && (
        <div className="sidebarmenu translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showuploads />
        </div>
      )}
      {openTextelement && (
        <div className="sidebarmenu translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showfonts />
        </div>
      )}
      {openshapelement && (
        <div className="sidebarmenu translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showshape />
        </div>
      )}
      {opentemplate && (
        <div className="sidebarmenu translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showtemplates />
        </div>
      )}
      <div className="board flex-grow bg-red-900 flex flex-col p-2 h-full">
        {opentexttoolbar && (
          <div className="toolbar rounded-lg h-10 bg-red-400 gap-2 flex flex-row justify-center items-center">
            <div className="font">
              <select
                name="font-family"
                id="font-family"
                aria-label="Font Family"
              >
                <option value="areal">Arial</option>
                <option value="courial">Courier</option>
                <option value="helvetical">Helvetica</option>
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
                aria-label="Text Color"
              />
            </div>

            <div className="border-edit">
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
                min="10"
                max="500"
              />
              <input
                className="w-10"
                type="number"
                name="size"
                id="textmanualsize"
                min="10"
                max="500"
              />
            </div>
          </div>
        )}
        {!openelementtoolbar && (
          <div className="toolbar rounded-lg h-10 bg-red-400 gap-2 flex flex-row justify-center items-center">
            <div className="shange-shape">
              <select
                name="shapeselector"
                id="changeshape"
                aria-label="change shape"
              >
                <option value="areal">rectangle</option>
                <option value="courial">square</option>
                <option value="helvetical">circle</option>
                <option value="helvetical">triangle</option>
                <option value="helvetical">star</option>
              </select>
            </div>

            <div className="color-input">
              <label htmlFor="shapecolor" className="sr-only">
                Shape Color
              </label>
              <input
                type="color"
                name="shapecolor"
                id="shapecolor"
                aria-label="Shape Color"
              />
            </div>

            <div className="border-edit">
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

            <div className="size">
              <label htmlFor="shapesize">Size</label>
              <input
                type="range"
                name="size"
                id="shapesize"
                min="10"
                max="500"
              />
              <input
                className="w-10"
                type="number"
                name="size"
                id="shapemanualsize"
                min="10"
                max="500"
              />
            </div>
          </div>
        )}
        <div className="canvas flex-grow rounded-lg bg-yellow-500">
          <Stage width={400} height={600}>
            <Layer>
              <Rect
                x={20}
                y={50}
                width={100}
                height={100}
                fill="red"
                shadowBlur={5}
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
