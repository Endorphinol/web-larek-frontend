import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasketItem, IBasketItemActions } from '../../types';
import { IEvents } from '../base/events';

export class BasketItem extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
    protected id: string;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		actions?: IBasketItemActions
	) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

        if (actions?.onClick) {
            this._button.addEventListener('click', (event: MouseEvent) => {
                actions.onClick(event);
            });
        }
	}

	// Установка элемента в корзину.
	render(item: IBasketItem): HTMLElement {
        this.id = item.id;
		this.setText(this._index, item.index ? String(item.index) : '');
		this.setText(this._title, item.title);
		this.setText(this._price, `${item.price} синапсов`);
		return this.container;
	}
}
