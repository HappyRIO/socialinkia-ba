import { useState } from "react";

export default function EditingPanel({ activeAttributes, onUpdateAttributes }) {
  const [isSettingsVisible, setIsSettingsVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const toggleSettingsVisibility = () => {
    setIsSettingsVisible((prevState) => !prevState);
  };

  const handleAttributeChange = (event) => {
    const { name, value, type, checked } = event.target;
    const attributeValue = type === "checkbox" ? checked : value;

    // Pass the updated attribute to the main component
    onUpdateAttributes({ [name]: attributeValue });
  };

  const handleScaleLock = () => {
    setIsLocked((prevState) => !prevState);
  };

  return (
    <>
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
              onChange={handleAttributeChange}
            />
            <input
              type="number"
              name="translateX"
              id="translate-x"
              placeholder="Translate X"
              value={activeAttributes.translateX || ""}
              onChange={handleAttributeChange}
            />
          </div>

          <div className="size-controls">
            <input
              type="number"
              name="scaleY"
              id="scale-y"
              placeholder="Scale Y"
              value={activeAttributes.scaleY || ""}
              onChange={(e) => {
                handleAttributeChange(e);
                if (isLocked) onUpdateAttributes({ scaleX: e.target.value });
              }}
            />
            <input
              type="number"
              name="scaleX"
              id="scale-x"
              placeholder="Scale X"
              value={activeAttributes.scaleX || ""}
              onChange={(e) => {
                handleAttributeChange(e);
                if (isLocked) onUpdateAttributes({ scaleY: e.target.value });
              }}
            />
            <button onClick={handleScaleLock}>
              {isLocked ? "Ratio Locked" : "Lock"}
            </button>
          </div>

          <div className="rotation-controls">
            <input
              value={activeAttributes.rotate || ""}
              onChange={handleAttributeChange}
              type="range"
              name="rotate"
              id="rotate"
              min="0"
              max="360"
            />
          </div>

          <div className="object-editing">
            {activeAttributes.type === "star" && (
              <input
                type="range"
                name="starPoints"
                id="star-points"
                value={activeAttributes.starPoints || 5}
                onChange={handleAttributeChange}
              />
            )}
            <input
              type="text"
              placeholder="element name......"
              id="element-name"
              name="elementName"
              value={activeAttributes.name || ""}
              onChange={handleAttributeChange}
            />

            {activeAttributes.type === "text" && (
              <div className="fontselector">
                <div className="font-list-zone">
                  <div className="font-picker">
                    <select
                      name="fontFamily"
                      id="font-family-selector"
                      value={activeAttributes.fontFamily || "Arial"}
                      onChange={handleAttributeChange}
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
                      value={activeAttributes.fontWeight || "normal"}
                      onChange={handleAttributeChange}
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
              value={activeAttributes.opacity || 1}
              onChange={handleAttributeChange}
            />
          </div>

          <div className="color-controls">
            <input
              type="color"
              name="color"
              id="color"
              value={activeAttributes.fill || "#000000"}
              onChange={handleAttributeChange}
            />
          </div>

          <div className="border-controls">
            <input
              type="checkbox"
              name="addBorder"
              id="add-border"
              checked={activeAttributes.addBorder || false}
              onChange={handleAttributeChange}
            />
            <input
              type="color"
              name="borderColor"
              id="border-color"
              value={activeAttributes.borderColor || "#000000"}
              onChange={handleAttributeChange}
            />
            <input
              type="number"
              name="borderRadius"
              id="border-radius"
              placeholder="Border Radius"
              value={activeAttributes.borderRadius || 0}
              onChange={handleAttributeChange}
            />
            <input
              type="number"
              name="borderWidth"
              id="border-width"
              placeholder="Border Width"
              value={activeAttributes.borderWidth || 0}
              onChange={handleAttributeChange}
            />
          </div>

          <div className="effect-controls">
            <div className="shadow-controls">
              <input
                type="checkbox"
                name="addShadow"
                id="add-shadow"
                checked={activeAttributes.addShadow || false}
                onChange={handleAttributeChange}
              />
              <input
                type="color"
                name="shadowColor"
                id="shadow-color"
                value={activeAttributes.shadowColor || "#000000"}
                onChange={handleAttributeChange}
              />
              <input
                type="number"
                name="shadowBlur"
                id="shadow-blur"
                placeholder="Shadow Blur"
                value={activeAttributes.shadowBlur || 0}
                onChange={handleAttributeChange}
              />
              <input
                type="number"
                name="shadowX"
                id="shadow-x"
                placeholder="Shadow X"
                value={activeAttributes.shadowX || 0}
                onChange={handleAttributeChange}
              />
              <input
                type="number"
                name="shadowY"
                id="shadow-y"
                placeholder="Shadow Y"
                value={activeAttributes.shadowY || 0}
                onChange={handleAttributeChange}
              />
            </div>

            <div className="blur-controls">
              <input
                type="range"
                name="gussianBlurRange"
                id="gussian-blur-range"
                value={activeAttributes.gussianBlurRange || 0}
                onChange={handleAttributeChange}
              />
            </div>
          </div>

          <div className="delete-object">
            <button
              className="w-full p-2 py-1 bg-red-500 text-white"
              onClick={() => onUpdateAttributes(null)}
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
    </>
  );
}
