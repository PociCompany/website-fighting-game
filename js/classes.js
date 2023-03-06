class Sprite {
    constructor({ 
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        frameCurrent = 0,
        framesElapsed = 0,
        framesHold = 5,
        offset = { x:0, y:0 }
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.barrierWidth = 10
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = frameCurrent
        this.framesElapsed = framesElapsed
        this.framesHold = framesHold
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )

            // // Draw the left barrier
            // c.fillStyle = "gray";
            // c.fillRect(0, 0, this.barrierWidth, canvas.height);
            
            // // Draw the right barrier
            // c.fillRect(canvas.width - this.barrierWidth, 0, this.barrierWidth, canvas.height);
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++
            }else {
                this.frameCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({ 
        position, 
        velocity, 
        color, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        frameCurrent = 0,
        framesElapsed = 0,
        framesHold,
        offset = { x:0, y:0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
     }) {
        super({ 
            position,
            imageSrc,
            scale, 
            framesMax, 
            frameCurrent, 
            framesElapsed,
            framesHold,
            offset
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.sprites = sprites
        this.dead = false
        this.isJumping = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw()
        
        if (!this.dead){
            this.animateFrames()
        }

        //attack box
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw attack box
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 97){
            this.velocity.y = 0
            this.position.y = 330
        }else {
            this.velocity.y += gravity
        }
    }
    
    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0){
            this.switchSprite('death')
        }else {
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true
            }
        return}
        //override animation
        if (
            this.image === this.sprites.attack1.image && 
            this.frameCurrent < this.sprites.attack1.framesMax - 1
        ) 
            return
        
        if (
            this.image === this.sprites.takeHit.image && 
            this.frameCurrent < this.sprites.takeHit.framesMax -1
        )
            return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.frameCurrent = 0
                }
                break
        }
    }
}