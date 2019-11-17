export class User {
    id: string;
    name: string;
    balances: {
        [userId: string]: number
    }
}