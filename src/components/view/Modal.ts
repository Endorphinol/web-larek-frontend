import { IEvents } from './../base/events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IModalData } from '../../types';

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}
	// Обновление содержимого модального окна.
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}
	// Открывает модальное окно.
	open(): void {
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this.handleEscape);
		this.events.emit('modal:open');
	}
	// Закрывает модальное окно.
	close(): void {
		this.container.classList.remove('modal_active');
		document.removeEventListener('keydown', this.handleEscape);
		this.content = null;
		this.events.emit('modal:close');
	}
	// Обработчик закрытия по Escape.
	handleEscape = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.close();
		}
	};
	// Отрисовка модального окна.
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
