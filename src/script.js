const matches = [...document.querySelectorAll("[data-match]")];

if (matches.length > 0) {
	let totalPoints = 0;
	let wins = 0;

	for (const match of matches) {
		const teamScore = Number(match.dataset.teamScore);
		const opponentScore = Number(match.dataset.opponentScore);
		const resultElement = match.querySelector("[data-match-result]");
		const scoreElement = match.querySelector("[data-score-display]");

		if (!Number.isFinite(teamScore) || !Number.isFinite(opponentScore)) {
			resultElement.textContent = "Placar inválido";
			continue;
		}

		scoreElement.textContent = `${teamScore} – ${opponentScore}`;
		scoreElement.setAttribute("aria-label", `Nordeste Camp ${teamScore}, adversário ${opponentScore}`);

		if (teamScore > opponentScore) {
			wins += 1;
			totalPoints += 3;
			resultElement.textContent = "Vitória · 3 pontos";
			resultElement.classList.add("bg-emerald-950/70", "text-emerald-100");
		} else if (teamScore === opponentScore) {
			totalPoints += 1;
			resultElement.textContent = "Empate · 1 ponto";
			resultElement.classList.add("bg-amber-950/70", "text-amber-100");
		} else {
			resultElement.textContent = "Derrota · 0 pontos";
			resultElement.classList.add("bg-rose-950/70", "text-rose-100");
		}
	}

	const completedMatches = matches.length;
	const averagePoints = completedMatches === 0 ? 0 : totalPoints / completedMatches;
	let classification = "Em treinamento";

	if (wins >= 4) {
		classification = "Campeã";
	} else if (wins >= 2) {
		classification = "Competitiva";
	}

	document.querySelector("[data-total-points]").textContent = totalPoints;
	document.querySelector("[data-points-average]").textContent = averagePoints.toFixed(1);
	document.querySelector("[data-win-count]").textContent = wins;
	document.querySelector("[data-team-classification]").textContent = classification;
}
