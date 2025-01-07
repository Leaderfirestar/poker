import { Card, cardValues, suits } from "./Card";

export class Deck {
	/**	The cards in the deck */
	private cards: Card[];
	constructor() {
		const initialCards: Card[] = [];
		for (const suit of suits) {
			for (const value of cardValues) {
				const card = new Card({ suit, value });
				initialCards.push(card);
			}
		}
		this.cards = initialCards;
		this.shuffle();
	}

	/**
	 * Gives a card from the top of the deck
	 * @returns First card off the top
	 */
	dealCard() {
		const card = this.cards.shift();
		return card;
	}

	/**
	 * Shuffles the deck of cards using the Durstenfeld variation of the Fisher-Yates shuffle algorithm.
	 * 
	 * This algorithm ensures an unbiased random shuffle by iterating through the array
	 * from the end to the beginning and swapping each element with a randomly chosen
	 * element that comes before it (including itself).
	 * 
	 * @returns The shuffled array of cards.
	 * @see {@link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm Fisher-Yates Shuffle on Wikipedia}
	 */
	private shuffle(): Card[] {
		for (let i = this.cards.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = this.cards[i];
			this.cards[i] = this.cards[j];
			this.cards[j] = temp;
		}
		return this.cards;
	}
}