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
        this.basket = this.basket.filter(item => item !== id);
        this.updateBasket();
    }
    // Очистить корзину.
    clearBasket() {
        this.basket = [];
        this.updateBasket();
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

    // Валидация заказа.
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