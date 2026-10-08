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
  const nav    = document.querySelector(".navbar nav");

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


import { db } from "../config/firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ----------------------------------------------------------------------
// RENDERIZAÇÃO DINÂMICA DE DADOS (Firebase)
// ----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async function () {
  try {
    // 1. Carregar Serviços Principais (Home)
    const gridPrincipais = document.getElementById("grid-servicos-principais");
    if (gridPrincipais) {
      gridPrincipais.innerHTML = "<p>Carregando serviços...</p>";
      const snapHome = await getDocs(collection(db, "servicosPrincipais"));
      gridPrincipais.innerHTML = "";
      snapHome.forEach(doc => {
        const servico = doc.data();
        gridPrincipais.innerHTML += `
          <div class="servico-card">
            <h3>${servico.titulo}</h3>
            <p>${servico.descricao}</p>
          </div>
        `;
      });
    }

    // 2. Carregar Todos os Serviços (Página Serviços)
    const gridTodos = document.getElementById("grid-todos-servicos");
    if (gridTodos) {
      gridTodos.innerHTML = "<p>Carregando produtos...</p>";
      const snapServicos = await getDocs(collection(db, "todosServicos"));
      gridTodos.innerHTML = "";
      snapServicos.forEach(doc => {
        const servico = doc.data();
        gridTodos.innerHTML += `
          <div class="produto-item">
            <img src="${servico.imagem}" alt="${servico.nome}" />
            <p class="produto-nome">${servico.nome}</p>
            <p class="produto-preco">${servico.preco}</p>
          </div>
        `;
      });
    }

    // 3. Carregar Portfólio (Página Portfólio)
    const gridPortfolio = document.getElementById("grid-portfolio");
    if (gridPortfolio) {
      gridPortfolio.innerHTML = "<p>Carregando portfólio...</p>";
      const snapPortfolio = await getDocs(collection(db, "portfolio"));
      gridPortfolio.innerHTML = "";
      snapPortfolio.forEach(doc => {
        const item = doc.data();
        gridPortfolio.innerHTML += `
          <div class="gallery-item">
            <img src="${item.imagem}" alt="${item.alt}" />
          </div>
        `;
      });
    }
  } catch (error) {
    console.error("Erro ao carregar dados do Firebase:", error);
  }
});
