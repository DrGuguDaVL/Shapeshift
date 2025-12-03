
const WIDTH = 600;
const HEIGHT = 600;
const HALF_W = WIDTH / 2;
const HALF_H = HEIGHT / 2;

function convert(points) {
    return points.map(p => {
        const px = ((p.x + HALF_W) / WIDTH) * 100;
        const py = ((p.y + HALF_H) / HEIGHT) * 100;
        return `${px}% ${py}%`;
    }).join(", ");
}
function generatePolygon(n) {
    const r = 260;
    let pts = [];
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
    }
    return pts;
}
function generateOval(rx, ry) {
    let pts = [];
    for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        pts.push({ x: rx * Math.cos(a), y: ry * Math.sin(a) });
    }
    return pts;
}
function generateEllipse() {
    return generateOval(260, 80);
}
function generateOblong() {
    return generateOval(260, 140);
}
function generateStar(points = 5, outer = 260, inner = 100) {
    let pts = [];
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
    }
    return pts;
}
function generateCrescent() {
    let pts = [];
    for (let i = 0; i <= 100; i++) {
        const a = (i / 100) * Math.PI * 2;
        pts.push({ x: 200 * Math.cos(a) - 60, y: 200 * Math.sin(a) });
    }
    for (let i = 100; i >= 0; i--) {
        const a = (i / 100) * Math.PI * 2;
        pts.push({ x: 170 * Math.cos(a) + 60, y: 170 * Math.sin(a) });
    }
    return pts;
}
function generateHeart() {
    let pts = [];
    for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        pts.push({ x: x * 12, y: y * 12 });
    }
    return pts;
}
const shapes = {
    rectangle: [
        {x:-260,y:-140},{x:260,y:-140},{x:260,y:140},{x:-260,y:140}
    ],

    parallelogram: [
        {x:-200,y:-140},{x:200,y:-140},{x:260,y:140},{x:-140,y:140}
    ],

    trapezoid: [
        {x:-200,y:-140},{x:200,y:-140},{x:260,y:140},{x:-260,y:140}
    ],

    oval: generateOval(220,150),
    ellipse: generateEllipse(),
    oblong: generateOblong(),

    star: generateStar(),
    cross: [
        {x:-80,y:-260},{x:80,y:-260},{x:80,y:-80},{x:260,y:-80},
        {x:260,y:80},{x:80,y:80},{x:80,y:260},{x:-80,y:260},
        {x:-80,y:80},{x:-260,y:80},{x:-260,y:-80},{x:-80,y:-80}
    ],

    heart: generateHeart(),
    kite: [
        {x:0,y:-260},{x:160,y:0},{x:0,y:260},{x:-160,y:0}
    ],
    arrow: [
        {x:-200,y:-80},{x:80,y:-80},{x:80,y:-200},{x:260,y:0},
        {x:80,y:200},{x:80,y:80},{x:-200,y:80}
    ],
    crescent: generateCrescent(),

    rhombus: [
        {x:0,y:-180},{x:260,y:0},{x:0,y:180},{x:-260,y:0}
    ],

    diamond: [
        {x:0,y:-260},{x:180,y:0},{x:0,y:260},{x:-180,y:0}
    ]
};
document.getElementById("generateBtn").addEventListener("click", drawShape);

function drawShape() {
    const shapeEl = document.getElementById("shape");
    const preset = document.getElementById("presetShape").value;
    const n = parseInt(document.getElementById("numberInput").value);
    const angle = parseFloat(document.getElementById("angleInput").value) || 0;

    const typed = document.getElementById("colorText").value.trim();
    const picked = document.getElementById("colorPicker").value;
    shapeEl.style.background = typed !== "" ? typed : picked;

    shapeEl.style.transform = `rotate(${angle}deg)`;

    let pts = [];

    if (preset !== "none") {
        pts = shapes[preset];
    } else if (!isNaN(n) && n >= 3) {
        pts = generatePolygon(n);
    } else {
        shapeEl.style.clipPath = "none";
        return;
    }

    const clip = convert(pts);
    shapeEl.style.clipPath = `polygon(${clip})`;
}