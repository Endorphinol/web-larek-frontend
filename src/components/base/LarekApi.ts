import { IOrder, IProductItem } from './../../types/index';
import { Api, ApiListResponse } from './Api';

export interface ILarekAPI {
    getItems: () => Promise<IProductItem[]>;
    getItem: (id: string) => Promise<IProductItem>;
    orderItems: (order: IOrder) => Promise<IOrderResult>;
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

    getItems(): Promise<IProductItem[]> {
        return this.get('/lot').then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderItems(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}