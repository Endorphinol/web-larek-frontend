import { FormErrors, IOrder, IProductItem } from './../../types/index';;
import { Model } from "./Model";
import { IOrderForm } from '../view/Order';

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class AppState extends Model {
    basket: string[] = [];
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

    getTotal() {
        return this.basket.reduce((total, id) => {
            const item = this.catalog.find(item => item.id === id);
            return total + (item?.price || 0);
        }, 0);
    }

    setCatalog(items: IProductItem[]) {
        this.catalog = items; 
        this.events.emit('items:changed', { catalog: this.catalog });
    }

    addToBasket(item: IProductItem) {
        if (!this.basket.includes(item.id)) {
            this.basket.push(item.id);
            this.events.emit('basket:changed');
            this.emitBasketUpdate();
        }
    };

    removeFromBasket(id: string) {
        this.basket = this.basket.filter(item => item !== id);
        this.events.emit('basket:changed');
        this.emitBasketUpdate();
    }

    private emitBasketUpdate() {
        this.events.emit('basket:changed');
        this.events.emit('counter:updated', this.basket.length);
    }
    
    clearBasket() {
        this.basket = [];
        this.events.emit('basket:changed');
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
        const errors: FormErrors = {};
        
        if (!this.order.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        
        if (!this.order.address) {
            errors.address = 'Введите адрес доставки';
        }
        
        if (!this.order.email) {
            errors.email = 'Введите email';
        } else if (!this.order.email.includes('@')) {
            errors.email = 'Некорректный email';
        }
        
        if (!this.order.phone) {
            errors.phone = 'Введите телефон';
        }
    
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}