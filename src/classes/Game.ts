import { Player } from "./Player";
import { Table } from "./Table";

export class Game {
	private currentRound: number = 0;
	/**	The players playing the game */
	private players: Player[];
	/**	The table object. Tracks play and whatnot */
	private table: Table;
	constructor() {
		this.players = [];
		this.table = new Table();
	}
}