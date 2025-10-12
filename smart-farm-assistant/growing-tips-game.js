const fruitImages = [
    {
        name: "Apple",
        src: "1000_F_906921905_vFPIpzXcBMjULtNBy2SYcabxbIVNAVBS.jpg",
        description: "Apples are sweet, edible fruits produced by an apple tree.",
        origin: "Central Asia",
        nutrition: "Rich in fiber and vitamin C."
    },
    {
        name: "Banana",
        src: "images/banana.png",
        description: "Bananas are elongated, edible fruits produced by several kinds of large herbaceous plants.",
        origin: "Southeast Asia",
        nutrition: "High in potassium and vitamin B6."
    },
    {
        name: "Orange",
        src: "images/orange.png",
        description: "Oranges are round, orange-colored citrus fruits.",
        origin: "China",
        nutrition: "Excellent source of vitamin C."
    },
    {
        name: "Strawberry",
        src: "images/strawberry.png",
        description: "Strawberries are bright red, juicy, and sweet fruits.",
        origin: "Europe",
        nutrition: "Rich in antioxidants and vitamin C."
    },
    {
        name: "Grape",
        src: "images/grape.png",
        description: "Grapes are small, round, smooth-skinned edible berries.",
        origin: "Near East",
        nutrition: "Contains vitamins C and K."
    },
    {
        name: "Cocoa Bean",
        src: "images/cocoa.png",
        description: "Cocoa beans are seeds from the cacao tree, used to make chocolate.",
        origin: "South America",
        nutrition: "Source of antioxidants and magnesium."
    },
    // Vegetables
    {
        name: "Tomato",
        src: "images/tomato.png",
        description: "Tomatoes are juicy red fruits often used as vegetables in cooking.",
        origin: "South America",
        nutrition: "High in vitamin C, potassium, folate, and vitamin K."
    },
    {
        name: "Lettuce",
        src: "images/lettuce.png",
        description: "Lettuce is a leafy green vegetable commonly used in salads.",
        origin: "Mediterranean region",
        nutrition: "Low in calories, high in vitamins A and K."
    },
    {
        name: "Carrot",
        src: "images/carrot.png",
        description: "Carrots are root vegetables, usually orange in color.",
        origin: "Iran and Afghanistan",
        nutrition: "Excellent source of beta carotene, fiber, vitamin K1, and potassium."
    },
    // Flowers
    {
        name: "Sunflower",
        src: "images/sunflower.png",
        description: "Sunflowers are tall plants known for their large, bright yellow flowers.",
        origin: "North America",
        nutrition: "Sunflower seeds are rich in healthy fats and vitamin E."
    },
    {
        name: "Rose",
        src: "images/rose.png",
        description: "Roses are popular ornamental flowers, often symbolizing love.",
        origin: "Asia",
        nutrition: "Rose hips are high in vitamin C."
    },
    // Other crops
    {
        name: "Wheat",
        src: "images/wheat.png",
        description: "Wheat is a cereal grain, a staple food worldwide.",
        origin: "Fertile Crescent",
        nutrition: "Provides carbohydrates, protein, and some B vitamins."
    },
    {
        name: "Corn",
        src: "images/corn.png",
        description: "Corn is a cereal plant that yields large grains, or kernels, set in rows on a cob.",
        origin: "Central America",
        nutrition: "Good source of fiber, vitamins B and C."
    }
];

document.getElementById('show-fruit-btn').onclick = function() {
    const fruit = fruitImages[Math.floor(Math.random() * fruitImages.length)];
    const display = document.getElementById('fruit-display');
    display.innerHTML = `
        <img src="${fruit.src}" alt="${fruit.name}" style="width:120px;height:auto;">
        <div style="font-weight:bold;">${fruit.name}</div>
        <div>${fruit.description}</div>
        <div><strong>Origin:</strong> ${fruit.origin}</div>
        <div><strong>Nutrition:</strong> ${fruit.nutrition}</div>
    `;

    const audio = document.getElementById('fruit-audio');
    if (audio) {
        audio.currentTime = 0;
        audio.play();
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            display.innerHTML = '';
        }, 3000);
    } else {
        setTimeout(() => {
            display.innerHTML = '';
        }, 3000);
    }
};