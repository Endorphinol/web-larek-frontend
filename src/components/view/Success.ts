import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { ISuccess } from "../../types";


// Реализиация интерфейса.
interface ISuccessActions {
    onClick: () => void;
}
// Инициализация класса.
export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _title: HTMLElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        // Поиск элементов.
        this._title = ensureElement<HTMLElement>('.film__title', this.container),
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container),
        this._description = ensureElement<HTMLElement>('.film__description', this.container);
        // Опциональная цепочка для поиска метода.
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
    // Списаное количество.
    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}