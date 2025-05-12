import { IOrder, IOrderResult, IProductItem } from '../../types/index';
import { Api, ApiListResponse } from '../base/api';

// Реалзиация интерфейса.
export interface ILarekAPI {
	getItems: () => Promise<IProductItem[]>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}

// Cоздание класса.
export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	/**
	 * Возвращает массив товаров с сервера.
	 * @returns Промис с массивом товаров.
	 */
	// Получить массив объектов с сервера.
	getItems(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
				price: item.price,
			}))
		);
	}
	/**
	 * Отправляет заказ на сервер.
	 * @returns Возвращает промис с результатом отправки заказа.
	 */
	// Отправить заказ.
	orderItems(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
