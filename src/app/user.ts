export class User {
    id: string;
    name: string;
    balances: {
        [userId: string]: number
    };
}

export class CompactUser {
    id: string;
    name: string;
}
