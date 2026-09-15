// --- STATE & UTILS --- //
let currentPathPoints = [];
let animFrameId = null;

const morphPath = document.getElementById("morphPath");
const presetSelect = document.getElementById("presetShape");
const triangleGroup = document.getElementById("triangleGroup");
const trapezoidGroup = document.getElementById("trapezoidGroup");
const foilGroup = document.getElementById("foilGroup");
const sidesGroup = document.getElementById("sidesGroup");

// Handle Dynamic Controls Visibility
presetSelect.addEventListener("change", () => {
    const val = presetSelect.value;

    triangleGroup.classList.toggle("hidden", val !== "triangle");
    trapezoidGroup.classList.toggle("hidden", val !== "trapezoid");
    foilGroup.classList.toggle("hidden", val !== "foil");
    sidesGroup.classList.toggle("hidden", val !== "none");
});

document.getElementById("triangleType").addEventListener("change", drawShape);
document.getElementById("trapezoidType").addEventListener("change", drawShape);
document.getElementById("foilPetals").addEventListener("input", drawShape);
document.getElementById("generateBtn").addEventListener("click", drawShape);

// Interpolate smooth cubic curves dynamically
function sampleBezierPath(dString, sampleCount = 120) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const path = new Path2D(dString);

    const points = [];
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgPath.setAttribute("d", dString);
    const totalLength = svgPath.getTotalLength();

    for (let i = 0; i < sampleCount; i++) {
        const pt = svgPath.getPointAtLength((i / sampleCount) * totalLength);
        points.push([pt.x, pt.y]);
    }
    return points;
}

// Convert points to Path Data String
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
        case "rectangle":
            return generateRectPoints(cx, cy, 220, 120);

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

        case "crescent": {
            const pathStr = "M 150 40 A 100 100 0 1 0 250 180 A 85 85 0 1 1 150 40 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "foil": {
            const petals = parseInt(document.getElementById("foilPetals").value) || 4;
            return generateFoilPoints(cx, cy, petals, 85, 30, 120);
        }

        case "pie":
            return generatePiePoints(cx, cy, 90, 0, 260, 120);

        case "ring": {
            const pathStr = "M 150 40 A 110 110 0 1 0 150 260 A 110 110 0 1 0 150 40 Z M 150 85 A 65 65 0 1 1 150 215 A 65 65 0 1 1 150 85 Z";
            return sampleBezierPath(pathStr, 120);
        }
    }
    return generatePolygonPoints(4, cx, cy, 80);
}

// Helper Point Generators
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

function generatePiePoints(cx, cy, r, startAngleDeg, endAngleDeg, count) {
    const pts = [[cx, cy]];
    const startRad = (startAngleDeg * Math.PI) / 180 - Math.PI / 2;
    const endRad = (endAngleDeg * Math.PI) / 180 - Math.PI / 2;
    for (let i = 0; i <= count; i++) {
        const a = startRad + (i / count) * (endRad - startRad);
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Normalize Array sizes to equalize path resolution for smooth morphing
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

// Dynamic Color Fetch API
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

// Master Render & Interpolated Transition Execution
async function drawShape() {
    const targetRawPoints = getShapePoints();
    const targetPoints = resamplePoints(targetRawPoints, 120);

    const angle = parseFloat(document.getElementById("angleInput").value) || 0;
    const color = await getSelectedColor();

    morphPath.style.transform = `rotate(${angle}deg)`;
    morphPath.style.fill = color;

    // Set initial frame if first load
    if (!currentPathPoints.length) {
        currentPathPoints = targetPoints;
        morphPath.setAttribute("d", pointsToSVGPath(currentPathPoints));
        return;
    }

    // Smooth Tween Interpolation Loop
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const startTime = performance.now();
    const duration = 800; // 0.8 seconds
    const startPoints = currentPathPoints;

    function animateFrame(now) {
        const elapsed = now - startTime;
        let progress = Math.min(elapsed / duration, 1);

        // Smooth Cubic Easing Function
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

// Initialize on Load
drawShape();