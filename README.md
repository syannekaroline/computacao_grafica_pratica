# 🎨✨ Rasterizador 2D/3D Interativo ✨🖌️

Bem-vindo ao Rasterizador 2D/3D Interativo! Este projeto foi desenvolvido como trabalho prático para a disciplina de Computação Gráfica, utilizando **Vite + React**. A aplicação permite visualizar e interagir com algoritmos clássicos de rasterização, transformações geométricas, recorte e projeções 3D em tempo real.

---

## 🚀 Funcionalidades Implementadas

O projeto inclui a implementação dos seguintes algoritmos e técnicas:

### Algoritmos 2D
-   [✔] **Rasterização de Primitivas:**
    -   Reta (Bresenham)
    -   Círculo (Ponto Médio)
    -   Elipse (Ponto Médio)
-   [✔] **Curvas:**
    -   Curva de Bézier
-   [✔] **Polígonos:**
    -   Polilinha (para criação de polígonos)
-   [✔] **Preenchimento:**
    -   Preenchimento Recursivo (Flood Fill)
    -   Preenchimento por Varredura (Scanline)
-   [✔] **Recorte:**
    -   Recorte de Linha (Cohen-Sutherland)
    -   Recorte de Polígono (Sutherland-Hodgman)
-   [✔] **Transformações Geométricas 2D:**
    -   Translação
    -   Escala (com ponto fixo)
    -   Rotação (com pivô)

### Projeções 3D
-   [✔] **Projeções Paralelas Oblíquas:**
    -   Projeção Cavalier
    -   Projeção Cabinet
-   [✔] **Projeção Perspectiva:**
    -   Configurável para 1, 2 ou 3 pontos de fuga.
-   [✔] **Criação de Sólidos:**
    -   Interface para criação e edição de vértices 3D.
    -   Interface para definição de arestas, permitindo a criação de qualquer sólido wireframe.

---

## 📁 Estrutura de Pastas

O projeto está organizado da seguinte forma para facilitar a manutenção e escalabilidade:

O projeto está organizado da seguinte forma para facilitar a manutenção e escalabilidade:

| Pasta / Arquivo | Descrição |
|---|---|
| `/.github/workflows/` | Contém o workflow do GitHub Actions para deploy automático no GitHub Pages. |
| `/cg-react-project/src/` | Pasta principal que contém todo o código-fonte da aplicação React. |
| `/cg-react-project/src/algorithms/` | Onde a lógica de cada algoritmo de computação gráfica (Bresenham, Projeções, etc.) é implementada. |
| `/cg-react-project/src/components/` | Contém todos os componentes React reutilizáveis que formam a interface (Canvas, Sidebar, etc.). |
| `.../components/ParameterPanels/` | Subpasta com os painéis de controle específicos para cada algoritmo, onde o usuário insere os parâmetros. |
| `.../components/TableView/` | Contém os componentes de tabela para a entrada de pontos 2D, vértices 3D e arestas. |
| `/cg-react-project/src/App.jsx` | O componente principal da aplicação, responsável por gerenciar o estado global e a interação. |
| `/cg-react-project/vite.config.js` | Arquivo de configuração do Vite, usado para definir o caminho base para o deploy no GitHub Pages. |

---

## 🛠️ Pré-requisitos

Antes de começar, garanta que você tem o seguinte instalado:
* [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
* npm (geralmente instalado junto com o Node.js)

---

## ⚙️ Como Rodar Localmente

Siga os passos abaixo para executar o projeto na sua máquina.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/computacao-grafica-pratica.git](https://github.com/seu-usuario/computacao-grafica-pratica.git)
    ```

2.  **Navegue até a pasta do projeto React:**
    ```bash
    cd computacao-grafica-pratica/cg-react-project
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Abra seu navegador e acesse `http://localhost:5173` (ou o endereço que aparecer no seu terminal).

---

## 🖥️ Como Usar a Aplicação

A interface é dividida em duas partes principais: a **Sidebar** (menu lateral) e o **Canvas** (área de desenho).

1.  **Desenhar Formas 2D:**
    * Na **Sidebar**, na aba "Algoritmos", selecione um algoritmo (ex: "Círculo").
    * Abaixo, no painel de parâmetros, ajuste os valores (ex: raio e centro).
    * Clique no botão "Desenhar Círculo" para ver o resultado no **Canvas**.

2.  **Recortar Linhas ou Polígonos:**
    * Primeiro, desenhe uma linha (com Bresenham) ou um polígono (com Polilinha).
    * Mude o algoritmo para "Recorte de Linha" ou "Recorte de Polígono".
    * Ajuste a janela de recorte vermelha usando os parâmetros no painel.
    * Clique em "Executar Recorte".

3.  **Aplicar Transformações 2D:**
    * Primeiro, desenhe um polígono usando o algoritmo "Polilinha".
    * Mude para a aba **"Transformações"** na Sidebar.
    * Ajuste os parâmetros de translação, escala ou rotação e clique no botão "Aplicar" correspondente. O polígono será desenhado em vermelho durante a transformação.

4.  **Projetar um Sólido 3D:**
    * Mude o algoritmo para "Projeções 3D".
    * No painel, irão aparecer as opções de projeção e duas tabelas: uma para **Vértices 3D** e outra para **Arestas**.
    * Adicione/edite os vértices (X, Y, Z) e as arestas (conexões entre os índices dos vértices).
    * Escolha o tipo de projeção (Cavalier, Cabinet ou Perspectiva) e ajuste os parâmetros.
    * Clique em "Projetar Sólido" para ver o resultado no Canvas.

---

## 🌐 Deploy no GitHub Pages

Este projeto está configurado para deploy automático no GitHub Pages através do GitHub Actions. Qualquer `push` no branch `main` irá iniciar o processo de build e deploy.

---

## ✍️ Autores

-   **Luiz Jordany de Sousa Silva**
-   **Syanne Karoline Moreira Tavares**