type Suit = "Heart" | "Diamond" | "Club" | "Spade";
type CardText = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

interface CardDetail {
	text: CardText;
	value: number;
}

export class Card {
	/**	Whether or not the card is flipped (for the river) */
	private flipped: boolean = false;
	/**	The Card's suit */
	private suit: Suit;
	/**	The Card's text */
	private text: CardText;
	/**	The Card's value */
	private value: number;
	constructor(input: CardInput) {
		this.suit = input.suit;
		this.text = input.text;
		this.value = input.value;
	}

	flip() {
		this.flipped = true;
	}

	getSuit() {
		return this.suit;
	}

	getValue() {
		return this.value;
	}

	isFlipped() {
		return this.flipped;
	}
}

interface CardInput {
	suit: Suit;
	text: CardText;
	value: number;
}

export const suits: Suit[] = ["Club", "Diamond", "Heart", "Spade"];
export const cardDetails: CardDetail[] = [
	{
		text: "2",
		value: 2
	},
	{
		text: "3",
		value: 3
	},
	{
		text: "4",
		value: 4
	},
	{
		text: "5",
		value: 5
	},
	{
		text: "6",
		value: 6
	},
	{
		text: "7",
		value: 7
	},
	{
		text: "8",
		value: 8
	},
	{
		text: "9",
		value: 9
	},
	{
		text: "10",
		value: 10
	},
	{
		text: "J",
		value: 11
	},
	{
		text: "Q",
		value: 12
	},
	{
		text: "K",
		value: 13
	},
	{
		text: "A",
		value: 14
	}
];