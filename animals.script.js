// ============================================================================
// GLOBAL HELPERS
// ============================================================================
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    const target = document.getElementById(pageId);
    if (target) target.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const State = {
        inventory: [],
        growthLevels: { cat: 1, dog: 1 },
        feedCounts: { cat: 0, dog: 0 },
        appleCount: 0,
        player: { level: 1, exp: 0, expToNext: 5 },
        dailyTasks: [],
        taskProgress: { collectApple: 0, catchFish: 0, feedCat: 0, feedDog: 0 },
        // Timers/Intervals can be stored here if needed
        intervals: []
    };

    // ============================================================================
    // CONFIGURATION & DATA
    // ============================================================================
    const Config = {
        infoData: {
            fruit: {
                Apple: { text: "🍎 Apple<br><br>Apples are red, shiny, and crunchy.<br>They taste sweet and juicy.<br><br>Eating apples helps you stay healthy and strong.<br>An apple a day makes you smile every day!", img: "apple.png" },
                Banana: { text: "🍌 Banana<br><br>Bananas are yellow and soft.<br>They are easy to peel and fun to eat.<br><br>Bananas give you lots of energy.<br>They are great for breakfast or snacks!", img: "banana.png" }
            },
            animal: {
                Cat: { text: "🐱 Cat<br><br>Cats are cute and soft animals.<br>They love sleeping and taking naps.<br><br>Cats like to chase small things and play quietly.<br>When they are happy, they say meow~ 😸", img: "cat.png" },
                Dog: { text: "🐶 Dog<br><br>Dogs are friendly and loyal animals.<br>They love their owners very much.<br><br>Dogs enjoy running, playing, and eating treats.<br>They protect the farm and say woof woof! 🐾", img: "dog.png" },
                Fish: { text: "🐟 Fish<br><br>Fish live in water and swim all day.<br>They move their tails to go forward.<br><br>Fish are quiet and colorful animals.<br>They like clean water and gentle waves 🌊", img: "fish.png" }
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
        ]
    };

    // ============================================================================
    // UI MODULE
    // ============================================================================
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
            },
            levelUp: () => {
                const msg = document.getElementById("level-up-msg");
                if(msg) {
                    msg.style.display = "block";
                    setTimeout(() => { msg.style.display = "none"; }, 2000);
                }
            }
        },
        
        player: {
            update: () => {
                const p = State.player;
                const elLevel = document.getElementById("player-level");
                const elExp = document.getElementById("player-exp");
                const elMax = document.getElementById("player-exp-max");
                const elBar = document.getElementById("exp-bar");

                if(elLevel) elLevel.textContent = p.level;
                if(elExp) elExp.textContent = p.exp;
                if(elMax) elMax.textContent = p.expToNext;
                if(elBar) elBar.style.width = (p.exp / p.expToNext * 100) + "%";
            }
        },

        inventory: {
            render: () => {
                let invDiv = document.getElementById('inventory');
                if(!invDiv){
                    invDiv = document.createElement('div');
                    invDiv.id = 'inventory';
                    Object.assign(invDiv.style, {
                        position: 'fixed', right: '12px', top: '12px', zIndex: '3000'
                    });
                    document.body.appendChild(invDiv);
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
                            img = null; 
                            div.textContent = item;
                    }
                    if(img) div.appendChild(img);
                    invDiv.appendChild(div);
                });
            }
        },

        info: {
            display: (type, name) => {
                const info = Config.infoData[type]?.[name];
                if(!info){
                    document.getElementById('info-display').textContent = "No info available.";
                    return;
                }
                document.getElementById('info-display').innerHTML = `
                    <div style="text-align:center; background: rgba(255,255,255,0.85); padding: 12px; border-radius: 12px;">
                        <img src="${info.img}" style="width:120px; margin-bottom:8px;">
                        <p>${info.text}</p>
                    </div>
                `;
            }
        },

        canvas: {
            init: () => {
                const fwCanvas = document.createElement('canvas');
                fwCanvas.id = 'fireworks-canvas';
                Object.assign(fwCanvas.style, {
                    position: 'fixed', left: '0', top: '0', width: '100%', height: '100%',
                    pointerEvents: 'none', zIndex: '2500'
                });
                document.body.appendChild(fwCanvas);
                
                window.addEventListener('resize', UI.canvas.resize);
                UI.canvas.resize();
                
                // Animation Loop
                requestAnimationFrame(UI.canvas.tick);

                // Click handler
                fwCanvas.addEventListener('click', (e)=>{
                    // Logic handled in global click or specific canvas click?
                    // Original code had click listener on canvas
                });
                
                return fwCanvas;
            },
            resize: () => {
                const c = document.getElementById('fireworks-canvas');
                if(!c) return;
                const dpr = window.devicePixelRatio || 1;
                c.width = Math.floor(window.innerWidth * dpr);
                c.height = Math.floor(window.innerHeight * dpr);
                c.style.width = window.innerWidth + 'px';
                c.style.height = window.innerHeight + 'px';
                const ctx = c.getContext('2d');
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            },
            tick: (now) => {
                Fireworks.tick(now);
                requestAnimationFrame(UI.canvas.tick);
            }
        }
    };

    // ============================================================================
    // LOGIC MODULES
    // ============================================================================
    
    const Inventory = {
        add: (item) => {
            State.inventory.push(item);
            UI.inventory.render();
        },
        remove: (item, count = 1) => {
            let removed = 0;
            for(let i=State.inventory.length-1; i>=0 && removed<count; i--){
                if(State.inventory[i]===item){
                    State.inventory.splice(i,1);
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
            if (State.player.exp >= State.player.expToNext) {
                State.player.level++;
                State.player.exp -= State.player.expToNext;
                State.player.expToNext += 5;
                UI.notifications.levelUp();
                Fireworks.launch(window.innerWidth/2, window.innerHeight/2, 50);
            }
            UI.player.update();
        }
    };

    const Animals = {
        feed: (animal) => {
            let food = '';
            const inv = Inventory;
            
            // Determine food preference logic
            if(animal === 'cat'){
                if(inv.has("LuckyCharm")) food="LuckyCharm";
                else if(inv.has("CatFood")) food="CatFood";
                else if(inv.has('Fish')) food='Fish';
                else if(inv.has('Water')) food='Water';           
                else { alert("You don't have Fish or Water to feed the cat."); return; }
                Missions.progress("feedCat");
            } else if(animal === 'dog'){
                if(inv.has("LuckyCharm")) food="LuckyCharm";
                else if(inv.has("DogBone")) food="DogBone";
                else if(inv.has('Apple')) food='Apple';
                else if(inv.has('Water')) food='Water';
                else { alert("You don't have Apple or Water to feed the dog."); return; }
                Missions.progress("feedDog");
            }

            // Consume Food
            inv.remove(food, 1);
            
            // Growth Logic
            State.feedCounts[animal] = (State.feedCounts[animal] || 0) + 1;
            
            let didGrow = false;
            if(State.feedCounts[animal] >= 3){
                State.feedCounts[animal] = 0;
                State.growthLevels[animal] += 1;
                didGrow = true;
                UI.notifications.show(`${animal === 'cat' ? '🐱' : '🐶'} grew bigger!`);
            } else {
                UI.notifications.show(`Fed ${animal}! (${State.feedCounts[animal]}/3 to grow)`);
            }

            const level = State.growthLevels[animal];
            
            // Update Visuals
            const img = document.querySelector(`#${animal} img`);
            if(img){
                img.style.width = (100 + level*10)+'px';
                if(animal==='cat' && level===5) img.src='cat2.png';
                if(animal==='dog' && level===5) img.src='dog2.png';
            }
            
            // Mood
            let mood='neutral';
            if(level>=10) mood='overjoyed';
            else if(level>=7) mood='satisfied';
            else if(level>=5) mood='excited';
            else if(level>=3) mood='happy';
            const animalEl = document.getElementById(animal);
            if(animalEl) animalEl.setAttribute('data-mood', mood);

            // Dialogue
            const speech = document.getElementById(`${animal}-speech`);
            let reaction = '';
            if(animal==='cat'){
                reaction = (food==='Fish') ? "Yummy! Meow~ 🐟" : (food==='Water') ? "A nice drink~ Meow 💧" : "Meow?";
            } else {
                reaction = (food==='Apple') ? "Woof! So tasty! 🍎" : (food==='Water') ? "Woof woof~ so refreshing 💦" : "Woof？";
            }
            if(speech) speech.textContent = reaction;
            setTimeout(()=>{ if(speech) speech.textContent = Animals.getRandomDialogue(animal); }, 3000);

            // EXP Reward
            let expGain = 1;
            if(food === 'CatFood' || food === 'DogBone') expGain = 5;
            if(food === 'LuckyCharm') expGain = 15;
            Player.addExp(expGain);
        },

        getRandomDialogue: (animal) => {
            const lines = Config.animalDialogues[animal];
            return lines[Math.floor(Math.random() * lines.length)];
        },

        startChatter: () => {
            setInterval(() => {
                const el = document.getElementById('cat-speech');
                if(el) el.textContent = Animals.getRandomDialogue('cat');
            }, 5000);
            setInterval(() => {
                const el = document.getElementById('dog-speech');
                if(el) el.textContent = Animals.getRandomDialogue('dog');
            }, 6000);
        }
    };

    const Missions = {
        possibleTasks: [
            { type: "collectApple", text: "Collect 5 Apples", goal: 5 },
            { type: "catchFish", text: "Catch 2 Fish", goal: 2 },
            { type: "feedCat", text: "Feed the Cat 3 times", goal: 3 },
            { type: "feedDog", text: "Feed the Dog 3 times", goal: 3 }
        ],
        
        generate: () => {
            State.dailyTasks = [];
            let used = new Set();
            while (State.dailyTasks.length < 3) {
                let t = Missions.possibleTasks[Math.floor(Math.random() * Missions.possibleTasks.length)];
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
            if (!(type in State.taskProgress)) return;
            State.taskProgress[type]++;
            Missions.render(); // Re-render to update counts
            Missions.checkCompletion();
        },

        checkCompletion: () => {
            let allCompleted = true;
            State.dailyTasks.forEach(task => {
                if (!task.completed && (State.taskProgress[task.type] || 0) >= task.goal) {
                    task.completed = true;
                    const reward = Math.random() < 0.5 ? "Apple" : "Fish";
                    Inventory.add(reward);
                    UI.notifications.show(`🎉 Mission Complete! Reward: ${reward}`);
                }
                if (!task.completed) allCompleted = false;
            });
            
            // Re-render to show strikethrough
            Missions.render();

            if (allCompleted && State.dailyTasks.length > 0) {
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 3;
                Fireworks.launch(cx, cy, 36);
                Fireworks.launch(cx - 150, cy + 80, 28);
                Fireworks.launch(cx + 150, cy + 80, 28);
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
                if(Inventory.count("Fish") < 3) return alert("Not enough Fish!");
                Inventory.remove("Fish", 3);
                Inventory.add("CatFood");
            } else if(item === "DogBone"){
                if(Inventory.count("Apple") < 3) return alert("Not enough Apples!");
                Inventory.remove("Apple", 3);
                Inventory.add("DogBone");
            } else if(item === "LuckyCharm"){
                if(Inventory.count("Water") < 10) return alert("Not enough Water!");
                Inventory.remove("Water", 10);
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
                const gameState = JSON.parse(savedData);
                State.inventory = gameState.inventory || [];
                State.growthLevels = gameState.growthLevels || { cat:1, dog:1 };
                State.feedCounts = gameState.feedCounts || { cat:0, dog:0 };
                State.dailyTasks = gameState.dailyTasks || [];
                State.taskProgress = gameState.taskProgress || { collectApple: 0, catchFish: 0, feedCat: 0, feedDog: 0 };
                State.appleCount = gameState.appleCount || 0;
                
                // Restore Player
                if(gameState.player) {
                    State.player = gameState.player;
                } else if (gameState.playerLevel) {
                     // Legacy save support
                     State.player.level = gameState.playerLevel;
                     State.player.exp = gameState.playerExp;
                     State.player.expToNext = gameState.playerExpToNext || (5 + (State.player.level-1)*5);
                }

                // Restore UI
                UI.inventory.render();
                Missions.render();
                UI.player.update();
                
                const appleEl = document.getElementById('apple-count');
                if(appleEl) appleEl.textContent = `Apples: ${State.appleCount}`;

                // Restore Animals
                ['cat', 'dog'].forEach(animal => {
                    const img = document.querySelector(`#${animal} img`);
                    if(img){
                        const lvl = State.growthLevels[animal];
                        img.style.width = (100 + lvl*10)+'px';
                        if(animal==='cat' && lvl>=5) img.src='cat2.png';
                        if(animal==='dog' && lvl>=5) img.src='dog2.png';
                    }
                });

                UI.notifications.show("📂 Game Loaded!");
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

    // ============================================================================
    // MINI GAMES
    // ============================================================================
    const MiniGames = {
        wordPuzzle: {
            list: [
                {correct: "APPLE", wrong: ["APEL", "APPLL"]},
                {correct: "BANANA", wrong: ["BANNA", "BANAN"]},
                {correct: "DOG", wrong: ["DGO", "DOQ"]},
                {correct: "CAT", wrong: ["CTA", "CA7"]},
                {correct: "FISH", wrong: ["F1SH", "FIS"]},
            ],
            load: () => {
                const q = MiniGames.wordPuzzle.list[Math.floor(Math.random()*MiniGames.wordPuzzle.list.length)];
                const questionEl = document.getElementById("wp-question");
                const optionsEl = document.getElementById("wp-options");
                
                let options = [q.correct, ...q.wrong].sort(()=>Math.random() - 0.5);
                
                if(questionEl) questionEl.textContent = "Which one is spelled correctly?";
                if(optionsEl) {
                    optionsEl.innerHTML = "";
                    options.forEach(opt=>{
                        const btn = document.createElement("button");
                        btn.textContent = opt;
                        btn.onclick = ()=>{
                            if(opt === q.correct){
                                UI.notifications.show("✅ Correct! You earned a Water 💧");
                                Inventory.add("Water");
                            } else {
                                UI.notifications.show("❌ Wrong spelling!");
                            }
                        };
                        optionsEl.appendChild(btn);
                    });
                }
            }
        },
        reactionGame: {
            ready: false,
            startTime: 0,
            init: () => {
                const startBtn = document.getElementById("rg-start");
                const gameArea = document.getElementById("reaction-game");
                const status = document.getElementById("rg-status");
                
                if(startBtn) startBtn.onclick = () => {
                    status.textContent = "WAIT...";
                    status.style.color = "red";
                    MiniGames.reactionGame.ready = false;
                    
                    setTimeout(()=>{
                        status.textContent = "CLICK!";
                        status.style.color = "green";
                        MiniGames.reactionGame.ready = true;
                        MiniGames.reactionGame.startTime = Date.now();
                    }, Math.random()*2000 + 1000);
                };

                if(gameArea) gameArea.onclick = () => {
                    if(!MiniGames.reactionGame.ready) return;
                    let time = Date.now() - MiniGames.reactionGame.startTime;
                    MiniGames.reactionGame.ready = false;
                    UI.notifications.show(`⚡ Reaction: ${time}ms`);
                    
                    if(time < 300){
                        Inventory.add("Fish");
                        UI.notifications.show("🔥 Amazing! You caught a Fish 🐟");
                    }
                };
            }
        },
        memoryGame: {
            cards: ["🍎","🍎","🐟","🐟","💧","💧"],
            selected: [],
            matched: 0,
            load: () => {
                MiniGames.memoryGame.selected = [];
                MiniGames.memoryGame.matched = 0;
                const board = document.getElementById("mg-board");
                if(!board) return;
                board.innerHTML = "";
                
                const shuffled = [...MiniGames.memoryGame.cards].sort(()=>Math.random()-0.5);
                
                shuffled.forEach((icon, index)=>{
                    const card = document.createElement("div");
                    card.className = "mg-card";
                    card.dataset.icon = icon;
                    card.textContent = "❓";
                    
                    card.onclick = () => {
                        if(card.textContent !== "❓" || MiniGames.memoryGame.selected.length === 2) return;
                        card.textContent = icon;
                        MiniGames.memoryGame.selected.push(card);
                        
                        if(MiniGames.memoryGame.selected.length === 2){
                            setTimeout(()=>{
                                const [c1, c2] = MiniGames.memoryGame.selected;
                                if(c1.dataset.icon === c2.dataset.icon){
                                    MiniGames.memoryGame.matched++;
                                    UI.notifications.show("🎉 Match!");
                                    Inventory.add(icon==="🐟"?"Fish":icon==="🍎"?"Apple":"Water");
                                } else {
                                    c1.textContent = "❓";
                                    c2.textContent = "❓";
                                }
                                MiniGames.memoryGame.selected = [];
                            }, 600);
                        }
                    };
                    board.appendChild(card);
                });
            }
        }
    };

    // ============================================================================
    // FIREWORKS SYSTEM
    // ============================================================================
    class Particle {
        constructor(x, y, vx, vy, life, color, size){
            this.x = x; this.y = y; this.vx = vx; this.vy = vy;
            this.life = life; this.remaining = life;
            this.color = color; this.size = size;
        }
        update(dt){
            this.remaining -= dt;
            this.vy += 120 * dt;
            this.x += this.vx * dt;
            this.y += this.vy * dt;
        }
        draw(ctx){
            const t = Math.max(this.remaining / this.life, 0);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = t;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.size * t, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const Fireworks = {
        particles: [],
        lastTime: performance.now(),
        launch: (x, y, count = 30) => {
            for(let i=0;i<6;i++){
                const angle = Math.random() * Math.PI * 2;
                const speed = 80 + Math.random()*120;
                Fireworks.particles.push(new Particle(x, y, Math.cos(angle)*speed, Math.sin(angle)*speed*0.6, 0.9+Math.random()*0.5, `hsla(${Math.random()*360}, 90%, 60%, 1)`, 3+Math.random()*3));
            }
            for(let i=0;i<count;i++){
                const angle = Math.random() * Math.PI * 2;
                const speed = 60 + Math.random()*220;
                Fireworks.particles.push(new Particle(x, y, Math.cos(angle)*speed, Math.sin(angle)*speed, 1.0+Math.random()*0.9, `hsla(${Math.random()*360}, 90%, 55%, 1)`, 2+Math.random()*3));
            }
        },
        tick: (now) => {
            const dt = Math.min((now - Fireworks.lastTime) / 1000, 0.05);
            Fireworks.lastTime = now;
            const c = document.getElementById('fireworks-canvas');
            if(!c) return;
            const ctx = c.getContext('2d');
            ctx.clearRect(0, 0, c.width, c.height);
            for(let i = Fireworks.particles.length - 1; i >= 0; i--){
                const p = Fireworks.particles[i];
                p.update(dt);
                if(p.remaining <= 0 || p.y > window.innerHeight + 50){
                    Fireworks.particles.splice(i,1);
                } else { p.draw(ctx); }
            }
        }
    };


    // ============================================================================
    // INITIALIZATION & EVENT LISTENERS
    // ============================================================================
    
    // 1. Init UI
    UI.canvas.init();
    UI.inventory.render();
    UI.player.update();
    Missions.generate();
    Animals.startChatter();

    // 2. Event Listeners - Info Items
    document.querySelectorAll('.info-item').forEach(item=>{
        item.addEventListener('click', ()=>{
            UI.info.display(item.getAttribute('data-type'), item.getAttribute('data-name'));
        });
    });

    // 3. Event Listeners - Apple Tree
    setInterval(() => {
        State.appleCount++;
        const el = document.getElementById('apple-count');
        if(el) el.textContent = `Apples: ${State.appleCount}`;
        Inventory.add('Apple');
        Missions.progress("collectApple");
    }, 10000);

    // 4. Event Listeners - Feeding
    document.querySelectorAll('.feed-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            Animals.feed(btn.getAttribute('data-animal'));
        });
    });

    // 5. Event Listeners - Lake/Quiz
    const lakeBtn = document.getElementById('lake-action');
    if(lakeBtn){
        lakeBtn.addEventListener('click', ()=>{
            const modal = document.getElementById('quiz-modal');
            const qText = document.getElementById('quiz-question');
            const qOptions = document.getElementById('quiz-options');
            const quiz = Config.quizQuestions[Math.floor(Math.random()*Config.quizQuestions.length)];
            
            if(qText) qText.textContent = quiz.q;
            if(qOptions) {
                qOptions.innerHTML = '';
                quiz.options.forEach(opt=>{
                    const btn = document.createElement('button');
                    btn.textContent = opt;
                    btn.className = 'quiz-btn';
                    btn.type = 'button';
                    btn.onclick = (e)=>{
                        e.stopPropagation();
                        if(opt===quiz.answer){
                            const reward = Math.random()<0.5 ? 'Water' : 'Fish';
                            if(reward === "Fish") Missions.progress("catchFish");
                            Inventory.add(reward);
                            UI.notifications.show(`✅ Correct! You got a ${reward==='Water'?'bottle of water💧':'fish🐟'}`);
                        } else {
                            UI.notifications.show("❌ Wrong! No reward this time😢");
                        }
                        if(modal) modal.style.display='none';
                    };
                    qOptions.appendChild(btn);
                });
            }
            if(modal) modal.style.display='flex';
        });
    }
    const quizCloseBtn = document.getElementById('quiz-close');
    if(quizCloseBtn) quizCloseBtn.onclick = () => document.getElementById('quiz-modal').style.display='none';

    // 6. Event Listeners - Audio
    const introBtn = document.getElementById('play-audio');
    const introAudio = document.getElementById('intro-audio');
    if(introBtn && introAudio) introBtn.onclick = () => introAudio.play().catch(console.error);
    
    const introBtn2 = document.getElementById('play2-intro');
    const introAudio2 = document.getElementById('intro2-audio');
    if(introBtn2 && introAudio2) introBtn2.onclick = () => introAudio2.play().catch(console.error);

    // 7. Event Listeners - Save/Load
    const saveBtn = document.getElementById('save-btn');
    if(saveBtn) saveBtn.onclick = SaveSystem.save;
    
    const loadBtn = document.getElementById('load-btn');
    if(loadBtn) loadBtn.onclick = SaveSystem.load;
    
    const resetBtn = document.getElementById('reset-btn');
    if(resetBtn) resetBtn.onclick = SaveSystem.reset;

    // 8. Event Listeners - Shop
    document.getElementById("open-shop").onclick = () => showPage('shop-section');
    document.querySelectorAll(".shop-item").forEach(btn=>{
        btn.addEventListener("click", () => Shop.buy(btn.getAttribute("data-item")));
    });

    // 9. Init Mini Games
    const wpNext = document.getElementById("wp-next");
    if(wpNext) wpNext.onclick = MiniGames.wordPuzzle.load;
    MiniGames.wordPuzzle.load();

    MiniGames.reactionGame.init();

    const mgRestart = document.getElementById("mg-restart");
    if(mgRestart) mgRestart.onclick = MiniGames.memoryGame.load;
    MiniGames.memoryGame.load();

    // 10. Click on Fireworks Canvas
    document.getElementById('fireworks-canvas').addEventListener('click', (e)=>{
        const r = e.target.getBoundingClientRect();
        Fireworks.launch(e.clientX - r.left, e.clientY - r.top, 40);
    });

});
