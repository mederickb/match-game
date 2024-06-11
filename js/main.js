document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    const gameArea = document.getElementById('gameArea');
    const recipeImage = document.getElementById('recipeImage');
    const recipeInfo = document.getElementById('recipeInfo');
    const timerDisplay = document.getElementById('timer');
    const ingredientButtons = document.getElementById('ingredientButtons');
    const doneButton = document.getElementById('doneButton');
    const restartButton = document.getElementById('restartButton');

    let recipes, randomIngredients, currentRecipe, timer, countdownInterval, gameActive = false;

    fetch('js/game.json')
        .then(response => response.json())
        .then(data => {
            recipes = data.recipes;
            randomIngredients = data.randomIngredients;
            scoreTitles = data.scoreTitles; 
        });

    playButton.addEventListener('click', startGame);
    doneButton.addEventListener('click', checkAnswers);
    restartButton.addEventListener('click', restartGame);

    function startGame() {
        gameActive = true;
        currentRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        recipeTitle.textContent = currentRecipe.name;
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
        const randomOtherIngredients = shuffleArray(randomIngredients).slice(0, Math.min(20 - currentIngredients.length, randomIngredients.length)); // select up to 20 other random ingredients
        const allIngredients = [...currentIngredients, ...randomOtherIngredients.map(ing => `${ing.quantity} ${ing.name}`)]; // combine current recipe ingredients with random other ingredients

        const shuffledIngredients = shuffleArray(allIngredients); // shuffle combined list

        shuffledIngredients.forEach(ing => {
            const button = document.createElement('button');
            button.textContent = ing;
            button.addEventListener('click', () => {
                if (!button.classList.contains('selected')) {
                    button.classList.add('selected');
                    button.style.backgroundColor = 'lightblue'; // change background color when clicked
                } else {
                    button.classList.remove('selected');
                    button.style.backgroundColor = ''; // reset background color when unclicked
                }
            });
            ingredientButtons.appendChild(button);
        });

        doneButton.style.display = 'inline-block';
        timer = 60;
        timerDisplay.textContent = timer;
        countdownInterval = setInterval(updateSelectionTimer, 1000);
    }

        // random shuffle of ingredients 
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
            checkAnswers(); // Call checkAnswers function when time runs out
            return;
        }
        timerDisplay.textContent = timer;
    }

    function checkAnswers() {
        clearInterval(countdownInterval);
        const selectedButtons = document.querySelectorAll('#ingredientButtons button.selected');
        const selectedIngredients = Array.from(selectedButtons).map(button => button.textContent);
        const correctIngredients = currentRecipe.ingredients.map(ing => `${ing.quantity} ${ing.name}`);
        
        // get number of correct ingredients selected
        let correctIngredientsSelected = 0;
        selectedButtons.forEach(button => {
            if (correctIngredients.includes(button.textContent)) {
                correctIngredientsSelected++;
            }
        });
    
        
        const totalIngredientsInRecipe = correctIngredients.length; // get total ingredients in the recipe
        const totalIngredientsSelected = selectedButtons.length; // get total ingredients selected (correct + incorrect)
        const totalIncorrectIngredientsSelected = totalIngredientsSelected - correctIngredientsSelected; // get total ingredients selected not in the recipe
    
        
        const scorePercentage = Math.floor((correctIngredientsSelected / (totalIngredientsInRecipe + totalIncorrectIngredientsSelected)) * 100); // Calculate the score percentage
    
        // Get the corresponding title from the scoreTitles array
        let scoreTitle = '';
        for (const title of scoreTitles) {
            const range = title.range.split('-');
            if (range.length === 1 && scorePercentage == range[0]) {
                scoreTitle = title.title;
                break;
            } else if (range.length === 2 && scorePercentage >= range[0] && scorePercentage <= range[1]) {
                scoreTitle = title.title;
                break;
            }
        }



        
        timerDisplay.innerHTML = 'Score: ' + scorePercentage + '%' + '<br>' + 'Cooking Level: "' + scoreTitle + '"'; // Display the score in place of timer
        
        
        const allButtons = document.querySelectorAll('#ingredientButtons button'); // Highlight correct and incorrect selections
    
        allButtons.forEach(button => {
            const ingredientText = button.textContent;
            const isCorrectIngredient = correctIngredients.includes(ingredientText);
            const isSelected = selectedIngredients.includes(ingredientText);
    
                // format button bacground according to guess
            if (isCorrectIngredient) {
                if (isSelected) {
                    button.classList.add('correct');
                    button.style.backgroundColor = 'lightgreen'; 
                } else {
                    button.classList.add('incorrect');
                    button.style.backgroundColor = 'lightcoral';
                }
            } else {
                if (isSelected) {
                    button.classList.add('incorrect');
                    button.style.backgroundColor = 'lightcoral'; 
                }
            }
        });
    
        doneButton.style.display = 'none';
        restartButton.style.display = 'inline-block';

        recipeInfo.style.display = 'block'; // display ingredient list back
        document.getElementById('timerHeader').style.display = 'none'; // hide timer title
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
        document.getElementById('timerHeader').style.display = 'block'; 
    }
});
