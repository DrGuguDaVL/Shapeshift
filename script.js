document.getElementById("generateBtn").addEventListener("click", drawShape);

function drawShape() {
    const n = parseInt(document.getElementById("numberInput").value);
    const shape = document.getElementById("shape");

    // NEW: typed color OR picked color
    const typed = document.getElementById("colorText").value.trim();
    const picked = document.getElementById("colorPicker").value;

    // Prefer typed color; if empty, use picked color
    const color = typed !== "" ? typed : picked;
    shape.style.background = color;

    if (isNaN(n) || n < 1) {
        shape.style.clipPath = "none";
        shape.style.borderRadius = "0";
        shape.style.background = "#ccc";
        return;
    }

    if (n === 1) {
        shape.style.borderRadius = "50%";
        shape.style.clipPath = "none";
        return;
    }

    if (n === 2) {
        shape.style.borderRadius = "100px 100px 0 0";
        shape.style.clipPath = "none";
        return;
    }

    shape.style.borderRadius = "0";

    let points = [];
    for (let i = 0; i < n; i++) {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + 50 * Math.cos(angle);
        const y = 50 + 50 * Math.sin(angle);
        points.push(`${x}% ${y}%`);
    }

    shape.style.clipPath = `polygon(${points.join(",")})`;
}
