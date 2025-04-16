import { Player } from "./Player";

export class Pot {
	private amount: number;
	private eligiblePlayers: Player[];

	constructor(eligiblePlayers: Player[]) {
		this.amount = 0;
		this.eligiblePlayers = eligiblePlayers;
	}

	/**
	 * Adds a player's contribution to the pot
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param player The player adding money to the pot
	 * @param amount The amount the player is adding to the pot
	 */
	addContribution(player: Player, amount: number) {
		if (!this.eligiblePlayers.includes(player)) {
			throw new Error(`${player.getName()} is not eligible for this pot.`);
		}
		this.amount += amount;
	}

	/**
	 * Given the people who won the hand, divides the pot among them
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param winners The folks who won the hand
	 */
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

	/**
	 * Gets and returns the value of the pot
	 * @returns The value of this pot
	 */
	getAmount() {
		return this.amount;
	}

	/**
	 * Gets the players that are eligible to win this pot and returns them
	 * @returns The players eligible to win this pot
	 */
	getEligiblePlayers() {
		return this.eligiblePlayers;
	}
}