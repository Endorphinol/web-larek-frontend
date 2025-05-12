export interface IProductList {
	items: IProductItem[];
}

export interface IProductItem {
	index?: number;
	id?: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
// Основной интерфейс заказа.
export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

// Интерфейс для формы заказа (первый шаг).
export interface IOrderForm {
	payment: string;
	address: string;
}

// Интерфейс для формы контактов (второй шаг).
export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IBasketItem {
	index: number;
	title: string;
	price: number;
}

export interface IBasketItemActions {
	onClick: (event: MouseEvent) => void;
}

export interface IPage {
	_counter: number;
	_catalog: HTMLElement[];
	_locked: boolean;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface INotFoundGet {
	error: string;
}

export interface ISuccess {
	id: string;
	total: number;
	description: string;
}

export interface INotFoundPost {
	error: string;
}

export interface IWrongTotal {
	error: string;
}

export interface INoAddress {
	error: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderForm {
	address: string;
	payment: string;
	email: string;
	phone: string;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}
