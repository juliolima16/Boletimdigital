/* =========================================================
   CONFIGURAÇÃO FIXA DO ALUNO
   ========================================================= */
const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 18,
  apiUrl: "https://boletim-api.profbt.com.br"
};

const MEDIA_MINIMA = 6.0;

/* =========================================================
   DADOS LOCALMENTE PRESERVADOS (9º ANO)
   ========================================================= */
const boletimLocal = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Estado da Sessão (somente em memória)
let sessaoPin = "";
let dadosAtuais = [];
let modoEdicao = false;

/* =========================================================
   FUNÇÃO: normalizarNota(valor)
   ========================================================= */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }
  const numero = Number(valor);
  if (isNaN(numero)) {
    return null;
  }
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

/* =========================================================
   FUNÇÕES AUXILIARES DE CÁLCULO
   ========================================================= */
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) return null;
  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

function formatarNota(valor) {
  if (valor === null) return "Ainda não lançada";
  return valor.toFixed(1).replace(".", ",");
}

function somarFaltas(faltas) {
  if (!Array.isArray(faltas)) return 0;
  return faltas.reduce((acc, n) => acc + (Number(n) || 0), 0);
}

function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-pendente";
}

/* =========================================================
   RENDERIZAÇÃO DA TABELA E CARDS
   ========================================================= */
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  dadosAtuais.forEach((item, index) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const faltasArray = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltas = somarFaltas(faltasArray);
    const situacao = definirSituacao(media);

    const linha = document.createElement("tr");

    if (modoEdicao) {
      linha.innerHTML = `
        <td></td>
        <td><input type="text" class="input-edicao" data-idx="${index}" data-campo="tri1" value="${item.tri1 !== null && item.tri1 !== undefined ? item.tri1 : ''}"></td>
        <td><input type="text" class="input-edicao" data-idx="${index}" data-campo="tri2" value="${item.tri2 !== null && item.tri2 !== undefined ? item.tri2 : ''}"></td>
        <td><input type="text" class="input-edicao" data-idx="${index}" data-campo="tri3" value="${item.tri3 !== null && item.tri3 !== undefined ? item.tri3 : ''}"></td>
        <td>${media !== null ? formatarNota(media) : "—"}</td>
        <td>
          <div style="display:flex; gap:2px;">
            <input type="text" class="input-edicao" data-idx="${index}" data-campo="f0" value="${faltasArray[0] ?? 0}" title="Faltas Tri 1">
            <input type="text" class="input-edicao" data-idx="${index}" data-campo="f1" value="${faltasArray[1] ?? 0}" title="Faltas Tri 2">
            <input type="text" class="input-edicao" data-idx="${index}" data-campo="f2" value="${faltasArray[2] ?? 0}" title="Faltas Tri 3">
          </div>
        </td>
        <td class="${classeSituacao(situacao)}">${situacao}</td>
      `;
      linha.cells[0].textContent = item.disciplina || "";
    } else {
      linha.innerHTML = `
        <td></td>
        <td>${formatarNota(n1)}</td>
        <td>${formatarNota(n2)}</td>
        <td>${formatarNota(n3)}</td>
        <td>${media !== null ? formatarNota(media) : "—"}</td>
        <td>${totalFaltas}</td>
        <td class="${classeSituacao(situacao)}">${situacao}</td>
      `;
      linha.cells[0].textContent = item.disciplina || "";
    }

    corpo.appendChild(linha);
  });
}

function preencherCards() {
  const medias = [];
  let totalFaltas = 0;
  let totalBom = 0;
  let totalAtencao = 0;

  dadosAtuais.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const situacao = definirSituacao(media);

    if (media !== null) medias.push(media);
    if (situacao === "Bom desempenho") totalBom++;
    if (situacao === "Atenção") totalAtencao++;

    const faltasArray = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    totalFaltas += somarFaltas(faltasArray);
  });

  const mediaGeral = calcularMedia(medias);
  const frequenciaDemonstrativa = 92;

  document.getElementById("media-geral").textContent =
    mediaGeral !== null ? formatarNota(mediaGeral) : "—";
  document.getElementById("total-faltas").textContent = totalFaltas;
  document.getElementById("total-bom").textContent = totalBom;
  document.getElementById("total-atencao").textContent = totalAtencao;
  document.getElementById("frequencia").textContent = frequenciaDemonstrativa + "%";
}

function atualizarTela() {
  preencherTabela();
  preencherCards();
}

/* =========================================================
   INTEGRAÇÃO COM A API
   ========================================================= */
async function entrarBoletim() {
  const inputPin = document.getElementById("input-pin");
  const msgStatus = document.getElementById("mensagem-status");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgStatus.textContent = "Digite o PIN para entrar.";
    msgStatus.style.color = "#ef4444";
    return;
  }

  msgStatus.textContent = "Conectando...";
  msgStatus.style.color = "#0284c7";

  try {
    const response = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (response.status === 401) {
      msgStatus.textContent = "Turma, chamada ou PIN inválidos.";
      msgStatus.style.color = "#ef4444";
      return;
    }

    if (response.status === 429) {
      msgStatus.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      msgStatus.style.color = "#ef4444";
      return;
    }

    if (!response.ok) {
      msgStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      msgStatus.style.color = "#ef4444";
      return;
    }

    const data = await response.json();

    sessaoPin = pinDigitado;
    inputPin.value = "";

    if (data && data.dados && Array.isArray(data.dados.disciplinas) && data.dados.disciplinas.length > 0) {
      dadosAtuais = data.dados.disciplinas;
    } else {
      dadosAtuais = JSON.parse(JSON.stringify(boletimLocal));
    }

    document.getElementById("area-login").classList.add("oculto");
    document.getElementById("area-boletim").classList.remove("oculto");
    msgStatus.textContent = "";

    atualizarTela();

  } catch (error) {
    msgStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    msgStatus.style.color = "#ef4444";
  }
}

/* =========================================================
   VALIÇÃO E EDIÇÃO
   ========================================================= */
function validarNotaDigitada(str) {
  if (str === "" || str === null || str === undefined) {
    return { valido: true, valor: null };
  }
  const limpo = String(str).trim().replace(",", ".");
  if (limpo === "") {
    return { valido: true, valor: null };
  }
  const num = Number(limpo);
  if (!isNaN(num) && num >= 0 && num <= 10) {
    return { valido: true, valor: num };
  }
  return { valido: false };
}

function validarFaltaDigitada(str) {
  const limpo = String(str).trim();
  if (limpo === "") return { valido: false };
  const num = Number(limpo);
  if (!isNaN(num) && Number.isInteger(num) && num >= 0) {
    return { valido: true, valor: num };
  }
  return { valido: false };
}

function habilitarEdicao() {
  modoEdicao = true;
  document.getElementById("btn-alterar").classList.add("oculto");
  document.getElementById("btn-salvar").classList.remove("oculto");
  document.getElementById("btn-cancelar").classList.remove("oculto");
  atualizarTela();
}

function cancelarEdicao() {
  modoEdicao = false;
  document.getElementById("btn-alterar").classList.remove("oculto");
  document.getElementById("btn-salvar").classList.add("oculto");
  document.getElementById("btn-cancelar").classList.add("oculto");
  atualizarTela();
}

async function salvarAlteracoes() {
  const inputs = document.querySelectorAll(".input-edicao");
  let temErro = false;

  inputs.forEach((input) => input.classList.remove("input-invalido"));

  const novosDados = JSON.parse(JSON.stringify(dadosAtuais));

  inputs.forEach((input) => {
    const idx = parseInt(input.getAttribute("data-idx"), 10);
    const campo = input.getAttribute("data-campo");
    const valStr = input.value;

    if (campo.startsWith("tri")) {
      const res = validarNotaDigitada(valStr);
      if (!res.valido) {
        input.classList.add("input-invalido");
        temErro = true;
      } else {
        novosDados[idx][campo] = res.valor;
      }
    } else if (campo.startsWith("f")) {
      const pos = parseInt(campo.replace("f", ""), 10);
      const res = validarFaltaDigitada(valStr);
      if (!res.valido) {
        input.classList.add("input-invalido");
        temErro = true;
      } else {
        if (!Array.isArray(novosDados[idx].faltas)) {
          novosDados[idx].faltas = [0, 0, 0];
        }
        novosDados[idx].faltas[pos] = res.valor;
      }
    }
  });

  if (temErro) {
    alert("Por favor, corrija os campos destacados em vermelho antes de salvar.");
    return;
  }

  const btnSalvar = document.getElementById("btn-salvar");
  const textoOriginal = btnSalvar.textContent;
  btnSalvar.textContent = "Salvando...";
  btnSalvar.disabled = true;

  try {
    const response = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: sessaoPin,
        dados: {
          disciplinas: novosDados
        }
      })
    });

    if (response.ok) {
      dadosAtuais = novosDados;
      modoEdicao = false;
      document.getElementById("btn-alterar").classList.remove("oculto");
      document.getElementById("btn-salvar").classList.add("oculto");
      document.getElementById("btn-cancelar").classList.add("oculto");
      atualizarTela();
      alert("Dados salvos com sucesso.");
    } else {
      alert("Não foi possível salvar as alterações. Tente novamente.");
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor ao salvar.");
  } finally {
    btnSalvar.textContent = textoOriginal;
    btnSalvar.disabled = false;
  }
}

/* =========================================================
   INICIALIZAÇÃO E EVENTOS
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-entrar").addEventListener("click", entrarBoletim);
  document.getElementById("input-pin").addEventListener("keypress", (e) => {
    if (e.key === "Enter") entrarBoletim();
  });

  document.getElementById("btn-alterar").addEventListener("click", habilitarEdicao);
  document.getElementById("btn-cancelar").addEventListener("click", cancelarEdicao);
  document.getElementById("btn-salvar").addEventListener("click", salvarAlteracoes);
});