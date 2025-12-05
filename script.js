document.getElementById("generateBtn").addEventListener("click", drawShape);

function drawShape() {
    const n = parseInt(document.getElementById("numberInput").value);
    const angle = parseFloat(document.getElementById("angleInput").value) || 0;
    const preset = document.getElementById("presetShape").value;
    const shape = document.getElementById("shape");

    // NEW: typed color OR picked color
    // Color handling
    const typed = document.getElementById("colorText").value.trim();
    const picked = document.getElementById("colorPicker").value;

    // Prefer typed color; if empty, use picked color
    const color = typed !== "" ? typed : picked;
    shape.style.background = color;

    // APPLY ROTATION
    shape.style.transform = `rotate(${angle}deg)`;

    // PRESET SHAPES
    if (preset !== "none") {
        shape.style.borderRadius = "0";

        switch (preset) {
            case "rectangle":
                shape.style.clipPath = "rect(0%,0%,100%,50%)";
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
                shape.style.clipPath = "none";
                shape.style.borderRadius = "50% / 35%";
                break;

            case "cross":
                shape.style.clipPath =
                    "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)";
                break;
        }

        return;
    }

    // POLYGON GENERATION (for triangle, square, pentagon...dodecagon)
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
}