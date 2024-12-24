import { Player } from "./Player";
import { Table } from "./Table";

export class Game {
	/**	The round number the game is on */
	private roundNumber: number = 1;
	/**	The players playing the game */
	private players: Player[];
	/**	The table object. Tracks play and whatnot */
	private table: Table;
	constructor() {
		this.players = [];
		this.table = new Table();
	}
}