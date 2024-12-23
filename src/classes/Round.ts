import { Pot } from "./Pot";

type Stage = "pre-flop" | "flop" | "turn" | "river" | "showdown";

export class Round {
	/**	The current bet for the round */
	private currentBet: number;
	/**	Value of chips in the pot */
	private pot: Pot;
	/**	The current stage of the round */
	private stage: Stage;
	constructor() {
		this.currentBet = 0;
		this.pot = new Pot();
		this.stage = "pre-flop";
	}
}