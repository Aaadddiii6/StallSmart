import { useState } from "react";
import { removeBgWithPixian } from "./utils/removeBg";
import PosterCanvas from "./components/PosterCanvas";
import "./App.css";

import bgImage from "./assets/background.png";
import { generateRenderformMockup } from "./utils/renderformAPI";

/*import { removeBgWithReplicate } from "./utils/removeBgWithReplicate";*/
function getPosterDataUrl() {
  const canvas = document.querySelector(".canvas-preview");
  return canvas.toDataURL("image/png");
}
async function uploadToImgBB(base64Image) {
  const form = new FormData();
  form.append("image", base64Image.split(",")[1]); // removes data:image/png;base64,

  const res = await fetch(
    "https://api.imgbb.com/1/upload?key=f594d149ac56f692bf1735dfa48310cb",
    {
      method: "POST",
      body: form,
    }
  );

  const data = await res.json();
  return data.data.url;
}

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
  const [vendorPosition, setVendorPosition] = useState({ x: 40, y: 350 });
  const [productPosition, setProductPosition] = useState({ x: 320, y: 400 });
  const [tagline, setTagline] = useState("");
  const [taglineFont, setTaglineFont] = useState("f1");
  const [taglineColor, setTaglineColor] = useState("#fce903");
  const [templateId, setTemplateId] = useState("template1");
  const [removeBg, setRemoveBg] = useState(true);

  const [imgShadow, setImgShadow] = useState({
    enabled: true,
    color: "#000000",
    blur: 20,
    alpha: 1, // 💡 new: transparency
    angle: 45, // 💡 new: direction in degrees
    distance: 10, // 💡 new: distance in px
  });

  const [renderformImageUrl, setRenderformImageUrl] = useState(null);

  const [textShadow, setTextShadow] = useState({
    enabled: true,
    color: "#000000",
    blur: 3,
    offsetX: 2,
    offsetY: 2,
  });

  const handleGenerate = async () => {
    if (!vendorFile && !productFile) {
      alert(
        "Please upload at least one image (vendor or product) and enter the shop name"
      );
      return;
    }
    if (!shopName) {
      alert("Please enter the shop name");
      return;
    }

    try {
      let vUrl = null;
      let pUrl = null;

      if (vendorFile) {
        vUrl = removeBg
          ? await removeBgWithPixian(vendorFile)
          : URL.createObjectURL(vendorFile);
      }

      if (productFile) {
        pUrl = removeBg
          ? await removeBgWithPixian(productFile)
          : URL.createObjectURL(productFile);
      }

      setVendorImgUrl(vUrl);
      setProductImgUrl(pUrl);
      setPosterKey((prev) => prev + 1);
    } catch (err) {
      alert("Image processing failed");
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
      <div className="glass-navbar">
        <h1>Street Vendor Poster Maker</h1>
      </div>

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
        <input
          type="text"
          placeholder="Enter Tagline (optional)"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={removeBg}
            onChange={(e) => setRemoveBg(e.target.checked)}
            style={{ marginRight: "6px" }}
          />
          Remove Background
        </label>
      </div>

      {/* 📏 SIZE CONTROL CARD */}

      {/* 🎨 FONT STYLE CARD */}
      <div className="yellow-card">
        <h2>Text Styling</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div>
            <label>Shop Font:</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              style={{ width: "100px" }}
            >
              <option value="f1">f1</option>
              <option value="f2">f2</option>
              <option value="f3">f3</option>
              <option value="f4">f4</option>
              <option value="f5">f5</option>
            </select>
          </div>

          <div>
            <label>Tagline Font:</label>
            <select
              value={taglineFont}
              onChange={(e) => setTaglineFont(e.target.value)}
              style={{ width: "100px" }}
            >
              <option value="f1">f1</option>
              <option value="f2">f2</option>
              <option value="f3">f3</option>
              <option value="f4">f4</option>
              <option value="f5">f5</option>
            </select>
          </div>
          <div>
            <label>Template:</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              style={{ width: "120px" }}
            >
              <option value="template1">Template 1</option>
              <option value="template2">Template 2</option>
              <option value="template3">Template 3</option>
              <option value="template4">Template 4</option>
              <option value="template5">Template 5</option>
              <option value="template6">Template 6</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <div>
            <label>Shop Color:</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              style={{ width: "50px" }}
            />
          </div>

          <div>
            <label>Tagline Color:</label>
            <input
              type="color"
              value={taglineColor}
              onChange={(e) => setTaglineColor(e.target.value)}
              style={{ width: "50px" }}
            />
          </div>
          <div>
            <label>Text Align:</label>
            <select
              value={textAlign}
              onChange={(e) => setTextAlign(e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

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
      </div>

      <div className="yellow-card">
        <h2>Shadow Settings</h2>

        <div className="shadow-container">
          {/* TEXT SHADOW SETTINGS */}
          <div className="shadow-column">
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
                <label>Text Shadow Color:</label>
                <input
                  type="color"
                  value={textShadow.color}
                  onChange={(e) =>
                    setTextShadow({ ...textShadow, color: e.target.value })
                  }
                />

                <label>Text Shadow Blur (0–10):</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={textShadow.blur}
                  onChange={(e) =>
                    setTextShadow({
                      ...textShadow,
                      blur: parseInt(e.target.value),
                    })
                  }
                />
              </>
            )}
          </div>

          {/* IMAGE SHADOW SETTINGS */}
          <div className="shadow-column">
            <label>
              <input
                type="checkbox"
                checked={imgShadow.enabled}
                onChange={(e) =>
                  setImgShadow({ ...imgShadow, enabled: e.target.checked })
                }
              />
              Add Image Shadow
            </label>

            {imgShadow.enabled && (
              <>
                <label>Image Shadow Color:</label>
                <input
                  type="color"
                  value={imgShadow.color}
                  onChange={(e) =>
                    setImgShadow({ ...imgShadow, color: e.target.value })
                  }
                />

                <label>Transparency (0–100):</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(imgShadow.alpha * 100)}
                  onChange={(e) =>
                    setImgShadow({
                      ...imgShadow,
                      alpha: parseInt(e.target.value) / 100,
                    })
                  }
                />

                <label>Shadow Blur:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={imgShadow.blur}
                  onChange={(e) =>
                    setImgShadow({
                      ...imgShadow,
                      blur: parseInt(e.target.value),
                    })
                  }
                />

                <label>Shadow Angle (degrees):</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={imgShadow.angle}
                  onChange={(e) =>
                    setImgShadow({
                      ...imgShadow,
                      angle: parseInt(e.target.value),
                    })
                  }
                />

                <label>Shadow Distance:</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={imgShadow.distance}
                  onChange={(e) =>
                    setImgShadow({
                      ...imgShadow,
                      distance: parseInt(e.target.value),
                    })
                  }
                />
              </>
            )}
          </div>
        </div>


        <button onClick={handleGenerate}>Generate Poster</button>
      </div>

      {/* 📏 SIZE + POSITION CONTROL CARD */}
      <div className="yellow-card">
        <h2>Adjust Image Sizes & Positions</h2>

        {/* Vendor Controls */}
        <div style={{ marginBottom: "15px" }}>
          <label>Vendor Image Size:</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={vendorScale}
            onChange={(e) => setVendorScale(Number(e.target.value))}
          />
        </div>

        {/* Product Controls */}
        <div style={{ marginBottom: "15px" }}>
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

        {/* Arrow Controls Side-by-Side */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          {/* Vendor Arrows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <strong>Vendor Position</strong>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "40px 40px 40px",
                gap: "5px",
              }}
            >
              <div></div>
              <button
                onClick={() => setVendorPosition((p) => ({ ...p, y: p.y - 5 }))}
              >
                ⬆️
              </button>
              <div></div>
              <button
                onClick={() => setVendorPosition((p) => ({ ...p, x: p.x - 5 }))}
              >
                ⬅️
              </button>
              <div></div>
              <button
                onClick={() => setVendorPosition((p) => ({ ...p, x: p.x + 5 }))}
              >
                ➡️
              </button>
              <div></div>
              <button
                onClick={() => setVendorPosition((p) => ({ ...p, y: p.y + 5 }))}
              >
                ⬇️
              </button>
              <div></div>
            </div>
          </div>

          {/* Product Arrows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <strong>Product Position</strong>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "40px 40px 40px",
                gap: "5px",
              }}
            >
              <div></div>
              <button
                onClick={() =>
                  setProductPosition((p) => ({ ...p, y: p.y - 5 }))
                }
              >
                ⬆️
              </button>
              <div></div>
              <button
                onClick={() =>
                  setProductPosition((p) => ({ ...p, x: p.x - 5 }))
                }
              >
                ⬅️
              </button>
              <div></div>
              <button
                onClick={() =>
                  setProductPosition((p) => ({ ...p, x: p.x + 5 }))
                }
              >
                ➡️
              </button>
              <div></div>
              <button
                onClick={() =>
                  setProductPosition((p) => ({ ...p, y: p.y + 5 }))
                }
              >
                ⬇️
              </button>
              <div></div>
            </div>
          </div>
        </div>
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
            taglineFont={taglineFont}
            taglineColor={taglineColor}
            fontColor={fontColor}
            vendorPosition={vendorPosition}
            productPosition={productPosition}
            tagline={tagline}
            templateId={templateId}
            imgShadow={imgShadow}
          />
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button onClick={handleRegenerate}>Regenerate Poster</button>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={async () => {
                  const posterDataUrl = getPosterDataUrl(); // 1️⃣ Get canvas image
                  const publicUrl = await uploadToImgBB(posterDataUrl); // 2️⃣ Upload to ImgBB
                  // 3️⃣ Save poster URL

                  const businessCardUrl = await generateRenderformMockup({
                    vendorImg: vendorImgUrl,
                    bgImg: publicUrl,
                    tagline: tagline,
                    shopName: shopName,
                  });

                  setRenderformImageUrl(businessCardUrl); // 4️⃣ Save mockup URL

                  const link = document.createElement("a"); // 5️⃣ Download poster locally
                  link.href = posterDataUrl;
                  link.download = "poster.png";
                  link.click();
                }}
              >
                Download Poster
              </button>
            </div>
          </div>
        </div>
      )}

      {renderformImageUrl && (
        <div className="yellow-card output-card">
          <h2>Business Card Mockup</h2>
          <img
            src={renderformImageUrl}
            alt="Business Card"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "12px",
            }}
          />
          <a href={renderformImageUrl} download="business_card.png">
            <button>Download Business Card</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
