document.getElementById("generateBtn").addEventListener("click", drawShape);

const HEART_SVG = `
<svg viewBox="0 0 24 24" width="100%" height="100%">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
</svg>
`;

function setRectangleDimensions(shape) {
    shape.style.width = "250px";
    shape.style.height = "125px";
}

function resetDimensions(shape) {
    shape.style.width = "200px";
    shape.style.height = "200px";
}

// Busca a cor em uma API externa que reconhece milhares de nomes de cores
async function getSelectedColor() {
    const typed = document.getElementById("colorText").value.trim().toLowerCase();
    const picked = document.getElementById("colorPicker").value;

    if (typed === "") {
        return picked;
    }

    try {
        // API pública de nomes de cores (contém mais de 30.000 nomes)
        const response = await fetch(`https://api.color.graphics/name/${encodeURIComponent(typed)}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.hex) {
                return `#${data.hex}`;
            }
        }
    } catch (error) {
        console.log("API offline, usando fallback local.");
    }

    // Se a API não encontrar ou estiver offline, usa o texto digitado (para hex, rgb ou cores CSS padrão)
    return typed;
}

async function drawShape() {
    const n = parseInt(document.getElementById("numberInput").value);
    const angle = parseFloat(document.getElementById("angleInput").value) || 0;
    const preset = document.getElementById("presetShape").value;
    const shape = document.getElementById("shape");

    shape.innerHTML = "";
    resetDimensions(shape);

    // Aguarda a busca da cor na API
    const color = await getSelectedColor();

    shape.style.transform = `rotate(${angle}deg)`;

    // --- PRESETS --- //
    if (preset !== "none") {
        shape.style.borderRadius = "0";
        shape.style.clipPath = "none";
        shape.style.background = color;

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
                shape.style.background = "transparent";
                shape.innerHTML = HEART_SVG;
                const pathElement = shape.querySelector("path");
                if (pathElement) {
                    pathElement.setAttribute("fill", color);
                }
                break;

            case "kite":
                shape.style.clipPath =
                    "polygon(50% 0%, 0% 35%, 50% 100%, 100% 35%)";
                break;
        }

        return;
    }

    // --- VALIDATION & CUSTOM POLYGONS --- //
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
        const angleRad = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + 50 * Math.cos(angleRad);
        const y = 50 + 50 * Math.sin(angleRad);

        points.push(`${x}% ${y}%`);
    }

    shape.style.clipPath = `polygon(${points.join(",")})`;
}