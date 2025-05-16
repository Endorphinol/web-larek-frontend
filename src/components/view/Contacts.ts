import { IContactsForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class Contacts extends Component<IContactsForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLFormElement, protected events: EventEmitter) {
		super(container);

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);

		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		this._emailInput.addEventListener('input', () => {
			this.events.emit('contacts.email:change', {
				field: 'email',
				value: this._emailInput.value,
			});
		});

		this._phoneInput.addEventListener('input', () => {
			this.events.emit('contacts.phone:change', {
				field: 'phone',
				value: this._phoneInput.value,
			});
		});
		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	// Блокировка / разблокировка кнопка отправки.
	set valid(value: boolean) {
		const emailValid = this._emailInput.value.includes('@');
		const phoneValid = this._phoneInput.value.replace(/\D/g, '').length >= 11;
		this.setDisabled(this._submitButton, !(emailValid && phoneValid));
	}

	// Установка текста ошибки.
	set errors(value: string) {
		this.setText(this._errors, value);
	}
}
