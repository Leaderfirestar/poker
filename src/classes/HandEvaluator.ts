import { Card, cardDetails } from "./Card";
import { Player } from "./Player";

export class HandEvaluator {
	static evaluateHand(playerCards: Card[], communityCards: Card[]) {
		// Combine player's hole cards with community cards
		const sortedCards = this.sortCards([...playerCards, ...communityCards]);
		const handValue = this.getHandValue(sortedCards);
	}

	private static sortCards(cards: Card[]) {
		const sortedCards = cards.toSorted((a, b) => a.getValue() - b.getValue());
		if (this.isNOfAKind(sortedCards, 4)) {
			// 4 of a kind
		} else if (this.isFullHouse(sortedCards)) {
			// Full house
		} else if (this.isNOfAKind(sortedCards, 3)) {
			// Three of a kind
		} else if (this.isTwoPair(sortedCards)) {
			// Two pair
		} else if (this.isNOfAKind(sortedCards, 2)) {
			// Pair
		}
		return sortedCards;
	}

	private static getHandValue(cards: Card[]) {
		if (this.isRoyalFlush(cards)) return 9;
		if (this.isStraightFlush(cards)) return 8;
		if (this.isNOfAKind(cards, 4)) return 7;
		if (this.isFullHouse(cards)) return 6;
		if (this.isFlush(cards)) return 5;
		if (this.isStraight(cards)) return 4;
		if (this.isNOfAKind(cards, 3)) return 3;
		if (this.isTwoPair(cards)) return 2;
		if (this.isNOfAKind(cards, 2)) return 1;
		return 0;
	}

	/**
	 * Given cards, checks for a royal flush (10-Ace of the same suit)
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to check for a royal flush
	 * @returns Whether or not there is a royal flush present
	 */
	private static isRoyalFlush(cards: Card[]): boolean {
		return this.isStraightFlush(cards) && cards.some(card => card.getValue() === 14);
	}

	/**
	 * Given cards, checks for the presence of a straight flush (5 consecutive cards of the same suit)
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to check for a straight flush
	 * @returns Whether or not a straight flush is present
	 */
	private static isStraightFlush(cards: Card[]): boolean {
		return this.isStraight(cards) && this.isFlush(cards);
	}

	/**
	 * Given cards, checks for the presence of n of a kind
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to check
	 * @param n The number of a kind we're checking for
	 * @returns Whether or not there is n of a kind
	 */
	private static isNOfAKind(cards: Card[], n: number): boolean {
		const counts = cards.reduce((prev, current) => {
			const value = current.getValue();
			prev[value] = (prev[value] || 0) + 1;
			return prev;
		}, {} as Record<number, number>);
		return Object.values(counts).includes(n);
	}

	/**
	 * Given cards, checks for the presence of a full house
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to check for a full house
	 * @returns Whether or not a full house is present
	 */
	private static isFullHouse(cards: Card[]): boolean {
		const counts = cards.reduce((prev, current) => {
			const value = current.getValue();
			prev[value] = (prev[value] || 0) + 1;
			return prev;
		}, {} as Record<number, number>);
		const values = Object.values(counts);
		const hasThree = values.includes(3);
		const hasTwo = values.includes(2);
		return hasThree && hasTwo;
	}

	/**
	 * Given cards, checks to see if there's a flush (5 of the same suit)
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to check for a flush
	 * @returns Whether or not it's a flush
	 */
	private static isFlush(cards: Card[]): boolean {
		const suitCounts = cards.reduce((prev, card) => {
			const suit = card.getSuit();
			prev[suit] = (prev[suit] || 0) + 1;
			return prev;
		}, {} as Record<string, number>);
		return Object.values(suitCounts).some(count => count >= 5);
	}

	/**
	 * Given cards, checks to see if there is a straight
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to check for a straight
	 * @returns Whether or not a straight is present
	 */
	private static isStraight(cards: Card[]): boolean {
		const uniqueValues = [...new Set(cards.map(card => card.getValue()))];

		// Handle normal straight
		for (let i = 0; i <= uniqueValues.length - 5; i++) {
			const slice = uniqueValues.slice(i, i + 5);
			const isSequence = slice.every((val, idx, arr) => idx === 0 || val === arr[idx - 1] + 1);
			if (isSequence) return true;
		}

		// Handle low-Ace straight
		const lowAceStraight = ['A', '2', '3', '4', '5'].map(t => cardDetails.find(cd => cd.text === t)!.value);
		const containsLowAceStraight = lowAceStraight.every(val => uniqueValues.includes(val));

		return containsLowAceStraight;
	}

	/**
	 * Given cards, checks to see if there are two pairs
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to check for two pairs
	 * @returns Whether or not there are two pairs
	 */
	private static isTwoPair(cards: Card[]): boolean {
		const counts = cards.reduce((prev, current) => {
			const value = current.getValue();
			prev[value] = (prev[value] || 0) + 1;
			return prev;
		}, {} as Record<number, number>);
		const pairs = Object.values(counts).filter(count => count === 2);
		return pairs.length >= 2;
	}

	static determineWinners(players: Player[], communityCards: Card[]): Player[] {
		// Map players to their evaluated hands
		const playerScores = players.map(player => ({
			player,
			score: this.evaluateHand(player.getHand(), communityCards),
		}));

		// Find the highest score
		const highestScore = Math.max(...playerScores.map(ps => ps.score.rank));

		// Filter players with the highest scores
		return playerScores.filter(ps => ps.score.rank === highestScore).map(ps => ps.player);
	}
}

// Heavy inspiration from https://stackoverflow.com/a/42396124/18673230
// Hand Types
// 9 - Royal flush
// 8 - Straight flush (special case of royal flush, really)
// 7 - Four of a kind
// 6 - Full house
// 5 - Flush
// 4 - Straight
// 3 - Three of a kind
// 2 - Two pair
// 1 - Pair
// 0 - High card