import { IProductItem } from './../../types/index';
import { EventEmitter } from "../base/Events";
import { IOrderForm } from "../view/Order";


export class AppState {
    catalog: IProductItem[] = [];
    basket: string[] = []; // Храним только ID товаров
    order: IOrderForm = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
    };

    constructor(data: Partial<AppState>, protected events: EventEmitter) {
        Object.assign(this, data);
    }

    setCatalog(items: IProductItem[]) {
        this.catalog = items;
        this.events.emit('items:changed');
    }

    addToBasket(id: string) {
        this.basket.push(id);
        this.updateOrder();
    }

    removeFromBasket(id: string) {
        this.basket = this.basket.filter(item => item !== id);
        this.updateOrder();
    }

    getBasketItems(): IProductItem[] {
        return this.catalog.filter(item => this.basket.includes(item.id));
    }

    getTotal(): number {
        return this.getBasketItems().reduce((total, item) => total + (item.price || 0), 0);
    }

    clearBasket() {
        this.basket = [];
        this.updateOrder();
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        
        if (field === 'payment') {
            this.order.payment = value;
        }
        
        this.validateOrder();
    }

    private updateOrder() {
        this.order.items = this.basket;
        this.order.total = this.getTotal();
        this.events.emit('basket:changed');
    }

    private validateOrder() {
        const errors: Partial<IOrderForm> = {};
        
        if (!this.order.email) errors.email = 'Необходимо указать email';
        if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
        if (!this.order.address) errors.address = 'Необходимо указать адрес';
        if (!this.order.payment) errors.payment = 'Необходимо выбрать способ оплаты';
        
        this.events.emit('formErrors:change', errors);
    }
}