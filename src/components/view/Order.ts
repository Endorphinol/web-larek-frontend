import { IEvents } from './../base/events';
import { Form } from "./Form";

// Интерфейс формы.
export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export class Order extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    // Установка номера телефона.
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    // Установка E-mail.
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    // Получение данных формы.
    get data(): IOrderForm {
        return {
    email: (this.container.elements.namedItem('email') as HTMLInputElement).value,
    phone: (this.container.elements.namedItem('phone') as HTMLInputElement).value,
    payment: '',
    address: (this.container.elements.namedItem('address') as HTMLInputElement).value,
};
    }
    // Очистка формы.
    clear() {
        this.email = '';
        this.phone = '';
        this.errors = '';
    }
}