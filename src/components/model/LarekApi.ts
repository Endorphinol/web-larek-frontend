import { IOrder, IProductItem } from '../../types/index';
import { Api, ApiListResponse } from '../base/api';

// Реалзиация интерфейса.
export interface ILarekAPI {
    getItems: () => Promise<IProductItem[]>;
    orderItems: (order: IOrder) => Promise<IOrderResult>;
}
// Реалзиация интерфейса.
export interface IOrderResult {
    id: string;
}
// Cоздание класса.
export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
// Получить массив объектов с сервера.
    getItems(): Promise<IProductItem[]> {
        return this.get('/product')
        .then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
                price: item.price,
            }))
        );
    }

// Отправить заказ.
    orderItems(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order)
        .then((data: IOrderResult) => data);
    }
}