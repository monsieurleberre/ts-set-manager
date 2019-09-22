export interface AllCoinlist {
    Response:     string;
    Message:      string;
    Data:         { [key: string]: Datum };
    BaseImageUrl: string;
    BaseLinkUrl:  string;
    RateLimit:    RateLimit;
    HasWarning:   boolean;
    Type:         number;
}

export interface Datum {
    Id:                   string;
    Url:                  string;
    ImageUrl?:            string;
    ContentCreatedOn:     number;
    Name:                 string;
    Symbol:               string;
    CoinName:             string;
    FullName:             string;
    Algorithm:            string;
    ProofType:            string;
    FullyPremined:        string;
    TotalCoinSupply:      string;
    BuiltOn:              string;
    SmartContractAddress: string;
    PreMinedValue:        PreMinedValue;
    TotalCoinsFreeFloat:  PreMinedValue;
    SortOrder:            string;
    Sponsored:            boolean;
    IsTrading:            boolean;
    TotalCoinsMined?:     number;
    BlockNumber?:         number;
    NetHashesPerSecond?:  number;
    BlockReward?:         number;
    BlockTime?:           number;
}

export enum PreMinedValue {
    NA = "N/A",
}

export interface RateLimit {
}
