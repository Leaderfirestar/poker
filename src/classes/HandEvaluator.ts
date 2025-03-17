import { Card, cardDetails } from "./Card";

interface Evaluation {
	rank: number;
	cards: Card[];
}

export class HandEvaluator {
	static evaluateHand(playerCards: Card[], communityCards: Card[]): Evaluation {
		// Combine player's hole cards with community cards
		const sortedCards = this.sortCards([...playerCards, ...communityCards]);
		const handValue = this.getHandValue(sortedCards);
		return {
			rank: handValue,
			cards: sortedCards.slice(0, 5),
		};
	}

	private static sortCards(cards: Card[]) {
		const sortedCards = cards.toSorted((a, b) => a.getValue() - b.getValue());
		if (this.isNOfAKind(sortedCards, 4)) {
			// 4 of a kind
			const ordered = this.orderFourOfAKind(sortedCards);
			if (ordered) return ordered;
		} else if (this.isFullHouse(sortedCards)) {
			// Full house
			const ordered = this.orderFullHouse(sortedCards);
			if (ordered) return ordered;
		} else if (this.isNOfAKind(sortedCards, 3)) {
			// Three of a kind
			const ordered = this.orderThreeOfAKind(sortedCards);
			if (ordered) return ordered;
		} else if (this.isTwoPair(sortedCards)) {
			// Two pair
			const ordered = this.orderTwoPair(sortedCards);
			if (ordered) return ordered;
		} else if (this.isNOfAKind(sortedCards, 2)) {
			// Pair
			const ordered = this.orderPair(sortedCards);
			if (ordered) return ordered;
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

	/**
	 * Given cards, creates a new array ordered with the 4 of a kind at the front, followed by the highest kicker
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to order
	 * @returns A new array ordered with the 4 of a kind at the front
	 */
	private static orderFourOfAKind(cards: Card[]): Card[] | null {
		const groups = this.groupByValue(cards);
		for (const [value, group] of [...groups.entries()].sort((a, b) => b[0] - a[0])) {
			if (group.length === 4) {
				const kickers = cards.filter(c => c.getValue() !== value).sort((a, b) => b.getValue() - a.getValue());
				return [...group, kickers[0]]; // 4 of a kind + highest kicker
			}
		}
		return null;
	}

	/**
	 * Given cards, creates a new array ordered with the full house at the front
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to order
	 * @returns A new array ordered with the full house at the front (3 of a kind + the pair)
	 */
	private static orderFullHouse(cards: Card[]): Card[] | null {
		const groups = this.groupByValue(cards);
		const trips = [...groups.entries()].filter(([_, g]) => g.length >= 3).sort((a, b) => b[0] - a[0]);
		const pairs = [...groups.entries()].filter(([_, g]) => g.length >= 2).sort((a, b) => b[0] - a[0]);

		for (const [tripVal, tripCards] of trips) {
			for (const [pairVal, pairCards] of pairs) {
				if (tripVal !== pairVal) {
					return [...tripCards.slice(0, 3), ...pairCards.slice(0, 2)];
				}
			}
		}
		return null;
	}

	/**
	 * Given cards, creates a new array with the 3 of a kind at the front, followed by the 2 highest kickers
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to order
	 * @returns A new array with the 3 of a kind at the front, followed by the 2 highest kickers
	 */
	private static orderThreeOfAKind(cards: Card[]): Card[] | null {
		const groups = this.groupByValue(cards);
		const trips = [...groups.entries()].filter(([_, g]) => g.length >= 3).sort((a, b) => b[0] - a[0]);

		if (trips.length) {
			const trip = trips[0][1].slice(0, 3);
			const kickers = cards.filter(c => c.getValue() !== trips[0][0]).sort((a, b) => b.getValue() - a.getValue()).slice(0, 2);
			// Three of a kind + 2 highest kickers
			return [...trip, ...kickers];
		}
		return null;
	}

	/**
	 * Given cards, creates a new array with the 2 pairs at the front (highest first) followed by the highest kicker
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to order
	 * @returns A new array with the 2 pairs at the front (highest first) followed by the highest kicker
	 */
	private static orderTwoPair(cards: Card[]): Card[] | null {
		const groups = this.groupByValue(cards);
		const pairs = [...groups.entries()].filter(([_, g]) => g.length >= 2).sort((a, b) => b[0] - a[0]);

		if (pairs.length >= 2) {
			const [highPair, lowPair] = [pairs[0][1].slice(0, 2), pairs[1][1].slice(0, 2)];
			const kicker = cards.filter(c => c.getValue() !== pairs[0][0] && c.getValue() !== pairs[1][0])
				.sort((a, b) => b.getValue() - a.getValue())[0];
			return [...highPair, ...lowPair, kicker];
		}
		return null;
	}

	/**
	 * Given cards, creates a new array with the pair at the front, followed by the 3 highest kickers
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want to order
	 * @returns A new array with the pair at the front, followed by the 3 highest kickers
	 */
	private static orderPair(cards: Card[]): Card[] | null {
		const groups = this.groupByValue(cards);
		const pairs = [...groups.entries()].filter(([_, g]) => g.length >= 2).sort((a, b) => b[0] - a[0]);

		if (pairs.length) {
			const pair = pairs[0][1].slice(0, 2);
			const kickers = cards.filter(c => c.getValue() !== pairs[0][0]).sort((a, b) => b.getValue() - a.getValue()).slice(0, 3);
			// Pair + 3 highest kickers
			return [...pair, ...kickers];
		}
		return null;
	}

	/**
	 * Given cards, groups them by value in a map and returns the map
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want groups
	 * @returns A map with the cards grouped by value
	 */
	private static groupByValue(cards: Card[]): Map<number, Card[]> {
		const map = new Map<number, Card[]>();
		for (const card of cards) {
			const value = card.getValue();
			if (!map.has(value)) map.set(value, []);
			map.get(value)!.push(card);
		}
		return map;
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