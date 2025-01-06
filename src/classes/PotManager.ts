import { Player } from "./Player";
import { Pot } from "./Pot";

export class PotManager {
	private pots: Pot[] = [];
	constructor(players: Player[]) {
		// Initialize with a main pot for all players
		this.pots.push(new Pot(players));
	}

	addContribution(player: Player, amount: number) {
		let remainingAmount = amount;

		for (const pot of this.pots) {
			if (pot.getEligiblePlayers().includes(player)) {
				const maxContribution = this.calculateMaxContribution(pot);
				const contribution = Math.min(remainingAmount, maxContribution);
				pot.addContribution(player, contribution);
				remainingAmount -= contribution;

				if (remainingAmount <= 0) break;
			}
		}

		// If there's remaining amount, create a new side pot
		if (remainingAmount > 0) {
			const newPotEligiblePlayers = this.pots.flatMap((pot) => pot.getEligiblePlayers()).filter((p) => p !== player);
			this.pots.push(new Pot(newPotEligiblePlayers));
			this.pots[this.pots.length - 1].addContribution(player, remainingAmount);
		}
	}

	distributeWinnings(winners: Player[]) {
		for (const pot of this.pots) {
			const potWinners = winners.filter((winner) =>
				pot.getEligiblePlayers().includes(winner)
			);
			pot.distributeWinnings(potWinners);
		}
	}

	private calculateMaxContribution(pot: Pot): number {
		return Math.min(...pot.getEligiblePlayers().map((p) => p.getChips()));
	}
}