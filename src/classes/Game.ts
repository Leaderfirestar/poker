import { GameSettings } from "./GameSettings";
import { Player } from "./Player";
import { Table } from "./Table";

export class Game {
	/**	The round number the game is on */
	private roundNumber: number = 1;
	/**	The players playing the game */
	private players: Player[];
	/**	The table object. Tracks play and whatnot */
	private table: Table;
	constructor(input: GameInput) {
		this.players = input.players;
		this.table = new Table();
	}
}

interface GameInput {
	players: Player[];
	settings: GameSettings;
}