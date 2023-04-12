function Player(width, height, x, y, gameArea)
{
    this.width = width ;
    this.height = height;

    this.startX = x; 
    this.startY = y; 

    this.x = x; 
    this.y = y; 
    this.score = 0; 

    this.stepTrack = 0; 
    
    this.stopMove = false; 
    this.isMovingLeft = false; 
    this.isMovingRight = false;
    this.isMovingDown = false; 
    this.isMovingUp = false;  

    this.queue = []; 

    this.update = () => {
        gameArea.context.fillStyle = "blue"; 
        gameArea.context.fillRect(this.x, this.y, width, height);
    }

    this.collisionDetection = (barriers) => {
  
        for (let piece = 0; piece < barriers.length; piece++)
        {
            let barrier = barriers[piece]; 
            if (((this.x <= barrier.x + barrier.width && this.x >= barrier.x) || 
                 (this.x + this.width >= barrier.x && this.x + this.width <= barrier.x + barrier.width)) &&
                ((this.y + this.height >= barrier.y && this.y + this.height <= barrier.y + barrier.height)||
                 (this.y <= barrier.y + barrier.height && this.y >= barrier.y)))
            {
                if (barrier.isEndTile){
                    this.score += 500; 
                }
                
                this.stopMove = true; 
            }
        }
    }

    this.move_left = function () {
        this.isMovingLeft = true; 
    }

    this.move_right = function () {
        this.isMovingRight = true;
    }

    this.move_down = function () {
        this.isMovingDown = true; 
    }

    this.move_up = function () {
        this.isMovingUp = true; 
    }

    this.play = () => {
        // Retrieves the next code block to execute 
        let next = this.queue.shift(); 
        if (next)
        {
            if (next == "move_left")
            {
                this.move_left(); 
            }
            else if (next == "move_right")
            {
                this.move_right(); 
            }
            else if (next == "move_down")
            {
                this.move_down(); 
            }
            else if (next == "move_up")
            {
                this.move_up(); 
            }
        }
    }

    this.handleMove = (canvas, event, barriers) => {
        if (this.stepTrack != 100 && !this.stopMove)
        {
            if (this.isMovingLeft)
            {
                this.collisionDetection(barriers);
                this.x -= 1; 
                this.stepTrack += 1; 
            }
            else if (this.isMovingRight)
            {
                this.collisionDetection(barriers); 
                this.x += 1; 
                this.stepTrack += 1; 
            }
            else if (this.isMovingDown)
            {
                this.collisionDetection(barriers); 
                this.y += 1; 
                this.stepTrack += 1; 
            }
            else if (this.isMovingUp)
            {
                this.collisionDetection(barriers); 
                this.y -= 1; 
                this.stepTrack += 1; 
            }
        }
        else 
        {
            this.isMovingLeft = false; 
            this.isMovingRight = false; 
            this.isMovingDown = false; 
            this.isMovingUp = false; 
            this.stopMove = false; 
            this.stepTrack = 0; 
            canvas.dispatchEvent(event); 
        }
    }
}


function Component(width, height, x, y, context, isEndTile)
{
    this.width = width; 
    this.height = height; 
    this.x = x; 
    this.y = y; 
    this.color = "black"; 
    this.isEndTile = isEndTile; 

    this.update = () => {
        // Redrawing object every frame of the game
        context.fillStyle = this.color; 
        context.fillRect(this.x, this.y, width, height); 
    }
}


function GameArea(width, height, rowCount, colCount) 
{
    this.canvas = document.getElementById("gameArea"); 
    this.context = this.canvas.getContext("2d"); 

    this.rowCount = rowCount; 
    this.colCount = colCount; 
    // X and Y position for start tile 
    this.startX = 0; 
    this.startY = 0;

    this.map; 

    this.start = () => {
        // Initialize settings for canvas element 
        this.canvas.height = height; 
        this.canvas.width = width; 
        this.canvas.style = "border: 2px solid black;"; 
    }

    this.clear = () => {
        // refreshing screen before the redraw
        this.context.clearRect(0, 0, width, height);
    }

    this.mapSetup = () => {
        // Map Layout
        this.map = [
            [1, 1, 1, 0, 2, 1, 0, 0, 1, 1, 1, 1, 1], 
            [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1], 
            [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], 
            [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], 
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1], 
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
            [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1], 
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1], 
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1], 
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1], 
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1], 
            [1, 1, 1, 1, 1, 1 ,1 ,1, 1, 1, 1, 3, 1]
        ]; 


        const pieceWidth = width/colCount;
        const pieceHeight = height/rowCount;
        let mapPieces = []; 
        let barrierPieces = []; 
        let mapPiece; 

        // Storing components objects in arrays for iteration in
        // collision and redrawing them to the screen using update
        for (let row = 0; row < rowCount; row++)
        {
            for (let col = 0; col < colCount; col++)
            {
                const tile = this.map[row][col]; 
                // Regular black barrier tile
                if (tile == 1) 
                {
                    mapPiece = new Component(pieceWidth, pieceHeight, 
                        pieceWidth*col, pieceHeight*row, this.context, false);
                    mapPieces.push(mapPiece); 
                    barrierPieces.push(mapPiece)
                }
                // Start tile 
                else if (tile == 2)
                {
                    mapPiece = new Component(pieceWidth, pieceHeight,
                        pieceWidth*col, pieceHeight*row, this.context, false); 
                    this.startX = pieceWidth*col; 
                    this.startY = pieceHeight*row; 
                    mapPiece.color = "green"; 
                    mapPieces.push(mapPiece); 
                }
                // End tile 
                else if (tile == 3)
                {
                    mapPiece = new Component(pieceWidth, pieceHeight,
                        pieceWidth*col, pieceHeight*row, this.context, true); 
                    mapPiece.color = "red"; 
                    mapPieces.push(mapPiece); 
                }
            }
        }
        // Returning object containing all tiles in the map and barriers
        return {
            map: mapPieces,
            barriers: barrierPieces
        }; 
    }

    this.update = (map) => {
        // Redrawing all tiles on the screen
        for (let piece = 0; piece < map.length; piece++)
        {
            const mapPiece = map[piece]; 
            mapPiece.update(); 
        }
    }
}