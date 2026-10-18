
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

// Load planet data from planets.json
async function loadPlanets() {
    try {
        const response = await fetch('./planets.json');

        if (!response.ok) {
            throw new Error(
                `Could not load planets.json: ${response.status}`
            );
        }

        planets = await response.json();

        if (!Array.isArray(planets)) {
            throw new Error('Planet data must be a JSON array.');
        }

        // Hide error messages when the page first loads
        if (searchError) searchError.hidden = true;
        if (noResultsPanel) noResultsPanel.hidden = true;

        // Display Earth by default
        displayPlanet('Earth');

    } catch (error) {
        console.error('Error loading planets:', error);

        if (noResultsPanel) {
            noResultsPanel.hidden = false;
            noResultsPanel.textContent =
                'Unable to load planet data. Please refresh the page.';
        }
    }
}


// Display the selected planet
function displayPlanet(planetName) {
    const planet = planets.find(
        item =>
            typeof item.name === 'string' &&
            item.name.toLowerCase() === planetName.trim().toLowerCase()
    );

    // If the planet doesn't exist, show the error
    if (!planet) {
        if (searchError) searchError.hidden = false;
        if (noResultsPanel) noResultsPanel.hidden = false;
        if (planetCard) planetCard.hidden = true;

        searchInput.setAttribute('aria-invalid', 'true');
        return;
    }

    // A matching planet was found: hide errors
    if (searchError) searchError.hidden = true;
    if (noResultsPanel) noResultsPanel.hidden = true;
    if (planetCard) planetCard.hidden = false;

    searchInput.removeAttribute('aria-invalid');

    // Update planet image
    const planetImage = document.querySelector('.planet-image img');

    if (planetImage) {
        planetImage.src = planet.image;
        planetImage.alt = planet.name;
    }

    // Update planet name, type and description
    const nameElement = document.querySelector('#planet-name');
    const typeElement = document.querySelector('.planet-type');
    const descriptionElement =
        document.querySelector('.planet-description');

    if (nameElement) nameElement.textContent = planet.name;
    if (typeElement) typeElement.textContent = planet.type;
    if (descriptionElement) {
        descriptionElement.textContent = planet.description;
    }

    // Update Gravity, Mass and Period
    const statistics = document.querySelectorAll(
        '.planet-statistics > div'
    );

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
    const factValues = document.querySelectorAll(
        '.planet-facts li span'
    );

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

    // Clear the input after a successful search
    searchInput.value = '';
}


// Handle search form submissions
if (searchForm && searchInput) {
    searchForm.addEventListener('submit', event => {
        event.preventDefault();

        const planetName = searchInput.value.trim();

        if (!planetName) {
            searchInput.focus();
            return;
        }

        displayPlanet(planetName);
    });

    // Hide the small error while the user types
    searchInput.addEventListener('input', () => {
        if (searchError) searchError.hidden = true;
        searchInput.removeAttribute('aria-invalid');
    });
}


// Start loading the planet data
loadPlanets();

