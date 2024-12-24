export class GameSettings {
	/**	The initial blind to be used in the game */
	private startingBlind: number;
	private startingChips: number;
	constructor(input: GameSettingsInput) {
		this.startingBlind = input.startingBlind;
		this.startingChips = input.startingChips;
	}

	getStartingBlind() {
		return this.startingBlind;
	}

	getStartingChips() {
		return this.startingChips;
	}
}

interface GameSettingsInput {
	startingBlind: number;
	startingChips: number;
}