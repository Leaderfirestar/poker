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
		// this.rotateDealer();
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

	private rotateDealer() {
		this.dealerIndex = this.dealerIndex > this.seats.length - 1 ? 0 : this.dealerIndex + 1;
	}

	startRound() {
		// this.round = new Round(this);
		// this.dealCards();
	}
}

interface TableInput {
	players: Player[];
	settings: GameSettings;
}