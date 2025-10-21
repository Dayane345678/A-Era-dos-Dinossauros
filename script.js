// ===============================================
// ARQUIVO: script.js
// FUNÇÃO: Gerenciar a navegação com transição de fade-out/fade-in
// ===============================================

document.addEventListener('DOMContentLoaded', initializeApp);

// Duração da transição em milissegundos (Deve ser igual ao 'transition: opacity' no seu CSS)
const FADE_DURATION = 1000; 

// Seleciona a imagem da Terra na primeira cena (para animação específica)
const earthImage = document.querySelector('#scene-1 .earth-image');

/**
 * Função de inicialização: Executada após o carregamento do HTML.
 * Configura o estado inicial das cenas e os event listeners.
 */
function initializeApp() {
    // 1. Configuração Inicial das Cenas
    const scenes = document.querySelectorAll('.scene');
    
    scenes.forEach(scene => {
        // Inicialmente, todas as cenas são ocultadas (opacidade 0)
        scene.classList.add('hidden');
        // E removidas do fluxo do layout (display: none)
        scene.classList.add('removed');
    });

    // 2. Revela a primeira cena ('scene-1')
    const firstScene = document.getElementById('scene-1');
    if (firstScene) {
        // Remove 'removed' para que o display: flex/block funcione
        firstScene.classList.remove('removed'); 
        
        // Pequeno atraso para garantir que o 'display' foi aplicado antes de mudar a opacidade
        setTimeout(() => {
            // Remove 'hidden' para iniciar o FADE-IN da primeira cena
            firstScene.classList.remove('hidden'); 
        }, 50);
    }

    // 3. Inicia a animação da Terra na Cena 1
    if (earthImage) {
        // Se houver uma classe para pausar (e ela estiver lá), remova-a
        earthImage.classList.remove('paused-spin');
    }
    
    // 4. Configura os ouvintes de clique nos botões
    setupEventListeners();
}

/**
 * Configura os ouvintes de clique para todos os botões de avanço.
 */
function setupEventListeners() {
    const buttons = document.querySelectorAll('.next-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Encontra a cena pai do botão
            const currentScene = event.target.closest('.scene');
            const currentSceneId = currentScene ? currentScene.id : null;
            
            // Pega o ID da próxima cena a partir do atributo data-next-scene
            const nextSceneId = event.target.dataset.nextScene;
            
            if (currentSceneId && nextSceneId) {
                transitionScene(currentSceneId, nextSceneId);
            }
        });
    });
}

/**
 * Gerencia a transição de Fade Out/Fade In entre duas cenas.
 * @param {string} currentSceneId O ID da cena atual (que irá desaparecer).
 * @param {string} nextSceneId O ID da próxima cena (que irá aparecer ou 'end-game').
 */
function transitionScene(currentSceneId, nextSceneId) {
    const currentScene = document.getElementById(currentSceneId);
    const nextScene = document.getElementById(nextSceneId);

    if (!currentScene) return;

    // AÇÃO ESPECÍFICA: Se estamos na Cena 1, pausa o giro da Terra.
    if (currentSceneId === 'scene-1' && earthImage) {
        earthImage.classList.add('paused-spin');
    }

    // 1. FADE OUT: Inicia a transição aplicando a classe 'hidden' (opacity: 0)
    currentScene.classList.add('hidden'); 
    
    // 2. Aguarda a duração total do Fade Out (1000ms)
    setTimeout(() => {
        
        // 3. DESAPARECIMENTO: Remove a cena do fluxo do layout APÓS a transição
        currentScene.classList.add('removed'); 

        // 4. Verifica se é o último passo (fim do jogo)
        if (nextSceneId === 'end-game') {
            console.log('FIM DA INTRODUÇÃO! Iniciando Jogo...');
            alert('FIM DA INTRODUÇÃO! Iniciando Jogo de Meteoros...');
            // window.location.href = 'seu-jogo-aqui.html'; // Redirecionamento
            return;
        }

        // 5. PRÓXIMA CENA: Mostra a nova cena no fluxo do layout (display: flex/block)
        if (nextScene) {
            nextScene.classList.remove('removed');
            
            // 6. FADE IN: Com um pequeno atraso, remove 'hidden' para iniciar o Fade In suave.
            setTimeout(() => {
                nextScene.classList.remove('hidden');
            }, 50); // Pequeno delay
        }

    }, FADE_DURATION);
}
