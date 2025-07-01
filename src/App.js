import { useState } from "react";
import { removeBgWithPixian } from "./utils/removeBg";
import PosterCanvas from "./components/PosterCanvas";
import "./App.css";
import bgImage from "./assets/background.png";

function App() {
  const [vendorFile, setVendorFile] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [vendorImgUrl, setVendorImgUrl] = useState(null);
  const [productImgUrl, setProductImgUrl] = useState(null);
  const [shopName, setShopName] = useState("");
  const [vendorScale, setVendorScale] = useState(3);
  const [productScale, setProductScale] = useState(2);
  const [posterKey, setPosterKey] = useState(0);
  const [fontColor, setFontColor] = useState("#fce903");
  const [fontSize, setFontSize] = useState(80);
  const [fontFamily, setFontFamily] = useState("f1");
  const [lineHeight, setLineHeight] = useState(80);
  const [textAlign, setTextAlign] = useState("center");
  const [textShadow, setTextShadow] = useState({
    enabled: true,
    color: "#000000",
    blur: 3,
    offsetX: 2,
    offsetY: 2,
  });

  const handleGenerate = async () => {
    if (!vendorFile && !productFile) {
      alert("Please upload at least one image (vendor or product) and enter the shop name");
      return;
    }
    if (!shopName) {
      alert("Please enter the shop name");
      return;
    
    }

    try {
      const vUrl = await removeBgWithPixian(vendorFile);
      const pUrl = await removeBgWithPixian(productFile);
      setVendorImgUrl(vUrl);
      setProductImgUrl(pUrl);
      setPosterKey((prev) => prev + 1);
    } catch (err) {
      alert("Image background removal failed");
      console.error(err);
    }
  };

  const handleRegenerate = () => {
    setPosterKey((prev) => prev + 1);
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#000", // fallback
      }}
    >
      {/* 🎯 IMAGE INPUT CARD */}
      <div className="yellow-card">
        <h2>Upload Vendor & Product Images</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setVendorFile(e.target.files[0])}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProductFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Enter Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
      </div>

      {/* 📏 SIZE CONTROL CARD */}
      <div className="yellow-card">
        <h2>Adjust Image Sizes</h2>
        <label>Vendor Image Size:</label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={vendorScale}
          onChange={(e) => setVendorScale(Number(e.target.value))}
        />

        <label>Product Image Size:</label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={productScale}
          onChange={(e) => setProductScale(Number(e.target.value))}
        />
      </div>

      {/* 🎨 FONT STYLE CARD */}
      <div className="yellow-card">
        <h2>Text Styling</h2>

        <label>Font Style:</label>
        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
          <option value="f1">f1</option>
          <option value="f2">f2</option>
          <option value="f3">f3</option>
          <option value="f4">f4</option>
          <option value="f5">f5</option>
        </select>

        <label>Font Size: {fontSize}px</label>
        <input
          type="range"
          min="40"
          max="140"
          step="1"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />

        <label>Line Spacing: {lineHeight}px</label>
        <input
          type="range"
          min="55"
          max="100"
          step="1"
          value={lineHeight}
          onChange={(e) => setLineHeight(Number(e.target.value))}
        />

        <label>Text Align:</label>
        <select value={textAlign} onChange={(e) => setTextAlign(e.target.value)}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>

        <label>Font Color:</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />
      </div>

      {/* 🌫️ SHADOW SETTINGS */}
      <div className="yellow-card">
        <h2>Text Shadow</h2>
        <label>
          <input
            type="checkbox"
            checked={textShadow.enabled}
            onChange={(e) =>
              setTextShadow({ ...textShadow, enabled: e.target.checked })
            }
          />
          Add Text Shadow
        </label>

        {textShadow.enabled && (
          <>
            <label>Shadow Color:</label>
            <input
              type="color"
              value={textShadow.color}
              onChange={(e) =>
                setTextShadow({ ...textShadow, color: e.target.value })
              }
            />
            <label>Blur:</label>
            <input
              type="number"
              min="0"
              max="10"
              value={textShadow.blur}
              onChange={(e) =>
                setTextShadow({ ...textShadow, blur: parseInt(e.target.value) })
              }
            />
          </>
        )}
        <button onClick={handleGenerate}>Generate Poster</button>
      </div>

      {/* 🖼️ OUTPUT SECTION */}
      {vendorImgUrl && productImgUrl && (
        <div className="yellow-card output-card">
          <h2>Poster Preview</h2>
          <PosterCanvas
            key={posterKey}
            vendorImg={vendorImgUrl}
            productImg={productImgUrl}
            shopName={shopName}
            vendorScale={vendorScale}
            productScale={productScale}
            lineHeight={lineHeight}
            textAlign={textAlign}
            textShadow={textShadow}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontColor={fontColor}
          />
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "10px" }}>
            <button onClick={handleRegenerate}>Regenerate Poster</button>
            {/* Add your download button here if needed */}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
