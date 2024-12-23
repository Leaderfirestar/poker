import { Card } from "./Card";
import { Deck } from "./Deck";
import { Player } from "./Player";

export class Game {
	/**	Index for the players array to designate a dealer */
	dealerIndex: number;
	/**	The deck we'll be using for the game */
	deck: Deck;
	/**	The players playing the game */
	players: Player[];
	/**	Value of chips in the pot */
	pot: number;
	/**	The cards in the river */
	river: Card[];
	constructor() {
		this.dealerIndex = 0;
		this.deck = new Deck();
		this.players = [];
		this.pot = 0;
		this.river = [];
	}
}