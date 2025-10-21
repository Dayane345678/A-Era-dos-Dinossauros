// script.js

// Tempo de transição definido no CSS (1 segundo = 1000 milissegundos)
const TRANSITION_DURATION = 1000; 

// Função que inicia o aplicativo e mostra a primeira cena
function initializeApp() {
    const scenes = document.querySelectorAll('.scene');
    
    // 1. Esconde todas as cenas ao iniciar (garante que só uma apareça)
    scenes.forEach(scene => {
        scene.classList.remove('active'); // Remove a classe de ativo
        scene.classList.add('hidden');    // Esconde com opacidade 0
        scene.style.display = 'none';     // Remove do layout
    });

    // 2. Mostra a primeira cena (ID: 'scene-1')
    const firstScene = document.getElementById('scene-1');
    if (firstScene) {
        firstScene.style.display = 'flex'; // Torna visível no layout
        
        // Pequeno delay para garantir que o navegador registre o 'display: flex'
        // antes de iniciar a transição de opacidade.
        setTimeout(() => {
            firstScene.classList.add('active'); // Inicia o fade-in para opacidade 1
            firstScene.classList.remove('hidden'); // Remove a classe de invisível
        }, 50);
    }

    // 3. Configura os ouvintes de evento para todos os botões
    setupEventListeners();
}

// Função para configurar os cliques dos botões
function setupEventListeners() {
    const buttons = document.querySelectorAll('.next-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const nextSceneId = event.target.getAttribute('data-next-scene');
            const currentSceneId = event.target.closest('.scene').id;
            
            if (nextSceneId) {
                changeScene(currentSceneId, nextSceneId);
            }
        });
    });
}


// Função principal para trocar de cena com fade-out e fade-in
function changeScene(currentId, nextId) {
    const currentScene = document.getElementById(currentId);
    const nextScene = document.getElementById(nextId);

    if (!currentScene || !nextScene) {
        console.error("Erro: ID de cena atual ou próxima não encontrado.");
        return;
    }

    // FASE 1: FADE-OUT da cena atual
    currentScene.classList.remove('active'); // Inicia a transição para opacidade 0 (fade-out)
    currentScene.classList.add('hidden');

    // FASE 2: Espera a transição terminar e faz a troca
    setTimeout(() => {
        // Oculta completamente a cena anterior do layout
        currentScene.style.display = 'none';

        // Prepara a próxima cena para aparecer
        nextScene.style.display = 'flex'; // Torna visível no layout, mas ainda com opacidade 0 (por causa da classe hidden)

        // FASE 3: FADE-IN da próxima cena (pequeno delay para a transição funcionar)
        setTimeout(() => {
            nextScene.classList.remove('hidden'); // Inicia a transição para opacidade 1 (fade-in)
            nextScene.classList.add('active');
        }, 50); // Pequeno delay
        
    }, TRANSITION_DURATION); // Espera 1 segundo (tempo do fade-out)
}


// Inicia o app quando todo o conteúdo (HTML e CSS) estiver carregado
document.addEventListener('DOMContentLoaded', initializeApp);
