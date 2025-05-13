# Dijkstra - Visualização e Cálculo de Menores Caminhos

> **Trabalho solicitado para a disciplina PGCC020 - Redes e Sistemas de Comunicação do Programa de Pós-Graduação em Ciência da Computação (PGCC) da UEFS, sob orientação do professor Alex Ferreira Dos Santos.**
>
> **Aluno:** Inácio Oliveira Borges

Este projeto é uma aplicação web simples para calcular e visualizar os menores caminhos entre todos os pares de nós em um grafo, utilizando o algoritmo de Dijkstra. O grafo é definido a partir de um arquivo de texto de entrada, e os resultados são exibidos em uma tabela e em um canvas.

## Funcionalidades

- Leitura de um arquivo `fisico.txt` contendo a definição do grafo (nós e arestas) no formato no formato:
  <nó_origem> <nó_destino> <distância_em_km>
- Cálculo dos menores caminhos entre todos os pares de nós usando Dijkstra.
- Exibição dos caminhos e distâncias em uma tabela.
- Visualização gráfica do grafo em um canvas.

## Como usar

1. Abra o arquivo `index.html` em seu navegador.
2. Clique no botão para selecionar o arquivo `fisico.txt` com a estrutura do grafo.
3. Clique em "Processar" para visualizar os menores caminhos e o grafo.

### Exemplo de arquivo `fisico.txt`

```
4
1 2 5
1 3 10
2 3 3
2 4 2
3 4 1
```

A primeira linha indica o número de nós. As linhas seguintes representam as arestas no formato: `origem destino distancia`.

## Estrutura dos arquivos

- `index.html`: Interface web.
- `script.js`: Lógica de leitura, cálculo dos caminhos e desenho do grafo.
- `style.css`: Estilos visuais da aplicação.

## Requisitos

- Navegador moderno (não requer instalação de dependências).

## Autor

- Projeto acadêmico para disciplina de Redes.
