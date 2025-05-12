import { Component } from "../base/Component";
import { ensureElement, formatNumber } from "../../utils/utils";
import { EventEmitter } from "../base/events";

// Инициализация интерфейса.
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    buttonText?: string;
}
// Создание класса корзины.
export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLTemplateElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }

    // Поместить товар в корзину.
    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
        this._button.disabled = items.length === 0;
    }

    // Подсчитать общую стоимость.
    set total(total: number) {
        this.setText(this._total, `${formatNumber(total)} синапсов`);
    }

    // Установка текста на кнопку.
    set buttonText(value: string) {
        this.setText(this._button, value);
    }
}