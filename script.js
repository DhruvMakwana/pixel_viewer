const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
const results = document.getElementById('results');
const landingDiv = document.querySelector('.landing');

cvs.addEventListener('mousemove', mousePos, false);
cvs.addEventListener('click', copyMousePos, false);

window.onload = function () {
    const inputImage = document.getElementById('inputImage');
    inputImage.addEventListener('change', handleImageFiles, false);
};

function copyMousePos(evt) {
    const rect = cvs.getBoundingClientRect();
    const x = parseInt(evt.clientX - rect.left);
    const y = parseInt(evt.clientY - rect.top);
    const p = ctx.getImageData(x, y, 1, 1).data;
    
    const xyInfo = `X: ${x}, Y: ${y}`;
    const rgbaInfo = `RGBA: ${p[0]}, ${p[1]}, ${p[2]}, ${p[3]}`;
    
    // Convert RGBA to HSV
    const hsv = rgbToHsv(p[0], p[1], p[2]);
    const hsvInfo = `HSV: H:${hsv[0].toFixed(2)}, S:${hsv[1].toFixed(2)}, V:${hsv[2].toFixed(2)}`;
    
    results.innerHTML = `<table style="width:100%;table-layout:fixed">
        <tr><td>${xyInfo}</td><td>${rgbaInfo}</td><td>${hsvInfo}</td></tr>
        </table>`;
}

function mousePos(evt) {
    const rect = cvs.getBoundingClientRect();
    const x = parseInt(evt.clientX - rect.left);
    const y = parseInt(evt.clientY - rect.top);
    const p = ctx.getImageData(x, y, 1, 1).data;
    
    const xyInfo = `X: ${x}, Y: ${y}`;
    const rgbaInfo = `RGBA: R:${p[0]}, G:${p[1]}, B:${p[2]}, A:${p[3]}`;
    
    // Convert RGBA to HSV
    const hsv = rgbToHsv(p[0], p[1], p[2]);
    const hsvInfo = `HSV: H:${hsv[0].toFixed(2)}, S:${hsv[1].toFixed(2)}, V:${hsv[2].toFixed(2)}`;

    // Convert RGBA to YCbCr
    const ycbcr = rgbToYCbCr(p[0], p[1], p[2]);
    const ycbcrInfo = `YCbCr: Y:${ycbcr[0].toFixed(2)}, Cb:${ycbcr[1].toFixed(2)}, Cr:${ycbcr[2].toFixed(2)}`;
    
    results.innerHTML = `<table style="width:100%;table-layout:fixed">
        <tr><td>${xyInfo}</td><td>${rgbaInfo}</td><td>${hsvInfo}</td><td>${ycbcrInfo}</td></tr>
        </table>`;
    return { x, y };
}

function handleImageFiles(e) {
    const url = URL.createObjectURL(e.target.files[0]);
    const img = new Image();
    img.onload = function () {
        cvs.width = img.width;
        cvs.height = img.height;
        ctx.drawImage(img, 0, 0);
        landingDiv.style.display = 'none';
    };
    img.src = url;
}

// Function to convert RGB to HSV
function rgbToHsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h, s, v;

    if (delta === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / delta) % 6;
    } else if (max === g) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }

    v = Math.round(max * 100);
    s = Math.round((delta / max) * 100);

    return [h, s, v];
}

// Function to convert RGB to YCbCr
function rgbToYCbCr(r, g, b) {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

    return [y, cb, cr];
}