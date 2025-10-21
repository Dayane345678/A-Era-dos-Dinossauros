document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões que têm a classe 'next-btn'
    const buttons = document.querySelectorAll('.next-btn');
    const FADE_DURATION = 1000; // 1 segundo (Deve ser o mesmo valor definido no CSS: transition: opacity 1s)

    // Referência à imagem da Terra na primeira cena
    const earthImage = document.querySelector('#scene-1 .earth-image');

    // 1. Configuração Inicial: Garante que todas as cenas, exceto a primeira, estejam ocultas.
    
    // Esconde todas as cenas, da Cena 2 até a Cena 6
    for (let i = 2; i <= 6; i++) {
        const scene = document.getElementById(`scene-${i}`);
        if (scene) {
            scene.classList.add('hidden');
        }
    }

    // Inicia a animação da Terra imediatamente na Cena 1
    if (earthImage) {
        earthImage.classList.remove('paused-spin'); 
    }

    /**
     * Gerencia a transição de Fade Out/Fade In entre duas cenas.
     * @param {string} currentSceneId O ID da cena atual (que irá desaparecer).
     * @param {string} nextSceneId O ID da próxima cena (que irá aparecer ou 'end-game').
     */
    const transitionScene = (currentSceneId, nextSceneId) => {
        const currentScene = document.getElementById(currentSceneId);
        const nextScene = document.getElementById(nextSceneId);

        if (!currentScene) return;

        // AÇÃO ESPECÍFICA: Se estamos na Cena 1, pausa o giro da Terra.
        if (currentSceneId === 'scene-1' && earthImage) {
            earthImage.classList.add('paused-spin'); 
        }

        // 1. FADE OUT: Inicia a transição tornando a cena atual transparente (dura 1s)
        currentScene.style.opacity = 0;
        
        // 2. Aguarda a duração total do Fade Out
        setTimeout(() => {
            
            // 3. DESAPARECIMENTO: Adiciona 'hidden' para remover a cena do fluxo (display: none).
            currentScene.classList.add('hidden'); 

            // 4. Verifica se é o último passo (fim do jogo)
            if (nextSceneId === 'end-game') {
                alert('FIM DA INTRODUÇÃO! Iniciando Jogo...');
                // Coloque seu código de redirecionamento para a próxima página aqui, por exemplo:
                // window.location.href = 'menu.html'; 
                return;
            }

            // 5. PRÓXIMA CENA: Mostra a nova cena (retira o display: none)
            if (nextScene) {
                nextScene.classList.remove('hidden');
                
                // 6. FADE IN: Com um pequeno atraso, aplica opacidade 1 para iniciar o Fade In suave.
                setTimeout(() => {
                    nextScene.style.opacity = 1;
                }, 10); 
            }

        }, FADE_DURATION);
    };

    // 7. Adiciona o ouvinte de clique a TODOS os botões de avanço
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Pega o elemento pai mais próximo que tem a classe 'scene' (a cena atual)
            const currentScene = event.target.closest('.scene');
            const currentSceneId = currentScene ? currentScene.id : null;
            
            // Pega o ID da próxima cena a partir do atributo data-next-scene
            const nextSceneId = event.target.dataset.nextScene; 
            
            if (currentSceneId) {
                transitionScene(currentSceneId, nextSceneId);
            }
        });
    });
});
