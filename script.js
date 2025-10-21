/* style.css */
/* 1. LAYOUT BÁSICO E CONTAINER */
body {
    background-color: #000; /* Fundo preto */
    color: #fff; /* Texto branco */
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh; /* Ocupa a altura total da tela */
}

#intro-container {
    position: relative; /* Ponto de referência para as cenas */
    width: 800px; /* Largura das suas imagens */
    height: 600px; /* Altura das suas imagens */
    overflow: hidden; /* Garante que nada saia do limite */
}

/* ------------------------------------------- */
/* 2. ESTILOS DAS CENAS E TRANSIÇÃO */
/* ------------------------------------------- */

.scene {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 1; 
    /* Esta linha é crucial para o FADE do JavaScript */
    transition: opacity 1s ease-in-out; 
    box-sizing: border-box; 
    /* Adicionado display: flex para ajudar a centralizar elementos */
    display: flex;
    flex-direction: column;
    
    /* ALTERAÇÃO: Mudamos a justificação para o topo ou removemos para confiar no 'absolute' */
    justify-content: flex-start; /* Confia no posicionamento absoluto dos elementos */
    
    align-items: center;
}

.scene.hidden {
    /* O JS define a opacidade para 0, e depois o display para none */
    display: none;
    opacity: 0;
}

/* ------------------------------------------- */
/* 3. ESTILOS DA IMAGEM, LEGENDA E BOTÃO */
/* ------------------------------------------- */

/* Imagem de Fundo */
.scene img {
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; 
    z-index: 1; /* Abaixo do texto e botão */
}
