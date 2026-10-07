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

