let currentPathPoints = [];
let isDirectPath = false;
let directDPath = "";
let animFrameId = null;

const morphPath = document.getElementById("morphPath");
const presetSelect = document.getElementById("presetShape");
const triangleGroup = document.getElementById("triangleGroup");
const trapezoidGroup = document.getElementById("trapezoidGroup");
const foilGroup = document.getElementById("foilGroup");
const starGroup = document.getElementById("starGroup");
const pieGroup = document.getElementById("pieGroup");
const ringGroup = document.getElementById("ringGroup");
const sidesGroup = document.getElementById("sidesGroup");

presetSelect.addEventListener("change", () => {
    const val = presetSelect.value;
    triangleGroup.classList.toggle("hidden", val !== "triangle");
    trapezoidGroup.classList.toggle("hidden", val !== "trapezoid");
    foilGroup.classList.toggle("hidden", val !== "foil");
    starGroup.classList.toggle("hidden", val !== "star");
    pieGroup.classList.toggle("hidden", val !== "pie");
    ringGroup.classList.toggle("hidden", val !== "ring");
    sidesGroup.classList.toggle("hidden", val !== "none");
    drawShape();
});

document.getElementById("triangleType").addEventListener("change", drawShape);
document.getElementById("trapezoidType").addEventListener("change", drawShape);
document.getElementById("foilPetals").addEventListener("input", drawShape);
document.getElementById("starSpikes").addEventListener("input", drawShape);
document.getElementById("piePercent").addEventListener("input", drawShape);
document.getElementById("ringInnerPercent").addEventListener("input", drawShape);
document.getElementById("angleInput").addEventListener("input", drawShape);
document.getElementById("numberInput").addEventListener("input", drawShape);
document.getElementById("colorPicker").addEventListener("input", drawShape);
document.getElementById("colorText").addEventListener("input", drawShape);
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

function getShapeData() {
    const preset = presetSelect.value;
    const n = parseInt(document.getElementById("numberInput").value);
    const cx = 150, cy = 150;

    if (preset === "ring") {
        const pct = Math.min(Math.max(parseFloat(document.getElementById("ringInnerPercent").value) || 50, 10), 90);
        const R = 95;
        const r = (pct / 100) * R;
        const compoundPath = `M ${cx} ${cy - R} A ${R} ${R} 0 1 0 ${cx} ${cy + R} A ${R} ${R} 0 1 0 ${cx} ${cy - R} Z M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
        return { isDirect: true, pathStr: compoundPath, points: sampleBezierPath(compoundPath, 120) };
    }

    let pts = [];

    if (preset === "none") {
        if (isNaN(n) || n < 1) pts = generatePolygonPoints(5, cx, cy, 80);
        else if (n === 1) pts = generateCirclePoints(cx, cy, 80, 120);
        else if (n === 2) pts = sampleBezierPath("M 65 150 A 85 85 0 0 1 235 150 Z", 120);
        else pts = generatePolygonPoints(n, cx, cy, 80);
    } else {
        switch (preset) {
            case "square":
                pts = generateRectPoints(cx, cy, 140, 140);
                break;
            case "rectangle":
                pts = generateRectPoints(cx, cy, 220, 120);
                break;
            case "circle":
                pts = generateCirclePoints(cx, cy, 85, 120);
                break;
            case "semicircle":
                pts = sampleBezierPath("M 65 150 A 85 85 0 0 1 235 150 Z", 120);
                break;
            case "oval":
                pts = generateOvalPoints(cx, cy, 65, 110, 120);
                break;
            case "triangle": {
                const type = document.getElementById("triangleType").value;
                if (type === "equilateral") pts = generatePolygonPoints(3, cx, cy, 90);
                else if (type === "isosceles") pts = [[cx, cy - 100], [cx + 80, cy + 80], [cx - 80, cy + 80]];
                else if (type === "right") pts = [[cx - 80, cy - 80], [cx + 80, cy + 80], [cx - 80, cy + 80]];
                else if (type === "scalene") pts = [[cx - 40, cy - 90], [cx + 100, cy + 70], [cx - 90, cy + 80]];
                else if (type === "obtuse") pts = [[cx - 110, cy + 60], [cx + 110, cy + 60], [cx - 20, cy - 20]];
                break;
            }
            case "trapezoid": {
                const type = document.getElementById("trapezoidType").value;
                if (type === "isosceles") pts = [[cx - 50, cy - 60], [cx + 50, cy - 60], [cx + 90, cy + 60], [cx - 90, cy + 60]];
                else if (type === "right") pts = [[cx - 80, cy - 60], [cx + 40, cy - 60], [cx + 80, cy + 60], [cx - 80, cy + 60]];
                else if (type === "scalene") pts = [[cx - 40, cy - 60], [cx + 70, cy - 60], [cx + 100, cy + 60], [cx - 80, cy + 60]];
                break;
            }
            case "parallelogram":
                pts = [[cx - 40, cy - 60], [cx + 100, cy - 60], [cx + 40, cy + 60], [cx - 100, cy + 60]];
                break;
            case "star": {
                const spikes = parseInt(document.getElementById("starSpikes").value) || 5;
                pts = generateStarPoints(cx, cy, spikes, 95, 42);
                break;
            }
            case "rhombus":
                pts = [[cx, cy - 90], [cx + 90, cy - 20], [cx, cy + 90], [cx - 90, cy + 20]];
                break;
            case "diamond":
                pts = [[cx, cy - 115], [cx + 80, cy], [cx, cy + 115], [cx - 80, cy]];
                break;
            case "kite":
                pts = [[cx, cy - 100], [cx + 70, cy - 30], [cx, cy + 100], [cx - 70, cy - 30]];
                break;
            case "cross":
                pts = [
                    [cx - 25, cy - 90], [cx + 25, cy - 90], [cx + 25, cy - 25],
                    [cx + 90, cy - 25], [cx + 90, cy + 25], [cx + 25, cy + 25],
                    [cx + 25, cy + 90], [cx - 25, cy + 90], [cx - 25, cy + 25],
                    [cx - 90, cy + 25], [cx - 90, cy - 25], [cx - 25, cy - 25]
                ];
                break;
            case "arrow":
                pts = [
                    [cx - 20, cy - 90], [cx + 20, cy - 90], [cx + 20, cy],
                    [cx + 60, cy], [cx, cy + 90], [cx - 60, cy], [cx - 20, cy]
                ];
                break;
            case "heart": {
                const pathStr = "M 150 230 C 70 180 30 130 30 85 C 30 50 55 30 85 30 C 110 30 135 48 150 70 C 165 48 190 30 215 30 C 245 30 270 50 270 85 C 270 130 230 180 150 230 Z";
                pts = sampleBezierPath(pathStr, 120);
                break;
            }
            case "club": {
                const pathStr = "M 150 50 C 172 50 190 68 190 90 C 190 102 184 113 175 120 C 195 122 210 138 210 158 C 210 180 192 198 170 198 C 160 198 151 194 145 187 L 160 240 L 140 240 L 155 187 C 149 194 140 198 130 198 C 108 198 90 180 90 158 C 90 138 105 122 125 120 C 116 113 110 102 110 90 C 110 68 128 50 150 50 Z";
                pts = sampleBezierPath(pathStr, 120);
                break;
            }
            case "spade": {
                const pathStr = "M 150 40 C 160 80 220 120 220 165 C 220 195 195 210 170 200 C 158 195 152 185 150 175 L 162 240 L 138 240 L 150 175 C 148 185 142 195 130 200 C 105 210 80 195 80 165 C 80 120 140 80 150 40 Z";
                pts = sampleBezierPath(pathStr, 120);
                break;
            }
            case "drop": {
                const pathStr = "M 150 35 C 235 155 225 240 150 240 C 75 240 65 155 150 35 Z";
                pts = sampleBezierPath(pathStr, 120);
                break;
            }
            case "crescent": {
                const pathStr = "M 150 40 A 100 100 0 1 0 250 180 A 85 85 0 1 1 150 40 Z";
                pts = sampleBezierPath(pathStr, 120);
                break;
            }
            case "foil": {
                const petals = parseInt(document.getElementById("foilPetals").value) || 4;
                pts = generateFoilPoints(cx, cy, petals, 85, 30, 120);
                break;
            }
            case "pie": {
                const pct = Math.min(Math.max(parseFloat(document.getElementById("piePercent").value) || 75, 1), 100);
                pts = generatePiePoints(cx, cy, 90, pct, 120);
                break;
            }
            default:
                pts = generatePolygonPoints(5, cx, cy, 80);
        }
    }

    return { isDirect: false, pathStr: "", points: pts };
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
    if (!points || !points.length) return [];
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

function getSelectedColor() {
    const typed = document.getElementById("colorText").value.trim();
    const picked = document.getElementById("colorPicker").value;
    return typed !== "" ? typed : picked;
}

function drawShape() {
    const data = getShapeData();
    isDirectPath = data.isDirect;
    directDPath = data.pathStr;

    const targetPoints = resamplePoints(data.points, 120);
    const angle = parseFloat(document.getElementById("angleInput").value) || 0;
    const color = getSelectedColor();

    morphPath.style.transform = `rotate(${angle}deg)`;
    morphPath.style.fill = color;

    if (isDirectPath) {
        currentPathPoints = targetPoints;
        morphPath.setAttribute("d", directDPath);
        return;
    }

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

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2200);
}

document.getElementById("copyDPathBtn").addEventListener("click", () => {
    const dAttr = morphPath.getAttribute("d");
    navigator.clipboard.writeText(dAttr);
    showToast("Dados do caminho 'd' copiados!");
});

document.getElementById("copySvgBtn").addEventListener("click", () => {
    const svgCode = document.getElementById("stageSvg").outerHTML;
    navigator.clipboard.writeText(svgCode);
    showToast("Código SVG completo copiado!");
});

document.getElementById("copyCssBtn").addEventListener("click", () => {
    if (!currentPathPoints.length) return;
    const pointsString = currentPathPoints
        .map(pt => `${((pt[0] / 300) * 100).toFixed(1)}% ${((pt[1] / 300) * 100).toFixed(1)}%`)
        .join(", ");
    const cssClip = `clip-path: polygon(${pointsString});`;
    navigator.clipboard.writeText(cssClip);
    showToast("CSS Clip-Path copiado!");
});

window.addEventListener("DOMContentLoaded", () => {
    drawShape();
});