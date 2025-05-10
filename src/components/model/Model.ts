import { IEvents } from './../base/events';
import { IProductItem } from '../../types';

export class Model {
	items: IProductItem[] = [];

	constructor(protected events: IEvents) {}

	getItems(): IProductItem[] {
		return this.items;
	}

	setItems(items: IProductItem[]) {
		this.items = items;
		this.events.emit('items:changed', this.items);
	}

	getItem(id: string): IProductItem {
		return this.items.find((item) => item.id === id);
	}
}