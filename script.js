// ===============================================
// ARQUIVO: script.js (Transição Automática)
// ===============================================

document.addEventListener('DOMContentLoaded', initializeApp);

// Duração da transição CSS (para o Fade-out/Fade-in)
const FADE_DURATION = 1000; // 1 segundo no CSS

// Tempo que cada cena fica VISÍVEL antes de iniciar o próximo Fade-out
const VIEW_DURATION = 5000; // 5 segundos (ajuste conforme necessário)

// Array contendo a ordem das cenas a serem exibidas
const SCENE_ORDER = [
    'scene-1',
    'scene-2',
    'scene-3',
    'scene-4',
    'scene-5',
    'scene-6'
];

/**
 * Função de inicialização: Configura o estado inicial das cenas e inicia a transição.
 */
function initializeApp() {
    // 1. Configuração Inicial das Cenas
    const scenes = document.querySelectorAll('.scene');
    
    // Oculta e remove do layout todas as cenas, exceto a primeira
    scenes.forEach(scene => {
        if (scene.id !== 'scene-1') {
            scene.classList.add('hidden');
            scene.classList.add('removed');
        } else {
            // Garante que a primeira cena esteja visível para iniciar o processo
            scene.classList.remove('removed');
            scene.classList.remove('hidden');
        }
    });
    
    // 2. Inicia a transição automática
    startAutoTransition(0); // Começa com o índice da primeira cena ('scene-1')
}

/**
 * Inicia o loop automático de transição.
 * @param {number} index O índice da cena atual no array SCENE_ORDER.
 */
function startAutoTransition(index) {
    const currentSceneId = SCENE_ORDER[index];
    
    // Verifica se há uma próxima cena para avançar
    const nextIndex = index + 1;
    const nextSceneId = SCENE_ORDER[nextIndex];
    
    // Apenas inicia se a cena atual existir
    if (!currentSceneId) {
        console.error("Cena atual não encontrada no array de ordem.");
        return;
    }

    // Se for a última cena, apenas a exibe e encerra
    if (nextIndex >= SCENE_ORDER.length) {
        // Exibiu a última cena (scene-6). Agora aguarda a duração para finalizar.
        setTimeout(() => {
            handleEndOfGame(currentSceneId);
        }, VIEW_DURATION);
        return;
    }

    // 1. Aguarda o tempo de visualização da cena atual
    setTimeout(() => {
        
        // 2. Inicia a transição da cena atual para a próxima
        transitionScene(currentSceneId, nextSceneId, () => {
            // 3. CALLBACK: Após o Fade-in da próxima cena terminar, chama a função recursivamente
            startAutoTransition(nextIndex);
        });

    }, VIEW_DURATION);
}


/**
 * Gerencia a transição de Fade Out/Fade In entre duas cenas.
 * Foi modificada para aceitar uma função de callback.
 * @param {string} currentSceneId O ID da cena atual (que irá desaparecer).
 * @param {string} nextSceneId O ID da próxima cena (que irá aparecer).
 * @param {function} callback A função a ser executada após o Fade-in completo.
 */
function transitionScene(currentSceneId, nextSceneId, callback) {
    const currentScene = document.getElementById(currentSceneId);
    const nextScene = document.getElementById(nextSceneId);

    if (!currentScene || !nextScene) return;

    // A. FADE OUT: Inicia a transição (opacidade para 0)
    currentScene.classList.add('hidden'); 
    
    // B. Aguarda a duração total do Fade Out (1000ms)
    setTimeout(() => {
        
        // C. REMOÇÃO: Adiciona 'removed' (display: none) à cena anterior APÓS o fade terminar.
        currentScene.classList.add('removed'); 

        // D. PRÓXIMA CENA: Remove 'removed' para que ela apareça no layout (display: flex)
        nextScene.classList.remove('removed');
        
        // E. FADE IN: Com um pequeno atraso, remove 'hidden' para iniciar o Fade In suave.
        setTimeout(() => {
            nextScene.classList.remove('hidden');
            
            // F. Aguarda a duração do Fade In (1000ms) e executa o callback (para avançar o timer)
            setTimeout(() => {
                if (callback) {
                    callback();
                }
            }, FADE_DURATION);

        }, 50); // Pequeno delay para garantir que o 'display: flex' seja aplicado
        
    }, FADE_DURATION);
}

/**
 * Lida com a etapa final da introdução.
 * @param {string} lastSceneId O ID da última cena.
 */
function handleEndOfGame(lastSceneId) {
    const lastScene = document.getElementById(lastSceneId);

    // Inicia o Fade Out da última cena
    if (lastScene) {
        lastScene.classList.add('hidden');
        
        // Aguarda o Fade Out terminar
        setTimeout(() => {
            lastScene.classList.add('removed');
            console.log('FIM DA INTRODUÇÃO! Iniciando Jogo de Meteoros...');
            alert('FIM DA INTRODUÇÃO! Iniciando Jogo de Meteoros...');
            // Exemplo de redirecionamento:
            // window.location.href = 'seu-jogo-aqui.html';
        }, FADE_DURATION);
    }
}
