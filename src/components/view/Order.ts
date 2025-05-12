import { IOrderForm } from './../../types/index';
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { IOrder } from "../../types";

export class Order extends Component<IOrder> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
    super(container);

    this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons button'));
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this._errors = ensureElement<HTMLElement>('.form__errors', container);

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectPayment(button.value as 'online' | 'offline');
      });
    });

    this._addressInput.addEventListener('input', () => {
      this.events.emit('order.address:change', {
        field: 'address',
        value: this._addressInput.value
      });
    });
  }

  selectPayment(payment: 'online' | 'offline') {
    this._paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.value === payment);
    });
    this.events.emit('order.payment:change', {
      field: 'payment',
      value: payment
    });
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }

  render(data?: Partial<IOrderForm>): HTMLElement {
    if (data.payment) {
      this.selectPayment(data.payment as 'online' | 'offline');
    }
    if (data.address) {
      this._addressInput.value = data.address;
    }
    return this.container;
  }
}