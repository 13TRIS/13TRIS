const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;

let isThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const status = {
    start: 'Start',
    playing: 'Playing',
    over: 'Game over'
}

let game = {
    currentBlock: {
        x: 0,
        y: 4,
        pattern: null
    },
    nextBlock: {
        pattern: null
    },
    holoBlock: {
        x: 0,
        y: 4,
        pattern: null
    },
    board: [
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 6, 0, 6, 6, 6, 0, 0, 0, 1, 1, 1],
        [6, 6, 1, 1, 6, 4, 8, 0, 4, 1, 0, 9],
        [9, 6, 0, 1, 4, 4, 0, 5, 4, 4, 4, 4],
        [9, 4, 6, 8, 4, 4, 5, 0, 4, 0, 0, 1],
        [9, 4, 0, 8, 0, 4, 0, 5, 4, 1, 1, 1],
        [9, 0, 8, 8, 0, 4, 0, 5, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
    ],
    level: 1,
    score: 0,
    highScore: 0,
    name: user,
    status: status.start
}
const blockSize = 40;

let blocks;

blocks = [
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

const offset = {
    x: 2 * blockSize,
    y: 2 * blockSize
};

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
    x += offset.x;
    y += offset.y;
    const strength = 10;
    ctx.fillStyle = hexColor;
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.fillStyle = adjust(hexColor, -strength);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 3, y + 3);
    ctx.lineTo(x + 3, y + blockSize - 3);
    ctx.lineTo(x + blockSize - 3, y + blockSize - 3);
    ctx.lineTo(x + blockSize, y + blockSize);
    ctx.lineTo(x, y + blockSize);
    ctx.fill();
    ctx.fillStyle = adjust(hexColor, strength);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 3, y + 3);
    ctx.lineTo(x + blockSize - 3, y + 3);
    ctx.lineTo(x + blockSize - 3, y + blockSize - 3);
    ctx.lineTo(x + blockSize, y + blockSize);
    ctx.lineTo(x + blockSize, y);
    ctx.fill();
}

// DRAW BOARD
function renderBoard() {
    // Draws the board to the canvas

    if (game.status !== status.over) {
        // DRAW THE BACKGROUND
        for (let i = 0; i < (canvas.height / blockSize); i++) {
            for (let j = 0; j < (canvas.width / blockSize); j++) {
                drawBlock(
                    i * blockSize - offset.x,
                    j * blockSize - offset.y,
                    getColour(10)
                );
            }
        }

        // DRAW THE TEXT (SCORE AND NAME)
        ctx.fillStyle = getColour(11);
        ctx.font = '48px serif';
        ctx.fillText(
            'Score: ' + game.score,
            offset.x + (game.board[0].length + 1) * blockSize,
            offset.y + 9 * blockSize
        );
        ctx.fillText(
            game.name,
            offset.x + (game.board[0].length + 1) * blockSize,
            offset.y + 11 * blockSize
        );

        // DRAW game.board
        for (let i = 0; i < game.board.length; i++) {
            for (let j = 0; j < game.board[i].length; j++) {
                drawBlock(
                    j * blockSize,
                    i * blockSize,
                    getColour(game.board[i][j])
                );
            }
        }

        // DRAW game.currentBlock.pattern
        if (game.currentBlock.pattern) {
            for (let i = 0; i < game.currentBlock.pattern.length; i++) {
                for (let j = 0; j < game.currentBlock.pattern[i].length; j++) {
                    const tile = game.currentBlock.pattern[i][j];
                    if (tile !== 0) {
                        drawBlock(
                            ((game.currentBlock.y + j) * blockSize),
                            ((game.currentBlock.x + i) * blockSize),
                            getColour(tile)
                        );
                    }

                    // DRAW game.holoBlock.pattern
                    if (game.holoBlock) {
                        const holoTile = game.holoBlock.pattern[i][j];
                        if (holoTile !== 0) {
                            drawBlock(
                                ((game.holoBlock.y + j) * blockSize),
                                ((game.holoBlock.x + i) * blockSize),
                                getColour(tile) + '5F'
                            );
                        }
                    }
                }
            }
        }

        // DRAW game.nextBlock.pattern
        if (game.nextBlock.pattern) {
            // DRAW THE BACKGROUND SQUARE
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    drawBlock(
                        (game.board[0].length + 2 + i) * blockSize,
                        (blockSize * (2 + j)),
                        adjust(getColour(9), -10)
                    );
                }
            }
            // DRAW game.nextBlock.pattern
            for (let i = 0; i < game.nextBlock.pattern.length; i++) {
                for (let j = 0; j < game.nextBlock.pattern[i].length; j++) {
                    const tile = game.nextBlock.pattern[i][j];
                    if (tile !== 0)
                        drawBlock(
                            (game.board[0].length + 3 + j) * blockSize,
                            (blockSize * (i + 3)),
                            getColour(tile)
                        );
                }
            }
        }
    } else if (game.status === status.over) {
        let i = 0;
        const sss = setInterval(function () {
            // DRAW EACH END SCREEN LINE
            for (let j = 0; j < game.board[i].length; j++) {
                drawBlock(
                    j * blockSize,
                    i * blockSize,
                    getColour(99)
                );
            }
            i++;
            // DO THIS FOR THE WHOLE GAMe BOARD
            if (i === game.board.length - 1) {
                clearInterval(sss);
            }
        }, 50);
    }
}

function rotate(matrix) {
    let rotateArr = matrix.map((a) => a.slice());   // DEEP COPY OF 2D ARRAY
    const n = rotateArr.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {                   // ROTAT
        for (let j = i; j < y - i; j++) {
            const k = rotateArr[i][j];
            rotateArr[i][j] = rotateArr[y - j][i];
            rotateArr[y - j][i] = rotateArr[y - i][y - j];
            rotateArr[y - i][y - j] = rotateArr[j][y - i];
            rotateArr[j][y - i] = k;
        }
    }
    return rotateArr;
}

function rotateBlock(block) {
    // Rotate the block
    if (game.status === status.playing && checkLegality(2, block)) {
        block.pattern = rotate(block.pattern);
        if (block === game.currentBlock)
            moveHolo()
    }
}

function addToBoard(block) {
    for (let i = 0; i < block.pattern.length; i++) {
        for (let j = 0; j < block.pattern[i].length; j++) {
            if (block.pattern[i][j] !== 0)
                game.board[block.x + i][block.y + j] = block.pattern[i][j];
        }
    }
}

function drawPattern(block) {
    if (block.pattern) {
        for (let i = 0; i < block.pattern.length; i++) {
            for (let j = 0; j < block.pattern[i].length; j++) {
                const tile = block.pattern[i][j];
                if (tile !== 0) {
                    drawBlock(
                        ((block.y + j) * blockSize),
                        ((block.x + i) * blockSize),
                        getColour(tile)
                    );
                }
            }
        }
    }
}

function moveDown(block) {
    // Move the block one down
    if (game.status === status.playing) {
        if (checkLegality(1, block))
            block.x++;
        else {
            addToBoard(block);
            destroyLines();
            if (!generateBlock()) {
                last = Number.MAX_SAFE_INTEGER;
                game.status = status.over
                drawPattern(game.currentBlock);
                renderBoard();
            }
        }
    }
}

function moveHolo() {
    game.holoBlock = {
        x: game.currentBlock.x,
        y: game.currentBlock.y,
        pattern: game.currentBlock.pattern.map((a) => a.slice())
    };
    while (checkLegality(1, game.holoBlock)) {
        moveDown(game.holoBlock);
    }

}

function moveSideways(number, block) {
    // Move the block sideways, either left or
    // move RIGHT if 4, else move LEFT
    if (game.status === status.playing && checkLegality(number, block)) {
        const tmp = (number === 4) ? 1 : -1;
        block.y += tmp;
        moveHolo()
    }
}

function slamDown(block) {
    if (game.status === status.playing) {
        while (checkLegality(1, block)) {
            moveDown(block);
            addScore(5);
        }
        moveDown(block);
    }
}

function checkLegality(pos, block) {
    // Check the legality of a move, either:
    //
    // inplace : 0 / down : 1 / rotation : 2 / left : 3 / right : 4
    //
    // returns: boolean (legal ? true : false)
    let newPattern = block.pattern.map((a) => a.slice());
    let mov;

    switch (pos) {
        case 0:
            mov = [0, 0];
            break;  // dont move
        case 1:
            mov = [1, 0];
            break;  // down
        case 2:
            mov = [0, 0];
            newPattern = rotate(newPattern);
            break;  // TODO rotate
        case 3:
            mov = [0, -1];
            break;  // left
        case 4:
            mov = [0, 1];
            break;  // right

        default:
            mov = [0, 0];
            break;
    }

    /*
    x: 5    i: 0-2
    y: 9    j: 0-2
    [1,0]

    [9,5]
    [10,5][10,6][10,7]
    [11,5][11,6][11,7]
    [12,5][12,6][12,7]
    [y][x] !== 0
    [y+mov(0)][x+mov(1)]

        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, 0, y, 0, 9]
        [9, _, _, _, _, _, _, _, 0, y, 0, 9]
        [9, _, _, _, _, _, _, _, y, y, 0, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, m, _, _, _, _, _, 9]
        [9, _, _, _, m, m, m, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, _, _, _, _, _, _, _, _, _, _, 9]
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]

    */

    for (let i = 0; i < newPattern.length; i++)
        for (let j = 0; j < newPattern[i].length; j++)
            if (
                game.board[block.x + i + mov[0]][block.y + j + mov[1]] !== 0 &&
                newPattern[i][j] !== 0)
                return false;
    return true;
}

function generateBlock() {
    if (game.status === status.playing) {
        game.currentBlock = {
            x: 0,
            y: 4,
            pattern: game.nextBlock.pattern.map((a) => a.slice())
        };
        game.holoBlock = {
            x: 0,
            y: 4,
            pattern: game.nextBlock.pattern.map((a) => a.slice())
        };

        game.nextBlock = {
            pattern: blocks[Math.floor(Math.random() * blocks.length)]
        }

        moveHolo();
        return checkLegality(0, game.currentBlock);
    }
    return false;
}

function destroyLines() {
    let linesBroken = 0;

    // CHECK EACH LINE FOR FULL LINES
    for (let i = 0; i < game.board.length - 2; i++) {
        if (game.board[i].indexOf(0) === -1) {
            for (let j = 0; j < i - 1; j++) {
                game.board[i - j] = JSON.parse(JSON.stringify(game.board[i - j - 1]));
            }
            game.board[0] = [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9];
            linesBroken++;
        }
    }
    if (linesBroken > 0)
        addScore(100 * linesBroken + (linesBroken > 3 ? 600 : 100));
}

function addScore(points) {
    if (points > 0)
        game.score += points;
}

function playSound(number) {

}

// CONTROLS
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowLeft':
            moveSideways(3, game.currentBlock);
            break;
        case 'ArrowRight':
            moveSideways(4, game.currentBlock);
            break;
        case 'ArrowUp':
            rotateBlock(game.currentBlock);
            break;
        case 'ArrowDown':
            moveDown(game.currentBlock);
            break;
        case 'Enter':
            if (game.status === status.start)
                startGame();
            break;
        case 'Space':
            if (game.status === status.start)
                startGame();
            else if (game.status === status.playing)
                slamDown(game.currentBlock);
            break;

        default:
            playSound(423);
            break;
    }
}, false);

// CHECKS IF THE START BUTTON HAS BEEN CLICKED
canvas.addEventListener('mousedown', (e) => {
    const cursor = {
        x: e.clientX,
        y: e.clientY
    }

    if (cursor.x < 100 && cursor.y < 100 && game.status === status.start)
        startGame();

}, false);

// setInterval(() => { generateBlock(); game.currentBlock.y = 0; }, 3000);

let last = 0;

function gameUpdate() {
    if (game.status === status.playing) {
        moveDown(game.currentBlock);
    } else if (game.status === status.over) {
        console.log('Game over')
        last = Number.MAX_SAFE_INTEGER;
    }
}

function startGame() {
    last = 0;
    game.status = status.playing;
    game.board = [
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
    ]
    game.nextBlock = {
        pattern: blocks[Math.floor(Math.random() * blocks.length)]
    }
    generateBlock();
}

// UPDATE
function fun(now) {
    isThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!last || now - last >= (800 - game.level * 35)) {
        last = now;
        gameUpdate();
    }
    if (game.status !== status.over)
        renderBoard();
    requestAnimationFrame(fun);
}

generateBlock();
requestAnimationFrame(fun);
