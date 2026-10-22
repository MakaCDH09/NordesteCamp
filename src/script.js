// Calcula a classificação parcial com os placares confirmados do torneio por equipes.
const partidas = [...document.querySelectorAll("[data-match]")];

if (partidas.length > 0) {
	const linhasEquipes = [...document.querySelectorAll("[data-team-standing]")];
	const estatisticasEquipes = new Map(
		linhasEquipes.map((linha) => [
			linha.dataset.teamStanding,
			{ played: 0, wins: 0, draws: 0, losses: 0, points: 0 },
		]),
	);
	const equipeNordeste = estatisticasEquipes.get("Nordeste Camp");
	let placaresInformados = 0;

	for (const partida of partidas) {
		const placarEquipe = Number(partida.dataset.teamScore);
		const placarAdversario = Number(partida.dataset.opponentScore);
		const adversario = estatisticasEquipes.get(partida.dataset.opponentTeam);
		const elementoResultado = partida.querySelector("[data-match-result]");
		const elementoPlacar = partida.querySelector("[data-score-display]");

		if (!Number.isFinite(placarEquipe) || !Number.isFinite(placarAdversario) || !adversario) {
			elementoResultado.textContent = "Placar inválido";
			continue;
		}

		placaresInformados += 1;
		elementoPlacar.textContent = `${placarEquipe} – ${placarAdversario}`;
		elementoPlacar.setAttribute(
			"aria-label",
			`Nordeste Camp ${placarEquipe}, ${partida.dataset.opponentTeam} ${placarAdversario}`,
		);
		equipeNordeste.played += 1;
		adversario.played += 1;

		if (placarEquipe > placarAdversario) {
			equipeNordeste.wins += 1;
			equipeNordeste.points += 3;
			adversario.losses += 1;
			elementoResultado.textContent = "Vitória · 3 pontos";
			elementoResultado.classList.add("bg-emerald-950/70", "text-emerald-100");
		} else if (placarEquipe < placarAdversario) {
			equipeNordeste.losses += 1;
			adversario.wins += 1;
			adversario.points += 3;
			elementoResultado.textContent = "Derrota · 0 pontos";
			elementoResultado.classList.add("bg-rose-950/70", "text-rose-100");
		} else {
			equipeNordeste.draws += 1;
			equipeNordeste.points += 1;
			adversario.draws += 1;
			adversario.points += 1;
			elementoResultado.textContent = "Empate · 1 ponto";
			elementoResultado.classList.add("bg-amber-950/70", "text-amber-100");
		}
	}

	linhasEquipes.forEach((linha) => {
		const estatisticas = estatisticasEquipes.get(linha.dataset.teamStanding);
		for (const celula of linha.querySelectorAll("[data-team-stat]")) {
			celula.textContent = estatisticas[celula.dataset.teamStat];
		}
		linha.querySelector("[data-team-mobile-stats]").textContent =
			`${estatisticas.played}J · ${estatisticas.wins}V · ${estatisticas.draws}E · ${estatisticas.losses}D`;
	});
	document.querySelector("[data-reported-fixtures]").textContent = placaresInformados;

	const resultadoIndividual = document.querySelector('[data-campaign-team="Nordeste Camp"]');
	const partidasIndividuais = Number(resultadoIndividual?.dataset.matches ?? 0);
	const vitoriasIndividuais = Number(resultadoIndividual?.dataset.wins ?? 0);
	const pontosIndividuais = Number(resultadoIndividual?.dataset.points ?? 0);
	const mediaPontosEquipe = equipeNordeste.played === 0 ? 0 : equipeNordeste.points / equipeNordeste.played;
	let classificacaoEquipe = "Em treinamento";

	if (equipeNordeste.wins >= 4) {
		classificacaoEquipe = "Campeã";
	} else if (equipeNordeste.wins >= 2) {
		classificacaoEquipe = "Competitiva";
	}

	document.querySelector("[data-team-points]").textContent = equipeNordeste.points;
	document.querySelector("[data-team-wins]").textContent = equipeNordeste.wins;
	document.querySelector("[data-team-matches]").textContent = equipeNordeste.played;
	document.querySelector("[data-team-average]").textContent = mediaPontosEquipe.toFixed(1);
	document.querySelector("[data-team-classification]").textContent = classificacaoEquipe;
	document.querySelector("[data-solo-points]").textContent = pontosIndividuais;
	document.querySelector("[data-solo-wins]").textContent = vitoriasIndividuais;
	document.querySelector("[data-solo-matches]").textContent = partidasIndividuais;
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
		const termoBusca = campoBusca.value.trim().toLocaleLowerCase();
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
