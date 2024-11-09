"use client";
import { Shapes, SwatchBook, MonitorUp, CaseUpper, CopyX } from "lucide-react";
import { useState } from "react";

function Showtemplates() {
  const [template, setTemplate] = useState([]);
  return (
    <div>
      <h1>Templates</h1>
    </div>
  );
}

function Showshape() {
  const [shapes, setshapes] = useState([]);
  return (
    <div>
      <h1>shapes</h1>
    </div>
  );
}

function Showfonts() {
  const [fontelements, setfontelements] = useState([]);
  return (
    <div>
      <h1>fonts</h1>
    </div>
  );
}

function Showuploads() {
  const [uploadelements, setuploadelements] = useState([]);
  return (
    <div className="">
      <h1>uploads</h1>
    </div>
  );
}

export default function Testtest() {
  const [openUploads, setOpenuploads] = useState(false);
  const [openTextelement, setOpentextelement] = useState(false);
  const [openshapelement, setopenshapeelement] = useState(false);
  const [opentemplate, setopentemplate] = useState(false);
  const [openelementtoolbar, setopenelementtoolbar] = useState(false);
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
    <div className="w-full flex flex-row h-full bg-green-200 min-h-[700px]">
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
      {openUploads ? (
        <div className="sidebarmenu translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showuploads />
        </div>
      ) : null}
      {openTextelement ? (
        <div className="sidebarmenu translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showfonts />
        </div>
      ) : null}
      {openshapelement ? (
        <div className="sidebarmenu translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showshape />
        </div>
      ) : null}
      {opentemplate ? (
        <div className="sidebarmenu translate-x-[81px] translate-y-8 absolute h-[600px] overflow-x-hidden bg-background shadow-lg w-full rounded-lg max-h-[90%] max-w-[400px]">
          <div className="topinnerspace py-3 translate-x-28">
            <button onClick={handleCloseSideBarMenu}>
              <CopyX />
            </button>
          </div>
          <Showtemplates />
        </div>
      ) : null}
      <div className="board gap-3 w-full bg-red-900 flex flex-col px-2 py-2">
        {opentexttoolbar ? (
          <div className="toolbar top-[17px] rounded-lg h-10 bg-red-400 flex flex-row justify-center items-center"></div>
        ) : null}
        {openelementtoolbar ? (
          <div className="toolbar top-[17px] rounded-lg h-10 bg-red-400 flex flex-row justify-center items-center"></div>
        ) : null}
        <div className="canvas rounded-lg h-full bg-yellow-500"></div>
      </div>
    </div>
  );
}
