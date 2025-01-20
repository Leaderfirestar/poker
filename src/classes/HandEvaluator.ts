import { Card } from "./Card";
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

		} else if (this.isFullHouse(sortedCards)) {

		} else if (this.isNOfAKind(sortedCards, 3)) {

		} else if (this.isTwoPair(sortedCards)) {

		} else if (this.isNOfAKind(sortedCards, 2)) {

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

	private static isRoyalFlush(cards: Card[]): boolean { }
	private static isStraightFlush(cards: Card[]): boolean { }
	private static isNOfAKind(cards: Card[], n: number): boolean {
		const counts = cards.reduce((prev, current) => {
			const value = current.getValue();
			prev[value] = (prev[value] || 0) + 1;
			return prev;
		}, {} as Record<number, number>);
		return Object.values(counts).includes(n);
	}
	private static isFullHouse(cards: Card[]): boolean { }
	private static isFlush(cards: Card[]): boolean { }
	private static isStraight(cards: Card[]): boolean { }
	private static isTwoPair(cards: Card[]): boolean { }

	static determineWinners(players: Player[], communityCards: Card[]): Player[] {
		// Map players to their evaluated hands
		const playerScores = players.map(player => ({
			player,
			score: this.evaluateHand(player.getHand(), communityCards),
		}));

		// Find the highest score
		const highestScore = Math.max(...playerScores.map(ps => ps.score.rank));

		// Filter players with the highest scorezzz
		return playerScores
			.filter(ps => ps.score.rank === highestScore)
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