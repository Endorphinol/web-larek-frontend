import { Component } from "../base/Component";
import { ensureAllElements } from "../../utils/utils";

// Реализиация именованного типа.
export type TabState = {
    selected: string
};

// Реализиация именованного типа.
export type TabActions = {
    onClick: (tab: string) => void
};

// Инициализация класса.
export class Tabs extends Component<TabState> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLElement, actions?: TabActions) {
        super(container);

        this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                actions?.onClick?.(button.name);
            });
        })
    }

    set selected(name: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, 'tabs__item_active', button.name === name);
            this.setDisabled(button, button.name === name)
        });
    }
}