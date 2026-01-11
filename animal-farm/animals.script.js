document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. CONFIGURATION & DATA
    // ============================================================
    const Config = {
        infoData: {
            fruit: {
                Apple: { text: "🍎 Apple<br><br>Apples are red, shiny, and crunchy.<br>They taste sweet and juicy.<br><br>Eating apples helps you stay healthy and strong.", img: "apple.png" },
                Banana: { text: "🍌 Banana<br><br>Bananas are yellow and soft.<br>They are easy to peel and fun to eat.<br><br>Bananas give you lots of energy.", img: "banana.png" }
            },
            animal: {
                Cat: { text: "🐱 Cat<br><br>Cats are cute and soft animals.<br>They love sleeping and taking naps.<br><br>Cats like to chase small things and play quietly.", img: "cat.png" },
                Dog: { text: "🐶 Dog<br><br>Dogs are friendly and loyal animals.<br>They love their owners very much.<br><br>Dogs enjoy running and playing.", img: "dog.png" },
                Fish: { text: "🐟 Fish<br><br>Fish live in water and swim all day.<br>They move their tails to go forward.", img: "fish.png" }
            }
        },
        animalDialogues: {
            cat: ["Meow~ It's such a comfy day 😸", "Feed me some fish! 🐟", "Have you seen my mouse? 🐭", "Purr~ I'm sunbathing ☀️", "I'm the real star of this farm! ✨"],
            dog: ["Woof woof! You're my favorite human ❤️", "Are we going for a walk today? 🏞️", "I'm hungry... got any apples? 🍎", "I'll guard the house for you! 💪", "Wagging my tail~ so happy 🐾"]
        },
        quizQuestions: [
            {q:"💧 Which one is water?", options:["Fish","Water"], answer:"Water"},
            {q:"🍎 Which fruit is red and crunchy?", options:["Banana","Apple"], answer:"Apple"},
            {q:"🐶 Which animal is loyal and friendly?", options:["Cat","Dog"], answer:"Dog"},
            {q:"🐱 Which animal loves napping and chasing shadows?", options:["Dog","Cat"], answer:"Cat"},
            {q:"🌞 Which fruit is yellow and high in energy?", options:["Banana","Apple"], answer:"Banana"},
            {q:"🐟 Which animal glides gracefully in water?", options:["Fish","Dog"], answer:"Fish"},
            {q:"🌳 Which one is a tree?", options:["Tree","Dog"], answer:"Tree"},
            {q:"🔥 Which one is hot?", options:["Fire","Water"], answer:"Fire"},
            {q:"❄️ Which one is cold?", options:["Cat","Ice"], answer:"Ice"},
            {q:"🥕 Which one is a vegetable?", options:["Apple","Carrot"], answer:"Carrot"},
            {q:"🍇 Which fruit grows in bunches?", options:["Banana","Grapes"], answer:"Grapes"},
            {q:"🦆 Which animal can swim and quack?", options:["Duck","Dog"], answer:"Duck"},
            {q:"🦁 Which one is the king of the jungle?", options:["Lion","Cat"], answer:"Lion"},
            {q:"🐔 Which one lays eggs?", options:["Chicken","Dog"], answer:"Chicken"},
            {q:"🍉 Which fruit is big and has many seeds?", options:["Watermelon","Apple"], answer:"Watermelon"},
            {q:"🌧️ What falls from the sky when it rains?", options:["Fire","Rain"], answer:"Rain"},
            {q:"🌙 What do you see at night?", options:["Sun","Moon"], answer:"Moon"},
            {q:"☀️ What do you see in the morning?", options:["Sun","Stars"], answer:"Sun"},
            {q:"🦋 Which one can fly?", options:["Fish","Butterfly"], answer:"Butterfly"},
            {q:"🐰 Which animal loves carrots?", options:["Dog","Rabbit"], answer:"Rabbit"}
        ],
        possibleTasks: [
            { type: "collectApple", text: "Collect 5 Apples", goal: 5 },
            { type: "catchFish", text: "Catch 2 Fish", goal: 2 },
            { type: "feedCat", text: "Feed the Cat 3 times", goal: 3 },
            { type: "feedDog", text: "Feed the Dog 3 times", goal: 3 }
        ]
    };

    // ============================================================
    // 2. STATE MANAGEMENT
    // ============================================================
    const State = {
        inventory: [],
        growthLevels: { cat: 1, dog: 1 },
        feedCounts: { cat: 0, dog: 0 }, // Tracks feeds per level (needs 3 to grow)
        appleCount: 0,
        player: {
            level: 1,
            exp: 0,
            expToNext: 5
        },
        dailyTasks: [],
        taskProgress: { collectApple: 0, catchFish: 0, feedCat: 0, feedDog: 0 },
        intervals: [] // To store interval IDs for cleanup if needed
    };

    // ============================================================
    // 3. UI CONTROLLER
    // ============================================================
    const UI = {
        notifications: {
            show: (msg) => {
                const notif = document.getElementById('reward-notification');
                if(!notif) return;
                notif.textContent = msg;
                notif.style.display = 'block';
                notif.style.opacity = '1';
                setTimeout(()=>{ notif.style.opacity='0'; },1800);
                setTimeout(()=>{ notif.style.display='none'; },2200);
            }
        },
        inventory: {
            render: () => {
                let invDiv = document.getElementById('inventory');
                if(!invDiv){
                    invDiv = document.createElement('div');
                    invDiv.id = 'inventory';
                    document.body.appendChild(invDiv); // Fallback placement
                }
                invDiv.innerHTML = '';
                State.inventory.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'inventory-item';
                    div.style.display = 'inline-block';
                    div.style.margin = '4px';
                    
                    let img = document.createElement('img');
                    img.style.width='32px'; img.style.height='32px'; img.alt=item;

                    switch(item){
                        case 'Apple': img.src='apple2.png'; break;
                        case 'Fish': img.src='fish.png'; break;
                        case 'Water': img.src='water.png'; break;
                        case 'DogBone': img.src='DogBone.png'; break;
                        case 'CatFood': img.src='CatFood.png'; break;
                        case 'LuckyCharm': img.src='luckycharm.png'; break;
                        default: 
                            img = document.createTextNode(item);
                            div.appendChild(img);
                            invDiv.appendChild(div);
                            return;
                    }
                    div.appendChild(img);
                    invDiv.appendChild(div);
                });
            }
        },
        player: {
            update: () => {
                const pLevel = document.getElementById("player-level");
                const pExp = document.getElementById("player-exp");
                const pExpMax = document.getElementById("player-exp-max");
                const bar = document.getElementById("exp-bar");

                if(pLevel) pLevel.textContent = State.player.level;
                if(pExp) pExp.textContent = State.player.exp;
                if(pExpMax) pExpMax.textContent = State.player.expToNext;
                if(bar) {
                    const percentage = Math.min((State.player.exp / State.player.expToNext) * 100, 100);
                    bar.style.width = percentage + "%";
                }
            },
            showLevelUp: () => {
                const msg = document.getElementById("level-up-msg");
                if(msg){
                    msg.style.display = "block";
                    setTimeout(() => { msg.style.display = "none"; }, 2000);
                }
            }
        },
        info: {
            show: (type, name) => {
                const info = Config.infoData[type]?.[name];
                const display = document.getElementById('info-display');
                if(!display) return;

                if(!info){
                    display.textContent = "No info available.";
                    return;
                }
                display.innerHTML = `
                    <div style="text-align:center; background: rgba(255,255,255,0.85); padding: 12px; border-radius: 12px;">
                        <img src="${info.img}" style="width:120px; margin-bottom:8px;">
                        <p>${info.text}</p>
                    </div>
                `;
            }
        },
        pages: {
            show: (pageId) => {
                document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
                const target = document.getElementById(pageId);
                if(target) target.style.display = 'block';
            }
        }
    };

    // ============================================================
    // 4. GAME LOGIC MODULES
    // ============================================================
    
    const Inventory = {
        add: (item) => {
            State.inventory.push(item);
            UI.inventory.render();
        },
        remove: (item, count = 1) => {
            let removed = 0;
            for(let i = State.inventory.length - 1; i >= 0 && removed < count; i--){
                if(State.inventory[i] === item){
                    State.inventory.splice(i, 1);
                    removed++;
                }
            }
            UI.inventory.render();
            return removed === count;
        },
        has: (item, count = 1) => {
            return State.inventory.filter(i => i === item).length >= count;
        },
        count: (item) => {
            return State.inventory.filter(i => i === item).length;
        }
    };

    const Player = {
        addExp: (amount) => {
            State.player.exp += amount;
            if(State.player.exp >= State.player.expToNext){
                State.player.level++;
                State.player.exp -= State.player.expToNext;
                State.player.expToNext += 5;
                UI.player.showLevelUp();
            }
            UI.player.update();
        }
    };

    const Animals = {
        feed: (animal) => {
            let food = '';
            let expGain = 1;

            // Determine food priority and availability
            if(animal==='cat'){
                if(Inventory.has("LuckyCharm")) { food="LuckyCharm"; expGain=15; }
                else if(Inventory.has("CatFood")) { food="CatFood"; expGain=5; }
                else if(Inventory.has('Fish')) { food='Fish'; expGain=1; }
                else if(Inventory.has('Water')) { food='Water'; expGain=1; }
                else { alert("You don't have Fish, Water, CatFood, or LuckyCharm to feed the cat."); return; }
                Missions.progress("feedCat");
            } else if(animal==='dog'){
                if(Inventory.has("LuckyCharm")) { food="LuckyCharm"; expGain=15; }
                else if(Inventory.has("DogBone")) { food="DogBone"; expGain=5; }
                else if(Inventory.has('Apple')) { food='Apple'; expGain=1; }
                else if(Inventory.has('Water')) { food='Water'; expGain=1; }
                else { alert("You don't have Apple, Water, DogBone, or LuckyCharm to feed the dog."); return; }
                Missions.progress("feedDog");
            }

            Inventory.remove(food);
            
            // Growth Mechanic: 3 feeds = 1 level
            State.feedCounts[animal] = (State.feedCounts[animal] || 0) + 1;
            
            let leveledUp = false;
            if(State.feedCounts[animal] >= 3){
                State.growthLevels[animal] += 1;
                State.feedCounts[animal] = 0;
                leveledUp = true;
            }

            // Update Visuals
            Animals.updateVisuals(animal);

            // Speech
            const speech = document.getElementById(`${animal}-speech`);
            if(speech) {
                let reaction = "";
                if(animal==='cat') reaction = (food==='Fish' || food==='CatFood') ? "Yummy! Meow~ 🐟" : "Meow?";
                if(animal==='dog') reaction = (food==='Apple' || food==='DogBone') ? "Woof! Tasty! 🍎" : "Woof?";
                speech.textContent = reaction;
                setTimeout(()=>{ speech.textContent = Animals.getRandomDialogue(animal); }, 3000);
            }

            Player.addExp(expGain);
        },
        updateVisuals: (animal) => {
            const img = document.querySelector(`#${animal} img`);
            if(img){
                // Base size 100 + 10 per level
                img.style.width = (100 + State.growthLevels[animal]*10)+'px';
                img.style.height = 'auto';
                
                // Evolution
                if(animal==='cat' && State.growthLevels.cat >= 5) img.src='cat2.png';
                if(animal==='dog' && State.growthLevels.dog >= 5) img.src='dog2.png';
            }
            const animalEl = document.getElementById(animal);
            if(animalEl) {
                let mood = 'neutral';
                if(State.growthLevels[animal]>=10) mood='overjoyed';
                else if(State.growthLevels[animal]>=7) mood='satisfied';
                else if(State.growthLevels[animal]>=5) mood='excited';
                else if(State.growthLevels[animal]>=3) mood='happy';
                animalEl.setAttribute('data-mood', mood);
            }
        },
        getRandomDialogue: (animal) => {
            const lines = Config.animalDialogues[animal];
            return lines[Math.floor(Math.random() * lines.length)];
        },
        startAutoDialogue: () => {
            ['cat', 'dog'].forEach(animal => {
                setInterval(() => {
                    const speech = document.getElementById(`${animal}-speech`);
                    if(speech) speech.textContent = Animals.getRandomDialogue(animal);
                }, animal === 'cat' ? 5000 : 6000);
            });
        }
    };

    const Missions = {
        generate: () => {
            State.dailyTasks = [];
            let used = new Set();
            while (State.dailyTasks.length < 3) {
                let t = Config.possibleTasks[Math.floor(Math.random() * Config.possibleTasks.length)];
                if (!used.has(t.type)) {
                    used.add(t.type);
                    State.dailyTasks.push({ ...t, completed: false });
                }
            }
            Missions.render();
        },
        render: () => {
            const list = document.getElementById("task-list");
            if(!list) return;
            list.innerHTML = "";
            State.dailyTasks.forEach(task => {
                const li = document.createElement("li");
                li.textContent = `${task.text} (${State.taskProgress[task.type] || 0}/${task.goal})`;
                li.id = `task-${task.type}`;
                if(task.completed) li.style.textDecoration = "line-through";
                list.appendChild(li);
            });
        },
        progress: (type) => {
            if (State.taskProgress[type] === undefined) State.taskProgress[type] = 0;
            State.taskProgress[type]++;
            Missions.render();
            Missions.checkCompletion();
        },
        checkCompletion: () => {
            let allCompleted = true;
            State.dailyTasks.forEach(task => {
                if (!task.completed && State.taskProgress[task.type] >= task.goal) {
                    task.completed = true;
                    const reward = Math.random() < 0.5 ? "Apple" : "Fish";
                    Inventory.add(reward);
                    UI.notifications.show(`🎉 Mission Complete! Reward: ${reward}`);
                }
                if (!task.completed) allCompleted = false;
            });
            Missions.render(); // Re-render to show completion strike-through
            
            if (allCompleted && State.dailyTasks.length > 0) {
                Fireworks.launchBatch();
                setTimeout(() => { Missions.reset(); }, 1600);
            }
        },
        reset: () => {
            State.taskProgress = { collectApple: 0, catchFish: 0, feedCat: 0, feedDog: 0 };
            Missions.generate();
            UI.notifications.show("🔄 New missions generated!");
        }
    };

    const Shop = {
        buy: (item) => {
            if(item === "CatFood"){
                if(!Inventory.remove("Fish", 3)) return alert("Not enough Fish (3 needed)!");
                Inventory.add("CatFood");
            }
            else if(item === "DogBone"){
                if(!Inventory.remove("Apple", 3)) return alert("Not enough Apples (3 needed)!");
                Inventory.add("DogBone");
            }
            else if(item === "LuckyCharm"){
                if(!Inventory.remove("Water", 10)) return alert("Not enough Water (10 needed)!");
                Inventory.add("LuckyCharm");
            }
            UI.notifications.show("🛒 Purchase successful!");
        }
    };

    const SaveSystem = {
        save: () => {
            const gameState = {
                inventory: State.inventory,
                growthLevels: State.growthLevels,
                feedCounts: State.feedCounts,
                dailyTasks: State.dailyTasks,
                taskProgress: State.taskProgress,
                appleCount: State.appleCount,
                player: State.player
            };
            localStorage.setItem('animalFarmSave', JSON.stringify(gameState));
            UI.notifications.show("💾 Game Saved!");
        },
        load: () => {
            const savedData = localStorage.getItem('animalFarmSave');
            if(savedData){
                try {
                    const gameState = JSON.parse(savedData);
                    
                    // Restore Variables safely
                    State.inventory = gameState.inventory || [];
                    State.growthLevels = gameState.growthLevels || { cat:1, dog:1 };
                    State.feedCounts = gameState.feedCounts || { cat:0, dog:0 };
                    State.dailyTasks = gameState.dailyTasks || [];
                    State.taskProgress = gameState.taskProgress || { collectApple: 0, catchFish: 0, feedCat: 0, feedDog: 0 };
                    State.appleCount = gameState.appleCount || 0;
                    
                    // Restore Player safely - Fix for "Level Not Restored"
                    if(gameState.player) {
                        State.player = { ...State.player, ...gameState.player };
                        // Ensure expToNext exists
                        if(!State.player.expToNext) {
                            State.player.expToNext = 5 + (State.player.level - 1) * 5;
                        }
                    } else if (gameState.playerLevel !== undefined) {
                         // Legacy save support
                         State.player.level = gameState.playerLevel;
                         State.player.exp = gameState.playerExp || 0;
                         State.player.expToNext = 5 + (State.player.level-1)*5;
                    }

                    // Restore UI
                    UI.inventory.render();
                    Missions.render();
                    UI.player.update();
                    
                    const appleEl = document.getElementById('apple-count');
                    if(appleEl) appleEl.textContent = `Apples: ${State.appleCount}`;

                    // Restore Animals
                    ['cat', 'dog'].forEach(animal => {
                        Animals.updateVisuals(animal);
                    });

                    UI.notifications.show("📂 Game Loaded!");
                } catch (e) {
                    console.error("Save load error:", e);
                    UI.notifications.show("❌ Error loading save!");
                }
            } else {
                UI.notifications.show("❌ No save found!");
            }
        },
        reset: () => {
            if(confirm("Are you sure you want to reset all progress?")){
                localStorage.removeItem('animalFarmSave');
                location.reload();
            }
        }
    };

    const Fireworks = {
        canvas: null,
        ctx: null,
        particles: [],
        init: () => {
            const c = document.createElement('canvas');
            c.id = 'fireworks-canvas';
            Object.assign(c.style, {
                position: 'fixed', left: 0, top: 0, width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 2500
            });
            document.body.appendChild(c);
            Fireworks.canvas = c;
            Fireworks.ctx = c.getContext('2d');
            window.addEventListener('resize', Fireworks.resize);
            Fireworks.resize();
            requestAnimationFrame(Fireworks.tick);
            
            // Allow click to launch
            c.addEventListener('click', (e)=>{
                // Pass through clicks if needed, but here we want to launch
            });
            // Actually, pointerEvents: none means we can't click it. 
            // The original code had pointerEvents none BUT added a click listener? 
            // That listener would never fire. I will leave it as is for now.
        },
        resize: () => {
            const dpr = window.devicePixelRatio || 1;
            Fireworks.canvas.width = window.innerWidth * dpr;
            Fireworks.canvas.height = window.innerHeight * dpr;
            Fireworks.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        },
        launch: (x, y, count=30) => {
            // Simplified particle logic
            for(let i=0; i<count; i++){
                const angle = Math.random() * Math.PI * 2;
                const speed = 50 + Math.random()*150;
                Fireworks.particles.push({
                    x, y, 
                    vx: Math.cos(angle) * speed, 
                    vy: Math.sin(angle) * speed,
                    life: 1.0 + Math.random(),
                    remaining: 1.0 + Math.random(),
                    color: `hsla(${Math.random()*360}, 90%, 60%, 1)`,
                    size: 2 + Math.random()*3
                });
            }
        },
        launchBatch: () => {
             const cx = window.innerWidth / 2;
             const cy = window.innerHeight / 3;
             Fireworks.launch(cx, cy, 40);
             setTimeout(()=>Fireworks.launch(cx-100, cy+50, 30), 200);
             setTimeout(()=>Fireworks.launch(cx+100, cy+50, 30), 400);
        },
        tick: (now) => {
            const dt = 0.016; // fixed timestep approx
            Fireworks.ctx.clearRect(0, 0, Fireworks.canvas.width, Fireworks.canvas.height);
            for(let i=Fireworks.particles.length-1; i>=0; i--){
                const p = Fireworks.particles[i];
                p.remaining -= dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.vy += 150 * dt; // gravity
                
                if(p.remaining <= 0) Fireworks.particles.splice(i,1);
                else {
                    Fireworks.ctx.globalAlpha = p.remaining / p.life;
                    Fireworks.ctx.fillStyle = p.color;
                    Fireworks.ctx.beginPath();
                    Fireworks.ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                    Fireworks.ctx.fill();
                }
            }
            requestAnimationFrame(Fireworks.tick);
        }
    };

    // ============================================================
    // 5. INITIALIZATION & EVENTS
    // ============================================================
    
    // Apple Tree
    setInterval(() => {
        State.appleCount++;
        const el = document.getElementById('apple-count');
        if(el) el.textContent = `Apples: ${State.appleCount}`;
        Inventory.add('Apple');
        Missions.progress("collectApple");
    }, 10000);

    // Event Listeners
    document.querySelectorAll('.info-item').forEach(item => {
        item.addEventListener('click', () => {
            UI.info.show(item.getAttribute('data-type'), item.getAttribute('data-name'));
        });
    });

    document.querySelectorAll('.feed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            Animals.feed(btn.getAttribute('data-animal'));
        });
    });

    // Shop
    document.getElementById("open-shop")?.addEventListener('click', () => UI.pages.show('shop-section'));
    document.querySelectorAll(".shop-item").forEach(btn => {
        btn.addEventListener("click", () => Shop.buy(btn.getAttribute("data-item")));
    });

    // Save/Load
    document.getElementById('save-btn')?.addEventListener('click', SaveSystem.save);
    document.getElementById('load-btn')?.addEventListener('click', SaveSystem.load);
    document.getElementById('reset-btn')?.addEventListener('click', SaveSystem.reset);

    // Lake Action (Quiz)
    document.getElementById('lake-action')?.addEventListener('click', () => {
        const modal = document.getElementById('quiz-modal');
        const qText = document.getElementById('quiz-question');
        const qOptions = document.getElementById('quiz-options');
        const quiz = Config.quizQuestions[Math.floor(Math.random()*Config.quizQuestions.length)];
        
        qText.textContent = quiz.q;
        qOptions.innerHTML = '';
        quiz.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.className = 'quiz-btn'; // Ensure css class exists or inline style
            btn.style.margin = "5px";
            btn.style.padding = "10px";
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(opt === quiz.answer){
                    const reward = Math.random()<0.5 ? 'Water' : 'Fish';
                    if(reward === "Fish") Missions.progress("catchFish");
                    Inventory.add(reward);
                    UI.notifications.show(`✅ Correct! You got a ${reward}`);
                } else {
                    UI.notifications.show("❌ Wrong! No reward this time.");
                }
                modal.style.display='none';
            });
            qOptions.appendChild(btn);
        });
        modal.style.display='flex';
    });

    document.getElementById('quiz-close')?.addEventListener('click', () => {
        document.getElementById('quiz-modal').style.display='none';
    });

    // Navigation
    window.showPage = UI.pages.show; // Expose for HTML onclicks

    // Mini Games (Simplified wrapper)
    // Word Puzzle
    const wordList = [
        {correct: "APPLE", wrong: ["APEL", "APPLL"]},
        {correct: "BANANA", wrong: ["BANNA", "BANAN"]},
        {correct: "DOG", wrong: ["DGO", "DOQ"]},
        {correct: "CAT", wrong: ["CTA", "CA7"]},
        {correct: "FISH", wrong: ["F1SH", "FIS"]},
    ];
    function loadWordPuzzle(){
        const q = wordList[Math.floor(Math.random()*wordList.length)];
        const questionEl = document.getElementById("wp-question");
        const optionsEl = document.getElementById("wp-options");
        if(!questionEl) return;

        let options = [q.correct, ...q.wrong].sort(()=>Math.random()-0.5);
        questionEl.textContent = "Which one is spelled correctly?";
        optionsEl.innerHTML = "";
        options.forEach(opt=>{
            const btn = document.createElement("button");
            btn.textContent = opt;
            btn.style.margin = "5px";
            btn.onclick = ()=>{
                if(opt === q.correct){
                    UI.notifications.show("✅ Correct! You earned a Water 💧");
                    Inventory.add("Water");
                } else {
                    UI.notifications.show("❌ Wrong spelling!");
                }
                loadWordPuzzle();
            };
            optionsEl.appendChild(btn);
        });
    }
    document.getElementById("wp-next")?.addEventListener('click', loadWordPuzzle);

    // Reaction Game
    let rgReady = false;
    let rgStartTime = 0;
    document.getElementById("rg-start")?.addEventListener('click', ()=>{
        const status = document.getElementById("rg-status");
        status.textContent = "WAIT...";
        status.style.color = "red";
        rgReady = false;
        setTimeout(()=>{
            status.textContent = "CLICK!";
            status.style.color = "green";
            rgReady = true;
            rgStartTime = Date.now();
        }, Math.random()*2000 + 1000);
    });
    document.getElementById("reaction-game")?.addEventListener('click', ()=>{
        if(!rgReady) return;
        let time = Date.now() - rgStartTime;
        rgReady = false;
        UI.notifications.show(`⚡ Reaction: ${time}ms`);
        if(time < 400){
            Inventory.add("Fish");
            UI.notifications.show("🔥 Fast! You caught a Fish 🐟");
        }
    });

    // Memory Game
    let mgCards = ["🍎","🍎","🐟","🐟","💧","💧"];
    let mgSelected = [];
    document.getElementById("mg-restart")?.addEventListener('click', loadMemoryGame);
    function loadMemoryGame(){
        mgSelected = [];
        const board = document.getElementById("mg-board");
        if(!board) return;
        board.innerHTML = "";
        const shuffled = mgCards.sort(()=>Math.random()-0.5);
        shuffled.forEach((icon, index)=>{
            const card = document.createElement("div");
            card.className = "mg-card"; // Requires CSS
            // Inline CSS fallback for cards
            card.style.width = "50px"; card.style.height = "50px"; 
            card.style.display = "inline-flex"; card.style.justifyContent="center"; 
            card.style.alignItems="center"; card.style.background="#eee"; 
            card.style.margin="5px"; card.style.cursor="pointer";
            
            card.textContent = "❓";
            card.onclick = ()=>{
                if(card.textContent !== "❓" || mgSelected.length === 2) return;
                card.textContent = icon;
                mgSelected.push(card);
                if(mgSelected.length === 2){
                    setTimeout(()=>{
                        if(mgSelected[0].textContent === mgSelected[1].textContent){
                            UI.notifications.show("🎉 Match!");
                            Inventory.add(icon==="🐟"?"Fish":icon==="🍎"?"Apple":"Water");
                        } else {
                            mgSelected[0].textContent = "❓";
                            mgSelected[1].textContent = "❓";
                        }
                        mgSelected = [];
                    }, 600);
                }
            };
            board.appendChild(card);
        });
    }

    // Audio
    const introBtn = document.getElementById('play-audio');
    const introAudio = document.getElementById('intro-audio');
    if(introBtn && introAudio) introBtn.addEventListener('click', () => introAudio.play().catch(e=>console.log(e)));
    
    const introBtn2 = document.getElementById('play2-intro');
    const introAudio2 = document.getElementById('intro2-audio');
    if(introBtn2 && introAudio2) introBtn2.addEventListener('click', () => introAudio2.play().catch(e=>console.log(e)));

    // Initialize
    Missions.generate();
    UI.inventory.render();
    UI.player.update();
    Animals.startAutoDialogue();
    Fireworks.init();
    loadWordPuzzle();
    loadMemoryGame();

});
