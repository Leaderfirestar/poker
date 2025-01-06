import { Player } from "./Player";

export class Pot {
	private amount: number;
	private eligiblePlayers: Player[];

	constructor(eligiblePlayers: Player[]) {
		this.amount = 0;
		this.eligiblePlayers = eligiblePlayers;
	}

	addContribution(player: Player, amount: number) {
		if (!this.eligiblePlayers.includes(player)) {
			throw new Error(`${player.getName()} is not eligible for this pot.`);
		}
		this.amount += amount;
	}

	distributeWinnings(winners: Player[]) {
		if (winners.some((winner) => !this.eligiblePlayers.includes(winner))) {
			throw new Error(`One or more winners are not eligible for this pot.`);
		}

		const share = this.amount / winners.length;
		for (const winner of winners) {
			winner.addChips(share);
		}
		this.amount = 0; // Clear the pot after distribution
	}

	getAmount() {
		return this.amount;
	}

	getEligiblePlayers() {
		return this.eligiblePlayers;
	}
}