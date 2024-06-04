export interface Card {
    title: string;
    description?: string;
    balanceAmount: number;
    goalAmount: number;
    type: 'Goal' | 'Category';
    colour: 'Yellow' | 'Blue' | 'Green' | 'Red';
}