import { Card, cardDetails } from "./Card";
import { Player } from "./Player";

interface Evaluation {
	rank: number;
	cards: Card[];
}

interface PlayerEvaluation {
	player: Player;
	evaluation: Evaluation;
}

export class HandEvaluator {
	private static HAND_SIZE = 5;
	private static evaluateHand(playerCards: Card[], communityCards: Card[]) {
		// Combine player's hole cards with community cards
		const sortedCards = this.sortCards([...playerCards, ...communityCards]);
		const handValue = this.getHandValue(sortedCards);
		return handValue;
	}

	/**
	 * Given cards, sortes them and groups them by their rank
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param cards The cards we want sorted
	 * @returns The sorted and grouped hand
	 */
	private static sortCards(cards: Card[]) {
		const sortedCards = cards.toSorted((a, b) => a.getValue() - b.getValue());
		if (this.isNOfAKind(sortedCards, 4)) {
			this.sortFourOfAKind(sortedCards);
		} else if (this.isFullHouse(sortedCards)) {
			this.sortFullHouse(sortedCards);
		} else if (this.isNOfAKind(sortedCards, 3)) {
			this.sortThreeOfAKind(sortedCards);
		} else if (this.isTwoPair(sortedCards)) {
			this.sortTwoPair(sortedCards);
		} else if (this.isNOfAKind(sortedCards, 2)) {
			this.sortOnePair(sortedCards);
		}
		return sortedCards;
	}

	private static sortFourOfAKind(sortedCards: Card[]) {
		if (sortedCards[0].getValue() != sortedCards[this.HAND_SIZE - 4].getValue()) {
			// If the four of a kind are the last 4 cards, swap the first card with the last card
			this.swapCardsByIndex(sortedCards, 0, this.HAND_SIZE - 1);
		}
	}

	private static sortFullHouse(sortedCards: Card[]) {
		if (sortedCards[0].getValue() != sortedCards[this.HAND_SIZE - 3].getValue()) {
			// If the three of a kind are the last three cards, swap cards 0 and 3 as well as 1 and 4
			this.swapCardsByIndex(sortedCards, 0, this.HAND_SIZE - 2);
			this.swapCardsByIndex(sortedCards, this.HAND_SIZE - 4, this.HAND_SIZE - 1);
		}
	}

	private static sortThreeOfAKind(sortedCards: Card[]) {
		if (sortedCards[0].getValue() != sortedCards[this.HAND_SIZE - 3].getValue() && sortedCards[this.HAND_SIZE - 1].getValue() != sortedCards[this.HAND_SIZE - 3].getValue()) {
			// If the 3 of a kind cards are the middle cards, swap cards 0 and 3
			this.swapCardsByIndex(sortedCards, 0, this.HAND_SIZE - 2);
		} else if (sortedCards[0].getValue() != sortedCards[this.HAND_SIZE - 3].getValue() && sortedCards[this.HAND_SIZE - 4].getValue() != sortedCards[this.HAND_SIZE - 3].getValue()) {
			// If the 3 of a kind cards are the last 3 cards, reverse the array to put them at the front, then swap the last 2 cards so they are largest to smallest
			sortedCards.reverse();
			this.swapCardsByIndex(sortedCards, this.HAND_SIZE - 1, this.HAND_SIZE - 2);
		}
	}

	private static sortTwoPair(sortedCards: Card[]) {
		if (sortedCards[0].getValue() != sortedCards[this.HAND_SIZE - 4].getValue()) {
			// If the two pairs are the last 4 cards, move the first card to the end of the array while preserving the order
			for (let i = 0; i < this.HAND_SIZE - 1; i++) {
				this.swapCardsByIndex(sortedCards, i, i + 1);
			}
		} else if (sortedCards[0].getValue() == sortedCards[this.HAND_SIZE - 4].getValue() && sortedCards[this.HAND_SIZE - 2].getValue() == sortedCards[this.HAND_SIZE - 1].getValue()) {
			// If the two pairs are the first and last two cards, swap the middle card with the last card
			this.swapCardsByIndex(sortedCards, this.HAND_SIZE - 3, this.HAND_SIZE - 1);
		}
	}

	private static sortOnePair(sortedCards: Card[]) {
		if (sortedCards[this.HAND_SIZE - 4].getValue() == sortedCards[this.HAND_SIZE - 3].getValue()) {
			// If the pair is cards 1 and 2, swap cards 0 and 2
			this.swapCardsByIndex(sortedCards, 0, this.HAND_SIZE - 3);
		} else if (sortedCards[this.HAND_SIZE - 3].getValue() == sortedCards[this.HAND_SIZE - 2].getValue()) {
			// If the pair is cards 2 and 3, swap cards 0 and 2 as well as 1 and 3 to preserve the largest to smallest ordering
			this.swapCardsByIndex(sortedCards, 0, this.HAND_SIZE - 3);
			this.swapCardsByIndex(sortedCards, this.HAND_SIZE - 4, this.HAND_SIZE - 2);
		} else if (sortedCards[this.HAND_SIZE - 2].getValue() == sortedCards[this.HAND_SIZE - 1].getValue()) {
			// If the pair is the last 2 cards, reverse the array and swap cards 2 and 4 to preserve the largest to smallest ordering
			sortedCards.reverse();
			this.swapCardsByIndex(sortedCards, this.HAND_SIZE - 3, this.HAND_SIZE - 1);
		}
	}

	private static swapCardsByIndex(cards: Card[], i: number, j: number) {
		const temp = cards[i];
		cards[i] = cards[j];
		cards[j] = temp;
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

	private static isRoyalFlush(cards: Card[]): boolean {
		const values = new Set<number>();
		const suits = new Set<string>();
		for (const card of cards) {
			values.add(card.getValue());
			suits.add(card.getSuit());
		}
		return values.has(10) && values.has(11) && values.has(12) && values.has(13) && values.has(14) && suits.size === 1;
	}

	private static isStraightFlush(cards: Card[]): boolean {
		const values = [];
		const suits = new Set<string>();
		for (const card of cards) {
			values.push(card.getValue());
			suits.add(card.getSuit());
		}
		if (suits.size !== 1) return false;
		for (let i = values.length - 1; i > 0; i--) {
			if (values[i] - 1 !== values[i - 1]) return false;
		}
		return true;
	}

	private static isNOfAKind(cards: Card[], n: number): boolean {
		const counts = cards.reduce((prev, current) => {
			const value = current.getValue();
			prev[value] = (prev[value] || 0) + 1;
			return prev;
		}, {} as Record<number, number>);
		return Object.values(counts).includes(n);
	}

	private static isFullHouse(cards: Card[]): boolean {
		const counts = cards.reduce((prev, current) => {
			const value = current.getValue();
			prev[value] = (prev[value] || 0) + 1;
			return prev;
		}, {} as Record<number, number>);
		const values = Object.values(counts);
		return values.includes(3) && values.includes(2);
	}

	private static isFlush(cards: Card[]): boolean {
		const suits = new Set<string>();
		for (const card of cards) {
			suits.add(card.getSuit());
		}
		return suits.size === 1;
	}

	private static isStraight(cards: Card[]): boolean {
		for (let i = 0; i < cards.length - 1; i++) {
			if (cards[i].getValue() + 1 !== cards[i + 1].getValue()) return false;
		}
		return true;
	}

	private static isTwoPair(cards: Card[]): boolean {
		const counts = cards.reduce((prev, current) => {
			const value = current.getValue();
			prev[value] = (prev[value] || 0) + 1;
			return prev;
		}, {} as Record<number, number>);
		const pairs = Object.values(counts).filter(count => count === 2);
		return pairs.length === 2;
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

	/**
	 * Given the players and cards on the table, determines the winner(s) of the hand
	 * @author Eric Webb <ewebb@factorearth.com>
	 * @param players The players to evaluate
	 * @param communityCards The cards on the table
	 * @returns The winning player(s)
	 */
	static determineWinners(players: Player[], communityCards: Card[]): Player[] {
		// Map players to their evaluated hands
		const playerEvaluations: PlayerEvaluation[] = players.map(player => ({
			player,
			rank: this.evaluateHand(player.getHand(), communityCards),
		}));

		// Find the highest score
		const highestScore = Math.max(...playerScores.map(ps => ps.rank));

		// Filter players with the highest scores
		return playerScores
			.filter(ps => ps.rank === highestScore)
			.map(ps => ps.player);
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