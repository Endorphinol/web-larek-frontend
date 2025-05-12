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

    this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons button'));
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this._errors = ensureElement<HTMLElement>('.form__errors', container);

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this._selectedPayment = button.value;
        this._updatePaymentUI();
        this._validateForm();
        this.events.emit('order.payment:change', {
          field: 'payment',
          value: button.value
        });
      });
    });

    this._addressInput.addEventListener('input', () => {
      this._validateForm();
      this.events.emit('order.address:change', {
        field: 'address',
        value: this._addressInput.value
      });
    });
  }

  private _updatePaymentUI() {
    this._paymentButtons.forEach(button => {
      button.classList.toggle(
        'button_alt-active', 
        button.value === this._selectedPayment
      );
    });
  }

  private _validateForm() {
    const isValid = Boolean(this._selectedPayment) && this._addressInput.value.trim().length > 0;
    this.setDisabled(this._submitButton, !isValid);
  }

  set valid(value: boolean) {
    this.setDisabled(this._submitButton, !value);
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }
}