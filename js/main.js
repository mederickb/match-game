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

    const currentIngredients = currentRecipe.ingredients.map(ing => `${ing.quantity} ${ing.name}`);
    
    const allOtherIngredients = recipes.flatMap(recipe => recipe.ingredients); // get ingredients from other recipes
    const otherIngredients = allOtherIngredients.filter(ing => !currentIngredients.includes(`${ing.quantity} ${ing.name}`)); // filter out ingredients that are not already in the current recipe
    const randomOtherIngredients = shuffleArray(otherIngredients).slice(0, Math.min(20 - currentIngredients.length, otherIngredients.length));  // select up to 20 other random ingredients
    const allIngredients = [...currentIngredients, ...randomOtherIngredients.map(ing => `${ing.quantity} ${ing.name}`)]; // Combine current recipe ingredients with random other ingredients

    
    const shuffledIngredients = shuffleArray(allIngredients); // shuffle combined list

    shuffledIngredients.forEach(ing => {
        const button = document.createElement('button');
        button.textContent = ing;
        button.addEventListener('click', () => {
            if (!button.classList.contains('selected')) {
                button.classList.add('selected');
                button.style.backgroundColor = 'lightblue'; // Change background color when clicked
            } else {
                button.classList.remove('selected');
                button.style.backgroundColor = ''; // Reset background color when unclicked
            }
        });
        ingredientButtons.appendChild(button);
    });

    doneButton.style.display = 'inline-block';
    timer = 60;
    timerDisplay.textContent = timer;
    countdownInterval = setInterval(updateSelectionTimer, 1000);
}
    
        // random shuffle of ingrdients 
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
                button.style.backgroundColor = 'lightgreen'; // Change background color to green for correct guesses
            } else {
                button.classList.add('incorrect');
                button.style.backgroundColor = 'lightcoral'; // Change background color to red for incorrect guesses
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
