import { useEffect, useRef } from "react";

function PosterCanvas({
  tagline,
  vendorImg,
  productImg,
  shopName,
  vendorScale,
  productScale,
  vendorPosition,
  productPosition,
  lineHeight,
  textAlign,
  textShadow,
  fontSize,
  fontFamily,
  fontColor,
  taglineFont,
  taglineColor,
  templateId,
  onExportImage, // ✅ new prop
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
    return currentY + lineHeight;
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
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        const vendor = new Image();
        vendor.src = vendorImg;
        vendor.onload = () => {
          const vendorWidth = 120 * vendorScale;
          const vendorHeight = 160 * vendorScale;

          ctx.drawImage(
            vendor,
            vendorPosition?.x || 0,
            vendorPosition?.y || 0,
            vendorWidth,
            vendorHeight
          );

          const product = new Image();
          product.src = productImg;
          product.onload = () => {
            const productWidth = 120 * productScale;
            const productHeight = 120 * productScale;

            ctx.drawImage(
              product,
              productPosition?.x || 0,
              productPosition?.y || 0,
              productWidth,
              productHeight
            );

            // ✏️ Text styles
            ctx.font = `bold ${fontSize}px '${fontFamily}'`;
            ctx.fillStyle = fontColor || "#fce903";
            ctx.textAlign = textAlign;
            ctx.textBaseline = "top";

            // 🌫 Shadow
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

            // 📍 Text position
            const textX =
              textAlign === "left"
                ? 50
                : textAlign === "right"
                ? canvas.width - 50
                : canvas.width / 2;
            const textY = 40;

            const taglineStartY = wrapText(
              ctx,
              shopName,
              textX,
              textY,
              500,
              lineHeight
            );

            // ✨ Tagline
            if (tagline) {
              ctx.font = `normal ${fontSize * 0.4}px '${taglineFont}'`;
              ctx.fillStyle = taglineColor || "#fce903";
              wrapText(
                ctx,
                tagline,
                textX,
                taglineStartY,
                500,
                lineHeight * 0.6
              );
            }

            // 🖼️ Export Image
            if (onExportImage) {
              const dataUrl = canvas.toDataURL("image/png");
              onExportImage(dataUrl); // 👈 pass base64 URL back to parent
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
    onExportImage, // 👈 trigger redraw on change
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
