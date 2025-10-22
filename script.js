document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. VARIÁVEIS DE ELEMENTOS HTML
    // =========================================================
    const introContainer = document.getElementById('intro-container'); // Do seu prompt anterior
    const nextButtons = document.querySelectorAll('.next-btn');       // Do seu prompt anterior

    const menu = document.getElementById("menu");
    const startButton = document.getElementById("startButton");
    const gameScreen = document.getElementById("gameScreen");
    const flash = document.getElementById("flash");
    const gameCanvas = document.getElementById("gameCanvas"); // Renomeado para seguir o padrão
    const ctx = gameCanvas.getContext("2d");
    const playerGif = document.getElementById("playerGif");
    const gameOverScreen = document.getElementById("gameOverScreen");
    const finalScoreDisplay = document.getElementById("finalScore"); // Renomeado para 'finalScoreDisplay' para evitar conflito com 'finalScore' do HTML
    const restartButton = document.getElementById("restartButton");
    const introSound = document.getElementById("introSound");

    // === EFEITOS VISUAIS (Fumaça e Brasas) ===
    const smokeCanvas = document.getElementById("smokeCanvas");
    const smokeCtx = smokeCanvas.getContext("2d");
    const emberCanvas = document.getElementById("emberCanvas");
    const emberCtx = emberCanvas.getContext("2d");
    let smokes = [], embers = [];

    // =========================================================
    // 2. CONFIGURAÇÃO INICIAL E EFEITOS VISUAIS (Menu)
    // =========================================================

    // *AJUSTE CRÍTICO*: Define as dimensões do Canvas do Jogo aqui, antes de usar player.y/x
    gameCanvas.width = 800; // Defina um tamanho padrão
    gameCanvas.height = 600;

    function resizeCanvas() {
        smokeCanvas.width = emberCanvas.width = window.innerWidth;
        smokeCanvas.height = emberCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Classes Smoke e Ember - Mantidas exatamente como você enviou
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

    // =========================================================
    // 3. LÓGICA DE TRANSIÇÃO DA INTRODUÇÃO (Do seu prompt anterior)
    // =========================================================

    // Garante que o menu e a tela de jogo estão escondidos ao iniciar
    menu.style.display = 'none';
    gameScreen.style.display = 'none';

    // 3.1. Controle das Cenas da Introdução
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentScene = button.closest('.scene');
            const nextSceneId = button.getAttribute('data-next-scene');

            if (introSound.paused) {
                introSound.play().catch(e => console.error("Erro ao tocar áudio:", e));
            }

            if (nextSceneId === 'end') {
                // FIM DA INTRO -> MENU
                currentScene.classList.add('hidden');
                introContainer.style.transition = 'opacity 1s ease-out';
                introContainer.style.opacity = '0';

                setTimeout(() => {
                    introContainer.style.display = 'none';
                    menu.style.display = 'flex';
                    animateFX(); // Inicia a animação do menu
                }, 1000);

            } else {
                // Transição de Cenas (Normal)
                const nextScene = document.getElementById(nextSceneId);

                currentScene.style.opacity = '0';

                setTimeout(() => {
                    currentScene.style.display = 'none';
                    currentScene.classList.add('hidden');

                    if (nextScene) {
                        nextScene.style.display = 'flex';
                        nextScene.offsetHeight; // Força reflow
                        nextScene.classList.remove('hidden');
                        nextScene.style.opacity = '1';
                    }
                }, 1000);
            }
        });
    });

    // 3.2. Iniciar Jogo (do Menu)
    startButton.addEventListener("click", () => {
        // Efeito de flash
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
                startGame(); // Inicia o jogo principal
            }, 1000);
        }, 800);
    });

    // Garante que a primeira cena da intro inicie visível
    const scene1 = document.getElementById('scene-1');
    if (scene1) {
        scene1.classList.remove('hidden');
        scene1.style.display = 'flex';
        scene1.style.opacity = '1';
    }


    // =========================================================
    // 4. LÓGICA DO JOGO (CÓDIGO ORIGINAL COM METEORO)
    // =========================================================

    let player = { x: (gameCanvas.width / 2) - 60, y: gameCanvas.height - 120, width: 120, height: 120, speed: 6 };
    let meteors = [];
    let keys = {};
    let score = 0;
    let gameRunning = false;

    const meteorImage = new Image();
    meteorImage.src = "https://pngimg.com/uploads/meteor/meteor_PNG22.png"; // IMAGEM DO METEORO!

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

    // Criação meteoros - Mantido
    function createMeteor() {
        const size = 40 + Math.random() * 30;
        const x = Math.random() * (gameCanvas.width - size);
        const speed = 2 + Math.random() * 3;
        meteors.push({ x, y: -size, width: size, height: size, speed });
    }

    // Atualiza posição e colisão - Mantido
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

        // Geração e movimento de meteoros
        if (Math.random() < 0.02) createMeteor();
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

        score++;
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

    // Game over - Mantido
    function gameOver() {
        gameRunning = false;
        playerGif.style.display = "none";
        gameOverScreen.style.display = "flex";
        finalScoreDisplay.textContent = "Pontos: " + score; // Usando o display correto
    }

    // Loop principal - Mantido
    function gameLoop() {
        if (gameRunning) {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    // Inicia jogo - Mantido
    function startGame() {
        meteors = [];
        score = 0;
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

});
