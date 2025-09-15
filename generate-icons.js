const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to generate a simple icon
function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(0, 0, size, size);
  
  // Simple bookmark shape
  ctx.fillStyle = '#3b82f6';
  const scale = size / 512;
  ctx.fillRect(128 * scale, 64 * scale, 256 * scale, 384 * scale);
  
  // Star
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(240 * scale, 160 * scale, 32 * scale, 32 * scale);
  
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = `${48 * scale}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('MT', size / 2, size - 80 * scale);
  
  return canvas.toBuffer('image/png');
}

// Generate icons
const icon192 = generateIcon(192);
const icon512 = generateIcon(512);

// Save icons
fs.writeFileSync('./public/icons/icon-192x192.png', icon192);
fs.writeFileSync('./public/icons/icon-512x512.png', icon512);

console.log('Icons generated successfully!');