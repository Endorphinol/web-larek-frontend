import { IEvents } from './../base/events';
import { IProductItem } from '../../types';

export class Model {
	protected items: IProductItem[] = [];
	constructor(protected events: IEvents) {}
/**
 * Получение массива товаров со слоя данных.
 * @returns Возвращает массив товаров.
 */
	getItems(): IProductItem[] {
		return this.items;
	}
/**
 * Сохранение массива товаров в слой данных.
 * @param items Массив товаров
 * 
 */
	setItems(items: IProductItem[]) {
		this.items = items;
		this.events.emit('items:changed', this.items);
	}
/**
 * Получение одного товара по ID из слоя данных.
 * @param id Идентификатор товара.
 * @returns Получение одного товара по ID.
 */
	getItem(id: string): IProductItem {
		return this.items.find((item) => item.id === id);
	}
}