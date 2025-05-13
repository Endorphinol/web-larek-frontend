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

			this._validateForm();

		// Слушатель события на форме ввода электронной почты.
		this._emailInput.addEventListener('input', () => {
			this._validateForm();
			this.events.emit('contacts.email:change', {
				field: 'email',
				value: this._emailInput.value,
			});
		});

		// Слушатель события на форме ввода телефона.
		this._phoneInput.addEventListener('input', () => {
			this._validateForm();
			this.events.emit('contacts.phone:change', {
				field: 'phone',
				value: this._phoneInput.value,
			});
		});

		// Прерывание отправки формы стандартым образом и передача данных.
		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			if (this._validateForm()) {
				this.events.emit('contacts:submit', {
					email: this._emailInput.value,
					phone: this._phoneInput.value,
				});
			}
		});
        
	}

	// Валидация формы и возврат булева значения.
	private _validateForm(): boolean {
		const isEmailValid = this._validateEmail(this._emailInput.value);
		const isPhoneValid = this._validatePhone(this._phoneInput.value);
	
		if (!isEmailValid) {
			this.errors = 'Введите корректный email';
			return false;
		}
	
		if (!isPhoneValid) {
			this.errors = 'Введите корректный телефон (минимум 11 цифр)';
			return false;
		}
	
		this.errors = '';
		return true;
	}

	// Валидация электронной почты.
	private _validateEmail(email: string): boolean {
		const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return reg.test(email);
	}

	// Валидация телефона..
	private _validatePhone(phone: string): boolean {
		return phone.replace(/\D/g, '').length >= 11;
	}

	set valid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}
    
	// Очистка всей формы.
	resetForm(): void {
		this._emailInput.value = '';
		this._phoneInput.value = '';
		this.errors = '';
		this._validateForm();
	}
}
