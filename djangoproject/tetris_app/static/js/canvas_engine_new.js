const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;

let isThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const status = {
    ready: 'Start',
    playing: 'Playing',
    pause: 'pause',
    over: 'Game over'
}

let blockSize = 40;


// / / / / / / / / / / / / / / / / / / //
//                                     //
//  Beneath lie inhumane horrors.      //
//  Don't read if you're suicidal      //
//  or really hate javascript.         //
//                                     //
// / / / / / / / / / / / / / / / / / / //

let game = (() => {

    let _currentBlock = {
        x: 0,
        y: 4,
        pattern: null,
        special: null
    };
    let _nextBlock = {
        pattern: null,
        special: null
    };
    let _holoBlock = {
        x: 0,
        y: 4,
        pattern: null
    };
    let _board = [
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
        [9, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 9],
        [9, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
    ];
    let _special = 11;
    let _level = 1;
    let _score = 0;
    let _highScore = 0;
    let _name = user;
    let _status = status.ready;
    let _inverted = {
        total: 0,
        left: 0
    };


    const moveDown = () => {
        if (checkLegality(1)) {
            _currentBlock.x++;
            return true;
        }
        addToBoard();
        destroyLines();
        generateBlock();
        renderBoard();
        updateHolo();
        return false;
    }

    const moveLeft = () => moveSideways(3);
    const moveRight = () => moveSideways(4);

    const moveSideways = (dir) => {
        // Move the block sideways, either left or
        // move RIGHT if 4, else move LEFT
        if (_status === status.playing && checkLegality(dir)) {
            const tmp = (dir === 4) ? 1 : -1;
            _currentBlock.y += tmp;
            updateHolo()
        }
    } // done

    const checkLegality = (pos = 0, block = _currentBlock) => {
        // Check the legality of a move, either:
        //
        // inplace : 0 / down : 1 / rotation : 2 / left : 3 / right : 4
        //
        // returns: boolean (legal ? true : false)
        let newPattern = block.pattern.map((a) => a.slice());
        let mov;

        switch (pos) {
            case 1:
                mov = [1, 0];
                break;  // down
            case 2:
                mov = [0, 0];
                newPattern = rotateMatrix(newPattern);
                break;  // rotate
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

        for (let i = 0; i < newPattern.length; i++)
            for (let j = 0; j < newPattern[i].length; j++)
                if (_board[block.x + i + mov[0]][block.y + j + mov[1]] !== 0
                        && newPattern[i][j] !== 0)
                    return false;
        return true;
    } // done

    const rotateMatrix = block => {
        let rotateArr = block.map((a) => a.slice());   // DEEP COPY OF 2D ARRAY
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
    } // done

    const addScore = points => _score += Math.max(points, 0); // done

    const rotate = () => {
        if (checkLegality(2)) {
            _currentBlock.pattern = rotateMatrix(_currentBlock.pattern);
            _holoBlock.pattern = rotateMatrix(_holoBlock.pattern);
        }
    } // done

    const slamDown = () => {
        do {
            addScore(Math.max(5, _level))
        }
        while (moveDown());
    } // done

    const addToBoard = () => {
        for (let i = 0; i < _currentBlock.pattern.length; i++) {
            for (let j = 0; j < _currentBlock.pattern[i].length; j++) {
                if (_currentBlock.pattern[i][j] !== 0)
                    _board[_currentBlock.x + i][_currentBlock.y + j] = _currentBlock.pattern[i][j];
            }
        }
        if (_currentBlock.special != null)
            specialMove();
    } // done

    const specialMove = () => {
        if (gamemode_param !== "13tris") return;
        switch (_currentBlock.special) {
            case "bomb":
                detonateBomb(_currentBlock.x + 1, _currentBlock.y + 1)
                break;
            case "twist":
                invertControls(30);
                break;
            case "amogus":
                generateNextBlock();
                break;
            case "cookie":
                cookieBomb(_currentBlock.x, _currentBlock.y);
                break;
            default:
        }
    } // TODO

    const updateHolo = () => {
        _holoBlock = {
            x: _currentBlock.x,
            y: _currentBlock.y,
            pattern: _currentBlock.pattern.map((a) => a.slice())
        };
        do {
            _holoBlock.x++;
        } while (checkLegality(1, _holoBlock));
    } // done

    const detonateBomb = (x, y) => {
        const tempArr = [
            [x, y - 2],
            [x, y - 1],
            [x, y],
            [x, y + 1],
            [x, y + 2],
            [x - 2, y],
            [x - 1, y],
            [x + 1, y],
            [x + 2, y],
            [x + 1, y + 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [x - 1, y - 1]
        ]
        tempArr.forEach(item => {
            deleteBlock.apply(null, item);
        });
    } // done

    const deleteBlock = (x, y) => {
        if (x >= 0 && y >= 0 && _board[x][y] != null && _board[x][y] !== 0 && _board[x][y] !== 9 && _board[x][y] !== 10)
            _board[x][y] = 0;
    } // done

    const invertControls = (units) => {
        _inverted = {
            total: units,
            left: units
        };
    } // done

    const cookieBomb = (x, y) => {
        for (let j = 0; j < _board.length - 2; j++) {
            _board[j][y % _board[0].length] = 0;
        }
        for (let i = 0; i < _board[0].length - 2; i++) {
            _board[x][i + 1] = 5;
        }
    } // done

    const generateNextBlock = () => {
        if (gamemode_param === "13tris" && _special === 12) {
            _nextBlock = randomElementFromArray(blocks_special);
            _special = 0;
        } else {
            _nextBlock = randomElementFromArray(blocks);
            _special++;
        }
    } // done

    const copyNextBlockIntoCurrent = () => {
        _currentBlock = {
            x: 0,
            y: 4,
            pattern: _nextBlock.pattern.map((a) => a.slice()),
            special: _nextBlock.special
        };
        _holoBlock = {
            x: 0,
            y: 4,
            pattern: _nextBlock.pattern.map((a) => a.slice()),
            special: false
        };
    } // done

    const destroyLines = () => {
        let linesBroken = 0;

        // CHECK EACH LINE FOR FULL LINES
        for (let i = 0; i < _board.length - 2; i++) {
            if (_board[i].indexOf(0) === -1) {
                for (let j = 0; j < i - 1; j++) {
                    _board[i - j] = JSON.parse(JSON.stringify(_board[i - j - 1]));
                }
                _board[0] = [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9];
                linesBroken++;
            }
        }
        if (linesBroken > 0)
            addScore(100 * linesBroken + (linesBroken > 3 ? 600 : 100));
    } // done

    const generateBlock = () => {
        if (_status !== status.playing)
            return false;

        copyNextBlockIntoCurrent();
        generateNextBlock()
        updateHolo();
        return checkLegality();

    } // done

    const pauseGame = () => {
        if (_status === status.pause)
            _status = (_board[2][0] === 6) ? status.ready : status.playing;
        else if (_status !== status.over)
            _status = status.pause;
    } // done
    //
    //
    //
    //

    return {
        moveDown: moveDown,
        moveLeft: moveLeft,
        moveRight: moveRight,
        rotate: rotate,
        slamDown: slamDown,
        pauseGame: pauseGame,
    }

})();


const blocks = [// l
    {
        pattern: [[0, 1, 0], [0, 1, 0], [1, 1, 0]], special: null
    }, // j
    {
        pattern: [[0, 2, 0], [0, 2, 0], [0, 2, 2]], special: null
    }, {
        pattern: // t
            [[0, 0, 0], [3, 3, 3], [0, 3, 0]], special: null
    }, {
        pattern: // s
            [[0, 4, 4], [4, 4, 0], [0, 0, 0]], special: null
    }, {
        pattern: // z
            [[5, 5, 0], [0, 5, 5], [0, 0, 0]], special: null
    }, {
        pattern: // o
            [[6, 6], [6, 6]], special: null
    }, {
        pattern: // i
            [[0, 0, 7, 0], [0, 0, 7, 0], [0, 0, 7, 0], [0, 0, 7, 0]], special: "twist"
    }
];

const blocks_special = [
    {
        pattern: // bomb
            [[8, 6], [6, 8]],
        special: "bomb"
    },
    {
        pattern: // 13tris block
            [
                [0, 6, 1, 1, 0],
                [6, 6, 0, 1, 0],
                [0, 6, 6, 8, 0],
                [0, 4, 0, 8, 0],
                [0, 4, 8, 8, 0]
            ],
        special: null
    },
    {
        pattern: // amogus
            [
                [0, 3, 3, 3],
                [3, 3, 4, 4],
                [3, 3, 3, 3],
                [0, 3, 0, 3]
            ],
        special: "amogus"
    },
    {
        pattern: // line bomb
            [
                [20],
            ],
        special: "cookie"
    }
];

let offset = {
    x: 3 * blockSize,
    y: 2 * blockSize
};

function scale(up) {
    if (blockSize <= 10 && !up) return;
    if (up) {
        blockSize += 5;
        canvas.height += 125;
        canvas.width += 125;
        canvas.style.height = Number(canvas.style.height.substring(0, canvas.style.height.length - 2)) + 125 + 'px';
        canvas.style.width = Number(canvas.style.width.substring(0, canvas.style.width.length - 2)) + 125 + 'px';
    } else {
        blockSize -= 5;
        canvas.height -= 125;
        canvas.width -= 125;
        canvas.style.height = Number(canvas.style.height.substring(0, canvas.style.height.length - 2)) - 125 + 'px';
        canvas.style.width = Number(canvas.style.width.substring(0, canvas.style.width.length - 2)) - 125 + 'px';
    }

    offset = {
        x: 3 * blockSize,
        y: 2 * blockSize
    };
}

const getColour = tile => {
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
        case 20:
            colour = '#653600';
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

/***
 * Adjusts the color by making to brighter (positive amount) or darker (by negatuive amount)
 * @param color{string} Hex colour as string. (i.e. #00923f)
 * @param amount{number} number (min: -256 / max: +256)
 * @returns {string} New colour as string
 */
function adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

function drawExtras(hexColor, strength, x, y) {
    switch (hexColor) {
        case '#653600':
            ctx.fillStyle = adjust(getColour(5), strength);
            ctx.fillRect(x + blockSize * 0.2, y + blockSize * 0.25, blockSize / 5, blockSize / 5);
            ctx.fillStyle = adjust(getColour(6), strength);
            ctx.fillRect(x + blockSize * 0.4, y + blockSize * 0.6, blockSize / 5, blockSize / 5);
            ctx.fillStyle = adjust(getColour(7), strength);
            ctx.fillRect(x + blockSize * 0.6, y + blockSize * 0.3, blockSize / 5, blockSize / 5);
            break
        default:
            break;
    }
}

// DRAWS A BLOCK
function drawBlock(x, y, hexColor) {
    x += offset.x;
    y += offset.y;
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

    drawExtras(hexColor, 0, x, y);
}

function drawHoloBlock(x, y, hexColor, hexColorIn = hexColor) {
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

    drawExtras(hexColorIn, -50, x, y);
}

// DRAW BOARD
function renderBoard(board) {
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

        // DRAW THE ZOOM IN BUTTON
        drawBlock(
            blockSize - offset.x,
            2 * blockSize - offset.y,
            getColour(11)
        );
        ctx.fillStyle = getColour(10);
        ctx.fillRect(7 / 5 * blockSize, 11 / 5 * blockSize, blockSize / 5, blockSize * 3 / 5);
        ctx.fillRect(6 / 5 * blockSize, 12 / 5 * blockSize, blockSize * 3 / 5, blockSize / 5);

        // DRAW THE ZOOM OUT BUTTON
        drawBlock(
            blockSize - offset.x,
            3 * blockSize - offset.y,
            getColour(11)
        );
        ctx.fillStyle = getColour(10);
        ctx.fillRect(6 / 5 * blockSize, 17 / 5 * blockSize, blockSize * 3 / 5, blockSize / 5);

        // DRAW THE SETTINGS BUTTON
        drawBlock(
            blockSize - offset.x,
            5 * blockSize - offset.y,
            getColour(11)
        );
        ctx.fillStyle = getColour(10);
        ctx.font = (blockSize) + 'px segoe ui';
        ctx.fillText(
            '?',
            4.25 * blockSize - offset.x,
            7.85 * blockSize - offset.y,
        );

        // DRAW THE TEXT (SCORE AND NAME)
        ctx.fillStyle = getColour(11);
        ctx.font = (blockSize / 10 * 12) + 'px segoe ui';
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
        if (game.status !== status.pause) {
            for (let i = 0; i < game.board.length; i++) {
                for (let j = 0; j < game.board[i].length; j++) {
                    drawBlock(
                        j * blockSize,
                        i * blockSize,
                        getColour(game.board[i][j])
                    );
                }
            }
        }

        // DRAW THE INVERTED TIMER

        if (game.inverted.left > 0) {
            const percentage = Math.floor((game.inverted.left / game.inverted.total) * 52);
            const fields = [
                [0, 0],
                [0, 1],
                [0, 2],
                [0, 3],
                [0, 4],
                [0, 5],
                [0, 6],
                [0, 7],
                [0, 8],
                [0, 9],
                [0, 10],
                [0, 11],
                [0, 12],
                [0, 13],
                [0, 14],
                [0, 15],
                [0, 16],
                [0, 17],
                [0, 18],
                [0, 19],
                [0, 20],
                [1, 20],
                [2, 20],
                [3, 20],
                [4, 20],
                [5, 20],
                [6, 20],
                [7, 20],
                [8, 20],
                [9, 20],
                [10, 20],
                [11, 20],
                [11, 19],
                [11, 18],
                [11, 17],
                [11, 16],
                [11, 15],
                [11, 14],
                [11, 13],
                [11, 12],
                [11, 11],
                [11, 10],
                [11, 9],
                [11, 8],
                [11, 7],
                [11, 6],
                [11, 5],
                [11, 4],
                [11, 3],
                [11, 2],
                [11, 1],
                [11, 0],
            ]
            for (let i = 0; i < percentage; i++) {
                drawBlock(
                    fields[i][0] * blockSize,
                    fields[i][1] * blockSize,
                    '#d23232'
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
                            drawHoloBlock(
                                ((game.holoBlock.y + j) * blockSize),
                                ((game.holoBlock.x + i) * blockSize),
                                adjust(getColour(tile) + '4D', -50),
                                getColour(holoTile)
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

            // DRAW SPECIAL NEXT BLOCK
            if (gamemode_param === "13tris" && game.nextBlock.special != null) {
                const specialBlock = [
                    6, 8, 7, 1, 4, 7, 5,
                    4, 6, 5, 5, 5, 6, 4,
                    2, 2, 1, 4, 7, 8, 1,
                    1, 8, 6, 8, 4, 7, 5,
                    2, 1, 4, 2, 3, 2, 2,
                    3, 1, 2, 3, 4, 2, 8,
                    1, 7, 4, 2, 5, 3, 6
                ];

                for (let i = 0; i < 7; i++) {
                    for (let j = 0; j < 7; j++) {
                        if (i === 0 || i === 6 || j === 0 || j === 6)
                            drawBlock(
                                (game.board[0].length + 1 + i) * blockSize,
                                (blockSize * (1 + j)),
                                adjust(getColour(specialBlock[(i * 7 + j) % specialBlock.length]), -10)
                            );
                    }
                }

            }

            // DRAW game.nextBlock.pattern
            if (game.status === status.playing) {
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
        }

        if (game.status === status.ready) {
            //cursor.x >= (6 * blockSize) && cursor.x < (10 * blockSize) && cursor.y >= (16 * blockSize) && cursor.y < (18 * blockSize)
            ctx.fillStyle = getColour(11);
            ctx.font = (blockSize / 10 * 12) + 'segoe ui';
            ctx.fillText(
                'START',
                4 * blockSize + 0.25 * blockSize + offset.x,
                16 * blockSize - 0.55 * blockSize + offset.y
            );
        }

        if (game.status === status.pause) {
            console.log("draw this")
            ctx.fillStyle = getColour(11);
            const pauseBoard = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 7, 8, 0, 0, 3, 0, 2, 0, 3, 3, 3],
                [0, 7, 0, 4, 0, 3, 0, 2, 0, 6, 6, 0],
                [0, 7, 4, 0, 0, 3, 2, 2, 0, 7, 0, 0],
                [0, 7, 0, 5, 5, 0, 0, 0, 0, 7, 7, 7],
                [0, 0, 0, 5, 0, 1, 0, 8, 8, 0, 0, 0],
                [0, 0, 0, 6, 1, 1, 0, 8, 0, 0, 0, 0],
                [0, 0, 0, 6, 0, 1, 0, 0, 5, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
            for (let i = 0; i < pauseBoard.length - 1; i++) {
                for (let j = 0; j < pauseBoard[i].length; j++) {
                    drawBlock(
                        j * blockSize,
                        i * blockSize,
                        adjust(getColour(pauseBoard[i][j]), -10)
                    );
                }
            }
        }
    } else if (game.status === status.over) {
        let i = 0;
        const sss = setInterval(function () {
            // DRAW EACH END SCREEN LINE
            for (let j = 0; j < game.board[i].length; j++) {
                drawHoloBlock(
                    j * blockSize,
                    i * blockSize,
                    getColour(99)
                );
            }
            i++;
            // DO THIS FOR THE WHOLE GAME BOARD
            if (i === game.board.length - 1) {
                clearInterval(sss);
            }
        }, 50);
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

function endGame() {
    last = Number.MAX_SAFE_INTEGER;
    game.status = status.over;

    let data = new FormData();
    data.append('score', game.score);
    data.append('mode', gamemode_param);
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    fetch(add_history, {
        method: 'POST',
        body: data,
        credentials: 'same-origin',
    }).then(res =>
        res.json()).then(d => {
        alert(d.score_added + gamemode_param)
    })
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const randomElementFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}



function playSound(number) {

}



// CONTROLS
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowLeft':
            moveSideways(game.inverted.left > 0 ? 4 : 3, game.currentBlock);
            break;
        case 'ArrowRight':
            moveSideways(game.inverted.left > 0 ? 3 : 4, game.currentBlock);
            break;
        case 'ArrowUp':
            rotateBlock(game.currentBlock);
            break;
        case 'ArrowDown':
            moveDown(game.currentBlock);
            break;
        case 'Enter':
            if (game.status === status.ready)
                startGame();
            break;
        case 'Space':
            if (game.status === status.ready)
                startGame();
            else if (game.status === status.playing)
                slamDown(game.currentBlock);
            break;
        case 'Escape':
            pauseGame();
            break;

        default:
            playSound(423);
            break;
    }
}, false);


function clickInBlock(x1, y1, x2, y2, rx, ry) {
    return rx >= (x1 * blockSize) && rx < ((x1 + x2) * blockSize) && ry >= (y1 * blockSize) && ry < ((y1 + y2) * blockSize);
}

// CHECKS IF THE START BUTTON HAS BEEN CLICKED
canvas.addEventListener('mousedown', (e) => {
    const pos = canvas.getBoundingClientRect();

    const cursor = {
        x: e.clientX - pos.left,
        y: e.clientY - pos.top
    }

    if (clickInBlock(7, 16, 4, 2, cursor.x, cursor.y) && game.status === status.ready) startGame();
    if (clickInBlock(1, 2, 1, 1, cursor.x, cursor.y) && game.status !== status.over) scale(true);
    if (clickInBlock(1, 3, 1, 1, cursor.x, cursor.y) && game.status !== status.over) scale(false);
    if (clickInBlock(1, 5, 1, 1, cursor.x, cursor.y) ) pauseGame();

}, false);

function checkStart() {
    if (game.status === status.ready) {
        startGame();
    }
} // TODO

// setInterval(() => { generateBlock(); game.currentBlock.y = 0; }, 3000);

let last = 0;

function gameUpdate() {
    if (game.status === status.playing) {
        moveDown(game.currentBlock);
        console.log('Game')
    } else if (game.status === status.over) {
        console.log('Game over')
        last = Number.MAX_SAFE_INTEGER;
    }
} // TODO

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

    game.special = 11;
    game.level = 1;
    game.score = 0;
    game.name = user;
    game.inverted = {
        total: 0,
        left: 0,
    };
    const nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
    game.nextBlock = {
        pattern: nextBlock.pattern,
        special: nextBlock.special
    }
    generateBlock();
} // TODO

// UPDATE
function fun(now) {
    isThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!last || now - last >= (800 - game.level * 35)) {
        last = now;
        gameUpdate();
    }
    if (game.status !== status.over && game.inverted.left > 0)
        game.inverted.left--;
    requestAnimationFrame(fun);
} // TODO

generateBlock();
requestAnimationFrame(fun);
