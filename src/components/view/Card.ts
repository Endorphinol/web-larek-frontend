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
    protected _description?: HTMLElement
    
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._description = container.querySelector(`.${blockName}__description`);

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

    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    render(data: IProductItem & { buttonText?: string }): HTMLElement {
        super.render(data); 
        this.setText(this._title, data.title);
        this.setImage(this._image, data.image, data.title);
        this.category = data.category;
        this.price = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
        
        if (this._description && data.description) {
            this.description = data.description;
        }

        if (this._button && data.buttonText) {
            this.setText(this._button, data.buttonText);
            this._button.disabled = data.price === null;
        }
        
        return this.container;
    }
}