const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;

let game = {
    currentBlock: {
        x: 0,
        y: 4,
        pattern: null
    },
    board: [
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
    ],
    level: 1,
    score: 0,
    highScore: 0,
    name: 'Guest',
    status: null
}

const blockSize = 40;
let blocks;

blocks = [
    // l
    [
        [0, 2, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    // j
    [
        [0, 1, 0],
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
        [0, 4, 5],
        [4, 4, 0],
        [0, 0, 0]
    ],
    // z
    [
        [4, 5, 0],
        [0, 5, 5],
        [0, 0, 0]
    ],
    // o
    [
        [6, 7],
        [6, 6]
    ],
    // i
    [
        [0, 0, 6, 0],
        [0, 0, 7, 0],
        [0, 0, 7, 0],
        [0, 0, 7, 0]
    ],
    // i
    [
        [4]
    ]
];

const status = {
    start: 'Start',
    playing: 'Playing',
    over: 'Game over'
}

const offset = {
    x: 100,
    y: 100
};

function getColour(tile) {
    // Get the hex color of a given number
    let colour;

    switch (tile) {
        case 0:
            colour = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? '#1f1f1f' : '#dedede';
            break; // no tile
        case 1:
            colour = '#139315';
            break; // l
        case 2:
            colour = '#ffb35f';
            break; // j
        case 3:
            colour = '#f8595e';
            break; // t
        case 4:
            colour = '#63d4ee';
            break; // s
        case 5:
            colour = '#dc6be0';
            break; // z
        case 6:
            colour = '#ffdb43';
            break; // o
        case 7:
            colour = '#83ff67';
            break; // i
        case 8:
            colour = '#352c56';
            break; // i
        case 9:
            colour = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? '#45564a' : '#ffffff';
            break;
        case 10:
            colour = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? '#32323f' : '#e8dec3';
            break;
        case 11:
            colour = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? '#f6f6f6' : '#042f3d';
            break;
        case 99:
            colour = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? '#7e0000' : '#be6262';
            break;

        default:
            colour = '#ffffff';
            break;
    }

    return colour;
}

// DRAW BOARD
function renderBoard() {
    // Draws the board to the canvas
    if (game.status === status.playing) {
        ctx.fillStyle = getColour(10);
        ctx.fillRect(0, 0, 2000, 2000);

        ctx.fillStyle = getColour(11);
        ctx.font = '48px serif';
        ctx.fillText(
            'Score: ' + game.score,
            offset.x,
            offset.y - 4
        );
        ctx.fillText(
            game.name,
            offset.x + game.board[0].length * blockSize,
            offset.y
        );
        ctx.font = '10px sans-serif';

        for (let i = 0; i < game.board.length; i++) {
            for (let j = 0; j < game.board[i].length; j++) {
                ctx.fillStyle = getColour(game.board[i][j]);
                ctx.fillRect(
                    j * blockSize + offset.x,
                    i * blockSize + offset.y,
                    blockSize,
                    blockSize);
                ctx.fillStyle = getColour(11);
                ctx.fillText(
                    i + "'" + j,
                    j * blockSize + offset.x + 5,
                    i * blockSize + offset.y + 20
                );
            }
        }

        if (game.currentBlock.pattern)
            for (let i = 0; i < game.currentBlock.pattern.length; i++) {
                for (let j = 0; j < game.currentBlock.pattern[i].length; j++) {
                    const tile = game.currentBlock.pattern[i][j];
                    if (tile !== 0) {
                        ctx.fillStyle = getColour(tile);
                        ctx.fillRect(
                            ((game.currentBlock.y + j) * blockSize) + offset.x,
                            ((game.currentBlock.x + i) * blockSize) + offset.y,
                            blockSize,
                            blockSize);
                    }
                }
            }
    }
}

function rotate(matrix) {
    // deep copy of 2d array
    let rotateArr = matrix.map((a) => a.slice());
    const n = rotateArr.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
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

function rotateBlock() {
    // Rotate the block
    if (checkLegality(2))
        game.currentBlock.pattern = rotate(game.currentBlock.pattern);
}

function addToBoard(currentBlock) {
    for (let i = 0; i < currentBlock.pattern.length; i++) {
        for (let j = 0; j < currentBlock.pattern[i].length; j++) {
            if (currentBlock.pattern[i][j] !== 0)
                game.board[currentBlock.x + i][currentBlock.y + j] = currentBlock.pattern[i][j];
        }
    }
}

function endSequence() {

    for (let i = 0; i < game.board.length; i++) {
        for (let j = 0; j < game.board[i].length; j++) {
            ctx.fillStyle = getColour(99);
            ctx.fillRect(
                j * blockSize + offset.x,
                i * blockSize + offset.y,
                blockSize,
                blockSize);
            ctx.fillStyle = getColour(11);
            ctx.fillText(
                i + "'" + j,
                j * blockSize + offset.x + 5,
                i * blockSize + offset.y + 20
            );
        }
    }

}

function moveDown() {
    // Move the block one down
    if (checkLegality(1))
        game.currentBlock.x++;
    else {
        addToBoard(game.currentBlock);
        destroyLines();
        if (!generateBlock()) {
            console.log(game.status);
            generateBlock();
            renderBoard();
            last = Number.MAX_SAFE_INTEGER;
            game.status = 'end'
            console.log('END')
            endSequence();
        }

    }
}

function moveSideways(number) {
    // Move the block sideways, either left or
    // move RIGHT if 4, else move LEFT
    if (checkLegality(number))
        game.currentBlock.y += number === 4 ? 1 : -1;
}

function checkLegality(pos) {
    // Check the legality of a move, either:
    //
    // inplace : 0 / down : 1 / rotation : 2 / left : 3 / right : 4
    //
    // returns: boolean (legal ? true : false)
    let newPattern = game.currentBlock.pattern.map((a) => a.slice());
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
                game.board[game.currentBlock.x + i + mov[0]][game.currentBlock.y + j + mov[1]] !== 0 &&
                newPattern[i][j] !== 0)
                return false;
    return true;
}

function generateBlock() {
    if (game.status === status.playing) {
        game.currentBlock = {
            x: 2,
            y: 4,
            pattern: blocks[Math.floor(Math.random() * blocks.length)]
        };

        return checkLegality(0);
    }
    return false;
}

function destroyLines() {
    let linesBroken = 0;
    for (let i = 0; i < game.board.length - 2; i++) {               // i < i-1 < i-2
        if (game.board[i].indexOf(0) === -1) {                      // 5 < 4   < 3   < 2 < 1 < 0 < [9, _, _, _, _, _, _, _, _, _, _, 9]
            for (let j = 0; j < i - 1; j++) {
                game.board[i - j] = JSON.parse(JSON.stringify(game.board[i - j - 1]));
            }
            game.board[0] = [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9];
            linesBroken++;
        }
    }
    addScore(linesBroken);
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
            moveSideways(3);
            break;
        case 'ArrowRight':
            moveSideways(4);
            break;
        case 'ArrowUp':
            rotateBlock();
            break;
        case 'ArrowDown':
            moveDown();
            break;

        default:
            playSound(423);
            break;
    }
}, false);

// setInterval(() => { generateBlock(); game.currentBlock.y = 0; }, 3000);

let last = 0;

function gameUpdate() {
    // console.log(game.board[game.currentBlock.x + game.currentBlock.pattern.length + 1])
    if (game.status === status.playing) {
        moveDown();
    } else if (game.status === status.over) {
        console.log('Game over')
        last = Number.MAX_SAFE_INTEGER;
    } else {
        console.log('nothing to do')
    }
}

function startGame() {
    game.status = status.playing;
    generateBlock();
}

// UPDATE
function fun(now) {
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
