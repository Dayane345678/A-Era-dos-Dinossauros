document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões que têm a classe 'next-btn'
    const buttons = document.querySelectorAll('.next-btn');
    const FADE_DURATION = 1000; // 1000ms = 1 segundo (Deve ser o mesmo valor no CSS: transition: opacity 1s)

    // Referência à imagem da Terra na primeira cena (se houver animação no CSS)
    const earthImage = document.querySelector('#scene-1 img'); 

    const allScenes = document.querySelectorAll('.scene');
    const firstScene = document.getElementById('scene-1');

    // 1. Configuração Inicial: Garante que todas as cenas, exceto a primeira, estejam ocultas e com opacidade 0.
    allScenes.forEach((scene) => {
        if (scene.id !== 'scene-1') {
            scene.classList.add('hidden'); // display: none
            scene.style.opacity = 0; // Garante que a opacidade inicial é zero
        } else {
            // Garante que a primeira cena não tem 'hidden' e está pronta para ser exibida
            scene.classList.remove('hidden'); 
        }
    });

    // Garante que a primeira cena (scene-1) inicie visível com opacidade 1.
    if (firstScene) {
        // Um pequeno atraso garante que o navegador ative a transição de opacidade do CSS
        setTimeout(() => {
             firstScene.style.opacity = 1;
        }, 50); 
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

        // AÇÃO OPCIONAL: Pausa animação da Terra (se implementada no CSS)
        if (currentSceneId === 'scene-1' && earthImage) {
            earthImage.classList.add('paused-spin'); 
        }

        // 1. FADE OUT: Inicia a transição tornando a cena atual transparente.
        currentScene.style.opacity = 0;
        
        // 2. Aguarda a duração total do Fade Out
        setTimeout(() => {
            
            // 3. DESAPARECIMENTO: Adiciona 'hidden' (display: none) à cena atual.
            currentScene.classList.add('hidden'); 

            // 4. Se for o último botão, termina a introdução.
            if (nextSceneId === 'end-game') {
                console.log('FIM DA INTRODUÇÃO! Iniciando Jogo...');
                alert('FIM DA INTRODUÇÃO! Iniciando Jogo...');
                // Adicione aqui a lógica para iniciar o jogo (ex: window.location.href = 'game.html';)
                return;
            }

            // 5. PRÓXIMA CENA: Mostra a nova cena (retira o display: none)
            if (nextScene) {
                nextScene.classList.remove('hidden');
                
                // 6. FADE IN: Com um pequeno atraso, define opacidade 1 para o Fade In suave.
                setTimeout(() => {
                    nextScene.style.opacity = 1;
                }, 10); 
            }
        }, FADE_DURATION);
    };
    
    // ----------------------------------------------------------------
    // 7. OUVINTE DE EVENTOS (Listener)
    // ----------------------------------------------------------------
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Pega o ID da próxima cena do atributo data-next-scene
            const nextSceneId = button.getAttribute('data-next-scene');
            
            // Encontra a cena pai mais próxima (o elemento .scene)
            const currentScene = button.closest('.scene');
            const currentSceneId = currentScene ? currentScene.id : null;

            if (currentSceneId && nextSceneId) {
                transitionScene(currentSceneId, nextSceneId);
            }
        });
    });
});
