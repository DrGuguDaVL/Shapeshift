document.getElementById("generateBtn").addEventListener("click", drawShape);

function drawShape() {
    const n = parseInt(document.getElementById("numberInput").value);
    const shape = document.getElementById("shape");

    if (isNaN(n) || n < 1) {
        shape.style.clipPath = "none";
        shape.style.borderRadius = "0";
        shape.style.background = "#ccc";
        return;
    }

    // Special: 1 → Circle
    if (n === 1) {
        shape.style.borderRadius = "50%";
        shape.style.clipPath = "none";
        return;
    }

    // Special: 2 → Semicircle
    if (n === 2) {
        shape.style.borderRadius = "100px 100px 0 0";
        shape.style.clipPath = "none";
        return;
    }

    // Reset for polygons
    shape.style.borderRadius = "0";

    // Generate polygon points
    let points = [];
    for (let i = 0; i < n; i++) {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + 50 * Math.cos(angle);
        const y = 50 + 50 * Math.sin(angle);
        points.push(`${x}% ${y}%`);
    }

    shape.style.clipPath = `polygon(${points.join(",")})`;
}