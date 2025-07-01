import { useEffect, useRef } from "react";

function PosterCanvas({
    vendorImg,
    productImg,
    shopName,
    vendorScale,
    productScale,
    vendorX = 60,
    vendorY = 400,
    productX = 420,
    productY = 400,
    lineHeight,
    textAlign,
    textShadow,
    fontSize,
    fontFamily,
    fontColor
  }) 
   {
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
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const loadFontAndDraw = async () => {
      await document.fonts.load(`${fontSize}px '${fontFamily}'`);

      const bg = new Image();
      bg.src = "/backgrounds/template1.png";
      bg.onload = () => {
        ctx.fillStyle = fontColor || "#fce903";
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        const vendor = new Image();
        vendor.src = vendorImg;
        vendor.onload = () => {
          const vendorWidth = 120 * vendorScale;
          const vendorHeight = 160 * vendorScale;
          const boundedVendorX = Math.min(Math.max(0, vendorX), canvas.width - vendorWidth);
          const boundedVendorY = Math.min(Math.max(0, vendorY), canvas.height - vendorHeight);

          ctx.drawImage(vendor, boundedVendorX, boundedVendorY, vendorWidth, vendorHeight);

          const product = new Image();
          product.src = productImg;
          product.onload = () => {
            const productWidth = 120 * productScale;
            const productHeight = 120 * productScale;
            const boundedProductX = Math.min(Math.max(0, productX), canvas.width - productWidth);
            const boundedProductY = Math.min(Math.max(0, productY), canvas.height - productHeight);

            ctx.drawImage(product, boundedProductX, boundedProductY, productWidth, productHeight);

            // 🖍 Font & color
            ctx.font = `bold ${fontSize}px '${fontFamily}'`;
            ctx.fillStyle = "#fce903";
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

            // 📝 Wrap text
            wrapText(ctx, shopName, textX, textY, 500, lineHeight);
          };
        };
      };
    };

    loadFontAndDraw();
  }, [
    vendorImg,
    productImg,
    shopName,
    vendorScale,
    productScale,
    lineHeight,
    textAlign,
    textShadow,
    fontSize,
    fontFamily,
    fontColor,
    vendorX,
  vendorY,
  productX,
  productY, 
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
