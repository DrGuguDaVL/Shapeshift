document.getElementById("generateBtn").addEventListener("click", drawShape);

// --- FUNCTIONS --- //
function setRectangleDimensions(shape) {
    shape.style.width = "250px";
    shape.style.height = "100px";
}

function resetDimensions(shape) {
    shape.style.width = "200px";   // default square size for polygons
    shape.style.height = "200px";
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
        shape.style.clipPath = "none"; // reset first

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
                shape.style.width = "120px";   // narrow 
                shape.style.height = "240px";  // tall
                shape.style.borderRadius = "0";
                shape.style.clipPath =
                    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
                break;

            case "heart":
                resetDimensions(shape);
                shape.style.borderRadius = "0";
                shape.style.width = "200px";
                shape.style.height = "180px";
                shape.style.clipPath =
        "polygon(50% 90%, 35% 80%, 25% 70%, 18% 58%, 15% 47%, 15% 38%, 18% 29%, 25% 22%, 34% 18%, 43% 20%, 50% 27%, 57% 20%, 66% 18%, 75% 22%, 82% 29%, 85% 38%, 85% 47%, 82% 58%, 75% 70%, 65% 80%)";
                break;

        }

        return;
    }
    if (isNaN(n) || n < 1) {
        shape.style.clipPath = "none";
        shape.style.borderRadius = "0";
        shape.style.background = "#ccc";
        return;
    }

    // Smooth circle
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

    let points = [];
    for (let i = 0; i < n; i++) {
        const angleRad = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + 50 * Math.cos(angleRad);
        const y = 50 + 50 * Math.sin(angleRad);
        points.push(`${x}% ${y}%`);
    }

    shape.style.clipPath = `polygon(${points.join(",")})`;


    // --- POLYGON GENERATION --- //
    resetDimensions(shape);  // ensures square base
    shape.style.clipPath}
