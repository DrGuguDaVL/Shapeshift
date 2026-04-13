document.getElementById("generateBtn").addEventListener("click", drawShape);
shape.classList.remove("heart");
// --- FUNCTIONS --- //
function setRectangleDimensions(shape) {
    shape.style.width = "250px";
    shape.style.height = "100px";
}

function resetDimensions(shape) {
    shape.style.width = "200px";   // default square size for polygons
    shape.style.height = "200px";
}

/**
 * Draws a heart on a canvas.
 */
function drawHeart(ctx, x, y, size, color) {
    resetDimensions(shape);
    const scale = size / 100;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(0, -35);

    // Left side
    ctx.bezierCurveTo(0, -38, -5, -50, -25, -50);
    ctx.bezierCurveTo(-55, -50, -55, -12.5, -55, -12.5);
    ctx.bezierCurveTo(-55, 5, -35, 27, 0, 45);

    // Right side
    ctx.bezierCurveTo(35, 27, 55, 5, 55, -12.5);
    ctx.bezierCurveTo(55, -12.5, 55, -50, 25, -50);
    ctx.bezierCurveTo(10, -50, 0, -38, 0, -35);

    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function drawShape() {
    const n = parseInt(document.getElementById("numberInput").value);
    const angle = parseFloat(document.getElementById("angleInput").value) || 0;
    const preset = document.getElementById("presetShape").value;
    const shape = document.getElementById("shape");

    // COLOR
    const typed = document.getElementById("colorText").value.trim();
    const picked = document.getElementById("colorPicker").value;
    const color = typed !== "" ? typed : picked;

    shape.style.background = color;

    // ROTATION
    shape.style.transform = `rotate(${angle}deg)`;

    // --- PRESETS --- //
    if (preset !== "none") {
        shape.style.borderRadius = "0";
        shape.style.clipPath = "none";

        switch (preset) {
            case "rectangle":
                setRectangleDimensions(shape);
                break;

            case "parallelogram":
                resetDimensions(shape);
                shape.style.clipPath = "polygon(20% 0, 100% 0, 80% 100%, 0 100%)";
                break;

            case "trapezoid":
                resetDimensions(shape);
                shape.style.clipPath = "polygon(20% 0, 80% 0, 100% 100%, 0 100%)";
                break;

            case "star":
                resetDimensions(shape);
                shape.style.clipPath =
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
                break;

            case "oval":
                resetDimensions(shape);
                shape.style.clipPath = "none";
                shape.style.width = "180px";
                shape.style.height = "300px";
                shape.style.borderRadius = "50%";
                break;

            case "cross":
                resetDimensions(shape);
                shape.style.clipPath =
                    "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)";
                break;

            case "rhombus":
                resetDimensions(shape);
                shape.style.width = "120px";
                shape.style.height = "240px";
                shape.style.borderRadius = "0";
                shape.style.clipPath =
                    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
                break;

            case "heart":
                resetDimensions(shape);
                shape.classList.add("heart");

                shape.style.clipPath = "none";
                shape.style.borderRadius = "0";

                break;

            case "kite":
                resetDimensions(shape);
                shape.style.width = "200px";
                shape.style.height = "200px";
                shape.style.borderRadius = "0";
                shape.style.clipPath =
                    "polygon(50% 0%, 0% 35%, 50% 100%, 100% 35%)";
                break;
        }

        return;
    }

    // --- VALIDATION --- //
    if (isNaN(n) || n < 1) {
        shape.style.clipPath = "none";
        shape.style.borderRadius = "0";
        shape.style.background = "#ccc";
        return;
    }

    // Circle
    if (n === 1) {
        shape.style.borderRadius = "50%";
        shape.style.clipPath = "none";
        return;
    }

    // Semi-circle
    if (n === 2) {
        shape.style.borderRadius = "100px 100px 0 0";
        shape.style.clipPath = "none";
        return;
    }

    shape.style.borderRadius = "0";

    // --- POLYGON GENERATION --- //
    let points = [];

    for (let i = 0; i < n; i++) {
        const angleRad = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + 50 * Math.cos(angleRad);
        const y = 50 + 50 * Math.sin(angleRad);

        points.push(`${x}% ${y}%`);
    }

    resetDimensions(shape);
    shape.style.clipPath = `polygon(${points.join(",")})`;
}