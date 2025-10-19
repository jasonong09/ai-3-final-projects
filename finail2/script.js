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
        const invDiv = document.getElementById('inventory');
        invDiv.innerHTML = '';
        inventory.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inventory-item';
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

    // -------------------- Apple Tree --------------------
    let appleCount = 0;
    function addApple(){
        appleCount++;
        document.getElementById('apple-count').textContent = `Apples: ${appleCount}`;
        inventory.push('Apple');
        updateInventory();
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
        }
        if(animal==='dog'){
            if(inventory.includes('Apple')) food='Apple';
            else if(inventory.includes('Water')) food='Water';
            else { alert("You don't have Apple or Water to feed the dog."); return; }
        }

        // 扣库存
        const index = inventory.indexOf(food);
        if(index>-1) inventory.splice(index,1);
        updateInventory();

        // 成长
        growthLevels[animal] += 1;
        const img = document.querySelector(`#${animal} img`);
        img.style.width = (100 + growthLevels[animal]*10)+'px';
        img.style.height='auto';

        // 情绪
        let mood='neutral';
        if(growthLevels[animal]>=10) mood='overjoyed';
        else if(growthLevels[animal]>=7) mood='satisfied';
        else if(growthLevels[animal]>=5) mood='excited';
        else if(growthLevels[animal]>=3) mood='happy';
        document.getElementById(animal).setAttribute('data-mood', mood);

        // 进化
        if(animal==='cat' && growthLevels.cat===5) img.src='cat2.png';
        if(animal==='dog' && growthLevels.dog===5) img.src='dog2.png';
    }

    document.querySelectorAll('.feed-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const animal = btn.getAttribute('data-animal');
            feedAnimal(animal);
        });
    });

    // -------------------- Reward Notification --------------------
    function showRewardNotification(msg){
        const notif = document.getElementById('reward-notification');
        notif.textContent = msg;
        notif.style.display = 'block';
        setTimeout(()=>{ notif.style.display='none'; },2000);
    }

    // -------------------- Quiz Questions --------------------
    const quizQuestions = [
        {q:"💧 Which one is water?", options:["Water","Fish"], answer:"Water"},
        {q:"🍎 Which fruit is red and crunchy?", options:["Apple","Banana"], answer:"Apple"},
        {q:"🐶 Which animal is loyal and friendly?", options:["Dog","Cat"], answer:"Dog"},
        {q:"🐱 Which animal loves napping and chasing shadows?", options:["Cat","Dog"], answer:"Cat"},
        {q:"🌞 Which fruit is yellow and high in energy?", options:["Banana","Apple"], answer:"Banana"},
        {q:"🐟 Which animal glides gracefully in water?", options:["Fish","Dog"], answer:"Fish"},
        {q:"🍌 Which fruit grows in bunches in tropical areas?", options:["Banana","Apple"], answer:"Banana"},
        {q:"🍏 Which fruit is green and can be sweet or sour?", options:["Apple","Banana"], answer:"Apple"},
        {q:"🐶 Which animal likes to play fetch?", options:["Dog","Fish"], answer:"Dog"},
        {q:"💦 Which item can you drink to quench thirst?", options:["Water","Fish"], answer:"Water"}
    ];

    // -------------------- Lake Button --------------------
    document.getElementById('lake-action').addEventListener('click', ()=>{
        const modal = document.getElementById('quiz-modal');
        const qText = document.getElementById('quiz-question');
        const qOptions = document.getElementById('quiz-options');

        // 随机选择题目
        const quiz = quizQuestions[Math.floor(Math.random()*quizQuestions.length)];
        qText.textContent = quiz.q;
        qOptions.innerHTML = '';

        quiz.options.forEach(opt=>{
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.style.cssText = `
                padding:8px 15px;
                border-radius:8px;
                border:none;
                cursor:pointer;
                background:#74b9ff;
                color:#fff;
                font-weight:bold;
                font-size:1em;
                box-shadow:0 2px 5px rgba(0,0,0,0.2);
                margin: 4px;
            `;
            btn.addEventListener('click', ()=>{
                if(opt===quiz.answer){
                    // 答对发放奖励
                    const reward = Math.random()<0.5 ? 'Water' : 'Fish';
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

    // -------------------- Close Quiz --------------------
    document.getElementById('quiz-close').addEventListener('click', ()=>{
        document.getElementById('quiz-modal').style.display='none';
    });

    // -------------------- Initialize --------------------
    updateInventory();
});
