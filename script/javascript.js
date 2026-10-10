window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  // Adiciona a classe 'scrolled' quando o usuário rolar mais de 50 pixels
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Marca o link da navbar correspondente à página atual como ativo
(function () {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".navbar nav a");

  navLinks.forEach(function (link) {
    // Ignora o botão de orçamento
    if (link.classList.contains("btn-orcamento")) return;

    const linkPath = new URL(link.href, window.location.origin).pathname;

    if (currentPath === linkPath) {
      link.classList.add("active");
    }
  });
})();

// Menu hambúrguer
(function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navbar nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    toggle.classList.toggle("open");
    nav.classList.toggle("open");
    // Bloqueia o scroll da página quando o menu está aberto
    document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
  });

  // Fecha o menu ao clicar em qualquer link
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      toggle.classList.remove("open");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

// ----------------------------------------------------------------------
// RENDERIZAÇÃO DINÂMICA VIA DADOS.JS
// ----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  if (typeof window.SiteConfig === "undefined") return;
  const config = window.SiteConfig;

  // 1. Home (Serviços Principais)
  const gridPrincipais = document.querySelector(".servicos-grid");
  if (gridPrincipais && config.servicosPrincipais) {
    gridPrincipais.innerHTML = "";
    config.servicosPrincipais.forEach(servico => {
      gridPrincipais.innerHTML += `
        <div class="servico-card">
          <h3>${servico.titulo}</h3>
          <p>${servico.descricao}</p>
        </div>
      `;
    });
  }

  // 2. Página de Serviços (Torna os itens clicáveis)
  const gridTodos = document.getElementById("grid-todos-servicos");
  if (gridTodos && config.todosServicos) {
    gridTodos.innerHTML = "";
    // O "index" é o número da posição do produto na lista (0, 1, 2...)
    config.todosServicos.forEach((servico, index) => {
      gridTodos.innerHTML += `
        <a href="/html/detalhes.html?id=${index}" class="produto-item" style="cursor: pointer;">
          <img src="${servico.imagem}" alt="${servico.nome}" />
          <p class="produto-nome">${servico.nome}</p>
          <p class="produto-preco">${servico.preco}</p>
        </a>
      `;
    });
  }

  // 3. Página de Detalhes do Produto
  const detalhesContainer = document.getElementById("detalhes-produto-container");
  if (detalhesContainer && config.todosServicos) {
    // Pega o número do ID na URL (ex: ?id=0)
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    // Verifica se o ID existe e encontra o produto
    if (produtoId !== null && config.todosServicos[produtoId]) {
      const produto = config.todosServicos[produtoId];

      // Cria uma mensagem personalizada para o WhatsApp
      const mensagemWhats = encodeURIComponent(`Olá, gostaria de saber mais sobre o produto: ${produto.nome}`);
      const linkWhats = `https://api.whatsapp.com/send/?phone=5583981985937&text=${mensagemWhats}&type=phone_number&app_absent=0`;

      detalhesContainer.innerHTML = `
        <div class="detalhes-imagem">
            <img src="${produto.imagem}" alt="${produto.nome}">
        </div>
        <div class="detalhes-info">
            <h2>${produto.nome}</h2>
            <p class="preco-destaque">${produto.preco}</p>
            
            ${produto.tamanho ? `<p><strong>Tamanho:</strong> ${produto.tamanho}</p>` : ''}
            ${produto.detalhes ? `<p><strong>Mais Detalhes:</strong> <br>${produto.detalhes}</p>` : ''}
            
            <div style="margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
                <a href="${linkWhats}" target="_blank" class="btn-orcamento-principal">
                  Pedir Orçamento no WhatsApp
                </a>
                <a href="/html/serviços.html" class="btn-voltar-servicos">
                  <- Voltar para Serviços
                </a>
            </div>
        </div>
      `;
    } else {
      detalhesContainer.innerHTML = `<p>Produto não encontrado. <a href="/html/serviços.html" style="color:var(--cor-magenta)">Voltar aos serviços</a>.</p>`;
    }
  }
  
});