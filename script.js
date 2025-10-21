document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões que têm a classe 'next-btn'
    const buttons = document.querySelectorAll('.next-btn');
    const FADE_DURATION = 1000; // 1000ms = 1 segundo (Deve ser o mesmo valor no CSS: 1s)

    // Referência à imagem da Terra na primeira cena (apenas se houver animação no CSS)
    const earthImage = document.querySelector('#scene-1 img'); 

    // 1. Configuração Inicial: Oculta todas as cenas, exceto a primeira.
    const allScenes = document.querySelectorAll('.scene');
    allScenes.forEach((scene, index) => {
        // Oculta todas as cenas (da cena 2 em diante)
        if (index > 0) {
            scene.classList.add('hidden');
        }
    });

    // Garante que a primeira cena (scene-1) esteja visível e com opacidade 1 no início
    const firstScene = document.getElementById('scene-1');
    if (firstScene) {
        firstScene.style.opacity = 1;
        firstScene.classList.remove('hidden');
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
                
                // 6. FADE IN: Com um pequeno atraso, define opacidade 1 para o Fade In suave (transição é pelo CSS).
                // O atraso de 10ms garante que o navegador reconheça que 'hidden' foi removido antes de mudar a opacidade.
                setTimeout(() => {
                    nextScene.style.opacity = 1;
                }, 10); 
            }
        }, FADE_DURATION);
    };
    
    // ----------------------------------------------------------------
    // 7. OUVINTE DE EVENTOS (Listener) - ESSA É A PARTE MAIS IMPORTANTE
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
