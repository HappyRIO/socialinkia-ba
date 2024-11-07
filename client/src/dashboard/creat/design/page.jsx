import { Shapes, SwatchBook, MonitorUp, CaseUpper, CopyX } from "lucide-react";
import { useState } from "react";

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
          <div className="toolbar rounded-lg h-10 bg-red-400 flex flex-row justify-center items-center"></div>
        )}
        {openelementtoolbar && (
          <div className="toolbar rounded-lg h-10 bg-red-400 flex flex-row justify-center items-center"></div>
        )}
        <div className="canvas flex-grow rounded-lg bg-yellow-500"></div>
      </div>
    </div>
  );
}
