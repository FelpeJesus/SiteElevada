import { auth, db, storage } from "../config/firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// Elementos da interface
const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const btnLogout = document.getElementById("btn-logout");

// Estados de edição
let editando = { servicosPrincipais: null, todosServicos: null, portfolio: null };
let dadosAtuais = { servicosPrincipais: {}, todosServicos: {}, portfolio: {} };

// Verifica estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    dashboard.style.display = "block";
    carregarDados();
  } else {
    loginSection.style.display = "block";
    dashboard.style.display = "none";
  }
});

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  
  signInWithEmailAndPassword(auth, email, senha)
    .then(() => { loginError.style.display = "none"; })
    .catch((error) => { loginError.style.display = "block"; });
});

// Logout
btnLogout.addEventListener("click", () => {
  signOut(auth);
});

// Função genérica para fazer upload de imagem
async function uploadImagem(file) {
  const fileRef = ref(storage, 'imagens/' + Date.now() + '_' + file.name);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

// ==========================================
// 1. SERVIÇOS PRINCIPAIS (HOME)
// ==========================================
document.getElementById("form-home").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.querySelector("#form-home button");
  const titulo = document.getElementById("home-titulo").value;
  const descricao = document.getElementById("home-descricao").value;
  
  btn.innerText = "Salvando...";
  btn.disabled = true;

  try {
    if (editando.servicosPrincipais) {
      await updateDoc(doc(db, "servicosPrincipais", editando.servicosPrincipais), { titulo, descricao });
      editando.servicosPrincipais = null;
    } else {
      await addDoc(collection(db, "servicosPrincipais"), { titulo, descricao });
    }
    document.getElementById("form-home").reset();
    carregarDados();
  } catch (error) {
    console.error(error);
  } finally {
    btn.innerText = "Adicionar Serviço";
    btn.disabled = false;
  }
});

// ==========================================
// 2. TODOS OS SERVIÇOS
// ==========================================
document.getElementById("form-servicos").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("btn-add-servico");
  btn.innerText = "Salvando...";
  btn.disabled = true;

  const nome = document.getElementById("servico-nome").value;
  const preco = document.getElementById("servico-preco").value;
  const file = document.getElementById("servico-foto").files[0];
  
  let imagemUrl = editando.todosServicos ? dadosAtuais.todosServicos[editando.todosServicos].imagem : null;

  try {
    if (file) {
      imagemUrl = await uploadImagem(file);
    }
    
    if (editando.todosServicos) {
      await updateDoc(doc(db, "todosServicos", editando.todosServicos), { nome, preco, imagem: imagemUrl });
      editando.todosServicos = null;
      document.getElementById("servico-foto").required = true;
    } else {
      await addDoc(collection(db, "todosServicos"), { nome, preco, imagem: imagemUrl });
    }
    document.getElementById("form-servicos").reset();
    carregarDados();
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar.");
  } finally {
    btn.innerText = "Adicionar Produto";
    btn.disabled = false;
  }
});

// ==========================================
// 3. PORTFÓLIO
// ==========================================
document.getElementById("form-portfolio").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("btn-add-portfolio");
  btn.innerText = "Salvando...";
  btn.disabled = true;

  const file = document.getElementById("portfolio-foto").files[0];
  let imagemUrl = editando.portfolio ? dadosAtuais.portfolio[editando.portfolio].imagem : null;

  try {
    if (file) {
      imagemUrl = await uploadImagem(file);
    }
    
    if (editando.portfolio) {
      await updateDoc(doc(db, "portfolio", editando.portfolio), { imagem: imagemUrl, alt: "Exemplo de trabalho" });
      editando.portfolio = null;
      document.getElementById("portfolio-foto").required = true;
    } else {
      await addDoc(collection(db, "portfolio"), { imagem: imagemUrl, alt: "Exemplo de trabalho" });
    }
    document.getElementById("form-portfolio").reset();
    carregarDados();
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar.");
  } finally {
    btn.innerText = "Adicionar Foto";
    btn.disabled = false;
  }
});

// ==========================================
// CARREGAR, EDITAR E DELETAR DADOS
// ==========================================
async function carregarDados() {
  dadosAtuais = { servicosPrincipais: {}, todosServicos: {}, portfolio: {} };

  // Home
  const snapHome = await getDocs(collection(db, "servicosPrincipais"));
  const listaHome = document.getElementById("lista-home");
  listaHome.innerHTML = "";
  snapHome.forEach(docSnap => {
    const d = docSnap.data();
    dadosAtuais.servicosPrincipais[docSnap.id] = d;
    listaHome.innerHTML += `
      <li>
        <div><strong>${d.titulo}</strong> <br> ${d.descricao}</div>
        <div style="display:flex; gap: 10px;">
          <button class="btn-edit" onclick="editarItem('servicosPrincipais', '${docSnap.id}')">Editar</button>
          <button class="btn-delete" onclick="deletarItem('servicosPrincipais', '${docSnap.id}')">Excluir</button>
        </div>
      </li>`;
  });

  // Serviços
  const snapServicos = await getDocs(collection(db, "todosServicos"));
  const listaServicos = document.getElementById("lista-servicos");
  listaServicos.innerHTML = "";
  snapServicos.forEach(docSnap => {
    const d = docSnap.data();
    dadosAtuais.todosServicos[docSnap.id] = d;
    listaServicos.innerHTML += `
      <li>
        <div style="display:flex; align-items:center;">
          <img src="${d.imagem}">
          <div><strong>${d.nome}</strong> <br> ${d.preco}</div>
        </div>
        <div style="display:flex; gap: 10px;">
          <button class="btn-edit" onclick="editarItem('todosServicos', '${docSnap.id}')">Editar</button>
          <button class="btn-delete" onclick="deletarItem('todosServicos', '${docSnap.id}')">Excluir</button>
        </div>
      </li>`;
  });

  // Portfolio
  const snapPortfolio = await getDocs(collection(db, "portfolio"));
  const listaPortfolio = document.getElementById("lista-portfolio");
  listaPortfolio.innerHTML = "";
  snapPortfolio.forEach(docSnap => {
    const d = docSnap.data();
    dadosAtuais.portfolio[docSnap.id] = d;
    listaPortfolio.innerHTML += `
      <li>
        <img src="${d.imagem}">
        <div style="display:flex; gap: 10px;">
          <button class="btn-edit" onclick="editarItem('portfolio', '${docSnap.id}')">Editar</button>
          <button class="btn-delete" onclick="deletarItem('portfolio', '${docSnap.id}')">Excluir</button>
        </div>
      </li>`;
  });
}

window.editarItem = function(colecao, id) {
  const item = dadosAtuais[colecao][id];
  editando[colecao] = id;
  
  if (colecao === 'servicosPrincipais') {
    document.getElementById("home-titulo").value = item.titulo;
    document.getElementById("home-descricao").value = item.descricao;
    document.querySelector("#form-home button").innerText = "Salvar Alterações";
    document.getElementById("home-titulo").focus();
  } else if (colecao === 'todosServicos') {
    document.getElementById("servico-nome").value = item.nome;
    document.getElementById("servico-preco").value = item.preco;
    document.getElementById("servico-foto").required = false; // Foto opcional ao editar
    document.querySelector("#form-servicos button").innerText = "Salvar Alterações";
    document.getElementById("servico-nome").focus();
  } else if (colecao === 'portfolio') {
    document.getElementById("portfolio-foto").required = false; // Foto opcional ao editar
    document.querySelector("#form-portfolio button").innerText = "Salvar Alterações";
    document.getElementById("portfolio-foto").focus();
  }
}

window.deletarItem = async function(colecao, id) {
  if(confirm("Tem certeza que deseja excluir?")) {
    await deleteDoc(doc(db, colecao, id));
    carregarDados();
  }
}
