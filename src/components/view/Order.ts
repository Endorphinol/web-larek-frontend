import { IOrderForm } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";


export class Order extends Component<IOrderForm> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected _selectedPayment: string | null = null;
  
    constructor(container: HTMLFormElement, protected events: EventEmitter) {
      super(container);
  
      // Инициализация элементов
      this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons button'));
      this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
      this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
      this._errors = ensureElement<HTMLElement>('.form__errors', container);
  
      // Обработчики для кнопок оплаты
      this._paymentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault(); // Добавьте это, чтобы форма не отправлялась
          this._selectedPayment = button.value;
          this._updatePaymentUI();
          this._validateForm();
          this.events.emit('order.payment:change', {
            field: 'payment',
            value: this._selectedPayment
          });
        });
      });
  
      // Обработчик для поля адреса
      this._addressInput.addEventListener('input', () => {
        this._validateForm();
        this.events.emit('order.address:change', {
          field: 'address',
          value: this._addressInput.value
        });
      });
  
      // Изначальная валидация
      this._validateForm();
    }
  
    private _updatePaymentUI() {
      this._paymentButtons.forEach(button => {
        if (button.value === this._selectedPayment) {
          button.classList.add('button_alt-active');
        } else {
          button.classList.remove('button_alt-active');
        }
      });
    }
  
    private _validateForm() {
      const isAddressValid = this._addressInput.value.trim().length > 0;
      const isPaymentSelected = this._selectedPayment !== null;
      this.setDisabled(this._submitButton, !(isAddressValid && isPaymentSelected));
    }
  
    // Остальные методы остаются без изменений
    set valid(value: boolean) {
      this.setDisabled(this._submitButton, !value);
    }
  
    set errors(value: string) {
      this.setText(this._errors, value);
    }
  }