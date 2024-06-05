export interface Card {
    title: string;
    balanceAmount: number;
    goalAmount: number;
    type: 'Goal' | 'Category';
    colour: 'Yellow' | 'Blue' | 'Green' | 'Red';
}