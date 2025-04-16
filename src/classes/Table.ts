import { Card } from "./Card";
import { Deck } from "./Deck";
import { GameSettings } from "./GameSettings";
import { Player } from "./Player";
import { Round } from "./Round";

export class Table {
	private blind: number;
	/**	Index for the players array to designate a dealer */
	private dealerIndex: number;
	/**	The deck we'll be using for the game */
	private deck: Deck;
	/**	The cards in the river */
	private river: Card[];
	/**	The current round at the table */
	private round: Round;
	/**	Players currently at the table */
	private seats: Player[];
	constructor(input: TableInput) {
		this.blind = input.settings.getStartingBlind();
		this.dealerIndex = 0;
		this.deck = new Deck();
		this.round = new Round({ blind: input.settings.getStartingBlind(), dealerIndex: 0, players: [] });
		this.river = [];
		this.seats = [];
	}

	private dealCards() {
		for (let i = 0; i < 2; i++) {
			for (const player of this.seats) {
				const card = this.deck.dealCard();
				if (card) player.dealCard(card);
			}
		}
		for (let i = 0; i < 5; i++) {
			const card = this.deck.dealCard();
			if (card) this.river.push(card);
		}
	}

	endRound() {
		this.round.determineWinner(this.river);
		this.rotateDealer();
	}

	/**
	 * Returns the current blind
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @returns The current blind
	 */
	getBlind() {
		return this.blind;
	}

	getDealerindex() {
		return this.dealerIndex;
	}

	getPlayers() {
		return this.seats;
	}

	/**
	 * Takes the current blind, cuts it in half, and raises it to the nearest whole number
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @returns The small blind value
	 */
	getSmallBlind() {
		return Math.ceil(this.blind / 2);
	}

	private prepareRiver() {
		for (let i = 0; i < 5; i++) {
			const dealtCard = this.deck.dealCard();
			if (dealtCard) this.river.push(dealtCard);
		}
	}

	private flipRiver(number: number) {
		if (number > 0 && number <= this.river.length) {
			let count = 0;
			for (let i = 0; i < number; i++) {
				if (!this.river[i].isFlipped()) {
					this.river[i].flip();
					count++;
					if (count === number) return;
				}
			}
		}
	}

	private rotateDealer() {
		this.dealerIndex = this.dealerIndex > this.seats.length - 1 ? 0 : this.dealerIndex + 1;
	}

	async playRound() {
		this.dealCards();
		this.prepareRiver();
		this.round.collectBlinds();
		const cardsToFlipPerStage = [
			0, // Pre-flop
			3, // flop
			1, // turn
			1, // river
			0 // showdown
		];
		// Pre-flop
		for (const cardCount of cardsToFlipPerStage) {
			const continuePlay = await this.processPhase(cardCount);
			if (!continuePlay) break;
		}

		this.round.determineAndPayWinners(this.river);
	}

	private async processPhase(cardsToFlip: number) {
		if (cardsToFlip > 0) {
			this.flipRiver(cardsToFlip);
		}
		await this.round.startBettingCycle();
		return this.round.getRemainingPlayers().length > 1;
	}
}

interface TableInput {
	players: Player[];
	settings: GameSettings;
}