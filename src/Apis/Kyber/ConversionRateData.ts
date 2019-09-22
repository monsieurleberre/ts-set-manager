export interface ConversionRateData {
    src_id: string;
    dst_id: string;
    src_qty: number[];
    dst_qty: number[];
}

export interface ConversionRateResponse {
    data: ConversionRateData[];
    error: boolean;
}