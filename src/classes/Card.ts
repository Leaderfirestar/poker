type Suit = "Heart" | "Diamond" | "Club" | "Spade";
type CardValue = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export class Card {
	/**	Whether or not the card is flipped (for the river) */
	private flipped: boolean = false;
	/**	The Card's suit */
	private suit: Suit;
	/**	The Card's value */
	private value: CardValue;
	constructor(input: CardInput) {
		this.suit = input.suit;
		this.value = input.value;
	}

	flip() {
		this.flipped = true;
	}

	isFlipped() {
		return this.flipped;
	}
}

interface CardInput {
	suit: Suit;
	value: CardValue;
}

export const suits: Suit[] = ["Club", "Diamond", "Heart", "Spade"];
export const cardValues: CardValue[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];