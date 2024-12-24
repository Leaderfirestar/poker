import { Pot } from "./Pot";

type Stage = "pre-flop" | "flop" | "turn" | "river" | "showdown";

export class Round {
	/**	The value of the big blind */
	private bigBlind: number;
	/**	The current bet for the round */
	private currentBet: number;
	/**	Value of chips in the pot */
	private pot: Pot;
	/**	The value of the small blind */
	private smallBlind: number;
	/**	The current stage of the round */
	private stage: Stage;
	constructor() {
		this.bigBlind = 0;
		this.currentBet = 0;
		this.pot = new Pot();
		this.smallBlind = 0;
		this.stage = "pre-flop";
	}
}