import { Player } from "./Player";
import { Pot } from "./Pot";

type Stage = "pre-flop" | "flop" | "turn" | "river" | "showdown";

export class Round {
	/**	The value of the big blind */
	private bigBlind: number;
	/**	The current bet for the round */
	private currentBet: number;
	/**	The players in this round. Null means the player left the round */
	private players: (Player | null)[];
	/**	Value of chips in the pot */
	private pot: Pot;
	/**	The value of the small blind */
	private smallBlind: number;
	/**	The current stage of the round */
	private stage: Stage = "pre-flop";
	constructor(input: RoundInput) {
		this.bigBlind = 0;
		this.currentBet = 0;
		this.players = input.players;
		this.pot = new Pot();
		this.smallBlind = 0;
	}
}

interface RoundInput {
	players: Player[];
}