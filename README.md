# 🛍️ Street Vendor Poster Generator

A React-based web app that allows users to generate attractive posters for street vendors. Users can upload vendor and product images, remove their backgrounds, customize text styling, and render the final poster for download.

## ✨ Features

- 🖼 Upload vendor and product images
- 🔍 Background removal using Pixian API
- 🎨 Text customization (font, size, color, alignment, shadow)
- ⚙️ Image scaling and positioning controls
- 🧾 Generate posters inside a canvas with real-time preview
- 📱 Mobile-optimized responsive UI

## 📷 Screenshots

*(Include screenshots here once available)*

## 🔧 Technologies Used

- React
- HTML5 Canvas API
- Pixian Image Background Removal API
- CSS (custom responsive styling)

## 📦 Installation

```bash
git clone https://github.com/your-username/street-vendor-poster.git
cd street-vendor-poster
npm install
npm start
🛠 Usage
Upload vendor image (product image is optional).

Enter the shop name.

Adjust image size and position.

Customize text style, font, and shadow.

Click Generate Poster to preview it on canvas.

Click Regenerate to refresh or Download to save the final poster (coming soon).

🗂 Folder Structure
css
Copy
Edit
src/
├── components/
│   └── PosterCanvas.jsx
├── utils/
│   └── removeBg.js
├── assets/
│   └── background.png
├── App.js
├── App.css
