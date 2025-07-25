class Key{
    constructor(x, y, height, width, key){
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.key = key
    }

    clicked(){
        let h = this.height/2
        let w = this.width/2
        if (Math.abs(mouseX - this.x) < w+1 && Math.abs(mouseY - this.y) < h+1 ){
            return true
        }else{
            return false
        }
    }
}