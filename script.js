document.getElementById("generateBtn").addEventListener("click", drawShape);

function setRectangleDimensions(shape) {
    shape.style.width = "250px";
    shape.style.height = "125px";
}

function resetDimensions(shape) {
    shape.style.width = "200px";
    shape.style.height = "200px";
}

function drawShape() {
    const n = parseInt(document.getElementById("numberInput").value);
    const angle = parseFloat(document.getElementById("angleInput").value) || 0;
    const preset = document.getElementById("presetShape").value;
    const shape = document.getElementById("shape");

    // Clean up heart class & reset default dimensions before each frame
    shape.classList.remove("heart");
    resetDimensions(shape);

    // COLOR SETUP
    const typed = document.getElementById("colorText").value.trim();
    const picked = document.getElementById("colorPicker").value;
    const color = typed !== "" ? typed : picked;
    shape.style.background = color;

    // ROTATION SETUP
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
                shape.style.clipPath = "polygon(20% 0, 100% 0, 80% 100%, 0 100%)";
                break;

            case "trapezoid":
                shape.style.clipPath = "polygon(20% 0, 80% 0, 100% 100%, 0 100%)";
                break;

            case "star":
                shape.style.clipPath =
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
                break;

            case "oval":
                shape.style.width = "220px";
                shape.style.height = "140px";
                shape.style.borderRadius = "50%";
                break;

            case "cross":
                shape.style.clipPath =
                    "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)";
                break;

            case "rhombus":
                shape.style.width = "140px";
                shape.style.height = "220px";
                shape.style.clipPath =
                    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
                break;

            case "heart":
    shape.style.clipPath = ""; // Clears inline clip-path so CSS class applies
    shape.classList.add("heart");
    break;

            case "kite":
                shape.style.clipPath =
                    "polygon(50% 0%, 0% 35%, 50% 100%, 100% 35%)";
                break;
        }

        return;
    }

    // --- VALIDATION & CUSTOM POLYGONS --- //
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

    // Regular N-sided polygon calculation
    let points = [];

    for (let i = 0; i < n; i++) {
        const angleRad = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + 50 * Math.cos(angleRad);
        const y = 50 + 50 * Math.sin(angleRad);

        points.push(`${x}% ${y}%`);
    }

    shape.style.clipPath = `polygon(${points.join(",")})`;
}