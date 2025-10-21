// ===============================================
// ARQUIVO: script.js
// FUNÇÃO: Gerenciar a navegação com transição de fade-out/fade-in
// ===============================================

document.addEventListener('DOMContentLoaded', initializeApp);

// Duração da transição em milissegundos (DEVE ser igual a 'transition: opacity' no seu CSS)
const FADE_DURATION = 1000; 

/**
 * Função de inicialização: Executada após o carregamento do HTML.
 * Configura o estado inicial das cenas e os event listeners.
 */
function initializeApp() {
    // 1. Configuração Inicial das Cenas
    const scenes = document.querySelectorAll('.scene');
    
    scenes.forEach(scene => {
        // Inicialmente, todas as cenas são ocultadas (opacidade 0, classe 'hidden' no CSS)
        scene.classList.add('hidden');
        // E removidas do fluxo do layout (display: none, classe 'removed' no CSS)
        scene.classList.add('removed');
    });

    // 2. Revela a primeira cena ('scene-1')
    const firstScene = document.getElementById('scene-1');
    if (firstScene) {
        // A cena 1 é a única que precisa ser exibida no início.
        
        // Remove 'removed' para que o display: flex (definido no .scene) funcione
        firstScene.classList.remove('removed'); 
        
        // Pequeno atraso para garantir que o 'display' foi aplicado antes de mudar a opacidade
        setTimeout(() => {
            // Remove 'hidden' para iniciar o FADE-IN da primeira cena
            firstScene.classList.remove('hidden'); 
        }, 50);
    }
    
    // 3. Configura os ouvintes de clique nos botões
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
            
            // Pega o ID da próxima cena do atributo data-next-scene no botão
            const nextSceneId = event.target.dataset.nextScene;
            
            // Apenas prossegue se a cena atual e a próxima cena forem identificadas
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

    // 1. FADE OUT: Inicia a transição aplicando a classe 'hidden' (opacity: 0)
    currentScene.classList.add('hidden'); 
    
    // 2. Aguarda a duração total do Fade Out (1000ms)
    setTimeout(() => {
        
        // 3. DESAPARECIMENTO: Adiciona 'removed' (display: none) APÓS o fade terminar.
        currentScene.classList.add('removed'); 

        // 4. Verifica se é o último passo (fim do jogo)
        if (nextSceneId === 'end-game') {
            console.log('FIM DA INTRODUÇÃO! Iniciando Jogo...');
            alert('FIM DA INTRODUÇÃO! Iniciando Jogo de Meteoros...');
            // Exemplo de redirecionamento para a próxima página do jogo:
            // window.location.href = 'seu-jogo-aqui.html'; 
            return;
        }

        // 5. PRÓXIMA CENA: Remove 'removed' para que ela apareça no layout
        if (nextScene) {
            nextScene.classList.remove('removed');
            
            // 6. FADE IN: Com um pequeno atraso, remove 'hidden' para iniciar o Fade In suave.
            setTimeout(() => {
                nextScene.classList.remove('hidden');
            }, 50); // Pequeno delay
        }

    }, FADE_DURATION);
}
