import { v4 as uuid } from "uuid";
import { Card } from "./Card";
import { GameSettings } from "./GameSettings";

export class Player {
	private id: string = uuid();
	/** Number of chips the user has */
	private chips: number;
	/**	Whether or not this player is the dealer */
	private dealer: boolean;
	/**	Whether or not this player has folded */
	private folded: boolean;
	/**	The array of cards the player has */
	private hand: Card[];
	/**	Whether or not a this player is all in */
	private allIn: boolean = false;
	/**	Player's username */
	private username: string;

	constructor(input: PlayerInput) {
		this.chips = input.gameSettings.getStartingChips();
		this.folded = false;
		this.hand = [];
		this.username = "";
		this.dealer = false;
	}

	/**
	 * Gives chips to the player
	 * @param amount The amount of chips to give to the player
	 */
	addChips(amount: number) {
		this.chips += amount;
	}

	/**
	 * Given an amount of chips to collect from the player, deducts chips from the player equal to that amount, or the maximum number of chips the player has
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param amount The amount to collect from the player
	 * @returns The amount of chips collected
	 */
	deductChips(amount: number) {
		const collectedChips = Math.min(this.chips, amount);
		this.chips -= collectedChips;
		return collectedChips;
	}

	/**
	 * Deals a card to the player
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param card The card to be dealt to the player
	 */
	dealCard(card: Card) {
		this.hand.push(card);
	}

	getHand() {
		return this.hand;
	}

	/**
	 * Get's the player's username
	 * @returns The player's username
	 */
	getName() {
		return this.username;
	}

	/**
	 * Returns the number of chips the player has
	 * @returns The number of chips the player has
	 */
	getTotalChips() {
		return this.chips;
	}

	/**
	 * Returns if this player is all in or not
	 * @returns Wheter or not this player is all in
	 */
	isAllIn() {
		return this.allIn;
	}

	/**
	 * Returns whether or not the player is all in
	 * @returns Whether or not this player is all-in
	 */
	isFolded() {
		return this.folded;
	}

	async placeBet(currentBet: number): Promise<number> {
		if (this.allIn || this.folded) return -1;

		const decision: BetDecision = { action: "check" };

		switch (decision.action) {
			case "fold": {
				this.folded = true;
				return -1;
			}
			case "call": {
				const callAmount = Math.min(currentBet, this.chips);
				this.chips -= callAmount;
				if (this.chips === 0) this.allIn = true;
				return callAmount;
			}
			case "raise": {
				const raiseAmount = Math.min(decision.amount, this.chips);
				this.chips -= raiseAmount;
				if (this.chips === 0) this.allIn = true;
				return raiseAmount;
			}
			case "check": {
				return 0;
			}
			default: {
				throw new Error("Invalid betting action.");
			}
		}
	}
}

interface PlayerInput {
	gameSettings: GameSettings;
}

interface CallDecision {
	action: "call";
}

interface CheckDecision {
	action: "check";
}

interface FoldDecision {
	action: "fold";
}

interface RaiseDecision {
	action: "raise";
	amount: number;
}

type BetDecision = CallDecision | CheckDecision | FoldDecision | RaiseDecision;