export class GameSettings {
	/**	The initial blind to be used in the game */
	private startingBlind: number;
	constructor() {
		this.startingBlind = 5;
	}

	getStartingBlind() {
		return this.startingBlind;
	}
}