const canvas = document.getElementById("L_block");
const ctx = canvas.getContext('2d');
canvas.width = 125;
canvas.height = 125;

console.log("hello")

let isThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

let blockSize = 25;

const blocks = [
    // l
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    // j
    [
        [0, 2, 0],
        [0, 2, 0],
        [0, 2, 2]
    ],
    // t
    [
        [0, 0, 0],
        [3, 3, 3],
        [0, 3, 0]
    ],
    // s
    [
        [0, 4, 4],
        [4, 4, 0],
        [0, 0, 0]
    ],
    // z
    [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0]
    ],
    // o
    [
        [6, 6],
        [6, 6]
    ],
    // i
    [
        [0, 0, 7, 0],
        [0, 0, 7, 0],
        [0, 0, 7, 0],
        [0, 0, 7, 0]
    ]
];


function getColour(tile) {
    // Get the hex color of a given number
    let colour;

    switch (tile) {
        case 0:
            colour = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? '#1f1f1f' : '#dedede';
            break; // no tile
        case 1:
            colour = '#00923f';
            break; // l
        case 2:
            colour = '#ff7912';
            break; // j
        case 3:
            colour = '#ef4135';
            break; // t
        case 4:
            colour = '#5abfd7';
            break; // s
        case 5:
            colour = '#dc6be0';
            break; // z
        case 6:
            colour = '#fbbf16';
            break; // o
        case 7:
            colour = '#5ab46b';
            break; // i
        case 8:
            colour = '#352c56';
            break; // i
        case 9:
            colour = isThemeDark ? '#45564a' : '#ffffff';
            break; // edge blocks
        case 10:
            colour = isThemeDark ? '#32323f' : '#e8dec3';
            break; // background
        case 11:
            colour = isThemeDark ? '#f6f6f6' : '#042f3d';
            break; // font color
        case 99:
            colour = isThemeDark ? 'rgba(204,204,204,0.18)' : 'rgba(61,61,61,0.2)';
            break; // end screen blocks

        default:
            colour = '#ffffff';
            break;
    }

    return colour;
}

// Adjusts the color by making to brighter (positive amount) or darker (by negatuive amount)
//
// AMOUNT : number (min: -256 / max: +256)
function adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// DRAWS A BLOCK
function drawBlock(x, y, hexColor) {
    const strength = 10;
    ctx.fillStyle = adjust(hexColor, strength);
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.fillStyle = adjust(hexColor, -strength);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + blockSize, y + blockSize);
    ctx.lineTo(x, y + blockSize);
    ctx.fill();
    ctx.fillStyle = hexColor;
    ctx.fillRect(x + 3, y + 3, blockSize - 6, blockSize - 6);
}

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        drawBlock(i*blockSize, j*blockSize, getColour(10));
    }
}

for (let i = 0; i < blocks[0].length; i++) {
    for (let j = 0; j < blocks[0][0].length; j++) {
        drawBlock(blockSize + i*blockSize, blockSize + j*blockSize, getColour(blocks[0][i][j]));
    }
}
