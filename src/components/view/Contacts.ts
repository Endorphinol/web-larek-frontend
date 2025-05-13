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
			this._validateForm();
			this.events.emit('contacts.email:change', {
				field: 'email',
				value: this._emailInput.value,
			});
		});

		this._phoneInput.addEventListener('input', () => {
			this._validateForm();
			this.events.emit('contacts.phone:change', {
				field: 'phone',
				value: this._phoneInput.value,
			});
		});

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this._validateForm()) {
				this.events.emit('contacts:submit', {
					email: this._emailInput.value,
					phone: this._phoneInput.value,
				});
			}
		});
		// Изначальная валидация.
		this._validateForm();
	}
	// Валидация формы общая.
	private _validateForm(): boolean {
		const isEmailValid = this._validateEmail(this._emailInput.value);
		const isPhoneValid = this._validatePhone(this._phoneInput.value);

		this.setDisabled(this._submitButton, !(isEmailValid && isPhoneValid));
		return isEmailValid && isPhoneValid;
	}
	// Проверка валидности электронной почты.
	private _validateEmail(email: string): boolean {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	// Проверка валидности телефонного номера.
	private _validatePhone(phone: string): boolean {
		return phone.replace(/\D/g, '').length >= 11;
	}

	// Блокировка / разблокировка кнопка отправки.
	set valid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}
	
	// Установка текста ошибки.
	set errors(value: string) {
		this.setText(this._errors, value);
	}
}
