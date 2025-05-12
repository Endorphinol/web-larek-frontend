import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class BasketItem extends Component<BasketItem> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);
        this._title = ensureElement<HTMLElement>('.basket__item-title', container);
        this._price = ensureElement<HTMLElement>('.basket__item-price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        this.setText(this._price, `${value} синапсов`);
    }
}