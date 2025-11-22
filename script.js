const API_BASE = "http://4.206.159.231:5000";

// ---------------- CARREGAR EQUIPES ---------------------
async function carregarEquipes() {
  const select = document.getElementById("cadEquipe");
  if (!select) return;

  try {
    const resp = await fetch(`${API_BASE}/api/Equipe`);
    if (!resp.ok) {
      console.error("Erro HTTP ao buscar equipes:", resp.status);
      return;
    }

    const payload = await resp.json();
    console.log("Equipes carregadas (raw):", payload);

    const equipes = Array.isArray(payload)
      ? payload
      : payload.data || payload.equipes || payload.items || [];

    // limpa opções anteriores (mantém placeholder com value="")
    select
      .querySelectorAll('option:not([value=""])')
      .forEach((o) => o.remove());

    if (!equipes.length) {
      console.warn("Nenhuma equipe encontrada", payload);
      return;
    }

    equipes.forEach((eq) => {
      const opt = document.createElement("option");
      opt.value = eq.id ?? eq.Id ?? eq.idEquipe ?? eq.IdEquipe ?? "";
      opt.textContent = eq.nome ?? eq.Nome ?? eq.name ?? eq.Name ?? String(eq);
      select.appendChild(opt);
    });
  } catch (error) {
    console.error("Erro ao carregar equipes:", error);
  }
}

// ---------------- GARANTIR QUE O DOM CARREGOU ---------------------
document.addEventListener("DOMContentLoaded", function () {
  // carregar equipes sempre que o select existir na página
  carregarEquipes();
});

// ---------------- LOGIN ---------------------
async function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  try {
    const resp = await fetch(`${API_BASE}/api/Usuario/email/${email}`);

    if (!resp.ok) {
      alert("Usuário não encontrado.");
      return;
    }

    const user = await resp.json();

    if (user.senha !== senha) {
      alert("Senha incorreta.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "app.html";
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
  }
}

// ---------------- CADASTRO ---------------------
async function cadastrar() {
  const data = {
    nome: document.getElementById("cadNome").value,
    email: document.getElementById("cadEmail").value,
    senha: document.getElementById("cadSenha").value,
    tipo: document.getElementById("cadTipo").value,
    equipeId: parseInt(document.getElementById("cadEquipe").value),
    voucherId: null,
  };

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
    alert("Erro ao conectar com o servidor.");
  }
}

// ---------------- LOGOUT ---------------------
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
