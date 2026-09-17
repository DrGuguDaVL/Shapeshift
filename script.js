let currentPathPoints = [];
let animFrameId = null;

const morphPath = document.getElementById("morphPath");
const presetSelect = document.getElementById("presetShape");
const triangleGroup = document.getElementById("triangleGroup");
const trapezoidGroup = document.getElementById("trapezoidGroup");
const foilGroup = document.getElementById("foilGroup");
const starGroup = document.getElementById("starGroup");
const pieGroup = document.getElementById("pieGroup");
const sidesGroup = document.getElementById("sidesGroup");

presetSelect.addEventListener("change", () => {
    const val = presetSelect.value;
    triangleGroup.classList.toggle("hidden", val !== "triangle");
    trapezoidGroup.classList.toggle("hidden", val !== "trapezoid");
    foilGroup.classList.toggle("hidden", val !== "foil");
    starGroup.classList.toggle("hidden", val !== "star");
    pieGroup.classList.toggle("hidden", val !== "pie");
    sidesGroup.classList.toggle("hidden", val !== "none");
});

document.getElementById("triangleType").addEventListener("change", drawShape);
document.getElementById("trapezoidType").addEventListener("change", drawShape);
document.getElementById("foilPetals").addEventListener("input", drawShape);
document.getElementById("starSpikes").addEventListener("input", drawShape);
document.getElementById("piePercent").addEventListener("input", drawShape);
document.getElementById("generateBtn").addEventListener("click", drawShape);

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

function pointsToSVGPath(points) {
    if (!points.length) return "";
    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
    }
    d += " Z";
    return d;
}

function getShapePoints() {
    const preset = presetSelect.value;
    const n = parseInt(document.getElementById("numberInput").value);
    const cx = 150, cy = 150;

    if (preset === "none") {
        if (isNaN(n) || n < 1) return generatePolygonPoints(4, cx, cy, 80);
        if (n === 1) return generateCirclePoints(cx, cy, 80, 120);
        if (n === 2) return sampleBezierPath("M 65 150 A 85 85 0 0 1 235 150 Z", 120);
        return generatePolygonPoints(n, cx, cy, 80);
    }

    switch (preset) {
        case "square":
            return generateRectPoints(cx, cy, 140, 140);

        case "rectangle":
            return generateRectPoints(cx, cy, 220, 120);

        case "circle":
            return generateCirclePoints(cx, cy, 85, 120);

        case "semicircle": {
            const pathStr = "M 65 150 A 85 85 0 0 1 235 150 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "oval":
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

        case "star": {
            const spikes = parseInt(document.getElementById("starSpikes").value) || 5;
            return generateStarPoints(cx, cy, spikes, 95, 42);
        }

        case "rhombus":
            return [[cx, cy - 90], [cx + 90, cy - 20], [cx, cy + 90], [cx - 90, cy + 20]];

        case "diamond":
            return [[cx, cy - 115], [cx + 80, cy], [cx, cy + 115], [cx - 80, cy]];

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
            const pathStr = "M 150 125 C 130 125 115 105 115 85 C 115 65 130 50 150 50 C 170 50 185 65 185 85 C 185 105 170 125 150 125 Z M 115 170 C 95 170 80 150 80 130 C 80 110 95 95 115 95 C 135 95 150 110 150 130 C 150 150 135 170 115 170 Z M 185 170 C 165 170 150 150 150 130 C 150 110 165 95 185 95 C 205 95 220 110 220 130 C 220 150 205 170 185 170 Z M 142 140 L 130 230 L 170 230 L 158 140 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "spade": {
            const pathStr = "M 150 35 C 150 35 240 135 230 185 C 220 220 180 220 150 175 C 120 220 80 220 70 185 C 60 135 150 35 150 35 Z M 142 160 L 125 235 L 175 235 L 158 160 Z";
            return sampleBezierPath(pathStr, 120);
        }

        case "drop": {
            const pathStr = "M 150 35 C 235 155 225 240 150 240 C 75 240 65 155 150 35 Z";
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

        case "ring": {
            const pathStr = "M 150 45 A 100 100 0 1 0 150 255 A 100 100 0 1 0 150 45 Z M 150 95 A 50 50 0 1 1 150 205 A 50 50 0 1 1 150 95 Z";
            return sampleBezierPath(pathStr, 120);
        }
    }
    return generatePolygonPoints(4, cx, cy, 80);
}

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

// Copy Action Handlers
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2200);
}

document.getElementById("copyDPathBtn").addEventListener("click", () => {
    const dAttr = morphPath.getAttribute("d");
    navigator.clipboard.writeText(dAttr);
    showToast("Path 'd' data copied!");
});

document.getElementById("copySvgBtn").addEventListener("click", () => {
    const svgCode = document.getElementById("stageSvg").outerHTML;
    navigator.clipboard.writeText(svgCode);
    showToast("Full SVG Code copied!");
});

document.getElementById("copyCssBtn").addEventListener("click", () => {
    if (!currentPathPoints.length) return;
    const pointsString = currentPathPoints
        .map(pt => `${((pt[0] / 300) * 100).toFixed(1)}% ${((pt[1] / 300) * 100).toFixed(1)}%`)
        .join(", ");
    const cssClip = `clip-path: polygon(${pointsString});`;
    navigator.clipboard.writeText(cssClip);
    showToast("CSS Clip-Path copied!");
});

drawShape();