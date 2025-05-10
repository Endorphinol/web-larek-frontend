import { IOrder, IProductItem, LotUpdate, IBid } from "../types";
import { Api, ApiListResponse } from "./Api";

export interface ILarekAPI {
    getLotList: () => Promise<IProductItem[]>;
    getItem: (id: string) => Promise<IProductItem>;
    getLotUpdate: (id: string) => Promise<LotUpdate>;
    placeBid(id: string, bid: IBid): Promise<LotUpdate>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export interface IOrderResult {
    id: string;
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItem(id: string): Promise<IProductItem> {
        return this.get(`/product/${id}`).then(
            (item: IProductItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getLotUpdate(id: string): Promise<LotUpdate> {
        return this.get(`/product/${id}/_auction`).then(
            (data: LotUpdate) => data
        );
    }

    getLotList(): Promise<IProductItem[]> {
        return this.get('/lot').then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    placeBid(id: string, bid: IBid): Promise<LotUpdate> {
        return this.post(`/lot/${id}/_bid`, bid).then(
            (data: IProductItem) => data
        );
    }

    orderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}