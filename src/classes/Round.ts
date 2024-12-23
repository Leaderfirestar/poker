import { Pot } from "./Pot";

export class Round {
	private currentBet: number;
	/**	Value of chips in the pot */
	private pot: Pot;
	constructor() {
		this.currentBet = 0;
		this.pot = new Pot();
	}
}