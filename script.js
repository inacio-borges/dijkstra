document.getElementById("processBtn").addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) {
    alert("Selecione o arquivo fisico.txt!");
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const conteudo = e.target.result;
    const { nodes, edges } = parseFisico(conteudo);
    const resultados = calcularMenoresCaminhos(nodes, edges);
    mostrarResultados(resultados);
    desenharGrafo(nodes, edges);
  };
  reader.readAsText(file);
});

// Parse do arquivo fisico.txt
function parseFisico(texto) {
  const linhas = texto.split(/\r?\n/).filter((l) => l.trim() !== "");
  const n = parseInt(linhas[0]);
  const edges = [];
  for (let i = 1; i < linhas.length; i++) {
    const [origem, destino, distancia] = linhas[i]
      .trim()
      .split(/\s+/)
      .map(Number);
    edges.push({ origem, destino, distancia });
  }
  const nodes = Array.from({ length: n }, (_, i) => i + 1);
  return { nodes, edges };
}

// Algoritmo de Dijkstra para todos os pares
function calcularMenoresCaminhos(nodes, edges) {
  const resultados = [];
  const grafo = {};
  nodes.forEach((n) => (grafo[n] = []));
  edges.forEach(({ origem, destino, distancia }) => {
    grafo[origem].push({ destino, distancia });
  });
  for (let origem of nodes) {
    const { dist, prev } = dijkstra(grafo, origem, nodes);
    for (let destino of nodes) {
      if (origem !== destino) {
        const caminho = reconstruirCaminho(prev, origem, destino);
        resultados.push({ origem, destino, distancia: dist[destino], caminho });
      }
    }
  }
  return resultados;
}

// Dijkstra de um nó origem
function dijkstra(grafo, origem, nodes) {
  const dist = {};
  const prev = {};
  const visitados = new Set();
  nodes.forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
  });
  dist[origem] = 0;
  while (visitados.size < nodes.length) {
    let u = null;
    let minDist = Infinity;
    for (let n of nodes) {
      if (!visitados.has(n) && dist[n] < minDist) {
        minDist = dist[n];
        u = n;
      }
    }
    if (u === null) break;
    visitados.add(u);
    for (let vizinho of grafo[u]) {
      if (dist[u] + vizinho.distancia < dist[vizinho.destino]) {
        dist[vizinho.destino] = dist[u] + vizinho.distancia;
        prev[vizinho.destino] = u;
      }
    }
  }
  return { dist, prev };
}

// Reconstruir caminho
function reconstruirCaminho(prev, origem, destino) {
  const caminho = [];
  let atual = destino;
  while (atual !== null && atual !== origem) {
    caminho.unshift(atual);
    atual = prev[atual];
  }
  if (atual === origem) caminho.unshift(origem);
  return caminho;
}

// Mostrar resultados na tela
function mostrarResultados(resultados) {
  const div = document.getElementById("resultados");
  // Limpa o conteúdo anterior
  div.innerHTML = "";

  // Cria a tabela
  const table = document.createElement("table");
  table.className = "resultado-tabela";

  // Cabeçalho
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["ORIGEM/DESTINO", "CAMINHO", "DISTÂNCIA"].forEach((titulo) => {
    const th = document.createElement("th");
    th.textContent = titulo;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  resultados.forEach((r) => {
    const row = document.createElement("tr");

    const tdOD = document.createElement("td");
    tdOD.textContent = `${r.origem} - ${r.destino}`;
    row.appendChild(tdOD);
    // Caminho
    const tdCaminho = document.createElement("td");
    tdCaminho.textContent = r.caminho.join(" - ");
    row.appendChild(tdCaminho);
    // Distância
    const tdDist = document.createElement("td");
    tdDist.textContent = r.distancia;
    row.appendChild(tdDist);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  div.appendChild(table);
}

// Desenhar grafo simples no canvas
function desenharGrafo(nodes, edges) {
  const canvas = document.getElementById("grafoCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Ajuste dinâmico do raio e do tamanho do nó
  const nodeCount = nodes.length;
  const minNodeSpacing = 60; // distância mínima entre centros dos nós
  const maxNodeRadius = 28;
  const nodeRadius = Math.min(
    maxNodeRadius,
    Math.floor(
      Math.min(canvas.width, canvas.height) /
        (2 * (1 + Math.sin(Math.PI / nodeCount))) -
        10
    )
  );
  // Calcula o maior raio possível para não sobrepor
  const raio = Math.min(centerX, centerY) - nodeRadius - 10;
  const angulo = (2 * Math.PI) / nodeCount;
  const posicoes = {};
  nodes.forEach((n, i) => {
    const x = centerX + raio * Math.cos(i * angulo - Math.PI / 2);
    const y = centerY + raio * Math.sin(i * angulo - Math.PI / 2);
    posicoes[n] = { x, y };
  });
  // Desenhar arestas
  ctx.strokeStyle = "#888";
  ctx.font = "14px Arial";
  edges.forEach(({ origem, destino, distancia }) => {
    const { x: x1, y: y1 } = posicoes[origem];
    const { x: x2, y: y2 } = posicoes[destino];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Distância
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    ctx.fillStyle = "#333";
    ctx.fillText(distancia, mx, my);
  });
  // Desenhar nós
  nodes.forEach((n) => {
    const { x, y } = posicoes[n];
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.stroke();
    ctx.fillStyle = "#333";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(n, x, y);
  });
}
