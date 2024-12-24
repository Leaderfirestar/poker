import { Card } from "./Card";
import { Deck } from "./Deck";
import { Player } from "./Player";
import { Round } from "./Round";

export class Table {
	/**	Index for the players array to designate a dealer */
	private dealerIndex: number;
	/**	The deck we'll be using for the game */
	private deck: Deck;
	/**	The cards in the river */
	private river: Card[];
	/**	The current round at the table */
	private round: Round;
	/**	Players currently at the table */
	private seats: Player[];
	constructor() {
		this.dealerIndex = 0;
		this.deck = new Deck();
		this.river = [];
		this.round = new Round();
		this.seats = [];
	}
}