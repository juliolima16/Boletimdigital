/* =========================================================
   DADOS FICTÍCIOS (9º ANO)
   =========================================================
   "boletim" é um ARRAY (lista) de OBJETOS.
   Cada OBJETO representa uma disciplina.
   Cada objeto tem:
   - disciplina: nome
   - tri1, tri2, tri3: notas brutas (podem vir em formatos diferentes)
   - faltas: array com as faltas de cada trimestre
========================================================= */
const boletim = [
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

const MEDIA_MINIMA = 6.0; // média de referência

/* =========================================================
   FUNÇÃO: normalizarNota(valor)
   =========================================================
   Transforma qualquer nota bruta em um número de 0 a 10,
   ou retorna null quando a nota ainda não foi lançada.

   Regras:
   - vazio / null / undefined  -> null (ainda não lançada)
   - 0 a 10                    -> permanece igual
   - maior que 10 até 100      -> divide por 10
   - aceita ponto ou vírgula decimal
   - valores fora das regras   -> null (inválido)
========================================================= */
function normalizarNota(valor) {
  // Nota ausente
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for string, troca vírgula por ponto antes de converter
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  const numero = Number(valor);

  // Se não for número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Entre 0 e 10: mantém
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Maior que 10 e até 100: divide por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras: inválido
  return null;
}

/* =========================================================
   FUNÇÃO: calcularMedia(notas)
   =========================================================
   Recebe um array com notas já normalizadas (ou null).
   Calcula a média usando SOMENTE as notas disponíveis.
   Se não houver nenhuma nota válida, retorna null.
========================================================= */
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);

  if (validas.length === 0) {
    return null;
  }

  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

/* =========================================================
   FUNÇÃO: definirSituacao(media)
   =========================================================
   Retorna a situação da disciplina de acordo com a média.
========================================================= */
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

/* =========================================================
   FUNÇÃO: formatarNota(valor)
   =========================================================
   Mostra a nota com uma casa decimal.
   Se for null, mostra "Ainda não lançada".
========================================================= */
function formatarNota(valor) {
  if (valor === null) {
    return "Ainda não lançada";
  }
  return valor.toFixed(1).replace(".", ",");
}

/* =========================================================
   FUNÇÃO: somarFaltas(faltas)
   =========================================================
   Soma todos os números do array de faltas.
========================================================= */
function somarFaltas(faltas) {
  return faltas.reduce((acc, n) => acc + n, 0);
}

/* =========================================================
   FUNÇÃO: classeSituacao(situacao)
   =========================================================
   Retorna a classe CSS correspondente à situação.
========================================================= */
function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-pendente";
}

/* =========================================================
   FUNÇÃO: preencherTabela()
   =========================================================
   Cria as linhas da tabela dinamicamente a partir do array.
========================================================= */
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = ""; // limpa antes de preencher

  boletim.forEach((item) => {
    // Normaliza as 3 notas
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Média e faltas
    const media = calcularMedia([n1, n2, n3]);
    const totalFaltas = somarFaltas(item.faltas);

    // Situação
    const situacao = definirSituacao(media);

    // Cria a linha <tr>
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${item.disciplina}</td>
      <td>${formatarNota(n1)}</td>
      <td>${formatarNota(n2)}</td>
      <td>${formatarNota(n3)}</td>
      <td>${media !== null ? formatarNota(media) : "—"}</td>
      <td>${totalFaltas}</td>
      <td class="${classeSituacao(situacao)}">${situacao}</td>
    `;
    corpo.appendChild(linha);
  });
}

/* =========================================================
   FUNÇÃO: preencherCards()
   =========================================================
   Calcula os valores dos cards de resumo.
========================================================= */
function preencherCards() {
  // Vamos acumular médias e faltas de todas as disciplinas
  const medias = [];
  let totalFaltas = 0;
  let totalBom = 0;
  let totalAtencao = 0;

  boletim.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const situacao = definirSituacao(media);

    if (media !== null) {
      medias.push(media);
    }
    if (situacao === "Bom desempenho") totalBom++;
    if (situacao === "Atenção") totalAtencao++;

    totalFaltas += somarFaltas(item.faltas);
  });

  // Média geral (média das médias disponíveis)
  const mediaGeral = calcularMedia(medias);

  // Frequência FICTÍCIA/DEMONSTRATIVA — apenas para mostrar na tela.
  // No futuro, será calculada de outra forma (a partir de aulas e presenças).
  const frequenciaDemonstrativa = 92;

  // Preenche os elementos do HTML
  document.getElementById("media-geral").textContent =
    mediaGeral !== null ? formatarNota(mediaGeral) : "—";

  document.getElementById("total-faltas").textContent = totalFaltas;

  document.getElementById("total-bom").textContent = totalBom;

  document.getElementById("total-atencao").textContent = totalAtencao;

  document.getElementById("frequencia").textContent =
    frequenciaDemonstrativa + "%";
}

/* =========================================================
   INICIALIZAÇÃO
   =========================================================
   Quando a página terminar de carregar, preenche tudo.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  preencherTabela();
  preencherCards();
});