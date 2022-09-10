document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId 
  let score = 0;
  const colors = [
    'orange',
    'blue',
    'purple',
    'green',
    'blue'
  ]

  //the tetris blocks
  const lTetramino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetraminos = [
    lTetramino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;
  //randomly select a tetramino and its first rotation
  let random = Math.floor(Math.random() * theTetraminos.length);
  let current = theTetraminos[random][0];

  //draw the tetramino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetramino");
      squares[currentPosition + index].style.backgroundColor = colors[random]
    });
  }
  //undraw the Tetramino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetramino");
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  //make the tetromino move down every second
//   timerId = setInterval(moveDown, 1000);

  //assign functions to keyCodes 
  function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if(e.keyCode === 38){
        rotate()
    } else if(e.keyCode === 39){
        moveRight()
    } else if(e.keyCode === 40){
        moveDown()
    }
  }
  document.addEventListener('keyup', control)

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetraminos.length);
      current = theTetraminos[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the teromino left, unless it's at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -= 1
    
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition += 1
    }

    draw()
  }
  //move tetramino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if(!isAtRightEdge) currentPosition += 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -= 1
    }    

    draw();
  }

  //rotate the tetramino 
  function rotate(){
    undraw()
    currentRotation++
    if(currentRotation === current.length){
        currentRotation = 0;
    }
    current = theTetraminos[random][currentRotation]
    draw()
  }

  //show up next tetramino in the mini-grid dispay
  const dispaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4;
  let dispayIndex = 0

  //the tetraminos without rotations 
  const upNextTetraminos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetramino
    [0, displayWidth,displayWidth + 1, displayWidth* 2 + 1], //zTetramino
    [1,displayWidth, displayWidth + 1, displayWidth+ 2], //tTetramino
    [0, 1, displayWidth, displayWidth + 1], //oTetramino
    [1, displayWidth + 1, displayWidth* 2 + 1, displayWidth * 3 + 1] //iTetramino
  ]

  //display the shape in the minigrid display
  function displayShape() {
    //remove any trace of a tetramino from the entire grid
    dispaySquares.forEach(square => {
        square.classList.remove('tetramino');
        //remove color
        square.style.backgroundColor = '';
    })
     upNextTetraminos[nextRandom].forEach(index => {
        dispaySquares[dispayIndex + index].classList.add('tetramino')
        //set color
        dispaySquares[dispayIndex + index].style.backgroundColor = colors[random]
     })
  }

  //add functionality to the buttons
  startBtn.addEventListener('click', () => {
    if(timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random() * theTetraminos.length)
        displayShape()
    }
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        
        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetramino');
                //remove color
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
  }

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = `${score} GAME OVER`;
        clearInterval(timerId)
    }
  }










});
