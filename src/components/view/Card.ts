import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IProductItem } from "../../types";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProductItem> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    set price(value: string) {
        this.setText(this._price, value);
    }

    render(data: IProductItem & { buttonText?: string }): HTMLElement {
        this.setText(this._title, data.title);
        this.setImage(this._image, data.image, data.title);
        this.category = data.category;
        this.price = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
        
        if (this._button && data.buttonText) {
            this.setText(this._button, data.buttonText);
        }
        
        return this.container;
    }
}