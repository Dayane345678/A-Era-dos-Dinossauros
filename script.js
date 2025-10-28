document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. VARIÁVEIS DE ELEMENTOS HTML
    // =========================================================
    const introContainer = document.getElementById('intro-container');
    const nextButtons = document.querySelectorAll('.next-btn');
    const menu = document.getElementById("menu");
    
    // Campo de input do nome
    const playerNameInput = document.getElementById("playerNameInput"); 

    const startButton = document.getElementById("startButton");
    const gameScreen = document.getElementById("gameScreen");
    const flash = document.getElementById("flash");
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");
    const playerGif = document.getElementById("playerGif");
    const gameOverScreen = document.getElementById("gameOverScreen");
    
    const finalScoreDisplay = document.getElementById("finalScore"); 
    
    const restartButton = document.getElementById("restartButton");
    const menuButton = document.getElementById("menuButton"); // Botão Voltar ao Menu
    
    const introSound = document.getElementById("introSound");
    const gameMusic = document.getElementById("gameMusic");
    
    const highScoreDisplay = document.getElementById("highScoreDisplay"); 
    const highScoresList = document.getElementById("highScoresList"); 

    // === EFEITOS VISUAIS (Fumaça e Brasas) ===
    const smokeCanvas = document.getElementById("smokeCanvas");
    const smokeCtx = smokeCanvas.getContext("2d");
    const emberCanvas = document.getElementById("emberCanvas");
    const emberCtx = emberCanvas.getContext("2d");
    let smokes = [], embers = [];

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
    
    let gameFrame; 

    menu.style.display = 'none';
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';

    // === LÓGICA DE TRANSIÇÃO DA INTRODUÇÃO ===
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentScene = button.closest('.scene');
            const nextSceneId = button.getAttribute('data-next-scene');

            if (introSound && introSound.paused) {
                introSound.play().catch(e => console.error("Erro ao tocar áudio (Intro):", e));
            }

            if (nextSceneId === 'end') {
                currentScene.classList.add('hidden');
                introContainer.style.transition = 'opacity 1s ease-out';
                introContainer.style.opacity = '0';

                setTimeout(() => {
                    introContainer.style.display = 'none';
                    menu.style.display = 'flex';
                    animateFX(); 
                    
                    // Foca no input ao abrir o menu
                    if (playerNameInput) {
                        playerNameInput.focus();
                    }
                    
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

    // === LÓGICA DO BOTÃO INICIAR ===
    startButton.addEventListener("click", () => {
        // CAPTURA O NOME DO JOGADOR
        if (playerNameInput) {
            let name = playerNameInput.value.trim();
            playerName = name.length > 0 ? name : "Jogador"; 
        }

        flash.style.transition = "opacity 0.1s";
        flash.style.opacity = "1";

        if (introSound && !introSound.paused) {
            introSound.pause();
            introSound.currentTime = 0; 
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
    
    let playerName = "Jogador"; 
    // Array para armazenar o TOP 10 { name, score }
    let highScores = []; 
    
    // Variáveis de Dificuldade
    let spawnProbability = 0.007;
    let baseSpeed = 2;
    const DIFFICULTY_INTERVAL = 1000;
    const MAX_SPAWN_PROBABILITY = 0.03;
    const MAX_SPEED = 7;

    const meteorImage = new Image();
    meteorImage.src = "https://pngimg.com/uploads/meteor/meteor_PNG22.png";

    // CONTROLE TECLADO: Impede que setas movam o jogador enquanto digita o nome
    document.addEventListener("keydown", e => {
        if (gameRunning && e.target !== playerNameInput) {
             keys[e.key] = true;
        }
    });
    
    document.addEventListener("keyup", e => keys[e.key] = false);

    // Controle toque
    let touchStartX = null, touchStartY = null;
    
    document.addEventListener("touchstart", e => { 
        if (gameRunning && e.touches.length === 1 && e.target === gameCanvas) { 
            touchStartX = e.touches[0].clientX; 
            touchStartY = e.touches[0].clientY; 
        }
    });
    
    document.addEventListener("touchmove", e => {
        if (!gameRunning || touchStartX === null) return;
        
        if (e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - touchStartX;
            const deltaY = e.touches[0].clientY - touchStartY;
            player.x += deltaX;
            player.y += deltaY;
            if (player.x < 0) player.x = 0;
            if (player.x > gameCanvas.width - player.width) player.x = gameCanvas.width - player.width;
            if (player.y < 0) player.y = 0;
            if (player.y > gameCanvas.height - player.height) player.y = gameCanvas.height - player.height;
            touchStartX = e.touches[0].clientX; 
            touchStartY = e.touches[0].clientY; 
            e.preventDefault();
        }
    }, { passive: false });

    // Criação meteoros
    function createMeteor() {
        const size = 40 + Math.random() * 30;
        const x = Math.random() * (gameCanvas.width - size);
        
        const speed = baseSpeed + Math.random() * 2; 
        
        meteors.push({ x, y: -size, width: size, height: size, speed });
    }

    // Atualiza posição e colisão
    function update() {
        if (!gameRunning) return;
        
        // Movimento do Jogador
        if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
        if (keys["ArrowRight"] && player.x < gameCanvas.width - player.width) player.x += player.speed;
        if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
        if (keys["ArrowDown"] && player.y < gameCanvas.height - player.height) player.y += player.speed;

        // Posicionamento do GIF
        const rect = gameCanvas.getBoundingClientRect();
        playerGif.style.left = (rect.left + player.x) + "px";
        playerGif.style.top = (rect.top + player.y) + "px";

        // Lógica de Dificuldade
        if (score > 0 && score % DIFFICULTY_INTERVAL === 0) {
            if (spawnProbability < MAX_SPAWN_PROBABILITY) {
                spawnProbability += 0.001;
            }
            if (baseSpeed < MAX_SPEED) {
                baseSpeed += 0.5;
            }
        }

        // Geração de meteoros
        if (Math.random() < spawnProbability) 
            createMeteor();
            
        // Movimento de meteoros
        meteors.forEach(m => m.y += m.speed);
        meteors = meteors.filter(m => m.y < gameCanvas.height);
        
        // Colisão
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

    // Desenha na tela
    function draw() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        meteors.forEach(m => ctx.drawImage(meteorImage, m.x, m.y, m.width, m.height));
        
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        
        ctx.fillText(`Pontos: ${score}`, 10, 25);
        
        const textToDisplay = `Jogador: ${playerName}`;
        const textWidth = ctx.measureText(textToDisplay).width;
        ctx.fillText(textToDisplay, gameCanvas.width - textWidth - 10, 25);
    }
    
    // Função para atualizar a tabela de recordes na tela de Game Over
    function updateHighScoresTable() {
        if (!highScoresList) return; 

        highScoresList.innerHTML = ''; 
        
        if (highScores.length === 0) {
            highScoresList.innerHTML = '<li>Nenhum recorde salvo.</li>';
            return;
        }

        highScores.forEach((item, index) => {
            const listItem = document.createElement('li');
            
            // Verifica se o recorde atual é o que acabou de ser feito (para destaque)
            const isNewRecord = (item.name === playerName && item.score === score);

            listItem.innerHTML = `${index + 1}. **${item.name}**: ${item.score} pts`;
            
            if (isNewRecord) {
                 listItem.style.color = 'gold'; 
                 listItem.style.fontWeight = 'bold';
            }
            highScoresList.appendChild(listItem);
        });
        
        // Atualiza o display do Menu (para o melhor recorde)
        loadHighScores(); 
    }

    // Game over
    function gameOver() {
        gameRunning = false;
        playerGif.style.display = "none";
        gameOverScreen.style.display = "flex";
        
        if (gameMusic) {
            gameMusic.pause();
            gameMusic.currentTime = 0; 
        }
        
        finalScoreDisplay.textContent = `Sua Pontuação: ${playerName} - ${score} pts`; 
        
        // LÓGICA DE SALVAR O RECORDE
        if (score > 0) {
            highScores.push({ name: playerName, score: score });
            
            highScores.sort((a, b) => b.score - a.score); 
            highScores = highScores.slice(0, 10); // Mantém o top 10
            
            localStorage.setItem('dinoRunnerHighScores', JSON.stringify(highScores));
        }
        
        // EXIBE A TABELA DE RECORDES
        updateHighScoresTable();
        
        cancelAnimationFrame(gameFrame); 
    }
    
    // Loop principal
    function gameLoop() {
        if (gameRunning) {
            update();
            draw();
            gameFrame = requestAnimationFrame(gameLoop);
        }
    }

    // Inicia jogo
    function startGame() {
        meteors = [];
        score = 0;
        
        spawnProbability = 0.007;
        baseSpeed = 2;
        
        player.x = (gameCanvas.width / 2) - (player.width / 2); 
        player.y = gameCanvas.height - 120;
        gameOverScreen.style.display = "none";
        playerGif.style.display = "block";
        gameRunning = true;
        
        if (gameMusic) {
            gameMusic.volume = 0.5;
            gameMusic.play().catch(e => console.error("Erro ao tocar música do jogo:", e));
        }
        
        gameLoop();
    }

    // FUNÇÃO : Voltar ao Menu
    function goToMenu() {
        gameOverScreen.style.display = "none";
        gameScreen.style.display = "none";

        menu.classList.remove("fade-out");
        menu.style.display = "flex";

        //Preenche o input e foca para permitir edição
        if (playerNameInput) {
            playerNameInput.value = playerName; 
            playerNameInput.focus(); 
        }

        if (introSound && introSound.paused) {
            introSound.play().catch(e => console.error("Erro ao tocar áudio (Menu):", e));
        }
    }


    // =========================================================
    // 5. EVENT LISTENERS DOS BOTÕES
    // =========================================================
    restartButton.addEventListener("click", startGame);
    menuButton.addEventListener("click", goToMenu);

    // =========================================================
    // 6. CARREGAMENTO INICIAL (Recordes)
    // =========================================================
    function loadHighScores() {
        const savedScores = localStorage.getItem('dinoRunnerHighScores');
        
        if (savedScores) {
            highScores = JSON.parse(savedScores);
        } else {
            highScores = [];
        }

        if (highScores.length > 0) {
            highScores.sort((a, b) => b.score - a.score); 
            if (highScoreDisplay) {
                highScoreDisplay.textContent = `Recorde Global: ${highScores[0].name} (${highScores[0].score} pts)`;
            }
        } else if (highScoreDisplay) {
            highScoreDisplay.textContent = `Recorde Global: N/A`;
        }
    }
    
    loadHighScores(); 
});
