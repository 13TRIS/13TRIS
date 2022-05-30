
let isThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let last = 0;
let fps = 30;

const Status = {
    ready: 'Start',
    playing: 'Playing',
    pause: 'pause',
    over: 'Game over'
}

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

let blockSize = 40;

const randomElementFromArray = (array) => array[Math.floor(Math.random() * array.length)]; // done


// / / / / / / / / / / / / / / / / / / //
//                                     //
//  Beneath lie inhumane horrors.      //
//  Don't read if you're suicidal      //
//  or really hate javascript.         //
//                                     //
// / / / / / / / / / / / / / / / / / / //

let game = (() => {

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
    let _special,
        _level,
        _score,
        _highScore,
        _name,
        _status = Status.ready,
        _inverted,
        _currentBlock,
        _nextBlock,
        _holoBlock;
    
    const board = () => _board;
    const level = () => _level;
    const status = () => _status;
    const currentBlock = () => _currentBlock;
    const holoBlock = () => _holoBlock;
    const nextBlock = () => _nextBlock;
    const special = () => _special;
    const score = () => _score;
    const highScore = () => _highScore;
    const name = () => _name;
    const inverted = () => _inverted;


    const moveDown = () => {
        if (checkLegality(1)) {
            _currentBlock.x++;
            return true;
        }
        addToBoard();
        destroyLines();
        generateBlock();
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
        if (block === null) return;

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
            updateHolo();
        }
    } // done

    const slamDown = () => {
        if (_status !== Status.playing) return;

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
        if (_currentBlock.special !== null)
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
        if (x >= 0 && y >= 0 && _board[x][y] !== null && _board[x][y] !== 0 && _board[x][y] !== 9 && _board[x][y] !== 10)
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

        copyNextBlockIntoCurrent();
        generateNextBlock();
        updateHolo();

        if (!checkLegality()) endGame();

    } // done

    const startGame = () => {
        if (_status !== Status.ready) return;

        last = 0;
        _status = status.playing;
        _board = [
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

        _special = 11;
        _level = 1;
        _score = 0;
        _name = user;
        _inverted = {
            total: 0,
            left: 0,
        };
        const nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
        _nextBlock = {
            pattern: nextBlock.pattern,
            special: nextBlock.special
        }
        generateBlock();
    } // done

    const pauseGame = () => {
        if (_status === status.pause)
            _status = (_board[2][0] === 6) ? status.ready : status.playing;
        else if (_status !== status.over)
            _status = status.pause;

        render.main();
    } // done

    const endGame = () => {
        last = Number.MAX_SAFE_INTEGER;
        _status = status.over;

        let data = new FormData();
        data.append('score', _score);
        data.append('mode', gamemode_param);
        data.append('opponent', gameopponent_param);
        data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
        fetch(add_history, {
            method: 'POST',
            body: data,
            credentials: 'same-origin',
        }).then(res =>
            res.json()).then(d => {
            alert(d.score_added + ' = ' + gamemode_param)
        })
    } // done

    const update = () => {
        if (_status !== status.playing)
            return;

        if (_inverted.left > 0)
            _inverted.left--;

        moveDown(_currentBlock);

        render.main();
    } // TODO

    return {
        moveDown: moveDown,
        moveLeft: moveLeft,
        moveRight: moveRight,
        rotate: rotate,
        slamDown: slamDown,
        startGame: startGame,
        pauseGame: pauseGame,
        endGame: endGame,
        update: update,
        level: level,
        status: status,
        board: board,
        currentBlock: currentBlock,
        holoBlock: holoBlock,
        nextBlock: nextBlock,
        special: special,
        score: score,
        highScore: highScore,
        name: name,
        inverted: inverted,
    }

})();


const render = (() => {

    let canvas = document.getElementById("my_canvas");
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1000;

    const background = () => {
        for (let i = 0; i < (canvas.height / blockSize); i++)
            for (let j = 0; j < (canvas.width / blockSize); j++)
                drawBlock(i, j, getColour(10));
    }

    const drawBoard = (b) => {
        for (let i = 0; i < b.length; i++)
            for (let j = 0; j < b[i].length; j++)
                drawBlock(j + offset.x, i + offset.y, getColour(b[i][j]));
    }
    
    const drawPattern = (b, holo = false) => {
        if (!b.pattern) return;

        for (let i = 0; i < b.pattern.length; i++)
            for (let j = 0; j < b.pattern[i].length; j++)
                if (b.pattern[i][j] !== 0)
                    drawBlock(
                        (b.y + j + offset.x),
                        (b.x + i + offset.y),
                        getColour(b.pattern[i][j], holo ? (isThemeDark ? -80 : 80) : 0),
                        holo
                    );
    }

    const text = () => {
        ctx.fillStyle = getColour(11);
        ctx.font = (blockSize / 10 * 12) + 'px segoe ui';

        if (game.status() === Status.ready) {
            console.log("ok")
            ctx.fillText(
                'START',
                (offset.x + game.board()[0].length + 1) * blockSize,
                11 * blockSize
            );
        } else {
            ctx.fillText(
                'Score: ' + game.score(),
                (offset.x + game.board()[0].length + 1) * blockSize,
                9 * blockSize
            );
            ctx.fillText(
                game.name(),
                (offset.x + game.board()[0].length + 1) * blockSize,
                11 * blockSize
            );
        }
    }

    const calculateBoard = () => {
        const b = game.board();
        const n = game.nextBlock();
        const c = game.currentBlock();
        const h = game.holoBlock();

        let result = Array.from({length: (canvas.height / blockSize)}, () => new Array((canvas.height / blockSize)).fill(10));

        for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < b[i].length; j++) {
                result[3 + j][2 + i] = b[i][j];
            }
        }

        if (n) {
            for (let i = 0; i < 6; i++)
                for (let j = 0; j < 6; j++)
                    result[17 + j][2 + i] = (i % 5 === 0 || j % 5 === 0) ? 9 : 0;

            for (let i = 0; i < n.pattern.length; i++)
                for (let j = 0; j < n.pattern[i].length; j++)
                    if (n.pattern[i][j] !== 0)
                        result[18 + j][3 + i] = n.pattern[i][j];
        }

        if(c) {
            for (let i = 0; i < c.pattern.length; i++)
                for (let j = 0; j < c.pattern[i].length; j++)
                    if (c.pattern[i][j] !== 0)
                        result[j + 3 + c.y][i + 2 + c.x] = c.pattern[i][j];
        }

        if (h) {
            for (let i = 0; i < h.pattern.length; i++)
                for (let j = 0; j < h.pattern[i].length; j++)
                    if (h.pattern[i][j] !== 0)
                        result[j + 3 + h.y][i + 2 + h.x] = h.pattern[i][j];
        }

        result[1][3] = 9;
        result[1][4] = 9;

        result[1][6] = 9;

        return result;
    }

    const useCanvas = (ID) => canvas = document.getElementById(ID); // done

    /***
     * Adjusts the color by making to brighter (positive amount) or darker (by negatuive amount)
     * @param tile{string} Hex colour as string. (i.e. #00923f)
     * @param amount{number} number (min: -256 / max: +256)
     * @returns {string} New colour as string
     */
    const getColour = (tile, amount = null) => {
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
                colour = tile;
                break;
        }

        if (amount === null) return colour;
        return '#' + colour.replace(/^#/, '').replace(/../g, colour => ('0' + Math.min(255, Math.max(0, parseInt(colour, 16) + amount)).toString(16)).substr(-2));
    } // done

    const drawBlock = (x, y, hexColor, holo) => {
        x = x * blockSize;
        y = y * blockSize;
        const strength = 10;

        if (holo) {
            ctx.fillStyle = getColour(hexColor);
            ctx.fillRect(x, y, blockSize, blockSize);
            ctx.fillStyle = getColour(hexColor, -strength);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 3, y + 3);
            ctx.lineTo(x + 3, y + blockSize - 3);
            ctx.lineTo(x + blockSize - 3, y + blockSize - 3);
            ctx.lineTo(x + blockSize, y + blockSize);
            ctx.lineTo(x, y + blockSize);
            ctx.fill();
            ctx.fillStyle = getColour(hexColor, strength);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 3, y + 3);
            ctx.lineTo(x + blockSize - 3, y + 3);
            ctx.lineTo(x + blockSize - 3, y + blockSize - 3);
            ctx.lineTo(x + blockSize, y + blockSize);
            ctx.lineTo(x + blockSize, y);
            ctx.fill();
        } else {
            ctx.fillStyle = getColour(hexColor, strength);
            ctx.fillRect(x, y, blockSize, blockSize);
            ctx.fillStyle = getColour(hexColor, -strength);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + blockSize, y + blockSize);
            ctx.lineTo(x, y + blockSize);
            ctx.fill();
            ctx.fillStyle = hexColor;
            ctx.fillRect(x + 3, y + 3, blockSize - 6, blockSize - 6);
        }

        drawExtras(hexColor, 0, x, y);
    } // done

    function drawExtras(hexColor, strength, x, y) {
        switch (hexColor) {
            case '#653600':
                ctx.fillStyle = getColour(getColour(5), strength);
                ctx.fillRect(x + blockSize * 0.2, y + blockSize * 0.25, blockSize / 5, blockSize / 5);
                ctx.fillStyle = getColour(getColour(6), strength);
                ctx.fillRect(x + blockSize * 0.4, y + blockSize * 0.6, blockSize / 5, blockSize / 5);
                ctx.fillStyle = getColour(getColour(7), strength);
                ctx.fillRect(x + blockSize * 0.6, y + blockSize * 0.3, blockSize / 5, blockSize / 5);
                break
            default:
                break;
        }
    } // done

    const offset = {
        x: 3,
        y: 2
    }; // done

    const scale = (up) => {
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

        render.main();
    } // dome

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();

        const cursor = {
            x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };

        console.log(Math.round(cursor.x / blockSize) + " -- " + Math.round(cursor.y / blockSize));
        // console.log(cursor.x + " -- " + cursor.y);
        console.log(clickInBlock(7, 16, 4, 2, cursor.x, cursor.y));

        if (clickInBlock(7, 16, 4, 2, cursor.x, cursor.y)) game.startGame();
        if (clickInBlock(1, 3, 1, 1, cursor.x, cursor.y)) scale(true);
        if (clickInBlock(1, 4, 1, 1, cursor.x, cursor.y)) scale(false);
        if (clickInBlock(1, 6, 1, 1, cursor.x, cursor.y)) game.pauseGame();

    }, false);


    const main = () => {
        console.log("Now")
        background();
        drawBoard(game.board());
        drawPattern(game.holoBlock(), true);
        drawPattern(game.currentBlock());
        text();
        // TODO : zoom in
        // TODO : zoom out
        // TODO : zoom settings
        // TODO : zoom timer
        // TODO : zoom special block show off
    }

    return {
        main: main,
        scale: scale,
        drawBlock: drawBlock,
    }

})();


const getCookie = (name) => {
    let cookieValue = null;
    if (!(document.cookie && document.cookie !== '')) return null;

    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }

    return cookieValue;
} // done

function playSound(number) {

}


// CONTROLS
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowLeft':
            game.moveLeft();
            break;
        case 'ArrowRight':
            game.moveRight();
            break;
        case 'ArrowUp':
            game.rotate();
            break;
        case 'ArrowDown':
            game.moveDown();
            break;
        case 'Enter':
            game.startGame();
            break;
        case 'Space':
            game.slamDown();
            break;
        case 'Escape':
            game.pauseGame();
            break;

        default:
            playSound(423);
            break;
    }
    render.main();
}, false); // done

function clickInBlock(x1, y1, x2, y2, rx, ry) {
    return rx >= (x1 * blockSize) && rx < ((x1 + x2) * blockSize) && ry >= (y1 * blockSize) && ry < ((y1 + y2) * blockSize);
} // done ? chrome is retarded

setInterval(() => {
    isThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    game.update();
}, 500); // done



render.main();