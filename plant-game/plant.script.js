// DOM Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-button');
const suggestionChips = document.querySelectorAll('.suggestion-chip');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const startChatButton = document.getElementById('start-chat');

// Geolocation variables
let userLocation = {
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    hemisphere: null,
    climateZone: null,
    currentSeason: null
};

// Agricultural Knowledge Base
const knowledgeBase = {
    crops: {
        vegetables: [
            {
                name: "Tomatoes",
                info: "Tomatoes need full sun and well-draining soil. Plant after the last frost and provide support as they grow. Water consistently and fertilize every 2-3 weeks.",
                planting: "Plant tomato seedlings 18-24 inches apart after the last frost date.",
                care: "Provide support with stakes or cages. Water at the base to prevent leaf diseases.",
                harvest: "Harvest when fruits are firm and fully colored, typically 60-85 days after planting."
            },
            {
                name: "Lettuce",
                info: "Lettuce is a cool-season crop that grows best in spring and fall. It prefers partial shade in warmer climates and requires consistent moisture.",
                planting: "Sow seeds 1/4 inch deep, 1 inch apart, in rows 12-18 inches apart. Can be planted as soon as soil can be worked.",
                care: "Keep soil consistently moist. Mulch to retain moisture and suppress weeds.",
                harvest: "Harvest outer leaves as needed or cut the entire plant at the base."
            },
            {
                name: "Carrots",
                info: "Carrots prefer loose, sandy soil free of rocks. They're a cool-season crop that can be planted in early spring and fall.",
                planting: "Sow seeds 1/4 inch deep, 1 inch apart, in rows 12-18 inches apart. Thin to 2-3 inches apart when seedlings are 2 inches tall.",
                care: "Keep soil consistently moist. Mulch to retain moisture and suppress weeds.",
                harvest: "Harvest when roots reach desired size, typically 60-80 days after planting."
            },
            {
                name: "Bell Peppers",
                info: "Bell peppers need full sun and warm temperatures. They grow best in well-draining soil with consistent moisture.",
                planting: "Plant seedlings 18-24 inches apart after the last frost date when soil has warmed.",
                care: "Water consistently and fertilize every 2-3 weeks. Support may be needed for heavy fruit loads.",
                harvest: "Harvest when peppers reach full size and desired color, typically 60-90 days after planting."
            },
            {
                name: "Cucumbers",
                info: "Cucumbers are warm-season crops that need full sun and consistent moisture. They can be grown on the ground or on trellises to save space.",
                planting: "Plant seeds 1 inch deep, 6-8 inches apart, after the last frost when soil has warmed. Provide trellis for vining varieties.",
                care: "Water deeply and regularly. Mulch to retain moisture and suppress weeds.",
                harvest: "Harvest when cucumbers reach desired size, typically 50-70 days after planting."
            }
        ],
        fruits: [
            {
                name: "Strawberries",
                info: "Strawberries are bright red, juicy, and sweet fruits. Origin: Europe. Nutrition: Rich in antioxidants and vitamin C. Growing tip: Strawberries prefer slightly acidic soil and benefit from mulching to retain moisture. They need full sun and well-draining soil rich in organic matter. Can be grown in beds, containers, or hanging baskets.",
                planting: "Plant in early spring, spacing plants 12-18 inches apart with crowns at soil level.",
                care: "Remove runners unless you want the plants to spread. Mulch to retain moisture and keep fruits clean.",
                harvest: "Harvest when fruits are fully red, typically in late spring to early summer."
            },
            {
                name: "Blueberries",
                info: "Blueberries are small, round, blue-purple berries. Origin: North America. Nutrition: High in antioxidants, vitamin C, and fiber. Growing tip: Blueberries need acidic soil (pH 4.5-5.5), full sun, and consistent moisture. They're perennial shrubs that can produce for many years.",
                planting: "Plant in early spring or fall, spacing plants 4-5 feet apart. Amend soil with peat moss to increase acidity if needed.",
                care: "Mulch with pine needles or acidic mulch. Water deeply and regularly, especially during fruit development.",
                harvest: "Harvest when berries turn completely blue and detach easily from the stem, typically in summer."
            },
            {
                name: "Apples",
                info: "Apples are sweet, edible fruits produced by an apple tree. Origin: Central Asia. Nutrition: Rich in fiber and vitamin C. Growing tip: Apples prefer well-drained soil and full sun. Most varieties require cross-pollination from another apple variety to produce fruit.",
                planting: "Plant bare-root trees in early spring or container-grown trees anytime during the growing season. Space standard trees 20-30 feet apart.",
                care: "Prune annually in late winter. Thin fruits to improve size and quality. Protect from pests with appropriate measures.",
                harvest: "Harvest when fruits are firm and fully colored, typically in late summer to fall depending on variety."
            }
        ],
        grains: [
            {
                name: "Corn",
                info: "Corn is a cereal plant that yields large grains, or kernels, set in rows on a cob. Origin: Central America. Nutrition: Good source of fiber, vitamins B and C. Growing tip: Corn needs full sun and should be planted in blocks for better pollination. Needs fertile, well-draining soil and consistent moisture.",
                planting: "Plant seeds 1-2 inches deep, 4-6 inches apart, in blocks of at least 4 rows for better pollination. Plant after the last frost when soil has warmed.",
                care: "Water deeply and regularly, especially during tasseling and ear development. Side-dress with nitrogen fertilizer when plants are knee-high.",
                harvest: "Harvest sweet corn when kernels are plump and milky, typically 18-24 days after silks appear."
            },
            {
                name: "Wheat",
                info: "Wheat is a cereal grain, a staple food worldwide. Origin: Fertile Crescent. Nutrition: Provides carbohydrates, protein, and some B vitamins. Growing tip: Wheat grows best in temperate climates with moderate rainfall. It is a cool-season grain that can be planted in fall (winter wheat) or spring (spring wheat). Needs full sun and moderate fertility.",
                planting: "Broadcast seeds at a rate of 3-4 pounds per 1,000 square feet. Rake lightly to cover seeds with 1/2 inch of soil.",
                care: "Water during dry periods. Control weeds in early stages of growth.",
                harvest: "Harvest when grain heads turn golden and kernels are hard, typically in early to midsummer for winter wheat."
            }
        ]
    },
    soil: {
        preparation: "Prepare soil by removing weeds and debris, then loosening it to a depth of 8-12 inches. Incorporate 2-3 inches of compost or other organic matter to improve fertility and structure.",
        testing: "Test soil pH and nutrient levels every 2-3 years. Most vegetables prefer a pH of 6.0-7.0. Adjust pH with lime to raise it or sulfur to lower it.",
        types: [
            {
                name: "Sandy Soil",
                characteristics: "Light, warm, dry, and tends to be acidic. Drains quickly but doesn't retain nutrients well.",
                improvement: "Add organic matter like compost, manure, or leaf mold to improve water and nutrient retention.",
                suitable_crops: "Carrots, radishes, potatoes, lettuce"
            },
            {
                name: "Clay Soil",
                characteristics: "Heavy, cold, wet, and nutrient-rich. Drains poorly and can be difficult to work with.",
                improvement: "Add organic matter and coarse sand to improve drainage and structure. Avoid working when wet.",
                suitable_crops: "Beans, brassicas, peas, squash"
            },
            {
                name: "Loam Soil",
                characteristics: "Ideal garden soil with balanced proportions of sand, silt, and clay. Good drainage and nutrient retention.",
                improvement: "Maintain with regular additions of organic matter.",
                suitable_crops: "Most crops thrive in loam soil"
            },
            {
                name: "Silt Soil",
                characteristics: "Fertile, light, and moisture-retentive. Can form a crust when dry and become compacted easily.",
                improvement: "Add organic matter to improve structure and drainage. Avoid walking on soil when wet.",
                suitable_crops: "Most vegetables, especially root crops"
            },
            {
                name: "Peat Soil",
                characteristics: "High organic content, moisture-retentive, and acidic. Warms slowly in spring.",
                improvement: "Add lime to reduce acidity if needed. Add sand or grit to improve drainage.",
                suitable_crops: "Acid-loving plants like blueberries, as well as moisture-loving vegetables"
            },
            {
                name: "Chalky Soil",
                characteristics: "Alkaline, stony, and free-draining. Often shallow and can cause nutrient deficiencies.",
                improvement: "Add organic matter to improve water retention and nutrient content. Use acidifying fertilizers for acid-loving plants.",
                suitable_crops: "Spinach, beets, sweet corn"
            }
        ],
        composting: "Create compost by layering green materials (nitrogen-rich, like grass clippings and kitchen scraps) with brown materials (carbon-rich, like dried leaves and straw). Turn pile regularly and keep moderately moist. Compost is ready when it's dark, crumbly, and earthy-smelling."
    },
    pests: {
        common: [
            {
                name: "Aphids",
                description: "Small, soft-bodied insects that cluster on new growth and undersides of leaves. They suck plant sap, causing distorted growth and yellowing leaves.",
                control: "Spray with strong water jet to dislodge. Introduce beneficial insects like ladybugs. Use insecticidal soap or neem oil for severe infestations."
            },
            {
                name: "Tomato Hornworms",
                description: "Large green caterpillars with white stripes and a horn-like projection. They defoliate tomato plants and can damage fruits.",
                control: "Handpick and destroy. Look for droppings on leaves to locate them. Encourage beneficial wasps that parasitize hornworms."
            },
            {
                name: "Cucumber Beetles",
                description: "Yellow-green beetles with black stripes or spots. They feed on leaves and can transmit bacterial wilt disease.",
                control: "Use row covers until flowering. Apply organic insecticides if necessary. Practice crop rotation."
            },
            {
                name: "Squash Bugs",
                description: "Gray-brown, flat-backed bugs that suck plant sap, causing wilting and yellow spots. Eggs are laid in neat rows on undersides of leaves.",
                control: "Handpick and destroy bugs and egg masses. Use row covers early in the season. Keep garden clean of debris."
            },
            {
                name: "Cabbage Worms",
                description: "Velvety green caterpillars that chew holes in leaves of cabbage family plants. They're the larvae of white butterflies.",
                control: "Handpick and destroy. Use Bacillus thuringiensis (Bt), a biological control. Cover plants with floating row covers."
            }
        ],
        diseases: [
            {
                name: "Powdery Mildew",
                description: "White, powdery fungal growth on leaf surfaces. Causes yellowing and distortion of leaves and reduced plant vigor.",
                control: "Provide good air circulation. Avoid overhead watering. Apply fungicides like neem oil or potassium bicarbonate at first sign of disease."
            },
            {
                name: "Blight",
                description: "Fungal disease causing dark spots on leaves that spread rapidly. Can affect tomatoes, potatoes, and other plants.",
                control: "Remove and destroy infected plants. Rotate crops. Use copper-based fungicides preventatively in wet conditions."
            },
            {
                name: "Damping Off",
                description: "Fungal disease that causes seedlings to collapse and die. Often occurs in cool, wet conditions with poor air circulation.",
                control: "Use sterile seed-starting mix. Avoid overwatering. Ensure good air circulation. Apply hydrogen peroxide solution to affected areas."
            },
            {
                name: "Mosaic Virus",
                description: "Viral disease causing mottled, distorted leaves with yellow and green patterns. Spread by aphids and other insects.",
                control: "Remove and destroy infected plants. Control insect vectors. Wash hands and tools after handling infected plants. Use resistant varieties."
            }
        ],
        organic_control: "Organic pest control methods include crop rotation, companion planting, physical barriers like row covers, introducing beneficial insects, and using organic sprays like neem oil, insecticidal soap, and Bacillus thuringiensis (Bt)."
    },
    water: {
        irrigation: [
            {
                method: "Drip Irrigation",
                description: "Delivers water directly to plant roots through tubes with small holes or emitters. Highly efficient and reduces disease by keeping foliage dry.",
                best_for: "Most garden plants, especially in dry climates or where water conservation is important."
            },
            {
                method: "Soaker Hoses",
                description: "Porous hoses that seep water along their length. Similar benefits to drip irrigation but simpler to set up.",
                best_for: "Row crops, flower beds, and areas with closely spaced plants."
            },
            {
                method: "Sprinklers",
                description: "Spray water over plants, simulating rainfall. Less efficient than drip methods and can promote leaf diseases.",
                best_for: "Lawns, large areas, and newly seeded beds that need gentle, even moisture."
            },
            {
                method: "Hand Watering",
                description: "Using a watering can or hose to apply water directly to plants. Time-consuming but allows precise control.",
                best_for: "Container plants, newly transplanted seedlings, and small gardens."
            },
            {
                method: "Self-Watering Containers",
                description: "Containers with a reservoir that supplies water to plants as needed through capillary action.",
                best_for: "Container gardening, especially for gardeners who can't water frequently."
            }
        ],
        conservation: "Conserve water by mulching soil, grouping plants with similar water needs, watering deeply but infrequently to encourage deep root growth, and collecting rainwater in barrels for garden use.",
        signs_of_water_stress: "Signs of underwatering include wilting, dry soil, brown leaf edges, and slow growth. Signs of overwatering include yellowing leaves, soft stems, mold on soil surface, and root rot."
    },
    organic: {
        principles: "Organic farming avoids synthetic fertilizers, pesticides, and GMOs. It focuses on building healthy soil through composting, crop rotation, and natural pest management to produce nutritious food while protecting the environment.",
        certification: "Organic certification requires following specific standards for at least three years. Certification bodies vary by country but generally prohibit synthetic chemicals and require detailed record-keeping.",
        soil_management: "Build healthy soil by adding compost, practicing crop rotation, planting cover crops, and minimizing tillage. Healthy soil supports beneficial organisms and provides balanced nutrition to plants.",
        pest_management: "Manage pests organically through prevention (healthy soil, resistant varieties, crop rotation), physical controls (row covers, traps), biological controls (beneficial insects), and approved organic sprays as a last resort.",
        benefits: "Benefits of organic farming include improved soil health, reduced pollution, increased biodiversity, lower energy use, and potentially more nutritious food with fewer pesticide residues."
    },
    urban: {
        container_gardening: "Grow plants in containers when space is limited. Use pots at least 12 inches deep for most vegetables. Ensure good drainage, quality potting mix, and regular watering and fertilizing.",
        vertical_gardening: "Maximize space by growing upward. Use trellises, wall-mounted planters, hanging baskets, and tiered structures. Good for vining crops like cucumbers, beans, and small melons.",
        raised_beds: "Build raised beds 8-12 inches high in areas with poor soil or limited space. Benefits include better drainage, soil warming, and easier access. Can be placed on concrete or rooftops with proper waterproofing.",
        community_gardens: "Join or start a community garden to access more growing space and share knowledge. Most cities have programs to help establish community gardens on vacant lots or in parks.",
        indoor_gardening: "Grow herbs, leafy greens, and some vegetables indoors with adequate light. Use south-facing windows or grow lights. Consider hydroponics or aquaponics for more efficient indoor production.",
        challenges: "Urban gardening challenges include limited space, potential soil contamination, restricted sunlight due to buildings, and water access. Solutions include soil testing, container gardening, and selecting shade-tolerant plants."
    }
};

// Helper function to find crop info in all categories
function findCropInfo(cropName) {
    const categories = ['vegetables', 'fruits', 'grains'];
    for (const category of categories) {
        const crop = knowledgeBase.crops[category].find(c => c.name.toLowerCase() === cropName.toLowerCase());
        if (crop) return crop;
    }
    return null;
}

// Initialize the chat interface
function initChat() {
    // Event listeners
    chatForm.addEventListener('submit', handleUserMessage);
    
    // Suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            userInput.value = chip.textContent;
            handleUserMessage(new Event('submit'));
        });
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Navigation topic selection
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Get selected topic
            const topic = link.getAttribute('data-topic');
            if (topic !== 'general') {
                scrollToChat();
                const topicQuestion = generateTopicQuestion(topic);
                userInput.value = topicQuestion;
                handleUserMessage(new Event('submit'));
            }
        });
    });
    
    // Start chat button
    startChatButton.addEventListener('click', () => {
        scrollToChat();
        userInput.focus();
    });
    
    // Get user's location when the page loads
    getUserLocation();
}

// Get user's location using Geolocation API
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation.latitude = position.coords.latitude;
                userLocation.longitude = position.coords.longitude;
                
                // Reverse geocoding to get city and country
                reverseGeocode(position.coords.latitude, position.coords.longitude);
                
                // Determine hemisphere and climate zone
                determineHemisphere(position.coords.latitude);
                determineClimateZone(position.coords.latitude);
                determineCurrentSeason();
                
                // Display welcome message with location info
                setTimeout(() => {
                    const welcomeMessage = `I've detected your location. I can now provide personalized crop suggestions and seasonal advice for your area.`;
                    displayMessage(welcomeMessage, 'bot');
                }, 2000);
            },
            error => {
                console.error("Error getting location:", error);
                displayMessage("I couldn't access your location. You can still get general farming advice, but location-specific recommendations won't be available unless you enable location access.", 'bot');
            }
        );
    } else {
        displayMessage("Your browser doesn't support geolocation. You can still get general farming advice, but location-specific recommendations won't be available.", 'bot');
    }
}

// Reverse geocoding using fetch API
function reverseGeocode(latitude, longitude) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`)
        .then(response => response.json())
        .then(data => {
            userLocation.city = data.address.city || data.address.town || data.address.village || data.address.hamlet || 'Unknown';
            userLocation.country = data.address.country || 'Unknown';
            console.log(`Location detected: ${userLocation.city}, ${userLocation.country}`);
        })
        .catch(error => {
            console.error("Error in reverse geocoding:", error);
        });
}

// Determine user's hemisphere based on latitude
function determineHemisphere(latitude) {
    userLocation.hemisphere = latitude >= 0 ? 'Northern' : 'Southern';
}

// Determine climate zone based on latitude
function determineClimateZone(latitude) {
    const absLat = Math.abs(latitude);
    
    if (absLat < 23.5) {
        userLocation.climateZone = 'Tropical';
    } else if (absLat < 35) {
        userLocation.climateZone = 'Subtropical';
    } else if (absLat < 50) {
        userLocation.climateZone = 'Temperate';
    } else if (absLat < 66.5) {
        userLocation.climateZone = 'Cold';
    } else {
        userLocation.climateZone = 'Polar';
    }
}

// Determine current season based on hemisphere and month
function determineCurrentSeason() {
    const month = new Date().getMonth(); // 0-11 (Jan-Dec)
    
    if (userLocation.hemisphere === 'Northern') {
        if (month >= 2 && month <= 4) userLocation.currentSeason = 'Spring';
        else if (month >= 5 && month <= 7) userLocation.currentSeason = 'Summer';
        else if (month >= 8 && month <= 10) userLocation.currentSeason = 'Fall';
        else userLocation.currentSeason = 'Winter';
    } else { // Southern hemisphere
        if (month >= 2 && month <= 4) userLocation.currentSeason = 'Fall';
        else if (month >= 5 && month <= 7) userLocation.currentSeason = 'Winter';
        else if (month >= 8 && month <= 10) userLocation.currentSeason = 'Spring';
        else userLocation.currentSeason = 'Summer';
    }
}

// Get crop suggestions based on climate zone and current season
function getCropSuggestions() {
    const suggestions = {
        Tropical: {
            year_round: ['Bananas', 'Coconut', 'Papaya', 'Cassava', 'Taro'],
            rainy: ['Rice', 'Taro', 'Sweet Potato'],
            dry: ['Mango', 'Pineapple', 'Sugarcane']
        },
        Subtropical: {
            Spring: ['Tomatoes', 'Peppers', 'Eggplant', 'Okra', 'Sweet Potatoes'],
            Summer: ['Watermelon', 'Cantaloupe', 'Corn', 'Beans', 'Squash'],
            Fall: ['Broccoli', 'Cabbage', 'Carrots', 'Lettuce', 'Spinach'],
            Winter: ['Kale', 'Collards', 'Mustard Greens', 'Turnips', 'Radishes']
        },
        Temperate: {
            Spring: ['Peas', 'Lettuce', 'Spinach', 'Radishes', 'Carrots'],
            Summer: ['Tomatoes', 'Corn', 'Beans', 'Cucumbers', 'Zucchini'],
            Fall: ['Broccoli', 'Brussels Sprouts', 'Kale', 'Cauliflower', 'Cabbage'],
            Winter: ['Winter Squash', 'Leeks', 'Garlic', 'Cover Crops']
        },
        Cold: {
            Spring: ['Spinach', 'Kale', 'Radishes', 'Peas', 'Potatoes'],
            Summer: ['Lettuce', 'Carrots', 'Beets', 'Broccoli', 'Cabbage'],
            Fall: ['Turnips', 'Brussels Sprouts', 'Leeks', 'Garlic'],
            Winter: ['Indoor Microgreens', 'Sprouts', 'Cover Crops']
        },
        Polar: {
            Summer: ['Quick-growing Greens', 'Radishes', 'Potatoes', 'Kale'],
            Winter: ['Indoor Herbs', 'Microgreens', 'Sprouts']
        }
    };
    
    if (userLocation.climateZone === 'Tropical') {
        // For tropical regions, use rainy/dry season instead of traditional seasons
        const isDrySeason = [0, 1, 2, 11].includes(new Date().getMonth()); // Roughly Dec-Mar as dry season
        const season = isDrySeason ? 'dry' : 'rainy';
        return {
            season: season === 'dry' ? 'Dry Season' : 'Rainy Season',
            crops: [...suggestions.Tropical.year_round, ...suggestions.Tropical[season]]
        };
    } else {
        return {
            season: userLocation.currentSeason,
            crops: suggestions[userLocation.climateZone]?.[userLocation.currentSeason] || []
        };
    }
}

// Get seasonal advice based on hemisphere and season
function getSeasonalAdvice() {
    const advice = {
        Northern: {
            Spring: 'Focus on soil preparation and planting warm-season crops as soil temperatures rise.',
            Summer: 'Maintain consistent watering during hot periods and monitor for pests that thrive in warm weather.',
            Fall: 'Plant cool-season crops and prepare perennials for winter dormancy.',
            Winter: 'Plan next year\'s garden, order seeds, and maintain any winter crops with protection.'
        },
        Southern: {
            Spring: 'Prepare beds for summer crops and begin planting as soil warms.',
            Summer: 'Focus on watering, mulching, and pest management during peak growing season.',
            Fall: 'Plant cool-season crops and prepare for the transition to winter.',
            Winter: 'Maintain winter gardens with frost protection when needed and plan for spring planting.'
        },
        Tropical: {
            'Dry Season': 'Focus on irrigation and mulching to conserve moisture. Plant drought-tolerant crops.',
            'Rainy Season': 'Ensure good drainage and focus on pest management as humidity increases.'
        }
    };
    
    if (userLocation.climateZone === 'Tropical') {
        const isDrySeason = [0, 1, 2, 11].includes(new Date().getMonth());
        const season = isDrySeason ? 'Dry Season' : 'Rainy Season';
        return advice.Tropical[season];
    } else {
        return advice[userLocation.hemisphere]?.[userLocation.currentSeason] || 
               'Focus on crops appropriate for your current local conditions.';
    }
}

// Generate a question based on the selected topic
function generateTopicQuestion(topic) {
    const questions = {
        crops: "What are the best crops to plant this season?",
        soil: "How can I improve my garden soil?",
        pests: "How do I identify and control common garden pests?",
        water: "What's the best way to water my garden?",
        organic: "How do I start organic farming?",
        urban: "What are some tips for urban gardening?"
    };
    
    return questions[topic] || "How can I improve my farming practices?";
}

// Scroll to chat section
function scrollToChat() {
    document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
}

// Handle user message submission
function handleUserMessage(e) {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Display user message
    displayMessage(message, 'user');
    
    // Clear input
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and get response (with slight delay to show typing indicator)
    setTimeout(() => {
        const response = processUserMessage(message);
        hideTypingIndicator();
        displayMessage(response, 'bot');
    }, 1500);
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Add this function to create progress indicators for advice
function createProgressIndicator(steps) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-indicator';
    
    for (let i = 0; i < steps; i++) {
        const step = document.createElement('div');
        step.className = 'progress-step';
        if (i === 0) step.classList.add('active');
        progressContainer.appendChild(step);
    }
    
    return progressContainer;
}

// Function to advance to the next step in multi-step advice
function advanceToNextStep(event) {
    const content = event.target.parentElement;
    const steps = JSON.parse(content.dataset.steps);
    const currentStep = parseInt(content.dataset.currentStep) + 1;
    
    // Update progress indicator
    const progressSteps = content.querySelectorAll('.progress-step');
    progressSteps[currentStep].classList.add('active');
    
    // Update content
    const paragraph = content.querySelector('p');
    paragraph.textContent = steps[0];
    
    // Update stored data
    content.dataset.steps = JSON.stringify(steps.slice(1));
    content.dataset.currentStep = currentStep.toString();
    
    // Remove next button if no more steps
    if (steps.length <= 1) {
        event.target.remove();
    }
    
    // Add animation
    paragraph.classList.add('step-transition');
    setTimeout(() => paragraph.classList.remove('step-transition'), 500);
}

// Display a message in the chat
function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    let avatar = '';
    if (sender === 'user') {
        avatar = '<i class="fas fa-user"></i>';
    } else {
        avatar = '<i class="fas fa-robot"></i>';
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${avatar}
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    // Check if the message is a multi-step advice (array)
    if (Array.isArray(message) && sender === 'bot') {
        // Clear the pre-built HTML
        messageDiv.innerHTML = '';
        
        // Create avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        
        // Create content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Create progress indicator
        const progressIndicator = createProgressIndicator(message.length);
        contentDiv.appendChild(progressIndicator);
        
        // Add the first step
        const paragraph = document.createElement('p');
        paragraph.textContent = message[0];
        contentDiv.appendChild(paragraph);
        
        // Store the remaining steps as data attribute
        contentDiv.dataset.steps = JSON.stringify(message.slice(1));
        contentDiv.dataset.currentStep = '0';
        
        // Add next button if there are more steps
        if (message.length > 1) {
            const nextButton = document.createElement('button');
            nextButton.className = 'next-step-btn';
            nextButton.textContent = 'Next Tip';
            nextButton.addEventListener('click', advanceToNextStep);
            contentDiv.appendChild(nextButton);
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process user message and generate response
function processUserMessage(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (containsAny(lowerMessage, ['hello', 'hi', 'hey', 'greetings'])) {
        return "Hello! I'm your Smart Farm Assistant. How can I help with your farming or gardening questions today?";
    }
    
    // Check for thanks
    if (containsAny(lowerMessage, ['thank', 'thanks', 'appreciate'])) {
        return "You're welcome! Feel free to ask if you have any other farming questions.";
    }
    
    // Check for location-based queries
    if (containsAny(lowerMessage, ['my location', 'where am i', 'my area', 'my region', 'my climate'])) {
        if (userLocation.latitude && userLocation.longitude) {
            return `Based on your location (${userLocation.city}, ${userLocation.country}), you're in the ${userLocation.climateZone} climate zone in the ${userLocation.hemisphere} Hemisphere. The current season is ${userLocation.currentSeason}.`;
        } else {
            return "I don't have your location information. Please enable location access to get personalized recommendations.";
        }
    }
    
    // Check for crop suggestions based on location
    if (containsAny(lowerMessage, ['what to plant', 'crop suggestion', 'what should i grow', 'best crops', 'recommend crops'])) {
        if (userLocation.climateZone) {
            const suggestions = getCropSuggestions();
            return `For your ${userLocation.climateZone} climate during ${suggestions.season}, I recommend growing: ${suggestions.crops.join(', ')}.`;
        } else {
            return "I need your location to provide personalized crop suggestions. Please enable location access or specify your climate zone.";
        }
    }
    
    // Check for seasonal advice
    if (containsAny(lowerMessage, ['seasonal advice', 'season tips', 'what should i do this season', 'seasonal tasks'])) {
        if (userLocation.hemisphere) {
            const advice = getSeasonalAdvice();
            return `Seasonal advice for ${userLocation.currentSeason} in the ${userLocation.hemisphere} Hemisphere: ${advice}`;
        } else {
            return "I need your location to provide seasonal advice. Please enable location access or specify your hemisphere and current season.";
        }
    }
    
    // Check for specific topics
    let response = checkTopics(lowerMessage);
    if (response) return response;
    
    // Default response if no specific match
    return "I'm not sure I understand your question. Could you rephrase it or ask about specific farming topics like crops, soil, pests, watering, organic farming, or urban gardening?";
}

// Check if message contains any of the keywords
function containsAny(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
}

// Check message against knowledge base topics
function checkTopics(message) {
    // Check for crop-related questions
    if (containsAny(message, ['crop', 'plant', 'grow', 'tomato', 'vegetable', 'fruit', 'grain'])) {
        // Check for specific crops
        for (const category of Object.keys(knowledgeBase.crops)) {
            for (const crop of knowledgeBase.crops[category]) {
                if (message.includes(crop.name.toLowerCase())) {
                    if (message.includes('plant') || message.includes('how to grow')) {
                        return `${crop.name} planting: ${crop.planting} ${crop.care}`;
                    } else if (message.includes('harvest')) {
                        return `${crop.name} harvesting: ${crop.harvest}`;
                    } else {
                        return `${crop.name}: ${crop.info}`;
                    }
                }
            }
        }
        
        // General crop questions
        if (message.includes('what') && (message.includes('plant') || message.includes('grow'))) {
            return "Good crops for beginners include tomatoes, lettuce, beans, and zucchini. What would you like to grow?";
        }
        
        return "I can provide information about various crops including vegetables, fruits, and grains. Could you specify which crop you're interested in?";
    }
    
    // Check for soil-related questions
    if (containsAny(message, ['soil', 'dirt', 'compost', 'fertilizer'])) {
        if (message.includes('prepare') || message.includes('preparation')) {
            return knowledgeBase.soil.preparation;
        } else if (message.includes('test')) {
            return knowledgeBase.soil.testing;
        } else if (message.includes('compost')) {
            return knowledgeBase.soil.composting;
        } else if (containsAny(message, ['type', 'kind', 'sandy', 'clay', 'loam'])) {
            // Check for specific soil types
            for (const soil of knowledgeBase.soil.types) {
                if (message.includes(soil.name.toLowerCase())) {
                    return `${soil.name}: ${soil.characteristics} ${soil.improvement} Suitable crops: ${soil.suitable_crops}`;
                }
            }
            
            // General soil types info
            return "The main soil types are sandy, clay, loam, silt, peat, and chalky. Each has different characteristics and is suitable for different crops. Which soil type would you like to know more about?";
        }
        
        return "Healthy soil is the foundation of successful farming. I can help with soil preparation, testing, composting, and identifying soil types. What specific soil information do you need?";
    }
    
    // Check for pest-related questions
    if (containsAny(message, ['pest', 'bug', 'insect', 'disease', 'aphid', 'beetle', 'mildew', 'blight'])) {
        if (message.includes('organic') || message.includes('natural')) {
            return knowledgeBase.pests.organic_control;
        }
        
        // Check for specific pests
        for (const pest of knowledgeBase.pests.common) {
            if (message.includes(pest.name.toLowerCase())) {
                return `${pest.name}: ${pest.description} Control: ${pest.control}`;
            }
        }
        
        // Check for specific diseases
        for (const disease of knowledgeBase.pests.diseases) {
            if (message.includes(disease.name.toLowerCase())) {
                return `${disease.name}: ${disease.description} Control: ${disease.control}`;
            }
        }
        
        if (message.includes('disease')) {
            return "Common plant diseases include powdery mildew, blight, damping off, and mosaic virus. Which disease are you dealing with?";
        }
        
        return "I can help identify and control common garden pests and diseases. Could you describe the pest or symptoms you're seeing?";
    }
    
    // Check for water-related questions
    if (containsAny(message, ['water', 'irrigation', 'drought', 'overwater', 'underwater'])) {
        if (containsAny(message, ['conserve', 'save', 'efficiency'])) {
            return knowledgeBase.water.conservation;
        } else if (containsAny(message, ['stress', 'sign', 'symptom', 'overwater', 'underwater'])) {
            return knowledgeBase.water.signs_of_water_stress;
        } else if (containsAny(message, ['method', 'system', 'irrigation', 'drip', 'sprinkler'])) {
            // Check for specific irrigation methods
            for (const method of knowledgeBase.water.irrigation) {
                if (message.includes(method.method.toLowerCase())) {
                    return `${method.method}: ${method.description} Best for: ${method.best_for}`;
                }
            }
            
            // General irrigation info
            return "Common irrigation methods include drip irrigation, soaker hoses, sprinklers, hand watering, and self-watering containers. Each has advantages for different situations. Which would you like to know more about?";
        }
        
        return "Proper watering is crucial for plant health. I can provide information about irrigation methods, water conservation, and signs of water stress. What specific water management information do you need?";
    }
    
    // Check for organic farming questions
    if (containsAny(message, ['organic', 'natural', 'chemical free', 'sustainable'])) {
        if (message.includes('principle') || message.includes('what is')) {
            return knowledgeBase.organic.principles;
        } else if (message.includes('certif')) {
            return knowledgeBase.organic.certification;
        } else if (containsAny(message, ['soil', 'compost', 'fertility'])) {
            return knowledgeBase.organic.soil_management;
        } else if (containsAny(message, ['pest', 'disease', 'control', 'manage'])) {
            return knowledgeBase.organic.pest_management;
        } else if (containsAny(message, ['benefit', 'advantage', 'why'])) {
            return knowledgeBase.organic.benefits;
        }
        
        return "Organic farming focuses on natural processes and avoids synthetic chemicals. I can provide information about organic principles, certification, soil management, pest control, and benefits. What specific aspect interests you?";
    }
    
    // Check for urban gardening questions
    if (containsAny(message, ['urban', 'city', 'apartment', 'balcony', 'patio', 'container', 'small space'])) {
        if (message.includes('container')) {
            return knowledgeBase.urban.container_gardening;
        } else if (containsAny(message, ['vertical', 'wall', 'trellis', 'hanging'])) {
            return knowledgeBase.urban.vertical_gardening;
        } else if (containsAny(message, ['raised', 'bed'])) {
            return knowledgeBase.urban.raised_beds;
        } else if (containsAny(message, ['community', 'shared'])) {
            return knowledgeBase.urban.community_gardens;
        } else if (containsAny(message, ['indoor', 'inside', 'windowsill'])) {
            return knowledgeBase.urban.indoor_gardening;
        } else if (containsAny(message, ['challenge', 'problem', 'difficult'])) {
            return knowledgeBase.urban.challenges;
        }
        
        return "Urban gardening allows you to grow food in limited spaces. I can provide information about container gardening, vertical gardening, raised beds, community gardens, indoor gardening, and overcoming urban challenges. What specific aspect interests you?";
    }
    
    return null;
}

// Language selection
const languageButtons = document.querySelectorAll('.language-btn');
let currentLanguage = 'en';

// Translations object
const translations = {
    en: {
        // Header
        'header-title': 'Smart Farm Assistant',
        'nav-home': 'Home',
        'nav-crops': 'Crops',
        'nav-soil': 'Soil',
        'nav-pests': 'Pests & Diseases',
        'nav-water': 'Water Management',
        'nav-organic': 'Organic Farming',
        'nav-urban': 'Urban Gardening',
        
        // Hero section
        'hero-title': 'Your Personal Farming Assistant',
        'hero-subtitle': 'Get expert advice on crops, soil management, pest control, and more',
        'start-chat': 'Start Chatting',
        
        // Features section
        'features-title': 'How Our Smart Farm Assistant Can Help You',
        'feature-crop-title': 'Crop Selection',
        'feature-crop-desc': 'Get recommendations on what to plant based on your location and season',
        'feature-planting-title': 'Planting Schedules',
        'feature-planting-desc': 'Learn the best times to plant and harvest your crops',
        'feature-soil-title': 'Soil Management',
        'feature-soil-desc': 'Tips for preparing and maintaining healthy soil',
        'feature-pest-title': 'Pest Identification',
        'feature-pest-desc': 'Identify common pests and diseases affecting your plants',
        
        // Chat section
        'chat-title': 'Farm Assistant Chat',
        'chat-subtitle': 'Ask me anything about farming!',
        'chat-placeholder': 'Ask about crops, soil, pests, etc...',
        'chat-welcome': 'Hello! I\'m your Smart Farm Assistant. How can I help you with your farming needs today?',
        'suggestion-1': 'How to grow tomatoes?',
        'suggestion-2': 'Best soil for herbs?',
        'suggestion-3': 'Organic pest control',
        
        // Footer
        'footer-title': 'Smart Farm Assistant',
        'footer-subtitle': 'Your AI-powered guide to successful farming and gardening',
        'footer-links': 'Quick Links',
        'footer-about': 'About',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Terms of Service',
        'footer-contact': 'Contact',
        'footer-connect': 'Connect With Us',
        'footer-copyright': '© 2023 Smart Farm Assistant. All rights reserved.'
    },
    zh: {
        // Header
        'header-title': '智能农场助手',
        'nav-home': '首页',
        'nav-crops': '农作物',
        'nav-soil': '土壤',
        'nav-pests': '病虫害',
        'nav-water': '水资源管理',
        'nav-organic': '有机农业',
        'nav-urban': '城市园艺',
        
        // Hero section
        'hero-title': '您的个人农业助手',
        'hero-subtitle': '获取关于农作物、土壤管理、病虫害防治等方面的专业建议',
        'start-chat': '开始聊天',
        
        // Features section
        'features-title': '我们的智能农场助手如何帮助您',
        'feature-crop-title': '农作物选择',
        'feature-crop-desc': '根据您的位置和季节获取种植建议',
        'feature-planting-title': '种植时间表',
        'feature-planting-desc': '了解农作物最佳种植和收获时间',
        'feature-soil-title': '土壤管理',
        'feature-soil-desc': '准备和维护健康土壤的技巧',
        'feature-pest-title': '病虫害识别',
        'feature-pest-desc': '识别影响植物的常见病虫害',
        
        // Chat section
        'chat-title': '农场助手聊天',
        'chat-subtitle': '问我任何关于农业的问题！',
        'chat-placeholder': '询问农作物、土壤、病虫害等...',
        'chat-welcome': '您好！我是您的智能农场助手。今天我能如何帮助您的农业需求？',
        'suggestion-1': '如何种植番茄？',
        'suggestion-2': '适合香草的最佳土壤？',
        'suggestion-3': '有机病虫害防治',
        
        // Footer
        'footer-title': '智能农场助手',
        'footer-subtitle': '您的AI驱动的农业和园艺指南',
        'footer-links': '快速链接',
        'footer-about': '关于我们',
        'footer-privacy': '隐私政策',
        'footer-terms': '服务条款',
        'footer-contact': '联系我们',
        'footer-connect': '关注我们',
        'footer-copyright': '© 2023 智能农场助手。保留所有权利。'
    }
};

// Function to update text content based on selected language
function updateLanguage(lang) {
    currentLanguage = lang;
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update header
    document.querySelector('.logo h1').textContent = translations[lang]['header-title'];
    document.querySelectorAll('.nav-menu li a').forEach((item, index) => {
        const topics = ['general', 'crops', 'soil', 'pests', 'water', 'organic', 'urban'];
        const navKeys = ['nav-home', 'nav-crops', 'nav-soil', 'nav-pests', 'nav-water', 'nav-organic', 'nav-urban'];
        if (index < navKeys.length) {
            // Keep the icon and add the translated text
            const icon = item.querySelector('i').outerHTML;
            item.innerHTML = `${icon} ${translations[lang][navKeys[index]]}`;
        }
    });
    
    // Update hero section
    document.querySelector('.hero-content h2').textContent = translations[lang]['hero-title'];
    document.querySelector('.hero-content p').textContent = translations[lang]['hero-subtitle'];
    document.querySelector('#start-chat').textContent = translations[lang]['start-chat'];
    
    // Update features section
    document.querySelector('.features h2').textContent = translations[lang]['features-title'];
    
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length >= 4) {
        featureCards[0].querySelector('h3').textContent = translations[lang]['feature-crop-title'];
        featureCards[0].querySelector('p').textContent = translations[lang]['feature-crop-desc'];
        featureCards[1].querySelector('h3').textContent = translations[lang]['feature-planting-title'];
        featureCards[1].querySelector('p').textContent = translations[lang]['feature-planting-desc'];
        featureCards[2].querySelector('h3').textContent = translations[lang]['feature-soil-title'];
        featureCards[2].querySelector('p').textContent = translations[lang]['feature-soil-desc'];
        featureCards[3].querySelector('h3').textContent = translations[lang]['feature-pest-title'];
        featureCards[3].querySelector('p').textContent = translations[lang]['feature-pest-desc'];
    }
    
    // Update chat section
    document.querySelector('.chat-header h2').innerHTML = 
        `<i class="fas fa-comments"></i> ${translations[lang]['chat-title']}`;
    document.querySelector('.chat-header p').textContent = translations[lang]['chat-subtitle'];
    document.querySelector('#user-input').placeholder = translations[lang]['chat-placeholder'];
    
    // Update suggestion chips
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    if (suggestionChips.length >= 3) {
        suggestionChips[0].textContent = translations[lang]['suggestion-1'];
        suggestionChips[1].textContent = translations[lang]['suggestion-2'];
        suggestionChips[2].textContent = translations[lang]['suggestion-3'];
    }
    
    // Update welcome message if it's the first bot message
    const firstBotMessage = document.querySelector('.bot-message .message-content p');
    if (firstBotMessage) {
        firstBotMessage.textContent = translations[lang]['chat-welcome'];
    }
    
    // Update footer
    document.querySelectorAll('.footer-section h3')[0].textContent = translations[lang]['footer-title'];
    document.querySelectorAll('.footer-section p')[0].textContent = translations[lang]['footer-subtitle'];
    document.querySelectorAll('.footer-section h3')[1].textContent = translations[lang]['footer-links'];
    
    const footerLinks = document.querySelectorAll('.footer-section ul li a');
    if (footerLinks.length >= 4) {
        footerLinks[0].textContent = translations[lang]['footer-about'];
        footerLinks[1].textContent = translations[lang]['footer-privacy'];
        footerLinks[2].textContent = translations[lang]['footer-terms'];
        footerLinks[3].textContent = translations[lang]['footer-contact'];
    }
    
    document.querySelectorAll('.footer-section h3')[2].textContent = translations[lang]['footer-connect'];
    document.querySelector('.footer-bottom p').textContent = translations[lang]['footer-copyright'];
    
    // Save language preference to local storage
    localStorage.setItem('preferredLanguage', lang);
}

// Add event listeners to language buttons
languageButtons.forEach(button => {
    button.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        
        // Update active button
        languageButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Update language
        updateLanguage(lang);
    });
});

// Initialize language from local storage or default to English
document.addEventListener('DOMContentLoaded', function() {
    // Add this to the existing DOMContentLoaded event or create a new one if needed
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    updateLanguage(savedLanguage);
    
    // Set active button
    document.querySelector(`.language-btn[data-lang="${savedLanguage}"]`).classList.add('active');
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initChat();
    addVisualFeedback();
    initGalleryFilter();
});

// Add visual feedback for user actions
function addVisualFeedback() {
    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
    
    // Add focus animation to input fields
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('input-focused');
        });
    });
    
    // Add hover effects to interactive elements
    document.querySelectorAll('.feature-card, .gallery-item, .suggestion-chip').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('element-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('element-hover');
        });
    });
}

// Create ripple effect on button click
function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Initialize gallery filter functionality
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Show all gallery items by default
    galleryItems.forEach(item => {
        item.style.display = 'block';
        item.classList.add('show');
    });
    
    // Add error handling for images
    document.querySelectorAll('.gallery-image img').forEach(img => {
        img.onerror = function() {
            console.error('Failed to load image:', this.src);
            // Replace with a placeholder
            this.src = 'https://via.placeholder.com/300x200?text=Plant+Image';
        };
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('show'), 10);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
}

// Garden Space Calculator
const gardenLength = document.getElementById('garden-length');
const gardenWidth = document.getElementById('garden-width');
const plantType = document.getElementById('plant-type');
const customSpacing = document.getElementById('custom-spacing');
const calculateBtn = document.getElementById('calculate-btn');
const resultsContainer = document.getElementById('results-container');
const gardenVisualization = document.getElementById('garden-visualization');

// Plant spacing database (in inches)
const plantDatabase = {
    tomato: { name: "Tomatoes", spacing: 24, rowSpacing: 36, yield: "8-10 lbs per plant" },
    lettuce: { name: "Lettuce", spacing: 8, rowSpacing: 12, yield: "1 head per plant" },
    carrot: { name: "Carrots", spacing: 2, rowSpacing: 12, yield: "1 lb per 1-foot row" },
    pepper: { name: "Bell Peppers", spacing: 18, rowSpacing: 24, yield: "5-10 peppers per plant" },
    cucumber: { name: "Cucumbers", spacing: 12, rowSpacing: 36, yield: "10-15 cucumbers per plant" },
    bean: { name: "Beans", spacing: 4, rowSpacing: 18, yield: "½ lb per foot of row" },
    corn: { name: "Corn", spacing: 12, rowSpacing: 30, yield: "1-2 ears per plant" },
    squash: { name: "Squash", spacing: 36, rowSpacing: 48, yield: "5-10 squash per plant" },
    radish: { name: "Radishes", spacing: 1, rowSpacing: 6, yield: "1 radish per plant" },
    onion: { name: "Onions", spacing: 4, rowSpacing: 12, yield: "1 onion per plant" }
};

// Calculate garden space and planting information
function calculateGardenSpace() {
    // Get input values
    const length = parseFloat(gardenLength.value);
    const width = parseFloat(gardenWidth.value);
    const plant = plantType.value;
    const spacing = customSpacing.value ? parseFloat(customSpacing.value) : null;
    
    // Validate inputs
    if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
        resultsContainer.innerHTML = '<p class="error">Please enter valid garden dimensions.</p>';
        gardenVisualization.innerHTML = '';
        return;
    }
    
    if (plant === 'select' && !spacing) {
        resultsContainer.innerHTML = '<p class="error">Please select a plant type or enter custom spacing.</p>';
        gardenVisualization.innerHTML = '';
        return;
    }
    
    // Calculate garden area
    const areaSquareFeet = length * width;
    const areaSquareInches = areaSquareFeet * 144; // 12² = 144 sq inches in a sq foot
    
    // Get plant spacing
    let plantSpacing, rowSpacing, plantName, plantYield;
    
    if (spacing) {
        // Use custom spacing
        plantSpacing = spacing;
        rowSpacing = spacing * 1.5; // Default row spacing if custom
        plantName = "Custom Plant";
        plantYield = "Varies";
    } else {
        // Use database spacing
        plantSpacing = plantDatabase[plant].spacing;
        rowSpacing = plantDatabase[plant].rowSpacing;
        plantName = plantDatabase[plant].name;
        plantYield = plantDatabase[plant].yield;
    }
    
    // Calculate plants per row and number of rows
    const inchesPerRow = length * 12; // Convert feet to inches
    const plantsPerRow = Math.floor(inchesPerRow / plantSpacing);
    
    const inchesPerColumn = width * 12; // Convert feet to inches
    const numRows = Math.floor(inchesPerColumn / rowSpacing);
    
    // Calculate total plants
    const totalPlants = plantsPerRow * numRows;
    
    // Display results
    let resultsHTML = `
        <div class="result-item">
            <span>Garden Area:</span> ${areaSquareFeet} square feet (${length}' × ${width}')
        </div>
        <div class="result-item">
            <span>Plant Type:</span> ${plantName}
        </div>
        <div class="result-item">
            <span>Plant Spacing:</span> ${plantSpacing}" between plants, ${rowSpacing}" between rows
        </div>
        <div class="result-item">
            <span>Plants per Row:</span> ${plantsPerRow}
        </div>
        <div class="result-item">
            <span>Number of Rows:</span> ${numRows}
        </div>
        <div class="result-item">
            <span>Total Plants:</span> ${totalPlants}
        </div>
    `;
    
    if (plantYield && plant !== 'select') {
        resultsHTML += `
            <div class="result-item">
                <span>Estimated Yield:</span> ${plantYield}
            </div>
        `;
    }
    
    resultsContainer.innerHTML = resultsHTML;
    
    // Create garden visualization
    createGardenVisualization(plantsPerRow, numRows, plantName);
}

// Create a visual representation of the garden layout
function createGardenVisualization(plantsPerRow, numRows, plantName) {
    // Clear previous visualization
    gardenVisualization.innerHTML = '';
    
    // Create garden container with aspect ratio matching the actual garden
    const gardenContainer = document.createElement('div');
    gardenContainer.className = 'garden-container';
    gardenContainer.style.aspectRatio = `${gardenLength.value} / ${gardenWidth.value}`;
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = `${plantName} Layout`;
    gardenVisualization.appendChild(title);
    
    // Add plants to the visualization
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < plantsPerRow; col++) {
            const plant = document.createElement('div');
            plant.className = 'plant-marker';
            plant.title = `${plantName} Plant`;
            
            // Position plants evenly
            plant.style.left = `${(col / plantsPerRow) * 100}%`;
            plant.style.top = `${(row / numRows) * 100}%`;
            
            gardenContainer.appendChild(plant);
        }
    }
    
    gardenVisualization.appendChild(gardenContainer);
}

// Event listeners
if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateGardenSpace);
}

// Add navigation for calculator
document.addEventListener('DOMContentLoaded', function() {
    // Add this to the existing DOMContentLoaded event or create a new one if needed
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu) {
        // Add calculator link to navigation
        const calculatorNavItem = document.createElement('li');
        calculatorNavItem.innerHTML = '<a href="#calculator-section" data-topic="calculator"><i class="fas fa-calculator"></i> Garden Calculator</a>';
        navMenu.appendChild(calculatorNavItem);
        
        // Update navigation event listeners to include the new link
        const allNavLinks = document.querySelectorAll('.nav-menu a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                allNavLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Scroll to the appropriate section
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
});