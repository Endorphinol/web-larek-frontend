import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasketItem, IBasketItemActions } from '../../types';

export class BasketItem extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IBasketItemActions) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	// Установка элемента в корзину.
	render(item: IBasketItem): HTMLElement {
		this.setText(this._index, item.index ? String(item.index) : '');
		this.setText(this._title, item.title);
		this.setText(this._price, `${item.price} синапсов`);
		return this.container;
	}
}
