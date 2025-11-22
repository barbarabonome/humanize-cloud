const API_BASE = "http://4.206.159.231:5000";


// ----------------------------------------------------
// CARREGAR EQUIPES
// ----------------------------------------------------
async function carregarEquipes() {
  const select = document.getElementById("cadEquipe");
  if (!select) return;

  try {
    const resp = await fetch(`${API_BASE}/api/Equipe`);

    if (!resp.ok) {
      console.error("Erro ao carregar equipes:", resp.status);
      return;
    }

    const payload = await resp.json();
    console.log("Equipes carregadas (raw):", payload);

    const equipes = Array.isArray(payload)
      ? payload
      : payload.data || payload.Data || payload.items || [];

    // Limpar as antigas (menos o placeholder)
    select.querySelectorAll('option:not([value=""])').forEach(o => o.remove());

    if (!equipes.length) {
      console.warn("Nenhuma equipe encontrada.");
      return;
    }

    equipes.forEach(eq => {
      const opt = document.createElement("option");
      opt.value = eq.id ?? eq.Id ?? "";
      opt.textContent = eq.nome ?? eq.Nome ?? "Sem Nome";
      select.appendChild(opt);
    });

  } catch (error) {
    console.error("Erro ao carregar equipes:", error);
  }
}


// ----------------------------------------------------
// LOGIN REAL (usando email + senha)
// ----------------------------------------------------
async function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  if (!email || !senha) {
    alert("Preencha email e senha!");
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/api/Usuario/search?email=${email}&senha=${senha}`);

    if (!resp.ok) {
      alert("Erro ao conectar ao servidor.");
      return;
    }

    const result = await resp.json();

    console.log("Resultado do login:", result);

    // Sua API retorna dentro de "Data" (D maiúsculo)
    const lista = result.Data ?? result.data ?? [];

    if (lista.length === 0) {
      alert("Email ou senha incorretos.");
      return;
    }

    const user = lista[0];

    // Salva usuário logado
    localStorage.setItem("user", JSON.stringify(user));

    // Redireciona
    window.location.href = "app.html";

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Não foi possível realizar o login.");
  }
}


// ----------------------------------------------------
// CADASTRO
// ----------------------------------------------------
async function cadastrar() {
  const data = {
    nome: document.getElementById("cadNome").value,
    email: document.getElementById("cadEmail").value,
    senha: document.getElementById("cadSenha").value,
    tipo: document.getElementById("cadTipo").value,
    equipeId: parseInt(document.getElementById("cadEquipe").value),
    voucherId: null,
  };

  if (!data.nome || !data.email || !data.senha) {
    alert("Preencha todos os campos.");
    return;
  }

  if (!data.equipeId) {
    alert("Selecione uma equipe.");
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/api/Usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (resp.ok) {
      alert("Usuário cadastrado com sucesso!");
      window.location.href = "index.html";
    } else {
      const error = await resp.text();
      alert("Erro ao cadastrar: " + error);
    }

  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com o servidor.");
  }
}


// ----------------------------------------------------
// LOGOUT
// ----------------------------------------------------
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}


// ----------------------------------------------------
// INICIALIZAÇÃO AUTOMÁTICA
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  carregarEquipes();
});
