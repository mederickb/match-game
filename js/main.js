document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    const gameArea = document.getElementById('gameArea');
    const recipeImage = document.getElementById('recipeImage');
    const recipeInfo = document.getElementById('recipeInfo');
    const timerDisplay = document.getElementById('timer');
    const ingredientButtons = document.getElementById('ingredientButtons');
    const doneButton = document.getElementById('doneButton');
    const restartButton = document.getElementById('restartButton');

    let recipes, currentRecipe, timer, countdownInterval, gameActive = false;

    fetch('js/game.json')
        .then(response => response.json())
        .then(data => {
            recipes = data.recipes;
        });

    playButton.addEventListener('click', startGame);
    doneButton.addEventListener('click', checkAnswers);
    restartButton.addEventListener('click', restartGame);

    function startGame() {
        gameActive = true;
        currentRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        recipeImage.src = `images/${currentRecipe.image}`;
        recipeInfo.innerHTML = currentRecipe.ingredients.map(ing => `${ing.quantity} ${ing.name}`).join('<br>');
        playButton.style.display = 'none';
        gameArea.style.display = 'block';
        timer = 15;
        timerDisplay.textContent = timer;
        countdownInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timer--;
        timerDisplay.textContent = timer;
        if (timer === 0) {
            clearInterval(countdownInterval);
            recipeInfo.style.display = 'none';
            showIngredientButtons();
        }
    }

    function showIngredientButtons() {
        ingredientButtons.innerHTML = '';
        const allIngredients = [...currentRecipe.ingredients, ...recipes.flatMap(recipe => recipe.ingredients)];
        const uniqueIngredients = Array.from(new Set(allIngredients.map(ing => `${ing.quantity} ${ing.name}`))).map(ing => {
            const [quantity, ...nameParts] = ing.split(' ');
            return { name: nameParts.join(' '), quantity };
        });
        uniqueIngredients.forEach(ing => {
            const button = document.createElement('button');
            button.textContent = `${ing.quantity} ${ing.name}`;
            button.addEventListener('click', () => {
                if (!button.classList.contains('selected')) {
                    button.classList.add('selected');
                } else {
                    button.classList.remove('selected');
                }
            });
            ingredientButtons.appendChild(button);
        });
        doneButton.style.display = 'inline-block';
        timer = 60;
        timerDisplay.textContent = timer;
        countdownInterval = setInterval(updateSelectionTimer, 1000);
    }

    function updateSelectionTimer() {
        timer--;
        timerDisplay.textContent = timer;
        if (timer === 0) {
            clearInterval(countdownInterval);
            doneButton.click();
        }
    }

    function checkAnswers() {
        clearInterval(countdownInterval);
        const selectedButtons = document.querySelectorAll('#ingredientButtons button.selected');
        const selectedIngredients = Array.from(selectedButtons).map(button => button.textContent);
        const correctIngredients = currentRecipe.ingredients.map(ing => `${ing.quantity} ${ing.name}`);
        selectedButtons.forEach(button => {
            if (correctIngredients.includes(button.textContent)) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        });
        doneButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
    }

    function restartGame() {
        gameActive = false;
        gameArea.style.display = 'none';
        recipeInfo.style.display = 'block';
        playButton.style.display = 'inline-block';
        restartButton.style.display = 'none';
        recipeInfo.innerHTML = '';
        recipeImage.src = '';
        ingredientButtons.innerHTML = '';
        timerDisplay.textContent = '';
    }
});
