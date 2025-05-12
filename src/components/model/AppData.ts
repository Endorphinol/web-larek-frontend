import {
	FormErrors,
	IContactsForm,
	IOrder,
	IOrderForm,
	IProductItem,
} from './../../types/index';
import { Model } from './Model';

// Реализация интерфейса.
export type CatalogChangeEvent = {
	catalog: IProductItem[];
};
// Объявление класса.
export class AppState extends Model {
	private _basket: string[] = [];
	private _catalog: IProductItem[];
	private _order: IOrder = {
		email: '',
		phone: '',
		items: [],
		payment: '',
		address: '',
		total: 0,
	};
	private _preview: string | null;
	private _formErrors: FormErrors = {};

	// Получить корзину.
	get basket(): string[] {
		return [...this._basket];
	}
	// Получить католог товаров.
	get catalog(): IProductItem[] {
		return [...this._catalog];
	}
	// Получить заказ.
	get order(): IOrder {
		return { ...this._order };
	}
	// Получить просматриваемый товар.
	get preview(): string | null {
		return this._preview;
	}

	// Получить ошибки формы при валидации.
	get formErrors(): FormErrors {
		return { ...this._formErrors };
	}

	// Общая стоимость корзины.
	getTotal() {
		return this.basket.reduce((total, id) => {
			const item = this.catalog.find((item) => item.id === id);
			return total + (item?.price || 0);
		}, 0);
	}

	setCatalog(items: IProductItem[]) {
		this._catalog = items;
		this.events.emit('items:changed', { catalog: this.catalog });
	}

	// Добавить товар в корзину.
	addToBasket(item: IProductItem) {
		if (!this.basket.includes(item.id)) {
			this.basket.push(item.id);
			this.updateBasket();
		}
	}

	// Обновление корзины.
	private updateBasket() {
		this.events.emit('basket:changed');
		this.events.emit('counter:updated', { basket: this.basket.length });
	}

	// Удалить товар с корзины.
	removeFromBasket(id: string) {
		this._basket = this.basket.filter((item) => item !== id);
		this.updateBasket();
	}

	// Очистить корзину.
	clearBasket() {
		this._basket = [];
		this.updateBasket();
	}
    
	setPreview(item: IProductItem) {
		this._preview = item.id;
		this.events.emit('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm | keyof IContactsForm, value: string) {
		if (field === 'payment' || field === 'address') {
			this.order[field] = value;
		} else if (field === 'email' || field === 'phone') {
			this.order[field] = value;
		}
		this.validateOrder();
	}

	// Валидация заказа.
	validateOrder() {
		const errors: FormErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.order.address || this.order.address.trim().length < 5) {
			errors.address = 'Введите корректный адрес (минимум 5 символов)';
		}

		this._formErrors = errors;
		this.events.emit('formErrors:change', this._formErrors);
		return Object.keys(errors).length === 0;
	}
}
