window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  // Adiciona a classe 'scrolled' quando o usuário rolar mais de 50 pixels
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
