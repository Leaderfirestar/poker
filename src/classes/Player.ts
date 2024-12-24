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
}

interface PlayerInput {
	gameSettings: GameSettings;
}