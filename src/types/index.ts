export interface IProductList {
    items: IProductItem[];
}

export interface IProductItem {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number;
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
