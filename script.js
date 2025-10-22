document.addEventListener('DOMContentLoaded', () => {
    const FADE_DURATION = 1000;
    const buttons = document.querySelectorAll('.next-btn');
    const allScenes = document.querySelectorAll('.scene');

    // Inicializa: apenas a primeira cena visível
    allScenes.forEach((scene, i) => {
        if (i !== 0) {
            scene.classList.add('hidden');
            scene.style.opacity = 0;
        } else {
            scene.classList.remove('hidden');
            setTimeout(() => scene.style.opacity = 1, 50);
        }
    });

    // Função de transição
    const transitionScene = (currentId, nextId) => {
        const current = document.getElementById(currentId);
        const next = document.getElementById(nextId);

        current.style.opacity = 0;
        setTimeout(() => {
            current.classList.add('hidden');

            if (nextId === 'end') {
                alert('Fim da introdução! Aqui você pode iniciar o jogo.');
                return;
            }

            if (next) {
                next.classList.remove('hidden');
                setTimeout(() => next.style.opacity = 1, 10);
            }
        }, FADE_DURATION);
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const currentSceneId = button.closest('.scene').id;
            const nextSceneId = button.getAttribute('data-next-scene');
            transitionScene(currentSceneId, nextSceneId);
        });
    });
