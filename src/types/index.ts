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

export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: string[];
    total: number;
}

export interface IBasketItem {
    index: any;
    title: string;
    price: number;
}

export interface IBasketItemActions {
    onClick: (event: MouseEvent) => void;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface INotFoundGet {
	error: string;
}

export interface ISuccess {
	id: string;
	total: number;
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

