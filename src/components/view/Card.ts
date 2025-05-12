import { Component } from "../base/Component";
import { ICardActions, IProductItem } from "../../types";

// Создание класса элемент карточки.
export class Card extends Component<IProductItem> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement;
    protected inBasket?: boolean;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = container.querySelector(`.${blockName}__title`);
        this._image = container.querySelector(`.${blockName}__image`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    toggleButton(state: boolean) {
        if (this._button) {
            this.setDisabled(this._button, state);
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    // Установка текста на кнопку.
    set buttonText(value: string) {
         this.setText(this._button, value);
     }

     render(data: IProductItem & { buttonText?: string }): HTMLElement {
        super.render(data);
        
        this.setText(this._title, data.title);
        this.setImage(this._image, data.image, data.title);
        this.setText(this._category, data.category);
        
        if (data.price !== null) {
            this.setText(this._price, `${data.price} синапсов`);
        } else {
            this.setText(this._price, 'Бесценно');
        }

        if (this._button && data.buttonText) {
            this.setText(this._button, data.buttonText);
            this.setDisabled(this._button, data.price === null);
        }
        
        return this.container;
    }
}