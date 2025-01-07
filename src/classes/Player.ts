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

	/**
	 * Returns the number of chips the player has
	 * @returns The number of chips the player has
	 */
	getTotalChips() {
		return this.chips;
	}

	/**
	 * Get's the player's username
	 * @returns The player's username
	 */
	getName() {
		return this.username;
	}
}

interface PlayerInput {
	gameSettings: GameSettings;
}