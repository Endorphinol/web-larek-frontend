import { IEvents } from './../base/events';
import { IProductItem } from '../../types';

export class Model {
	protected items: IProductItem[] = [];
	constructor(protected events: IEvents) {}
	// Получение массива товаров со слоя данных.
	getItems(): IProductItem[] {
		return this.items;
	}

	// Сохранение массива товаров в слой данных.
	setItems(items: IProductItem[]): void {
		this.items = items;
		this.events.emit('items:changed', this.items);
	}
	
	// Получение одного товара по ID из слоя данных.
	getItem(id: string): IProductItem {
		return this.items.find((item) => item.id === id);
	}
}
