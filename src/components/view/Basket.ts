import { Component } from "../base/Component";
import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { EventEmitter } from "../base/events";


interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    buttonText?: string;
}
export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__total', this.container);
        this._button = ensureElement<HTMLElement>('.basket__action', this.container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, formatNumber(total));
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }
}