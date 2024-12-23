export class Round {
	currentBet: number;
	/**	Value of chips in the pot */
	pot: number;
	constructor() {
		this.currentBet = 0;
		this.pot = 0;
	}
}