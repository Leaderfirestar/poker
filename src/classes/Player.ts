import { v4 as uuid } from "uuid";
import { Card } from "./Card";

export class Player {
	private id: string = uuid();
	/** Chip denomination to the number of chips of that denomination */
	private chips: Map<number, number>;
	/**	Whether or not this player is the dealer */
	private dealer: boolean;
	/**	Whether or not this player has folded */
	private folded: boolean;
	/**	The array of cards the player has */
	private hand: Card[];
	/**	Player's username */
	private username: string;

	constructor() {
		this.chips = new Map();
		this.folded = false;
		this.hand = [];
		this.username = "";
		this.dealer = false;
	}
}