export async function removeBgWithPixian(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
  
    const response = await fetch("https://api.pixian.ai/api/v2/remove-background?test=true", {
      method: "POST",
      headers: {
        // Pixian uses HTTP Basic Auth: base64(API_ID:API_SECRET)
        Authorization: "Basic " + btoa(`${process.env.REACT_APP_PIXIAN_API_ID}:${process.env.REACT_APP_PIXIAN_API_SECRET}`),
      },
      body: formData,
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pixian API Error Response:", errorText);
      throw new Error("Pixian failed: " + errorText);
    }
  
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
  