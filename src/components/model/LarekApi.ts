import {
	ILarekAPI,
	IOrder,
	IOrderResult,
	IProductItem,
} from '../../types/index';
import { Api, ApiListResponse } from '../base/api';

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
	async getItems(): Promise<IProductItem[]> {
		try {
			const response = await this.get('/product');
			const data = response as ApiListResponse<IProductItem>;
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		} catch (error) {
			throw new Error('Ошибка получения данных');
		}
	}

	/**
	 * Отправляет заказ на сервер.
	 * @returns Возвращает промис с результатом отправки заказа.
	 */
	// Отправить заказ.
	async orderItems(order: IOrder): Promise<IOrderResult> {
		try {
			return (await this.post('/order', order)) as IOrderResult;
		} catch (error) {
			throw new Error('Ошибка отправки данных');
		}
	}
}
