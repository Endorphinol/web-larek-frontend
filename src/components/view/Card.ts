import { Component } from '../base/Component';
import { ICardActions, IProductItem } from '../../types';

export class Card extends Component<IProductItem> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _description?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = container.querySelector(`.${blockName}__title`);
		this._image = container.querySelector(`.${blockName}__image`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Управление кнопкой.
	toggleButton(state: boolean): void {
		if (this._button) {
			this.setDisabled(this._button, state);
		}
	}
	// Установливает ID товара.
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Установка текста на кнопку.
	set buttonText(value: string) {
		this.setText(this._button, value);
	}

    private getCategoryClass(category: string): string {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'soft',
            'другое': 'other',
            'дополнительное': 'additional',
            'кнопка': 'button',
            'хард-скил': 'hard'
        };
        return `card__category_${categoryMap[category.toLowerCase()]}`;
    }

	// Отрисовка карточки.
	render(data: IProductItem & { buttonText?: string }): HTMLElement {
		super.render(data);

		this.setText(this._title, data.title);
		this.setImage(this._image, data.image, data.title);
		this.setText(this._category, data.category);

		if (this._description && data.description) {
			this.setText(this._description, data.description);
		}

        if (this._category) {
            this.setText(this._category, data.category);
            this._category.className = `${this.blockName}__category`;
            this._category.classList.add(this.getCategoryClass(data.category));
        }

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
