class Snake {
    constructor(element){
        this.bgColor = '#798575'
        this.fgColor = '#14181B'
        this.fieldWidth = 10
        this.fieldHeight = 20
        this.tickDelayMax = 300
        this.tickDelayMin = 50
        this.acceleration = 5
        
        this.wH = window.innerHeight
        this.wW = window.innerWidth
        this.width = this.wW
        this.height = this.wH
        
        this.bitSize = Math.floor( this.wH / 4 * 3 * this.fieldWidth / this.fieldHeight / this.fieldWidth )


        this.sprite = []
        this.parent = element
        this.snake = new Array()
        this.field = new Rect(0, 0, this.fieldWidth * this.bitSize, this.fieldHeight * this.bitSize)
        this.fieldOffsetX = (this.width - this.fieldWidth * this.bitSize) / 2
        this.fieldOffsetY =  this.bitSize * 2; //(this.height - this.fieldHeight * this.bitSize) / 2

        this.buttons = new Set()
        this.buttons.add(new Button('LEFT', 'ArrowLeft', new Rect(0, this.fieldOffsetY + this.field.height + 1, this.width / 3, this.height)))
        this.buttons.add(new Button('RIGHT', 'ArrowRight', new Rect(this.width / 3 * 2, this.fieldOffsetY + this.field.height + 1, this.width, this.height)))
        this.buttons.add(new Button('UP', 'ArrowUp', new Rect(this.width / 3, this.fieldOffsetY + this.field.height + 1, this.width / 3 * 2, this.fieldOffsetY + this.field.height + (this.height - this.fieldOffsetY - this.field.height + 1 ) / 2)))
        this.buttons.add(new Button('DOWN', 'ArrowDown', new Rect(this.width / 3, this.fieldOffsetY + this.field.height + (this.height - this.fieldOffsetY - this.field.height + 1 ) / 2,this.width / 3 * 2, this.height)))

        this.css = document.createElement('style')
        this.css.setAttribute('type','text/css')
        this.css.innerText = '.game{border:1px solid black;width:100%;height:auto;margin:0;padding:0;position:fixed;top:0;left:0;z-index:99999;}'
        
        document.head.append(this.css);

        element.addEventListener('keydown',(event)=>{
            this.keyDownHandler(event)
        })

        this.initGraphics()

        this.theCanvas.addEventListener('touchstart',(event)=>{
            this.touchstartHandler(event)
        })

        this.initGame()
    }
    createSpriteFromSVG(width, height, innerText ) {
        let svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
        svg.setAttribute('width',width)
        svg.setAttribute('height',height)
        //svg.setAttribute('width','100%')
        //svg.setAttribute('height','100%')

        //svg.setAttribute('viewBox',`0 0 ${width} ${height}`)
        svg.setAttribute('viewBox',`0 0 10 10`)
        //svg.setAttribute('shape-rendering','crispEdges')
        svg.setAttribute('preserveAspectRatio','none')
        svg.innerHTML = innerText
        const svgDef = new XMLSerializer().serializeToString(svg);
        let blob = new Blob([svgDef],{type:'image/svg+xml;charset=utf-8'})
        const url = URL.createObjectURL(blob)
        let img = new Image()//document.createElement('img')
        img.addEventListener('load', () => URL.revokeObjectURL(url), {once: true});
        img.src = url
        img.width = this.bitSize
        img.height = this.bitSize
        let promise = new Promise((resolve,reject)=>{
            img.onload = () => {
                resolve(img)
            }
        })        
        return promise
    }
    async initGraphics(){
        this.theCanvas = document.createElement('canvas')
        this.theContext = this.theCanvas.getContext('2d')
        this.theCanvas.setAttribute('width',this.width)
        this.theCanvas.setAttribute('height',this.height)
        this.theCanvas.classList.add('game')
        this.parent.append(this.theCanvas)

        this.sprite["bit"] = await this.createSpriteFromSVG(this.bitSize, this.bitSize, `<rect x="1" y="1" width="8" height="8" style="fill:${this.bgColor};stroke-width:1;stroke:${this.fgColor}"/><rect x="3" y="3" width="4" height="4" style="fill:${this.bgColor};stroke-width:1;stroke:${this.fgColor}"/>`)
        
        this.render()        
    }
    createInterval(){
        window.clearInterval( this.interval )
        this.interval = window.setInterval(()=>{
            this.tickHandler()
        }, this.tickDelay)
    }
    initGame(){
        this.snake = new Array()
        this.inGame = true
        this.X = 5
        this.Y = 5
        this.tickDelay = this.tickDelayMax
        this.score = 0

        this.snake.push(new Point(this.X, this.Y))
        this.snake.push(new Point(this.X, this.Y - 1))
        this.snake.push(new Point(this.X, this.Y - 2))

        this.createApple()

        this.direction = 'down'
        this.createInterval()
    }
    tickHandler() {
        switch (this.direction) {
            case 'up':
                this.Y -= 1
                break;
            case 'down':
                this.Y += 1
                break;
            case 'left':
                this.X -= 1
                break;
            case 'right':
                this.X += 1
                break;
            default:
                break;
        }

        if(this.collosionDetection()) {
            //game over
            window.clearInterval( this.interval )
            this.inGame = false            
        } else if(!this.omnomnomDetection()) {
            //move snek
            this.snake.unshift(new Point(this.X, this.Y))
            this.snake.pop()
        }
        this.render()
    }
    collosionDetection(){
        if (this.X < 0 || this.X >=this.fieldWidth || this.Y < 0 || this.Y >= this.fieldHeight) {
            return true
        }
        for (let index = 0; index < this.snake.length; index++) {
            const element = this.snake[index];
            if(this.X == element.X && this.Y == element.Y) {
                return true
            }
        }
    }
    omnomnomDetection(){
        if(this.apple.X == this.X && this.apple.Y == this.Y) {
            this.snake.unshift(new Point(this.X, this.Y))
            this.createApple()            
            if(this.tickDelay > this.tickDelayMin) this.tickDelay -= this.acceleration
            this.createInterval()
            this.score += Math.floor( 10000 / this.tickDelay )
            return true
        }
        return false
    }
    createApple(){
        let fields = new Set()
        for (let j = 0; j < this.fieldHeight; j++) {
            for (let i = 0; i < this.fieldWidth; i++) {
                fields.add(`${i}_${j}`)
            }
        }

        for (const bit of this.snake) {
            fields.delete(`${bit.X}_${bit.Y}`)
        }

        let r = Math.floor( Math.random() * fields.size )
        
        let index = 0
        for (const field of fields) {
            if(index == r) {
                //decoding field
                let coordinates = field.split("_")
                this.apple = new Point(coordinates[0], coordinates[1])
                break
            }
            index++
        }        
    }
    drawButton(button,bufferContext){
        bufferContext.rect( button.rect.X1, button.rect.Y1, button.rect.width, button.rect.height )
        bufferContext.stroke()
        let buttonText = bufferContext.measureText(button.text)
        bufferContext.strokeText(button.text, button.rect.X1 + (button.rect.width - buttonText.width) / 2, button.rect.Y1 + button.rect.height / 2 + this.bitSize / 2 )
    }
    render(){
        let bufferCanvas = document.createElement('canvas')
        bufferCanvas.width = this.theCanvas.width
        bufferCanvas.height = this.theCanvas.height
        let bufferContext = bufferCanvas.getContext('2d')
        bufferContext.fillStyle = this.bgColor
        bufferContext.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height)

        bufferContext.beginPath()
        bufferContext.fillStyle = this.bgColor
        //bufferContext.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height)
        bufferContext.lineWidth = this.bitSize/25
        bufferContext.strokeStyle = this.fgColor
        bufferContext.rect(this.field.X1 + this.fieldOffsetX, this.field.Y1 + this.fieldOffsetY, this.field.width + 1, this.field.height + 1)
        bufferContext.stroke()
        bufferContext.fill()

        //snake
        for (const bit of this.snake) {
            bufferContext.drawImage(this.sprite['bit'], bit.X * this.bitSize + this.fieldOffsetX, bit.Y * this.bitSize + this.fieldOffsetY);
        }

        //apple
        bufferContext.drawImage(this.sprite['bit'], this.apple.X * this.bitSize + this.fieldOffsetX, this.apple.Y * this.bitSize + this.fieldOffsetY);

        //score
        bufferContext.fillStyle = this.fgColor
        bufferContext.strokeStyle = this.fgColor

        bufferContext.font = `${this.bitSize}px sans-serif`
        //bufferContext.fillText(`SCORE: ${this.score}`, this.fieldOffsetX ,this.fieldOffsetY - 5)
        bufferContext.strokeText(`SCORE: ${this.score}`, this.fieldOffsetX ,this.fieldOffsetY - 5)

        if(this.inGame) {
            bufferContext.lineWidth = this.bitSize/25
            bufferContext.strokeStyle = this.fgColor    

            this.buttons.forEach(button=>this.drawButton(button,bufferContext))
 
        } else {
            bufferContext.strokeText(`GAME OVER`, this.fieldOffsetX ,this.fieldOffsetY + this.field.height + this.bitSize)    
        } 

        this.theContext.drawImage(bufferCanvas, 0, 0)
    }
    keyDownHandler(event) {
        if(!this.inGame) {
            this.initGame()
            return
        }
        let second = this.snake[1]
        let X = this.X
        let Y = this.Y
        let direction = undefined
        switch (event.key) {
            case 'ArrowUp':
                if (this.direction != 'up' && this.direction != 'down') {
                    direction = 'up'
                    Y -= 1
                } else return
                break;
            case 'ArrowDown':
                if (this.direction != 'up' && this.direction != 'down') {
                    direction = 'down'
                    Y += 1
                } else return
                break;
            case 'ArrowLeft':
                if (this.direction != 'left' && this.direction != 'right') {
                    direction = 'left' 
                    X -= 1                   
                } else return
                break;
            case 'ArrowRight':
                if (this.direction != 'left' && this.direction != 'right') {
                    direction = 'right'
                    X += 1
                } else return
                break;
            case ' ':
                if(!this.inGame) {
                    this.initGame()
                }
                return
                break
            default:
                return
                break;
        }
        if(second.X == X && second.Y == Y) return
        this.direction = direction
    }
    touchstartHandler(event) {
        let x = event.changedTouches[0].clientX
        let y = event.changedTouches[0].clientY
        console.log(`X:${x}, Y:${y}`)
        let hit = undefined
        this.buttons.forEach(btn => {
            if (x > btn.rect.X1 && x < btn.rect.X2 && y > btn.rect.Y1 && y < btn.rect.Y2) {
                hit = btn                
            } 
        });
        if(hit!==undefined) {
            this.keyDownHandler({key:hit.key})
        }
        
    }
}

class Button {
    constructor(text, key, rect) {
        this.text = text
        this.key = key
        this.rect = rect        
    }
}

class Rect {
    constructor(X1,Y1,X2,Y2) {
        this.X1 = X1
        this.Y1 = Y1
        this.X2 = X2
        this.Y2 = Y2
    }
    get width() {
        return this.X2 - this.X1
    }
    get height() {
        return this.Y2 - this.Y1
    }
}

class Point {
    constructor(X, Y) {
        this.X = X
        this.Y = Y
    }
}

module.exports = {Snake}