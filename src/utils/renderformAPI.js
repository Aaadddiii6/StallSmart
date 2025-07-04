// src/utils/renderformAPI.js

export async function generateRenderformMockup({ vendorImg, shopName, tagline }) {
    const response = await fetch("https://api.renderform.io/api/v2/render", {
      method: "POST",
      headers: {
        "x-api-key": "key-u2KqKM8dRfT1wTvKJn3HZ9eLi6wBCyKPXb", // ✅ Do not change this line
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: "snobby-flies-wander-too-1011",
        data: {
          shopname: shopName,
          tagline: tagline,
          vendorimage: vendorImg,
        },
      }),
    });
  
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`RenderForm Error (${response.status}): ${err}`);
    }
  
    const data = await response.json();
    return data.href;
  }
  