import { Component } from "../base/Component";
import { ensureElement, formatNumber } from "../../utils/utils";
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
    protected _description?: HTMLElement;
    protected inBasket?: boolean;

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

    private toggleButtonState(inBasket?: boolean) {
        if (this._button && inBasket !== undefined) {
            this._button.textContent = inBasket ? 'Убрать' : 'Купить';
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

    render(data: IProductItem & { buttonText?: string }): HTMLElement {
        super.render(data);
        
        this.setText(this._title, data.title);
        this.setImage(this._image, data.image, data.title);
        this.setText(this._category, data.category);
        if (data.price !== null && data.price !== undefined) {
            this.setText(this._price, `${formatNumber(data.price)} синапсов`);
        } else {
            this.setText(this._price, 'Бесценно');
        }        
        if (this._description) {
            this.setText(this._description, data.description || '');
            this.setVisible(this._description); 
        }

        if (this._button) {
            this.setText(this._button, data.buttonText || '')
        }
        
        return this.container;
    }
}