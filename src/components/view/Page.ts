import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from './../base/events';

// Реализиация интерфейса.
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
// Инициализация класса.
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLButtonElement;


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
    // Cчетчик товаров.
    set counter(value: number) {
        if (typeof value !== 'number') return;
        this.setText(this._counter, String(value));
    }
     // Отображение католога товаров.
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
        this.events.emit('catalog:updated');
    }
     // Блокировка прокрутки страницы.
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}