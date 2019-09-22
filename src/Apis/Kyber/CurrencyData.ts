export interface CurrencyData {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    id: string;
    reserves_src: string[];
    reserves_dest: string[];
}

export interface CurrencyResponse {
    data: CurrencyData[];
    error: boolean;
}