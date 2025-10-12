const askBtn = document.getElementById('askBtn');
const questionInput = document.getElementById('questionInput');
const answerArea = document.getElementById('answerArea');

const plantAnswers = {
    "how to water": "Water your plant when the top inch of soil feels dry.",
    "how much sunlight": "Most plants need at least 6 hours of sunlight per day.",
    "best fertilizer": "Use a balanced fertilizer (N-P-K 10-10-10) for most garden plants.",
    "why leaves yellow": "Yellow leaves may indicate overwatering, underwatering, or nutrient deficiency.",
    "how to remove pests": "Inspect leaves and use natural remedies like neem oil or soapy water."
};

askBtn.addEventListener('click', () => {
    const question = questionInput.value.toLowerCase();
    let found = false;
    for (const key in plantAnswers) {
        if (question.includes(key)) {
            answerArea.textContent = plantAnswers[key];
            found = true;
            break;
        }
    }
    if (!found) {
        answerArea.textContent = "Sorry, I don't have an answer for that. Try asking about watering, sunlight, fertilizer, yellow leaves, or pests!";
    }
});
// Basic pet state
let petStage = 0; // 0: seed, 1: seedling, 2: sprout, 3: flower, 4: fruit
let growthPoints = 0;
const growthThresholds = [3, 8, 15, 25]; // Points needed for each stage
const petImg = document.getElementById('pet');
const statusDiv = document.getElementById('status');
const weatherTypes = [
    { name: "Sunny", icon: "sunny.png", bg: "#ffe066" },
    { name: "Rainy", icon: "rainy.png", bg: "#b3e0ff" },
    { name: "Cloudy", icon: "cloudy.png", bg: "#d3d3d3" }
];
let currentWeather = 0; // 0: Sunny, 1: Rainy, 2: Cloudy
const funFacts = [
    "Did you know? Plants convert sunlight into energy through photosynthesis!",
    "Some plants can live for hundreds of years.",
    "Rain helps plants absorb nutrients from the soil.",
    "Flowers attract pollinators like bees and butterflies.",
    "Plants release oxygen, which we need to breathe!"
];

function showRandomFact() {
    const factText = document.getElementById('factText');
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    factText.textContent = funFacts[randomIndex];
}

document.getElementById('changeWeatherBtn').onclick = function() {
    currentWeather = (currentWeather + 1) % weatherTypes.length;
    updateWeather();
    showRandomFact();
    growthPoints++;
    tryGrowPet();
    updateProgress();
};

function updateWeather() {
    const weather = weatherTypes[currentWeather];
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.style.opacity = 0;
    setTimeout(() => {
        weatherIcon.src = weather.icon;
        weatherIcon.style.opacity = 1;
    }, 400);
    document.getElementById('weatherText').textContent = weather.name;
    document.body.style.background = weather.bg;
}

function updatePet() {
    petImg.classList.remove('grow');
    void petImg.offsetWidth;
    petImg.classList.add('grow');

    if (petStage === 0) {
        petImg.src = "seed.png";
        statusDiv.textContent = "Status: Waiting to sprout 🌰";
    } else if (petStage === 1) {
        petImg.src = "seedling.png.jpg";
        statusDiv.textContent = "Status: Happy Seedling 🌱";
    } else if (petStage === 2) {
        petImg.src = "sprout.png.webp";
        statusDiv.textContent = "Status: Growing Sprout 🌿";
    } else if (petStage === 3) {
        petImg.src = "flower.png.webp";
        statusDiv.textContent = "Status: Beautiful Flower 🌸";
    } else {
        petImg.src = "fruit.png";
        statusDiv.textContent = "Status: Fruiting! 🍎";
    }
    updateProgress();
}

function tryGrowPet() {
    if (petStage < growthThresholds.length && growthPoints >= growthThresholds[petStage]) {
        petStage++;
        updatePet();
    }
}

function updateProgress() {
    let nextThreshold = growthThresholds[petStage] || growthThresholds[growthThresholds.length - 1];
    let progressElem = document.getElementById('progressValue');
    if (progressElem) {
        progressElem.textContent = `${growthPoints} / ${nextThreshold}`;
    }
}

document.getElementById('waterBtn').onclick = function() {
    growthPoints++;
    tryGrowPet();
    updateProgress();
    showRandomFact();
};

document.getElementById('fertilizeBtn').onclick = function() {
    growthPoints++;
    tryGrowPet();
    updateProgress();
    showRandomFact();
};

document.getElementById('pestBtn').onclick = function() {
    growthPoints++;
    statusDiv.textContent = "Status: No pests!";
    tryGrowPet();
    updateProgress();
    showRandomFact();
};

// Initialize display
updateWeather();
updatePet();
updateProgress();