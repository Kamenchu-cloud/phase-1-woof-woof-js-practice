document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const goodDogFilterButton = document.getElementById('good-dog-filter');
  
    let allDogsData;
    let showGoodDogsOnly = false; 
  
    // Step 2: Fetch and display all pups in the dog bar
    function fetchDogs() {
      fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(data => {
          allDogsData = data;
          displayDogs();
        });
    }
  
    // Helper function to display dogs in the dog bar
    function displayDogs() {
    
      // Filter dogs based on the filter status
      const dogsToDisplay = showGoodDogsOnly
        ? allDogsData.filter(dog => dog.isGoodDog)
        : allDogsData;
  
      // Create and append span elements for each dog
      dogsToDisplay.forEach(dog => {
        const span = document.createElement('span');
        span.innerText = dog.name;
  
        // Add click event to show more info about the dog
        span.addEventListener('click', () => displayDogInfo(dog));
  
        dogBar.appendChild(span);
      });
    }
  
    // Step 3: Show more info about each pup
    function displayDogInfo(dog) {
      dogInfo.innerHTML = `
        <img src="${dog.image}" />
        <h2>${dog.name}</h2>
        <button id="toggle-good-dog">${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
      `;
  
      // Add click event to toggle good/bad dog 
      const toggleButton = document.getElementById('toggle-good-dog');
      toggleButton.addEventListener('click', () => toggleGoodDogStatus(dog));
    }
  
    // Step 4
    function toggleGoodDogStatus(dog) {
      const updatedStatus = !dog.isGoodDog;
      fetch(`http://localhost:3000/pups/${dog.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isGoodDog: updatedStatus }),
      })
        .then(response => response.json())
        .then(updatedDog => {
          // Update the local data and re-display dogs
          allDogsData = allDogsData.map(d => (d.id === updatedDog.id ? updatedDog : d));
          displayDogs();
        });
    }
  
    // Bonus: Step 5 
    goodDogFilterButton.addEventListener('click', () => {
      showGoodDogsOnly = !showGoodDogsOnly;
      goodDogFilterButton.innerText = `Filter good dogs: ${showGoodDogsOnly ? 'ON' : 'OFF'}`;
      displayDogs();
    });
  
    // Initial fetch and display
    fetchDogs();
  });
  