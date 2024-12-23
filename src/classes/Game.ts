import { Card } from "./Card";
import { Deck } from "./Deck";
import { Player } from "./Player";

export class Game {
	/**	Index for the players array to designate a dealer */
	private dealerIndex: number;
	/**	The deck we'll be using for the game */
	private deck: Deck;
	/**	The players playing the game */
	private players: Player[];
	/**	The cards in the river */
	private river: Card[];
	constructor() {
		this.dealerIndex = 0;
		this.deck = new Deck();
		this.players = [];
		this.river = [];
	}
}