document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. VARIÁVEIS DE ELEMENTOS HTML 
    // =========================================================
    const introContainer = document.getElementById('intro-container');
    const nextButtons = document.querySelectorAll('.next-btn');
    const menu = document.getElementById("menu");
    const startButton = document.getElementById("startButton");
    const gameScreen = document.getElementById("gameScreen");
    const flash = document.getElementById("flash");
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");
    const playerGif = document.getElementById("playerGif");
    const gameOverScreen = document.getElementById("gameOverScreen");
    
    // 
    const finalScoreDisplay = document.getElementById("finalScore"); 
    
    const restartButton = document.getElementById("restartButton");
    const introSound = document.getElementById("introSound");
    
    // Referência ao novo display de recorde
    const highScoreDisplay = document.getElementById("highScoreDisplay"); 

    // === EFEITOS VISUAIS (Fumaça e Brasas) ===
    const smokeCanvas = document.getElementById("smokeCanvas");
    const smokeCtx = smokeCanvas.getContext("2d");
    const emberCanvas = document.getElementById("emberCanvas");
    const emberCtx = emberCanvas.getContext("2d");
    let smokes = [], embers = [];

    // 
    
    gameCanvas.width = 800;
    gameCanvas.height = 600;

    function resizeCanvas() {
        smokeCanvas.width = emberCanvas.width = window.innerWidth;
        smokeCanvas.height = emberCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Smoke {
        constructor() { this.reset(); }
        reset() { this.x = Math.random() * smokeCanvas.width; this.y = smokeCanvas.height + 50; this.size = Math.random() * 150 + 50; this.speedY = Math.random() * 0.3 + 0.2; this.alpha = Math.random() * 0.2 + 0.05; }
        update() { this.y -= this.speedY; if (this.y + this.size < 0) this.reset(); }
        draw() { smokeCtx.beginPath(); smokeCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); smokeCtx.fillStyle = `rgba(255,255,255,${this.alpha})`; smokeCtx.fill(); }
    }
    class Ember {
        constructor() { this.reset(); }
        reset() { this.x = Math.random() * emberCanvas.width; this.y = Math.random() * emberCanvas.height; this.size = Math.random() * 3 + 1; this.speedY = Math.random() * -0.6 - 0.2; this.alpha = Math.random() * 0.8 + 0.2; this.color = `rgba(255,${100+Math.random()*100},0,${this.alpha})`; }
        update() { this.y += this.speedY; if (this.y < -10) this.reset(); }
        draw() { emberCtx.beginPath(); emberCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); emberCtx.fillStyle = this.color; emberCtx.fill(); }
    }

    for (let i = 0; i < 20; i++) smokes.push(new Smoke());
    for (let i = 0; i < 100; i++) embers.push(new Ember());

    function animateFX() {
        smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
        emberCtx.clearRect(0, 0, emberCanvas.width, emberCanvas.height);
        smokes.forEach(s => { s.update(); s.draw(); });
        embers.forEach(e => { e.update(); e.draw(); });
        requestAnimationFrame(animateFX);
    }

    menu.style.display = 'none';
    gameScreen.style.display = 'none';

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentScene = button.closest('.scene');
            const nextSceneId = button.getAttribute('data-next-scene');

            if (introSound.paused) {
                introSound.play().catch(e => console.error("Erro ao tocar áudio:", e));
            }

            if (nextSceneId === 'end') {
                currentScene.classList.add('hidden');
                introContainer.style.transition = 'opacity 1s ease-out';
                introContainer.style.opacity = '0';

                setTimeout(() => {
                    introContainer.style.display = 'none';
                    menu.style.display = 'flex';
                    animateFX();
                }, 1000);

            } else {
                const nextScene = document.getElementById(nextSceneId);
                currentScene.style.opacity = '0';
                setTimeout(() => {
                    currentScene.style.display = 'none';
                    currentScene.classList.add('hidden');
                    if (nextScene) {
                        nextScene.style.display = 'flex';
                        nextScene.offsetHeight;
                        nextScene.classList.remove('hidden');
                        nextScene.style.opacity = '1';
                    }
                }, 1000);
            }
        });
    });

    startButton.addEventListener("click", () => {
        flash.style.transition = "opacity 0.1s";
        flash.style.opacity = "1";

        if (introSound && !introSound.paused) {
            introSound.pause();
        }

        setTimeout(() => {
            flash.style.opacity = "0";
            menu.classList.add("fade-out");

            setTimeout(() => {
                menu.style.display = "none";
                gameScreen.style.display = "flex";
                startGame();
            }, 1000);
        }, 800);
    });

    const scene1 = document.getElementById('scene-1');
    if (scene1) {
        scene1.classList.remove('hidden');
        scene1.style.display = 'flex';
        scene1.style.opacity = '1';
    }


    // =========================================================
    // 4. LÓGICA DO JOGO
    // =========================================================

    let player = { x: (gameCanvas.width / 2) - 60, y: gameCanvas.height - 120, width: 120, height: 120, speed: 6 };
    let meteors = [];
    let keys = {};
    let score = 0;
    let gameRunning = false;
    
    // Variável de Recorde Global
    let highScore = 0; 
    
    // VARIÁVEIS DE DIFICULDADE
    let spawnProbability = 0.007;
    let baseSpeed = 2;
    const DIFFICULTY_INTERVAL = 1000;
    const MAX_SPAWN_PROBABILITY = 0.03;
    const MAX_SPEED = 7;
    // FIM VARIÁVEIS DE DIFICULDADE

    const meteorImage = new Image();
    meteorImage.src = "https://pngimg.com/uploads/meteor/meteor_PNG22.png";

    // Controle teclado - Mantido
    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    // Controle toque - Mantido
    let touchStartX = null, touchStartY = null;
    document.addEventListener("touchstart", e => { if (e.touches.length === 1) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; } });
    document.addEventListener("touchmove", e => {
        if (!gameRunning) return;
        if (e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - touchStartX;
            const deltaY = e.touches[0].clientY - touchStartY;
            player.x += deltaX;
            player.y += deltaY;
            if (player.x < 0) player.x = 0;
            if (player.x > gameCanvas.width - player.width) player.x = gameCanvas.width - player.width;
            if (player.y < 0) player.y = 0;
            if (player.y > gameCanvas.height - player.height) player.y = gameCanvas.height - player.height;
            touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; e.preventDefault();
        }
    }, { passive: false });

    // Criação meteoros - OK
    function createMeteor() {
        const size = 40 + Math.random() * 30;
        const x = Math.random() * (gameCanvas.width - size);
        
        const speed = baseSpeed + Math.random() * 2; 
        
        meteors.push({ x, y: -size, width: size, height: size, speed });
    }

    // Atualiza posição e colisão - OK
    function update() {
        // Movimento do Jogador
        if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
        if (keys["ArrowRight"] && player.x < gameCanvas.width - player.width) player.x += player.speed;
        if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
        if (keys["ArrowDown"] && player.y < gameCanvas.height - player.height) player.y += player.speed;

        // Posicionamento do GIF
        const rect = gameCanvas.getBoundingClientRect();
        playerGif.style.left = (rect.left + player.x) + "px";
        playerGif.style.top = (rect.top + player.y) + "px";

        // LÓGICA DE DIFICULDADE E GERAÇÃO
        if (score > 0 && score % DIFFICULTY_INTERVAL === 0) {
            if (spawnProbability < MAX_SPAWN_PROBABILITY) {
                spawnProbability += 0.001;
            }
            if (baseSpeed < MAX_SPEED) {
                baseSpeed += 0.5;
            }
            console.log(`Dificuldade aumentada! Probabilidade: ${spawnProbability.toFixed(4)}, Velocidade: ${baseSpeed.toFixed(1)}`);
        }

        // Geração de meteoros (usando a probabilidade variável)
        if (Math.random() < spawnProbability) 
            createMeteor();
            
        // Movimento de meteoros
        meteors.forEach(m => m.y += m.speed);
        meteors = meteors.filter(m => m.y < gameCanvas.height);
        
        // === COLISÃO REAL SOBRE O DINOSSAURO ===
        const playerHitbox = { x: player.x + 20, y: player.y + 20, width: player.width - 40, height: player.height - 40 };

        for (const m of meteors) {
            const meteorHitbox = { x: m.x + 10, y: m.y + 10, width: m.width - 20, height: m.height - 20 };
            const hit = playerHitbox.x < meteorHitbox.x + meteorHitbox.width &&
                playerHitbox.x + playerHitbox.width > meteorHitbox.x &&
                playerHitbox.y < meteorHitbox.y + meteorHitbox.height &&
                playerHitbox.y + playerHitbox.height > meteorHitbox.y;
            if (hit) { gameOver(); return; }
        }

        score++; // Incrementa a pontuação
    }

    // Desenha meteoros e pontuação - Mantido
    function draw() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        // Desenha a imagem do meteoro
        meteors.forEach(m => ctx.drawImage(meteorImage, m.x, m.y, m.width, m.height));
        
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Pontos: ${score}`, 10, 25);
    }

    // Game over - OK
    function gameOver() {
        gameRunning = false;
        playerGif.style.display = "none";
        gameOverScreen.style.display = "flex";
        
        // 1. Atualiza a pontuação final
        finalScoreDisplay.textContent = "Pontos: " + score; 
        
        // 2.  LÓGICA DO RECORDE 
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('dinoRunnerHighScore', highScore);
            console.log("NOVO RECORDE: " + highScore); 
        }
        
        // 3. Exibe o Recorde (novo ou antigo)
        highScoreDisplay.textContent = "Recorde: " + highScore;
    }
    
    // Loop principal - Mantido
    function gameLoop() {
        if (gameRunning) {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    // Inicia jogo - OK
    function startGame() {
        meteors = [];
        score = 0;
        
        // REINICIA A DIFICULDADE
        spawnProbability = 0.007;
        baseSpeed = 2;
        
        // Reinicia o player na posição correta do canvas definido
        player.x = (gameCanvas.width / 2) - (player.width / 2); 
        player.y = gameCanvas.height - 120;
        gameOverScreen.style.display = "none";
        playerGif.style.display = "block";
        gameRunning = true;
        gameLoop();
    }

    // Botão de Restart - Mantido
    restartButton.addEventListener("click", startGame);

    // =========================================================
    //  RECORDE: FUNÇÃO MOVIDA PARA DENTRO DE DOMContentLoaded
    // =========================================================
    function loadHighScore() {
        const savedHighScore = localStorage.getItem('dinoRunnerHighScore');
        
        // Agora, highScoreDisplay e as outras variáveis HTML JÁ EXISTEM
        if (savedHighScore) {
            highScore = parseInt(savedHighScore, 10);
        }
        // Garante que o display seja atualizado na inicialização
        if (highScoreDisplay) {
            highScoreDisplay.textContent = `Recorde: ${highScore}`;
        }
    }
    
    // Chame a função para carregar o recorde ao iniciar o DOM
    loadHighScore(); 
});
