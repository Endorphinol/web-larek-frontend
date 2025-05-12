import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";


// Реализиация интерфейса.
interface ISuccess {
    _total: number;
}
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
        this._title = ensureElement<HTMLElement>('.film__title', this.container),
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container),
        this._description = ensureElement<HTMLElement>('.film__description', this.container);
        
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}