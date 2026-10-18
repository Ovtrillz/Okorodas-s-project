
const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const moonIcon = document.querySelector('.moon-icon');

function updateThemeButton(isDarkMode) {
    if (isDarkMode) {
        themeLabel.textContent = 'LIGHT';
        moonIcon.textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeLabel.textContent = 'DARK';
        moonIcon.textContent = '🌙';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }

    themeToggle.setAttribute('aria-pressed', isDarkMode);
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDarkMode = document.body.classList.contains('dark-mode');

    updateThemeButton(isDarkMode);
});

// Set the correct label and icon when the page loads
updateThemeButton(document.body.classList.contains('dark-mode'));


/* =========================
   PLANET DATA AND SEARCH
========================= */

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#planet-search');

const planetCard = document.querySelector('.planet-card');
const searchError = document.querySelector('#search-error');
const noResultsPanel = document.querySelector('.no-results');


let planets = [];

// Load the planet data from planets.json
async function loadPlanets() {
    try {
        const response = await fetch('planets.json');

        if (!response.ok) {
            throw new Error('Could not load planet data.');
        }

        planets = await response.json();

        // Display Earth when the page first loads
       
function displayPlanet(planetName) {
    const planet = planets.find(
        item => item.name.toLowerCase() === planetName.trim().toLowerCase()
    );

    // Show the inline error if no planet matches
    if (!planet) {
        searchError.hidden = false;
        planetCard.hidden = true;
        noResultsPanel.hidden = false;
        searchInput.setAttribute('aria-invalid', 'true');
        return;
    }

    // Hide errors and restore the planet card
    searchError.hidden = true;
    planetCard.hidden = false;
    noResultsPanel.hidden = true;
    searchInput.removeAttribute('aria-invalid');

    // Update the planet image
    const planetImage = document.querySelector('.planet-image img');
    planetImage.src = planet.image;
    planetImage.alt = planet.name;

    // Update the planet name, type and description
    document.querySelector('#planet-name').textContent = planet.name;
    document.querySelector('.planet-type').textContent = planet.type;
    document.querySelector('.planet-description').textContent =
        planet.description;

    // Update Gravity, Mass and Period
    const statistics = document.querySelectorAll('.planet-statistics > div');

    statistics.forEach(stat => {
        const label = stat.querySelector('dt')?.textContent
            .trim()
            .toLowerCase();

        const value = stat.querySelector('dd');

        if (!label || !value) return;

        if (label.includes('gravity')) {
            value.textContent = planet.gravity;
        } else if (label.includes('mass')) {
            value.textContent = planet.mass;
        } else if (label.includes('period')) {
            value.textContent = planet.period;
        }
    });

    // Update temperature, moons, diameter and distance from the Sun
    const factValues = document.querySelectorAll('.planet-facts li span');

    const values = [
        planet.temperature,
        planet.moons,
        planet.diameter,
        planet.distanceFromSun
    ];

    factValues.forEach((element, index) => {
        if (values[index] !== undefined) {
            element.textContent = values[index];
        }
    });

    // Clear the search field after a successful search
    searchInput.value = '';
}


    } catch (error) {
        console.error('Error loading planets:', error);
    }
}

// Update the existing planet card
function displayPlanet(planetName) {
    const planet = planets.find(
        item => item.name.toLowerCase() === planetName.trim().toLowerCase()
    );

    if (!planet) {
        alert('Planet not found. Please check the name and try again.');
        return;
    }

    // Update the planet image
    const planetImage = document.querySelector('.planet-image img');
    planetImage.src = planet.image;
    planetImage.alt = planet.name;

    // Update the planet name, type and description
    document.querySelector('#planet-name').textContent = planet.name;
    document.querySelector('.planet-type').textContent = planet.type;
    document.querySelector('.planet-description').textContent =
        planet.description;

    // Update Gravity, Mass and Period using their existing labels
    const statistics = document.querySelectorAll('.planet-statistics > div');

    statistics.forEach(stat => {
        const label = stat.querySelector('dt')?.textContent
            .trim()
            .toLowerCase();

        const value = stat.querySelector('dd');

        if (!label || !value) return;

        if (label.includes('gravity')) {
            value.textContent = planet.gravity;
        } else if (label.includes('mass')) {
            value.textContent = planet.mass;
        } else if (label.includes('period')) {
            value.textContent = planet.period;
        }
    });

    // Update the four additional facts:
    // Temperature, moons, diameter and distance from the Sun
    const factValues = document.querySelectorAll('.planet-facts li span');

    const values = [
        planet.temperature,
        planet.moons,
        planet.diameter,
        planet.distanceFromSun
    ];

    factValues.forEach((element, index) => {
        if (values[index] !== undefined) {
            element.textContent = values[index];
        }
    });

    // Clear the search field after a successful search
    searchInput.value = '';
}

// Handle searches using the existing search form

searchForm.addEventListener('submit', event => {
    event.preventDefault();

    const planetName = searchInput.value.trim();

    if (!planetName) {
        searchError.hidden = true;
        searchInput.focus();
        return;
    }

    displayPlanet(planetName);
});

// Clear the error message while the user edits the search
searchInput.addEventListener('input', () => {
    searchError.hidden = true;
    searchInput.removeAttribute('aria-invalid');
});


// Start loading the planet data
loadPlanets();
