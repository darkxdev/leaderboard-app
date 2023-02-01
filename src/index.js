const scoresList = document.querySelector('#scores-list');
const refreshButton = document.querySelector('#scores-header button');
const submitForm = document.querySelector('#scores-form form');

// Base URL for the API
const baseURL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api';

// Function to create a new game
const createGame = async () => {
  // POST request to the API to create a new game
  const response = await fetch(`${baseURL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'New Game' }),
  });

  // Parse the response to JSON format
  const data = await response.json();

  // Get the game ID from the response
  const gameID = data.result.split(' ').pop().slice(0, -1);

  // Return the game ID
  return gameID;
};

// Function to refresh the scores list
const refreshScores = async (gameID) => {
  // GET request to the API to get the scores for the given game
  const response = await fetch(`${baseURL}/games/${gameID}/scores`);

  // Parse the response to JSON format
  const data = await response.json();

  // Clear the scores list
  scoresList.innerHTML = '';

  // Loop through the scores and add them to the scores list
  data.result.forEach((score) => {
    const scoreItem = document.createElement('li');
    scoreItem.innerHTML = `${score.user}: ${score.score}`;
    scoresList.appendChild(scoreItem);
  });
};

// Function to submit a score
const submitScore = async (gameID, user, score) => {
  // POST request to the API to create a new score for the given game
  await fetch(`${baseURL}/games/${gameID}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, score: Number(score) }),
  });
};

// Event listener for the refresh button
refreshButton.addEventListener('click', async () => {
  // Create a new game if there's no game ID saved
  if (!localStorage.getItem('gameID')) {
    const gameID = await createGame();
    localStorage.setItem('gameID', gameID);
  }

  // Refresh the scores list
  refreshScores(localStorage.getItem('gameID'));
});

// Event listener for the submit form
submitForm.addEventListener('submit', async (event) => {
  // Prevent the default form behavior
  event.preventDefault();

  // Get the user name and score from the form
  const user = document.querySelector('#form-name').value;
  const score = document.querySelector('#form-score').value;

  // Create a new game if there's no game ID saved
  if (!localStorage.getItem('gameID')) {
    const gameID = await createGame();
    localStorage.setItem('gameID', gameID);
  }

  // Submit the score
  submitScore(localStorage.getItem('gameID'), user, score);

  // Clear the form
  submitForm.reset();
});