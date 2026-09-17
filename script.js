// --- STATE & UTILS --- //
let currentPathPoints = [];
let animFrameId = null;

const morphPath = document.getElementById("morphPath");
const presetSelect = document.getElementById("presetShape");
const triangleGroup = document.getElementById("triangleGroup");
const trapezoidGroup = document.getElementById("trapezoidGroup");
const foilGroup = document.getElementById("foilGroup");
const pieGroup = document.getElementById("pieGroup");
const sidesGroup = document.getElementById("sidesGroup");

// Handle Dynamic Controls Visibility
presetSelect.addEventListener("change", () => {
    const val = presetSelect.value;

    triangleGroup.classList.toggle("hidden", val !== "triangle");
    trapezoidGroup.classList.toggle("hidden", val !== "trapezoid");
    foilGroup.classList.toggle("hidden", val !== "foil");
    pieGroup.classList.toggle("hidden", val !== "pie");
    sidesGroup.classList.toggle("hidden", val !== "none");
});

document.getElementById("triangleType").addEventListener("change", drawShape);
document.getElementById("trapezoidType").addEventListener("change", drawShape);
document.getElementById("foilPetals").addEventListener("input", drawShape);
document.getElementById("piePercent").addEventListener("input", drawShape);
document.getElementById("generateBtn").addEventListener("click", drawShape);

// Interpolate smooth bezier/SVG paths into uniform sample points
function sampleBezierPath(dString, sampleCount = 120) {
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgPath.setAttribute("d", dString);
    const totalLength = svgPath.getTotalLength();

    const points = [];
    for (let i = 0; i < sampleCount; i++) {
        const pt = svgPath.getPointAtLength((i / sampleCount) * totalLength);
        points.push([pt.x, pt.y]);
    }
    return points;
}

// Convert sampled points back to SVG path format
function pointsToSVGPath(points) {
    if (!points.length) return "";
    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
    }
    d += " Z";
    return d;
}

// --- SHAPE GENERATION LOGIC (Center = 150, 150) --- //
function getShapePoints() {
    const preset = presetSelect.value;
    const n = parseInt(document.getElementById("numberInput").value);
    const cx = 150, cy = 150;

    if (preset === "none") {
        if (isNaN(n) || n < 1) return generatePolygonPoints(4, cx, cy, 80);
        if (n === 1) return generateCirclePoints(cx, cy, 80, 120);
        if (n === 2) return generateSemicirclePoints(cx, cy, 80, 120);
        return generatePolygonPoints(n, cx, cy, 80);
    }

    switch (preset) {
        case "square":
            return generateRectPoints(cx, cy, 140, 140);

        case "rectangle":
            return generateRectPoints(cx, cy, 220, 120);

        case "circle":
            return generateCirclePoints(cx, cy, 85, 120);

        case "semicircle":
            return generateSemicirclePoints(cx, cy, 85, 120);

        case "verticalOval":
            return generateOvalPoints(cx, cy, 65, 110, 120);

        case "triangle": {
            const type = document.getElementById("triangleType").value;
            if (type === "equilateral") return generatePolygonPoints(3, cx, cy, 90);
            if (type === "isosceles") return [[cx, cy - 100], [cx + 80, cy + 80], [cx - 80, cy + 80]];
            if (type === "right") return [[cx - 80, cy - 80], [cx + 80, cy + 80], [cx - 80, cy + 80]];
            if (type === "scalene") return [[cx - 40, cy - 90], [cx + 100, cy + 70], [cx - 90, cy + 80]];
            if (type === "obtuse") return [[cx - 110, cy + 60], [cx + 110, cy + 60], [cx - 20, cy - 20]];
            return generatePolygonPoints(3, cx, cy, 90);
        }

        case "trapezoid": {
            const type = document.getElementById("trapezoidType").value;
            if (type === "isosceles") return [[cx - 50, cy - 60], [cx + 50, cy - 60], [cx + 90, cy + 60], [cx - 90, cy + 60]];
            if (type === "right") return [[cx - 80, cy - 60], [cx + 40, cy - 60], [cx + 80, cy + 60], [cx - 80, cy + 60]];
            if (type === "scalene") return [[cx - 40, cy - 60], [cx + 70, cy - 60], [cx + 100, cy + 60], [cx - 80, cy + 60]];
            return [[cx - 50, cy - 60], [cx + 50, cy - 60], [cx + 90, cy + 60], [cx - 90, cy + 60]];
        }

        case "parallelogram":
            return [[cx - 40, cy - 60], [cx + 100, cy - 60], [cx + 40, cy + 60], [cx - 100, cy + 60]];

        case "star":
            return generateStarPoints(cx, cy, 5, 90, 40);

        case "rhombus":
            return [[cx, cy - 100], [cx + 70, cy], [cx, cy + 100], [cx - 70, cy]];

        case "kite":
            return [[cx, cy - 100], [cx + 70, cy - 30], [cx, cy + 100], [cx - 70, cy - 30]];

        case "cross":
            return [
                [cx - 25, cy - 90], [cx + 25, cy - 90], [cx + 25, cy - 25],
                [cx + 90, cy - 25], [cx + 90, cy + 25], [cx + 25, cy + 25],
                [cx + 25, cy + 90], [cx - 25, cy + 90], [cx - 25, cy + 25],
                [cx - 90, cy + 25], [cx - 90, cy - 25], [cx - 25, cy - 25]
            ];

        case "arrow":
            return [
                [cx - 20, cy - 90], [cx + 20, cy - 90], [cx + 20, cy],
                [cx + 60, cy], [cx, cy + 90], [cx - 60, cy], [cx - 20, cy]
            ];

        case "heart": {
            const pathStr = "M 150 230 C 70 180 30 130 30 85 C 30 50 55 30 85 30 C 110 30 135 48 150 70 C 165 48 190 30 215 30 C 245 30 270 50 270 85 C 270 130 230 180 150 230 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "club": {
            const pathStr = "M 150 150 C 120 150 110 100 130 80 C 145 60 170 80 150 100 C 170 80 200 110 180 135 C 160 160 150 150 150 150 C 175 160 185 200 160 210 C 140 220 125 180 150 150 C 130 170 100 160 110 130 C 120 100 150 150 150 150 M 145 160 L 130 230 L 170 230 L 155 160 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "spade": {
            const pathStr = "M 150 30 C 220 120 230 170 180 200 C 150 220 150 175 150 175 C 150 175 150 220 120 200 C 70 170 80 120 150 30 Z M 145 160 L 125 230 L 175 230 L 155 160 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "diamond":
            return [[cx, cy - 110], [cx + 80, cy], [cx, cy + 110], [cx - 80, cy]];

        case "drop": {
            const pathStr = "M 150 40 C 230 150 220 240 150 240 C 80 240 70 150 150 40 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "crescent": {
            const pathStr = "M 150 40 A 100 100 0 1 0 250 180 A 85 85 0 1 1 150 40 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "foil": {
            const petals = parseInt(document.getElementById("foilPetals").value) || 4;
            return generateFoilPoints(cx, cy, petals, 85, 30, 120);
        }

        case "pie": {
            const pct = Math.min(Math.max(parseFloat(document.getElementById("piePercent").value) || 75, 1), 100);
            return generatePiePoints(cx, cy, 90, pct, 120);
        }

        case "ring":
            return generateRingPoints(cx, cy, 95, 55, 120);
    }
    return generatePolygonPoints(4, cx, cy, 80);
}

// Helper Generators
function generatePolygonPoints(n, cx, cy, r) {
    const pts = [];
    for (let i = 0; i < n; i++) {
        const a = (i / n) * 2 * Math.PI - Math.PI / 2;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

function generateCirclePoints(cx, cy, r, count) {
    const pts = [];
    for (let i = 0; i < count; i++) {
        const a = (i / count) * 2 * Math.PI;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

function generateOvalPoints(cx, cy, rx, ry, count) {
    const pts = [];
    for (let i = 0; i < count; i++) {
        const a = (i / count) * 2 * Math.PI - Math.PI / 2;
        pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    return pts;
}

function generateSemicirclePoints(cx, cy, r, count) {
    const pts = [];
    const half = Math.floor(count / 2);
    for (let i = 0; i <= half; i++) {
        const a = Math.PI + (i / half) * Math.PI;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    pts.push([cx - r, cy + 30]);
    pts.push([cx + r, cy + 30]);
    return pts;
}

function generateRectPoints(cx, cy, w, h) {
    const hw = w / 2, hh = h / 2;
    return [[cx - hw, cy - hh], [cx + hw, cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]];
}

function generateStarPoints(cx, cy, spikes, outerR, innerR) {
    const pts = [];
    for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (i / (spikes * 2)) * 2 * Math.PI - Math.PI / 2;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

function generateFoilPoints(cx, cy, petals, rBase, amp, count) {
    const pts = [];
    for (let i = 0; i < count; i++) {
        const a = (i / count) * 2 * Math.PI;
        const r = rBase + amp * Math.sin(petals * a);
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

function generatePiePoints(cx, cy, r, percent, count) {
    const pts = [[cx, cy]];
    const sweepRad = (percent / 100) * 2 * Math.PI;
    const startRad = -Math.PI / 2;

    for (let i = 0; i <= count - 1; i++) {
        const a = startRad + (i / (count - 1)) * sweepRad;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Seamless Donut Ring without open end-points
function generateRingPoints(cx, cy, outerR, innerR, count) {
    const pts = [];
    const half = Math.floor(count / 2);

    // Outer Circle Loop (Clockwise)
    for (let i = 0; i < half; i++) {
        const a = (i / half) * 2 * Math.PI;
        pts.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
    }

    // Inner Circle Loop (Counter-clockwise to create a hole)
    for (let i = 0; i < half; i++) {
        const a = (1 - i / half) * 2 * Math.PI;
        pts.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
    }

    return pts;
}

// Resample points array evenly to maintain morphing fidelity across frames
function resamplePoints(points, targetCount = 120) {
    if (!points.length) return [];
    const resampled = [];
    const n = points.length;
    for (let i = 0; i < targetCount; i++) {
        const index = (i / targetCount) * n;
        const idx1 = Math.floor(index) % n;
        const idx2 = (idx1 + 1) % n;
        const t = index - Math.floor(index);

        const x = points[idx1][0] + t * (points[idx2][0] - points[idx1][0]);
        const y = points[idx1][1] + t * (points[idx2][1] - points[idx1][1]);
        resampled.push([x, y]);
    }
    return resampled;
}

// Color Lookup via Color Graphics API
async function getSelectedColor() {
    const typed = document.getElementById("colorText").value.trim().toLowerCase();
    const picked = document.getElementById("colorPicker").value;

    if (typed === "") return picked;

    try {
        const response = await fetch(`https://api.color.graphics/name/${encodeURIComponent(typed)}`);
        if (response.ok) {
            const data = await response.json();
            if (data && data.hex) return `#${data.hex}`;
        }
    } catch (e) {
        console.log("Color API fallback active.");
    }

    return typed;
}

// Main Draw and Dynamic Frame Morphing Engine
async function drawShape() {
    const targetRawPoints = getShapePoints();
    const targetPoints = resamplePoints(targetRawPoints, 120);

    const angle = parseFloat(document.getElementById("angleInput").value) || 0;
    const color = await getSelectedColor();

    morphPath.style.transform = `rotate(${angle}deg)`;
    morphPath.style.fill = color;

    if (!currentPathPoints.length) {
        currentPathPoints = targetPoints;
        morphPath.setAttribute("d", pointsToSVGPath(currentPathPoints));
        return;
    }

    if (animFrameId) cancelAnimationFrame(animFrameId);

    const startTime = performance.now();
    const duration = 800;
    const startPoints = currentPathPoints;

    function animateFrame(now) {
        const elapsed = now - startTime;
        let progress = Math.min(elapsed / duration, 1);

        const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const interpolated = startPoints.map((pt, i) => {
            const tx = targetPoints[i][0];
            const ty = targetPoints[i][1];
            return [
                pt[0] + (tx - pt[0]) * ease,
                pt[1] + (ty - pt[1]) * ease
            ];
        });

        currentPathPoints = interpolated;
        morphPath.setAttribute("d", pointsToSVGPath(interpolated));

        if (progress < 1) {
            animFrameId = requestAnimationFrame(animateFrame);
        }
    }

    animFrameId = requestAnimationFrame(animateFrame);
}

// Initialize App
drawShape();