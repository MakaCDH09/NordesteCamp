// Reúne as partidas da página de classificação para calcular os resultados da equipe.
const partidas = [...document.querySelectorAll("[data-match]")];

if (partidas.length > 0) {
	// Guarda a soma dos pontos e a quantidade de vitórias durante o cálculo.
	let pontosTotais = 0;
	let vitorias = 0;

	for (const partida of partidas) {
		// Lê os placares configurados nos atributos data-team-score e data-opponent-score.
		const placarEquipe = Number(partida.dataset.teamScore);
		const placarAdversario = Number(partida.dataset.opponentScore);
		const elementoResultado = partida.querySelector("[data-match-result]");
		const elementoPlacar = partida.querySelector("[data-score-display]");

		// Ignora a pontuação se algum placar não for um número válido.
		if (!Number.isFinite(placarEquipe) || !Number.isFinite(placarAdversario)) {
			elementoResultado.textContent = "Placar inválido";
			continue;
		}

		// Atualiza o placar visível e sua descrição para leitores de tela.
		elementoPlacar.textContent = `${placarEquipe} – ${placarAdversario}`;
		elementoPlacar.setAttribute("aria-label", `Nordeste Camp ${placarEquipe}, adversário ${placarAdversario}`);

		// Aplica a regra de pontuação: vitória vale 3 pontos, empate vale 1.
		if (placarEquipe > placarAdversario) {
			vitorias += 1;
			pontosTotais += 3;
			elementoResultado.textContent = "Vitória · 3 pontos";
			elementoResultado.classList.add("bg-emerald-950/70", "text-emerald-100");
		} else if (placarEquipe === placarAdversario) {
			pontosTotais += 1;
			elementoResultado.textContent = "Empate · 1 ponto";
			elementoResultado.classList.add("bg-amber-950/70", "text-amber-100");
		} else {
			elementoResultado.textContent = "Derrota · 0 pontos";
			elementoResultado.classList.add("bg-rose-950/70", "text-rose-100");
		}
	}

	// Calcula a média de pontos e define a categoria conforme o total de vitórias.
	const partidasConcluidas = partidas.length;
	const mediaPontos = partidasConcluidas === 0 ? 0 : pontosTotais / partidasConcluidas;
	let classificacao = "Em treinamento";

	if (vitorias >= 4) {
		classificacao = "Campeã";
	} else if (vitorias >= 2) {
		classificacao = "Competitiva";
	}

	// Exibe os valores calculados nos campos de resumo da classificação.
	document.querySelector("[data-total-points]").textContent = pontosTotais;
	document.querySelector("[data-points-average]").textContent = mediaPontos.toFixed(1);
	document.querySelector("[data-win-count]").textContent = vitorias;
	document.querySelector("[data-team-classification]").textContent = classificacao;
}

// Procura o formulário de filtros; ele só existe na página de competições.
const formularioFiltros = document.querySelector("[data-competition-filters]");

if (formularioFiltros) {
	// Guarda os controles e os cartões que serão filtrados.
	const cartoesCompeticao = [...document.querySelectorAll("[data-competition]")];
	const campoBusca = formularioFiltros.querySelector("[data-filter-search]");
	const filtroModalidade = formularioFiltros.querySelector("[data-filter-mode]");
	const filtroJogo = formularioFiltros.querySelector("[data-filter-game]");
	const filtroSituacao = formularioFiltros.querySelector("[data-filter-status]");
	const elementoContagem = document.querySelector("[data-competition-count]");
	const mensagemSemResultados = document.querySelector("[data-competition-empty]");

	// Evita que pressionar Enter envie o formulário e recarregue a página.
	formularioFiltros.addEventListener("submit", (evento) => evento.preventDefault());

	// Compara cada cartão com todos os filtros e atualiza a lista exibida.
	const atualizarCompeticoes = () => {
		const termoBusca = campoBusca.value.trim().toLocaleLowerCase("pt-BR");
		let quantidadeVisivel = 0;

		for (const cartao of cartoesCompeticao) {
			// Cada verificação aceita qualquer valor quando o filtro está em "all".
			const correspondeBusca = cartao.dataset.search.includes(termoBusca);
			const correspondeModalidade = filtroModalidade.value === "all" || cartao.dataset.mode === filtroModalidade.value;
			const correspondeJogo = filtroJogo.value === "all" || cartao.dataset.game === filtroJogo.value;
			const correspondeSituacao = filtroSituacao.value === "all" || cartao.dataset.status === filtroSituacao.value;
			const deveExibir = correspondeBusca && correspondeModalidade && correspondeJogo && correspondeSituacao;

			// Oculta os cartões que não correspondem e soma os que permanecem visíveis.
			cartao.hidden = !deveExibir;
			quantidadeVisivel += Number(deveExibir);
		}

		// Atualiza a contagem e mostra uma mensagem quando nenhum cartão corresponde.
		elementoContagem.textContent = quantidadeVisivel;
		mensagemSemResultados.classList.toggle("hidden", quantidadeVisivel !== 0);
	};

	// Reaplica os filtros ao digitar ou alterar uma opção.
	formularioFiltros.addEventListener("input", atualizarCompeticoes);
	formularioFiltros.addEventListener("change", atualizarCompeticoes);
}
