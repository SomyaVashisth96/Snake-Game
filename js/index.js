let snake = [{ x: 8, y: 8 }];
let direction = { x: 0, y: 0 };
let food = generateFood();
let score = 0;
let hiScore = 0;
let level = 1;
let snakeSpeed = 4;
let gameOver = false;
let gameInterval;

// Generate random food position
function generateFood() {
    const x = Math.floor(Math.random() * 18) + 1;
    const y = Math.floor(Math.random() * 18) + 1;
    return { x, y };
}

// Update the game state
function updateGame() {
    if (gameOver) return;

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        snake.unshift({ ...head });
        food = generateFood();
        if (score > hiScore) {
            hiScore = score;
        }
        checkLevelUp(); // Check if level should be increased and speed changed
    } else {
        snake.unshift({ ...head });
        snake.pop();
    }

    // Check for collisions with walls or itself
    if (
        head.x < 1 ||
        head.x > 18 ||
        head.y < 1 ||
        head.y > 18 ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver = true;
    }
}



// Check and handle level-up
function checkLevelUp() {
    if (score >= 5 && level === 1) {
        level = 2;
        snakeSpeed += 1;  // Increase speed
        clearInterval(gameInterval);  // Stop the current game loop
        gameInterval = setInterval(gameLoop, 1000 / snakeSpeed);  // Restart with new speed
    } else if (score >= 10 && level === 2) {
        level = 3;
        snakeSpeed += 1;  // Increase speed
        clearInterval(gameInterval);  // Stop the current game loop
        gameInterval = setInterval(gameLoop, 1000 / snakeSpeed);  // Restart with new speed
    }
}



// Draw the game on the screen
function drawGame() {
    const board = document.getElementById('board');
    board.innerHTML = "";

    for (let i = 0; i < 18 * 18; i++) {
        const cell = document.createElement('div');
        board.appendChild(cell);
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        const element = document.createElement('div');
        element.style.gridRowStart = segment.y;
        element.style.gridColumnStart = segment.x;
        element.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(element);
    });

    // Draw food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    // Update score, hi-score, and level
    document.getElementById('scoreBox').innerText = `Score: ${score}`;
    document.getElementById('hiscoreBox').innerText = `HiScore: ${hiScore}`;
    document.getElementById('levelBox').innerText = `Level: ${level}`;
}

// Game loop
function gameLoop() {
    if(gameOver) {
        clearInterval(gameInterval);
        document.getElementById('gameOverScreen').style.display = 'flex';
        return;
    }
    updateGame();
    drawGame();
}

// Restart the game
function restartGame() {
    clearInterval(gameInterval);
    snake = [{ x: 8, y: 8 }];
    direction = { x: 0, y: 0 };
    food = generateFood();
    score = 0;
    level = 1;
    snakeSpeed = 5;
    gameOver = false;
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('board').style.display = 'grid';
    startGame();
}

// Quit the game


function quitGame() {
    clearInterval(gameInterval);
    // document.getElementById('board').innerHTML = "";
    document.getElementById('board').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('quitBtn').style.display = 'none';
    // document.getElementById('rightBox').style.display = 'none';
    alert("The game is quitted.");
}


// Start the game
function startGame() {
    gameInterval = setInterval(gameLoop, 1000 / snakeSpeed);
}

// Handle keyboard input
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case 'r':
            restartGame();
            break;
        case 'R':
            restartGame();
            break;
        case 'q':
            quitGame();
            break;
        case 'Q':
            quitGame();
            break;
    }
});

// Restart and Quit button functionality
document.getElementById('restartBtn').addEventListener('click', restartGame);
document.getElementById('quitBtn').addEventListener('click', quitGame);

// Initialize the game
startGame();
