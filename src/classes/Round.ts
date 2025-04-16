import { Card } from "./Card";
import { HandEvaluator } from "./HandEvaluator";
import { Player } from "./Player";
import { PotManager } from "./PotManager";

type Stage = "pre-flop" | "flop" | "turn" | "river" | "showdown";

export class Round {
	/**	The value of the blind */
	private blind: number;
	/**	The current bet for the round */
	private currentBet: number;
	/**	The round's dealer */
	private dealerIndex: number;
	/**	The players in this round. Null means the player left the round */
	private players: Player[];
	/**	Value of chips in the pot */
	private potManager: PotManager;
	/**	The current stage of the round */
	private stage: Stage = "pre-flop";
	constructor(roundInput: RoundInput) {
		this.blind = roundInput.blind;
		this.currentBet = roundInput.blind;
		this.dealerIndex = roundInput.dealerIndex;
		this.players = roundInput.players;
		this.potManager = new PotManager(roundInput.players);
	}

	/**
	 * Collects the initial blinds from each player
	 */
	collectBlinds() {
		const bigBlindIndex = (this.dealerIndex + 1) % this.players.length;
		const smallBlindIndex = (this.dealerIndex + 2) % this.players.length;
		const bigBlind = this.players[bigBlindIndex];
		const smallBlind = this.players[smallBlindIndex];
		if (bigBlind && smallBlind) {
			const bigBlindAmount = bigBlind.deductChips(this.blind);
			const smallBlindAmount = smallBlind.deductChips(Math.ceil(this.blind / 2));
			this.potManager.addContribution(bigBlind, bigBlindAmount);
			this.potManager.addContribution(smallBlind, smallBlindAmount);
		}
	}

	getRemainingPlayers() {
		return this.players.filter((player) => !player.isFolded());
	}

	async startBettingCycle(): Promise<void> {
		let allMatched = false;
		while (!allMatched) {
			allMatched = true;
			for (const player of this.players) {
				if (!player || player.isAllIn() || player.isFolded()) continue;

				const betAmount = await player.placeBet(this.currentBet);
				if (betAmount === -1) continue;
				if (betAmount > this.currentBet) {
					this.currentBet = betAmount;
					allMatched = false;
				}

				this.potManager.addContribution(player, betAmount);
			}
		}
	}

	determineAndPayWinners(river: Card[]) {
		const remainingPlayers = this.getRemainingPlayers();
		if (remainingPlayers.length === 1) {
			// 1 player, they win!!
			this.potManager.distributeWinnings(remainingPlayers);
		} else {
			// calculate the winner
			const sortedCommunityCards = river.toSorted((a, b) => a.getValue() - b.getValue());
			const winners = HandEvaluator.determineWinners(remainingPlayers, sortedCommunityCards);
			this.potManager.distributeWinnings(winners);
		}
	}
}

interface RoundInput {
	blind: number;
	dealerIndex: number;
	players: Player[];
}