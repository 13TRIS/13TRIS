const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const img = document.querySelector('#block');
context.drawImage(img, 10, 10)
var block;

class Block {
    constructor(img, posX, posY) {
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.draw = () => {
            context.drawImage(this.img, this.posX, this.posY)
        }
    }
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    block.posY += 1;
    block.draw();
    requestAnimationFrame(animate)
}

function init() {
    block = new Block(img, 10, 10);
    requestAnimationFrame(animate)
}

init()