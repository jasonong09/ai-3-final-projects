document.addEventListener('DOMContentLoaded', function() {

    // -------------------- Info Data --------------------
    const infoData = {
        fruit: {
            Apple: "🍎 Apple: Crunchy and sweet! Perfect for pretending you’re in a fairy tale orchard. ✨",
            Banana: "🍌 Banana: Soft and yellow, ideal for slipping on… just kidding! Great energy snack. 💪"
        },
        animal: {
            Cat: "🐱 Cat: Loves naps, chasing shadows, and judging humans silently. 😼",
            Dog: "🐶 Dog: Loyal buddy who thinks you’re the best chef in the world. 🦴",
            Fish: "🐟 Fish: Swims gracefully, occasionally pretending to be a mermaid. 🧜‍♂️"
        }
    };

    // -------------------- Inventory --------------------
    let inventory = [];
    function updateInventory() {
        let invDiv = document.getElementById('inventory');
        if(!invDiv){
            invDiv = document.createElement('div');
            invDiv.id = 'inventory';
            invDiv.style.position = 'fixed';
            invDiv.style.right = '12px';
            invDiv.style.top = '12px';
            invDiv.style.zIndex = '3000';
            document.body.appendChild(invDiv);
        }
        invDiv.innerHTML = '';
        inventory.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.style.display = 'inline-block';
            div.style.margin = '4px';
            let img;
            switch(item){
                case 'Apple': img = document.createElement('img'); img.src='apple.png'; break;
                case 'Fish': img = document.createElement('img'); img.src='fish.png'; break;
                case 'Water': img = document.createElement('img'); img.src='water.png'; break;
                default: img = document.createTextNode(item);
            }
            if(img.tagName){ img.style.width='32px'; img.style.height='32px'; img.alt=item; }
            div.appendChild(img);
            invDiv.appendChild(div);
        });
    }

    // -------------------- Info Click --------------------
    document.querySelectorAll('.info-item').forEach(item=>{
        item.addEventListener('click', ()=>{
            const type = item.getAttribute('data-type');
            const name = item.getAttribute('data-name');
            document.getElementById('info-display').textContent = infoData[type][name] || "No info available.";
        });
    });

    // -------------------- Reward Notification --------------------
    function showRewardNotification(msg){
        const notif = document.getElementById('reward-notification');
        if(!notif) return;
        notif.textContent = msg;
        notif.style.display = 'block';
        notif.style.opacity = '1';
        setTimeout(()=>{ notif.style.opacity='0'; },1800);
        setTimeout(()=>{ notif.style.display='none'; },2200);
    }

    // -------------------- Apple Tree --------------------
    let appleCount = 0;
    function addApple(){
        appleCount++;
        const el = document.getElementById('apple-count');
        if(el) el.textContent = `Apples: ${appleCount}`;
        inventory.push('Apple');
        updateInventory();
        updateTaskProgress("collectApple");
    }
    setInterval(addApple,10000);

    // -------------------- Animal Growth --------------------
    let growthLevels = { cat:1, dog:1 };
    function feedAnimal(animal){
        let food = '';
        if(animal==='cat'){
            if(inventory.includes('Fish')) food='Fish';
            else if(inventory.includes('Water')) food='Water';
            else { alert("You don't have Fish or Water to feed the cat."); return; }
            updateTaskProgress("feedCat");
        }
        if(animal==='dog'){
            if(inventory.includes('Apple')) food='Apple';
            else if(inventory.includes('Water')) food='Water';
            else { alert("You don't have Apple or Water to feed the dog."); return; }
            updateTaskProgress("feedDog");
        }
        const index = inventory.indexOf(food);
        if(index>-1) inventory.splice(index,1);
        updateInventory();
        growthLevels[animal] += 1;
        const img = document.querySelector(`#${animal} img`);
        if(img){
            img.style.width = (100 + growthLevels[animal]*10)+'px';
            img.style.height='auto';
        }
        let mood='neutral';
        if(growthLevels[animal]>=10) mood='overjoyed';
        else if(growthLevels[animal]>=7) mood='satisfied';
        else if(growthLevels[animal]>=5) mood='excited';
        else if(growthLevels[animal]>=3) mood='happy';
        const animalEl = document.getElementById(animal);
        if(animalEl) animalEl.setAttribute('data-mood', mood);
        if(animal==='cat' && growthLevels.cat===5 && img) img.src='cat2.png';
        if(animal==='dog' && growthLevels.dog===5 && img) img.src='dog2.png';
        const speech = document.getElementById(`${animal}-speech`);
        let reaction = '';
        if(animal==='cat'){
            reaction = (food==='Fish') ? "Yummy! Meow~ 🐟" :
                       (food==='Water') ? "A nice drink~ Meow 💧" :
                       "Meow?";
        } else if(animal==='dog'){
            reaction = (food==='Apple') ? "Woof! So tasty! 🍎" :
                       (food==='Water') ? "Woof woof~ so refreshing 💦" :
                       "Woof？";
        }
        if(speech) speech.textContent = reaction;
        if(animal === 'cat') addEXP(1); // 喂猫加 10 EXP
        else if(animal === 'dog') addEXP(1); // 喂狗加 10 EXP
        setTimeout(()=>{ if(speech) speech.textContent = randomDialogue(animal); }, 3000);
    }

    document.querySelectorAll('.feed-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const animal = btn.getAttribute('data-animal');
            feedAnimal(animal);
        });
    });

    // -------------------- Quiz --------------------
    const quizQuestions = [
    {q:"💧 Which one is water?", options:["Fish","Water"], answer:"Water"},
    {q:"🍎 Which fruit is red and crunchy?", options:["Banana","Apple"], answer:"Apple"},
    {q:"🐶 Which animal is loyal and friendly?", options:["Cat","Dog"], answer:"Dog"},
    {q:"🐱 Which animal loves napping and chasing shadows?", options:["Dog","Cat"], answer:"Cat"},
    {q:"🌞 Which fruit is yellow and high in energy?", options:["Banana","Apple"], answer:"Banana"},
    {q:"🐟 Which animal glides gracefully in water?", options:["Fish","Dog"], answer:"Fish"},

    // --- New Questions ---
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
    {q:"🦋 Which one can fly?", options:["Butterfly","Fish"], answer:"Butterfly"},
    {q:"🐰 Which animal loves carrots?", options:["Rabbit","Dog"], answer:"Rabbit"}
];


    const lakeBtn = document.getElementById('lake-action');
    if(lakeBtn){
        lakeBtn.addEventListener('click', ()=>{
            const modal = document.getElementById('quiz-modal');
            const qText = document.getElementById('quiz-question');
            const qOptions = document.getElementById('quiz-options');
            const quiz = quizQuestions[Math.floor(Math.random()*quizQuestions.length)];
            qText.textContent = quiz.q;
            qOptions.innerHTML = '';
            quiz.options.forEach(opt=>{
                const btn = document.createElement('button');
                btn.textContent = opt;
                btn.className = 'quiz-btn';
                btn.type = 'button';
                btn.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    if(opt===quiz.answer){
                        const reward = Math.random()<0.5 ? 'Water' : 'Fish';
                        if(reward === "Fish") updateTaskProgress("catchFish");
                        inventory.push(reward);
                        updateInventory();
                        showRewardNotification(`✅ Correct! You got a ${reward==='Water'?'bottle of water💧':'fish🐟'}`);
                    } else {
                        showRewardNotification("❌ Wrong! No reward this time😢");
                    }
                    modal.style.display='none';
                });
                qOptions.appendChild(btn);
            });
            modal.style.display='flex';
        });
    }

    const quizCloseBtn = document.getElementById('quiz-close');
    if(quizCloseBtn){
        quizCloseBtn.addEventListener('click', ()=>{
            document.getElementById('quiz-modal').style.display='none';
        });
    }

    // -------------------- Animal Auto Dialogue --------------------
    const animalDialogues = {
        cat: [
            "Meow~ It's such a comfy day 😸",
            "Feed me some fish! 🐟",
            "Have you seen my mouse? 🐭",
            "Purr~ I'm sunbathing ☀️",
            "I'm the real star of this farm! ✨"
        ],
        dog: [
            "Woof woof! You're my favorite human ❤️",
            "Are we going for a walk today? 🏞️",
            "I'm hungry... got any apples? 🍎",
            "I'll guard the house for you! 💪",
            "Wagging my tail~ so happy 🐾"
        ]
    };

    function randomDialogue(animal) {
        const lines = animalDialogues[animal];
        return lines[Math.floor(Math.random() * lines.length)];
    }

    function makeAnimalTalk(animal, interval) {
        const speechDiv = document.getElementById(`${animal}-speech`);
        if(!speechDiv) return;
        setInterval(() => {
            speechDiv.textContent = randomDialogue(animal);
        }, interval);
    }

    makeAnimalTalk('cat', 5000);
    makeAnimalTalk('dog', 6000);

    updateInventory();

    // ------------------------------------------------------------
    // ✅ DAILY MISSIONS SYSTEM
    // ------------------------------------------------------------
    const possibleTasks = [
        { type: "collectApple", text: "Collect 5 Apples", goal: 5 },
        { type: "catchFish", text: "Catch 2 Fish", goal: 2 },
        { type: "feedCat", text: "Feed the Cat 3 times", goal: 3 },
        { type: "feedDog", text: "Feed the Dog 3 times", goal: 3 }
    ];

    let dailyTasks = [];
    let taskProgress = { collectApple: 0, catchFish: 0, feedCat: 0, feedDog: 0 };

    function generateDailyTasks() {
        dailyTasks = [];
        let used = new Set();
        while (dailyTasks.length < 3) {
            let t = possibleTasks[Math.floor(Math.random() * possibleTasks.length)];
            if (!used.has(t.type)) {
                used.add(t.type);
                dailyTasks.push({ ...t });
            }
        }
        renderTasks();
    }

    function renderTasks() {
        const list = document.getElementById("task-list");
        if(!list) return;
        list.innerHTML = "";
        dailyTasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = `${task.text} (${taskProgress[task.type]}/${task.goal})`;
            li.id = `task-${task.type}`;
            list.appendChild(li);
        });
    }

    function updateTaskProgress(type) {
        if (!(type in taskProgress)) return;
        taskProgress[type]++;
        const li = document.getElementById(`task-${type}`);
        if (li) {
            const task = dailyTasks.find(t => t.type === type);
            li.textContent = `${task.text} (${taskProgress[type]}/${task.goal})`;
        }
        checkTaskCompletion();
    }

    function resetDailyTasks(){
        taskProgress = { collectApple: 0, catchFish: 0, feedCat: 0, feedDog: 0 };
        dailyTasks.forEach(t => t.completed = false);
        generateDailyTasks();
        showRewardNotification("🔄 New missions generated!");
    }

    function checkTaskCompletion() {
        let allCompleted = true;
        dailyTasks.forEach(task => {
            if (!task.completed && taskProgress[task.type] >= task.goal) {
                task.completed = true;
                const reward = Math.random() < 0.5 ? "Apple" : "Fish";
                inventory.push(reward);
                updateInventory();
                showRewardNotification(`🎉 Mission Complete! Reward: ${reward}`);
            }
            if (!task.completed) allCompleted = false;
        });
        if (allCompleted && dailyTasks.length > 0) {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 3;
            launchFireworks(cx, cy, 36);
            launchFireworks(cx - 150, cy + 80, 28);
            launchFireworks(cx + 150, cy + 80, 28);
            setTimeout(() => { resetDailyTasks(); }, 1600);
        }
    }

    generateDailyTasks();

    // -------------------- FIREWORKS --------------------
    const fwCanvas = document.createElement('canvas');
    fwCanvas.id = 'fireworks-canvas';
    fwCanvas.style.position = 'fixed';
    fwCanvas.style.left = '0';
    fwCanvas.style.top = '0';
    fwCanvas.style.width = '100%';
    fwCanvas.style.height = '100%';
    fwCanvas.style.pointerEvents = 'none';
    fwCanvas.style.zIndex = '2500';
    document.body.appendChild(fwCanvas);
    const fwc = fwCanvas;
    const fwCtx = fwc.getContext('2d');

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        fwc.width = Math.floor(window.innerWidth * dpr);
        fwc.height = Math.floor(window.innerHeight * dpr);
        fwc.style.width = window.innerWidth + 'px';
        fwc.style.height = window.innerHeight + 'px';
        fwCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

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

    let particles = [];
    let lastTime = performance.now();

    function launchFireworks(x, y, count = 30){
        for(let i=0;i<6;i++){
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random()*120;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed * 0.6;
            particles.push(new Particle(x, y, vx, vy, 0.9 + Math.random()*0.5, `hsla(${Math.random()*360}, 90%, 60%, 1)`, 3 + Math.random()*3));
        }
        for(let i=0;i<count;i++){
            const angle = Math.random() * Math.PI * 2;
            const speed = 60 + Math.random()*220;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = `hsla(${Math.random()*360}, 90%, 55%, 1)`;
            const size = 2 + Math.random()*3;
            particles.push(new Particle(x, y, vx, vy, 1.0 + Math.random()*0.9, color, size));
        }
    }

    function tick(now){
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        fwCtx.clearRect(0, 0, fwc.width, fwc.height);
        for(let i = particles.length - 1; i >= 0; i--){
            const p = particles[i];
            p.update(dt);
            if(p.remaining <= 0 || p.y > window.innerHeight + 50){
                particles.splice(i,1);
            } else { p.draw(fwCtx); }
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    fwCanvas.addEventListener('click', (e)=>{
        const r = fwCanvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        launchFireworks(x, y, 40);
    });

    // -------------------- Listen to Introduction --------------------
    const introBtn = document.getElementById('play-audio');
    const introAudio = document.getElementById('intro-audio');

    if(introBtn && introAudio){
       introBtn.addEventListener('click', () => {
           introAudio.play().catch(err => console.log('Audio play failed:', err));
       });
    }
   const introBtn2 = document.getElementById('play2-intro');
   const introAudio2 = document.getElementById('intro2-audio');

   if (introBtn2 && introAudio2) {
      introBtn2.addEventListener('click', () => {
        introAudio2.play().catch(err => console.log("Audio play failed:", err));
       });
     } 
     // -------------------- Word Puzzle --------------------
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

    let options = [q.correct, ...q.wrong];
    options.sort(()=>Math.random() - 0.5);

    questionEl.textContent = "Which one is spelled correctly?";
    optionsEl.innerHTML = "";

    options.forEach(opt=>{
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = ()=>{
            if(opt === q.correct){
                showRewardNotification("✅ Correct! You earned a Water 💧");
                inventory.push("Water");
                updateInventory();
            } else {
                showRewardNotification("❌ Wrong spelling!");
            }
        };
        optionsEl.appendChild(btn);
       });
     }

    document.getElementById("wp-next").onclick = loadWordPuzzle;
    loadWordPuzzle();

    // -------------------- Reaction Game --------------------
   let rgReady = false;
   let rgStartTime = 0;

   document.getElementById("rg-start").onclick = ()=>{
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
   };

    document.getElementById("reaction-game").onclick = ()=>{
    if(!rgReady) return;

    let time = Date.now() - rgStartTime;
    rgReady = false;

    showRewardNotification(`⚡ Reaction: ${time}ms`);

    if(time < 300){
        inventory.push("Fish");
        updateInventory();
        showRewardNotification("🔥 Amazing! You caught a Fish 🐟");
    }
    };

    // -------------------- Memory Game --------------------
    let mgCards = ["🍎","🍎","🐟","🐟","💧","💧"];
    let mgSelected = [];
   let mgMatched = 0;

  function loadMemoryGame(){
    mgSelected = [];
    mgMatched = 0;

    const board = document.getElementById("mg-board");
    board.innerHTML = "";

    const shuffled = mgCards.sort(()=>Math.random()-0.5);

    shuffled.forEach((icon, index)=>{
        const card = document.createElement("div");
        card.className = "mg-card";
        card.dataset.icon = icon;
        card.dataset.index = index;
        card.textContent = "❓";

        card.onclick = ()=>{
            if(card.textContent !== "❓" || mgSelected.length === 2) return;

            card.textContent = icon;
            mgSelected.push(card);

            if(mgSelected.length === 2){
                setTimeout(()=>{
                    if(mgSelected[0].dataset.icon === mgSelected[1].dataset.icon){
                        mgMatched++;
                        showRewardNotification("🎉 Match!");
                        inventory.push(icon==="🐟"?"Fish":icon==="🍎"?"Apple":"Water");
                        updateInventory();
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

document.getElementById("mg-restart").onclick = loadMemoryGame;
loadMemoryGame();

// -------------------- Player Level System --------------------
let player = {
    level: 1,
    exp: 0,
    expToNext: 5
};

function addEXP(amount) {
    player.exp += amount;

    // 如果升级
    if (player.exp >= player.expToNext) {
        player.level++;
        player.exp = player.exp - player.expToNext;
        player.expToNext += 5; // 每次升级需要更多经验

        showLevelUpMessage();
    }

    updatePlayerUI();
}

function updatePlayerUI() {
    document.getElementById("player-level").textContent = player.level;
    document.getElementById("player-exp").textContent = player.exp;
    document.getElementById("player-exp-max").textContent = player.expToNext;

    document.getElementById("exp-bar").style.width =
    (player.exp / player.expToNext * 100) + "%";
}
function showLevelUpMessage() {
    const msg = document.getElementById("level-up-msg");
    msg.style.display = "block";

    setTimeout(() => {
        msg.style.display = "none";
    }, 2000);
}

// 初始化 UI
updatePlayerUI();
 
});
