type Suit = "Heart" | "Diamond" | "Club" | "Spade";
type CardValue = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export class Card {
	/**	The Card's suit */
	suit: Suit;
	/**	The Card's value */
	value: CardValue;
	constructor() {
		this.suit = "Club";
		this.value = "2";
	}
}