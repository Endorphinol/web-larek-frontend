import { IPage } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from './../base/events';

// Инициализация класса.
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLButtonElement;

// Инициализация всех элементов в классе.
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLButtonElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }
/**
 * Счетчик товаров в сверху в хэддере.
 * @param value Принимаемое значение число.
 */
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

     // Замена элементов в катологе товаров.
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
        this.events.emit('catalog:updated');
    }

    // 
    get basketButton(): HTMLButtonElement {
        return ensureElement<HTMLButtonElement>('.header__basket');
    }
/**
 * Блокировка прокрутки страницы
 * @param value Принимается булево значение.
 */
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}