export interface ExchangeMappingResponse {
    Response:   string;
    Message:    string;
    HasWarning: boolean;
    Type:       number;
    RateLimit:  RateLimit;
    Data:       ExchangeMapping[];
}

export interface ExchangeMapping {
    exchange:      string;
    exchange_fsym: string;
    exchange_tsym: string;
    fsym:          string;
    tsym:          string;
    last_update:   number;
}

export interface RateLimit {
}
