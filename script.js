// ===============================================
// ARQUIVO: script.js (Transição Baseada em Clique)
// ===============================================

document.addEventListener('DOMContentLoaded', initializeApp);

// Duração da transição CSS em milissegundos (DEVE ser igual ao 'transition: opacity' no seu CSS)
const FADE_DURATION = 1000; 

/**
 * Função de inicialização: Configura o estado inicial das cenas e os event listeners.
 */
function initializeApp() {
    // 1. Configuração Inicial das Cenas
    const scenes = document.querySelectorAll('.scene');
    
    // Oculta e remove do layout todas as cenas, exceto a primeira
    scenes.forEach(scene => {
        // Todas as cenas, exceto a primeira, devem começar ocultas e fora do fluxo.
        if (scene.id !== 'scene-1') {
            scene.classList.add('hidden'); // opacity: 0
            scene.classList.add('removed'); // display: none
        } else {
            // Garante que a primeira cena esteja visível para iniciar.
            scene.classList.remove('removed');
            scene.classList.remove('hidden');
        }
    });
    
    // 2. Configura os ouvintes de clique nos botões
    setupEventListeners();
}

/**
 * Configura os ouvintes de clique para todos os botões de avanço (.next-btn).
 */
function setupEventListeners() {
    const buttons = document.querySelectorAll('.next-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Encontra a cena pai (a cena atual)
            const currentScene = event.target.closest('.scene');
            const currentSceneId = currentScene ? currentScene.id : null;
            
            // Pega o ID da próxima cena (ou "end-game") do atributo data-next-scene
            const nextSceneId = event.target.dataset.nextScene;
            
            if (currentSceneId && nextSceneId) {
                transitionScene(currentSceneId, nextSceneId);
            }
        });
    });
}

/**
 * Gerencia a transição de Fade Out/Fade In entre duas cenas ou finaliza a introdução.
 * @param {string} currentSceneId O ID da cena atual (que irá desaparecer).
 * @param {string} nextSceneId O ID da próxima cena (ou 'end-game').
 */
function transitionScene(currentSceneId, nextSceneId) {
    const currentScene = document.getElementById(currentSceneId);
    
    // Garante que a cena atual existe
    if (!currentScene) return;

    // 1. FADE OUT: Inicia a transição aplicando a classe 'hidden' (opacity: 0)
    currentScene.classList.add('hidden'); 
    
    // 2. Aguarda a duração total do Fade Out (1000ms)
    setTimeout(() => {
        
        // 3. DESAPARECIMENTO: Adiciona 'removed' (display: none) à cena anterior APÓS o fade.
        currentScene.classList.add('removed'); 

        // 4. Se for o último botão, finaliza o jogo.
        if (nextSceneId === 'end-game') {
            console.log('FIM DA INTRODUÇÃO! Iniciando Jogo...');
            alert('FIM DA INTRODUÇÃO! Iniciando Jogo...');
            // AQUI VOCÊ PODE REDIRECIONAR PARA O SEU JOGO:
            // window.location.href = 'seu-jogo-aqui.html'; 
            return;
        }

        // 5. Se houver uma próxima cena, inicia o FADE IN dela.
        const nextScene = document.getElementById(nextSceneId);

        if (nextScene) {
            // Remove 'removed' para que ela apareça no layout (display: flex)
            nextScene.classList.remove('removed');
            
            // 6. FADE IN: Com um pequeno atraso, remove 'hidden' para iniciar o Fade In suave.
            // O pequeno atraso é CRUCIAL para evitar que o navegador pule a transição.
            setTimeout(() => {
                nextScene.classList.remove('hidden');
            }, 50); 
        }

    }, FADE_DURATION);
}
