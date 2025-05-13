export interface IProductList {
	items: IProductItem[];
}

export interface IProductItem {
	id?: string;
	title: string;
	description?: string;
	image: string;
	category: string;
	price: number | null;
	index?: number; 
  }

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

// Основной интерфейс заказа.
export interface IOrder extends IOrderForm, IContactsForm {
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
// Элемент корзины.
export interface IBasketItem {
	index: number;
	title: string;
	price: number;
}

export interface IBasketItemActions {
    onClick: (event: MouseEvent) => void;
}

export type CatalogChangeEvent = {
	catalog: IProductItem[];
};

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
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

export interface ILarekAPI {
	getItems: () => Promise<IProductItem[]>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}

export interface FormErrors {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
  }

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
  }

export interface IModalData {
    content: HTMLElement;
}

export interface IFormState {
    valid: boolean;
    errors: string;
}