export interface Pricemultifull {
    RAW:     { [key: string]: Raw };
    DISPLAY: { [key: string]: Display };
}

export interface Display {
    [key: string]: { [key: string]: string };
}

export interface Raw {
    [key: string]: RawData;
}

export interface RawData {
    TYPE:                    string;
    MARKET:                  string;
    FROMSYMBOL:              string;
    TOSYMBOL:                string;
    FLAGS:                   string;
    PRICE:                   number;
    LASTUPDATE:              number;
    LASTVOLUME:              number;
    LASTVOLUMETO:            number;
    LASTTRADEID:             string;
    VOLUMEDAY:               number;
    VOLUMEDAYTO:             number;
    VOLUME24HOUR:            number;
    VOLUME24HOURTO:          number;
    OPENDAY:                 number;
    HIGHDAY:                 number;
    LOWDAY:                  number;
    OPEN24HOUR:              number;
    HIGH24HOUR:              number;
    LOW24HOUR:               number;
    LASTMARKET:              string;
    VOLUMEHOUR:              number;
    VOLUMEHOURTO:            number;
    OPENHOUR:                number;
    HIGHHOUR:                number;
    LOWHOUR:                 number;
    TOPTIERVOLUME24HOUR:     number;
    TOPTIERVOLUME24HOURTO:   number;
    CHANGE24HOUR:            number;
    CHANGEPCT24HOUR:         number;
    CHANGEDAY:               number;
    CHANGEPCTDAY:            number;
    CHANGEHOUR:              number;
    CHANGEPCTHOUR:           number;
    SUPPLY:                  number;
    MKTCAP:                  number;
    TOTALVOLUME24H:          number;
    TOTALVOLUME24HTO:        number;
    TOTALTOPTIERVOLUME24H:   number;
    TOTALTOPTIERVOLUME24HTO: number;
    IMAGEURL:                string;
}
