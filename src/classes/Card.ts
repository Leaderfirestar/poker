type Suit = "Heart" | "Diamond" | "Club" | "Spade";
type CardValue = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export class Card {
	/**	Whether or not the card is flipped (for the river) */
	private flipped: boolean;
	/**	The Card's suit */
	private suit: Suit;
	/**	The Card's value */
	private value: CardValue;
	constructor() {
		this.flipped = false;
		this.suit = "Club";
		this.value = "2";
	}
}