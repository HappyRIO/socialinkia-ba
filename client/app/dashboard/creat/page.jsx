"use client";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

const FabricEditor = () => {
  const canvasRef = useRef(null); // Reference to the canvas DOM element
  const fabricCanvasRef = useRef(null); // Reference to Fabric.js canvas instance
  const [templateName, setTemplateName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [DefaultTemplate, setDefaultTemplate] = useState([]);

  useEffect(() => {
    // Fetch all templates
    fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/templates/all`)
      .then((res) => res.json())
      .then((data) => {
        setDefaultTemplate(data);
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
      });

    // Initialize Fabric.js canvas
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      height: 600,
      width: 800,
      backgroundColor: "#f3f3f3",
    });

    return () => {
      // Cleanup Fabric.js canvas on unmount
      fabricCanvasRef.current.dispose();
    };
  }, []);

  // Add text to the canvas
  const addText = () => {
    const text = new fabric.Textbox("Sample Text", {
      left: 50,
      top: 50,
      fontSize: 20,
      fill: "#333",
    });
    fabricCanvasRef.current.add(text).setActiveObject(text);
  };

  // Add image to the canvas
  const addImage = (url) => {
    fabric.Image.fromURL(url, (img) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      });
      fabricCanvasRef.current.add(img).setActiveObject(img);
    });
  };

  // Save template to backend
  const saveTemplate = async () => {
    const canvasData = fabricCanvasRef.current.toJSON();
    try {
      setIsLoading(true);
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: templateName, data: canvasData }),
      });
      alert("Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load template from backend
  const loadTemplate = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/templates/${id}`);
      const { data } = await response.json();
      fabricCanvasRef.current.loadFromJSON(data, () => {
        fabricCanvasRef.current.renderAll();
      });
    } catch (error) {
      console.error("Error loading template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete the active object
  const deleteObject = () => {
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.discardActiveObject(); // Discard the active object after deletion
      fabricCanvasRef.current.renderAll();
    } else {
      alert("No object selected for deletion.");
    }
  };

  return (
    <div>
      <h2>Fabric.js Image Editor</h2>

      <input
        type="text"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        placeholder="Template Name"
      />
      <button onClick={addText}>Add Text</button>
      <button onClick={() => addImage("/path/to/image.jpg")}>Add Image</button>
      <button onClick={saveTemplate} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Template"}
      </button>
      <button onClick={() => loadTemplate("template-id")}>Load Template</button>
      <button onClick={deleteObject}>Delete Active Object</button>

      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default FabricEditor;
