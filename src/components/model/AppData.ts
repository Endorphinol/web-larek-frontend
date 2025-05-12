import { FormErrors, IOrder, IProductItem } from './../../types/index';;
import { Model } from "./Model";
import { Card } from '../view/Card';
import { IOrderForm } from '../view/Order';

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class AppState extends Model {
    basket: string[];
    catalog: IProductItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        items: [],
        payment: '',
        address: '',
        total: 0
    };
    preview: string | null;
    formErrors: FormErrors = {};


    clearBasket() {
        this.basket = [];
        this.order.items = [];
        this.order.total = 0;
        this.events.emit('basket:cleared');
    }

    getTotal() {
        return this.basket.reduce((total, id) => {
            const item = this.catalog.find(it => it.id === id);
            return total + (item?.price || 0);
        }, 0);
    }

    setCatalog(items: IProductItem[]) {
        this.catalog = items; 
        this.events.emit('items:changed', { catalog: this.catalog });
    }


    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.events.emit('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}