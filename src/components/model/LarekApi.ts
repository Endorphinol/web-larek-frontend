import { IOrder, IProductItem } from '../../types/index';
import { Api, ApiListResponse } from '../base/api';

export interface ILarekAPI {
    getItems: () => Promise<IProductItem[]>;
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

    getItems(): Promise<IProductItem[]> {
        return this.get('/product')
        .then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
                price: item.price || 0,
            }))
        );
    }

    orderItems(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order)
        .then((data: IOrderResult) => data);
    }
}