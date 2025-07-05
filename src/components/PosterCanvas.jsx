import { useEffect, useRef } from "react";
function hexToRGBA(hex, alpha = 1) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function PosterCanvas({
  tagline,
  vendorImg,
  productImg,
  shopName,
  vendorScale,
  productScale,
  vendorPosition,
  productPosition,
  vendorX = 60,
  vendorY = 400,
  productX = 420,
  productY = 400,
  lineHeight,
  textAlign,
  textShadow,
  fontSize,
  fontFamily,
  fontColor,
  taglineFont,
  taglineColor,
  templateId,
  imgShadow 
}) {
  const canvasRef = useRef();

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }

    ctx.fillText(line, x, currentY);
    return currentY + lineHeight; // 👈 return next Y position
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const loadFontAndDraw = async () => {
      await document.fonts.load(`${fontSize}px '${fontFamily}'`);

      const bg = new Image();
      bg.src = `/backgrounds/${templateId}.png`;
      bg.onload = () => {
        ctx.fillStyle = fontColor || "#fce903";
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        const vendor = new Image();
        vendor.src = vendorImg;
        vendor.onload = () => {
          const vendorWidth = 120 * vendorScale;
          const vendorHeight = 160 * vendorScale;

          if (imgShadow?.enabled) {
            const alphaColor = hexToRGBA(imgShadow.color, imgShadow.alpha ?? 1);
            const angleRad = ((imgShadow.angle ?? 45) * Math.PI) / 180;
            const offsetX = Math.round(Math.cos(angleRad) * (imgShadow.distance ?? 10));
            const offsetY = Math.round(Math.sin(angleRad) * (imgShadow.distance ?? 10));
          
            ctx.shadowColor = alphaColor;
            ctx.shadowBlur = imgShadow.blur ?? 20;
            ctx.shadowOffsetX = offsetX;
            ctx.shadowOffsetY = offsetY;
          }
           else {
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
          
          ctx.drawImage(
            vendor,
            vendorPosition?.x || 0,
            vendorPosition?.y || 0,
            vendorWidth,
            vendorHeight
          );
          
          // Reset shadow so it doesn't affect product or text
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          

          const product = new Image();
          product.src = productImg;
          product.onload = () => {
            const productWidth = 120 * productScale;
            const productHeight = 120 * productScale;

            if (imgShadow?.enabled) {
              const alphaColor = hexToRGBA(imgShadow.color, imgShadow.alpha ?? 1);
              const angleRad = ((imgShadow.angle ?? 45) * Math.PI) / 180;
              const offsetX = Math.round(Math.cos(angleRad) * (imgShadow.distance ?? 10));
              const offsetY = Math.round(Math.sin(angleRad) * (imgShadow.distance ?? 10));
            
              ctx.shadowColor = alphaColor;
              ctx.shadowBlur = imgShadow.blur ?? 20;
              ctx.shadowOffsetX = offsetX;
              ctx.shadowOffsetY = offsetY;
            }
            else {
              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }
            
            ctx.drawImage(
              product,
              productPosition?.x || 0,
              productPosition?.y || 0,
              productWidth,
              productHeight
            );
            
            // Reset again to avoid affecting next elements
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            

            // 🖍 Font & color
            ctx.font = `bold ${fontSize}px '${fontFamily}'`;
            ctx.fillStyle = fontColor || "#fce903";
            ctx.textAlign = textAlign;
            ctx.textBaseline = "top";

            // 🌫️ Shadow
            if (textShadow?.enabled) {
              ctx.shadowColor = textShadow.color;
              ctx.shadowBlur = textShadow.blur;
              ctx.shadowOffsetX = textShadow.offsetX;
              ctx.shadowOffsetY = textShadow.offsetY;
            } else {
              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }

            // 🎯 Positioning
            let textX =
              textAlign === "left"
                ? 50
                : textAlign === "right"
                ? canvas.width - 50
                : canvas.width / 2;
            const textY = 40;

            // 📝 Draw shop name and get next Y
            const taglineStartY = wrapText(
              ctx,
              shopName,
              textX,
              textY,
              500,
              lineHeight
            );

            // ✨ Draw tagline below shop name
            if (tagline) {
              ctx.font = `normal ${fontSize * 0.4}px '${taglineFont}'`;
ctx.fillStyle = taglineColor || "#fce903";

              wrapText(ctx, tagline, textX, taglineStartY, 500, lineHeight * 0.6);
            }
          };
        };
      };
    };
    

    loadFontAndDraw();
  }, [
    vendorImg,
    productImg,
    shopName,
    tagline,
    taglineFont,
    taglineColor,
    templateId,
    vendorScale,
    productScale,
    lineHeight,
    textAlign,
    textShadow,
    fontSize,
    fontFamily,
    fontColor,
    vendorPosition,
    productPosition,
    imgShadow,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={800}
      className="canvas-preview"
      style={{ backgroundColor: "white", border: "1px solid gray" }}
    />
  );
}

export default PosterCanvas;
