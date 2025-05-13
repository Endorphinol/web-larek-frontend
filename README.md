# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## В процессе выполнения работы планируется использовать архитектуру MVP.

##  Реализация типов данных используемых в приложении:
```
export interface IProductList {
	items: IProductItem[];
}
```
```
export interface IProductItem {
	index?: number;
	id?: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```
```
export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
```
```
// Основной интерфейс заказа.
export interface IOrder extends IOrderForm, IContactsForm {
    items: string[];
    total: number;
}
```
```
// Интерфейс для формы заказа (первый шаг).
export interface IOrderForm {
	payment: string;
	address: string;
}
```
```
// Интерфейс для формы контактов (второй шаг).
export interface IContactsForm {
    email: string;
    phone: string;
}
```
```
export interface IBasketItem {
	index: number;
	title: string;
	price: number;
}
```
```
export interface IBasketItemActions {
    onClick: (event: MouseEvent) => void;
}
```
```
export type CatalogChangeEvent = {
	catalog: IProductItem[];
};
```
```
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```
```
export interface IOrderResult {
    id: string;
    total: number;
}
```
```
export interface ISuccessActions {
    onClick: () => void;
}
```
```
export interface INotFoundGet {
	error: string;
}
```
```
export interface ISuccess {
    description: string;
}
```
```
export interface INotFoundPost {
	error: string;
}
```
```
export interface IWrongTotal {
	error: string;
}
```
```
export interface INoAddress {
	error: string;
}
```
```
export interface ILarekAPI {
	getItems: () => Promise<IProductItem[]>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}
```
```
export interface FormErrors {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}
```
```
export interface IOrderForm {
    payment: string;
    address: string;
}
```
```
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
```
```
export interface IModalData {
    content: HTMLElement;
}
```
```
export interface IFormState {
    valid: boolean;
    errors: string;
}
```


### Архитектура приложения:

#### Код приложения разделен на слои согласно парадигме MVP.
- `Слой представления, отвечает за отображение данных на странице.`
- `Слой данных, отвечает за хранение и изменение данных.`
- `Презентер, отвечает за связь представления и данных.`

#### Описание взаимодействия:
- `Пользователь совершает действие.`
- `View уведомляет Presenter.`
- `Presenter обновляет Model.`
- `Model уведомляет Presenter об изменениях.`
- `Presenter обновляет View.`

## Описание базового кода:
1. Класс `events` позволяет подписываться на события и уведомлять подписчиков о наступлении события. 
Класс имеет следующие методы:
- `on, off, emit` — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно. Дополнительно реализованы методы:
- `onAll и offAll` — для подписки на все события и сброса всех подписчиков.
#### Интересным дополнением является метод:
- `trigger` - генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.
Класс api позволяет осуществлять запрос к серверу и осуществлять отправку, удаление, замену данных. 
---
- `handleResponse` - для обработки запросов сервера успешных и неудачных.
- `get, post` - для получения данных с сервера, отправки данных на сервер или изменения данных в объекте на сервере.

2. Класс `api` позволяет получить и отправлять данные на сервер. 
Класс имеет следующие методы:
- `get` - используется для получения данных с сервера. 
- `post` - используется для отправки данных на сервер, также предусмотрена возможность использовать разные методы вторым параметром.
- `handleResponse` - используется для обработки запроса с сервера.

3. Класс `Components` используется для реализации базовой функционьности для использования в проекте. 
Класс имеет следующие методы:
- `toggleClass` - позволяет переключать классы для элемента.
- `setText` - позволяет установить текстовое сообщение.
- `setDisabled` - позволяет сменить статус блокировки.
- `setHidden` - позволяет скрыть элемент.
- `setVisible` - позволяет показать элемент.
- `setImage` - позволяет установить изображение и добавить описание.
- `render` - позволяет записать переданные данные в текущий объект и вернуть его.

## Описание слоя данных:
1. Класс `AppState` позволяет осуществлять базовую логику веб-приложения.
#### Класс имеет следующие методы:
 - `getTotal(): number` - позвляет полоучить общую стоимость в корзине.
 - `setCatalog(items: IProductItem[]): void` - позволяет записать в каталог массив объектов с товарами.
 - `addToBasket(item: IProductItem): void` - позволяет добавить товар в корзину.
 - `updateBasket(): void` - позволяет обновить корзину (генерирурет события).
 - `removeFromBasket(id: string): void` - позволяет удалить товар из корзины.
 - `clearBasket(): void` - позволяет очистить корзину полностью.
 - ` setPreview(item: IProductItem): void` - хранит ID товара в модальном окне.
 - `setOrderField(field: keyof IOrderForm | keyof IContactsForm, value: string)` - осуществляет обновление полей заказа.
 - ` validateOrder()` - осуществляет валидацию заказа.

2. Класс `LarekApi` наследуется от класса `Api` расширяя его функциональность. 
#### Используется конструктор: 
`constructor(cdn: string, baseUrl: string, options?: RequestInit)` принимающий в параметры ссылку на изображение, базовый URL к серверу и набор возможных дополнительных опции.
#### Класс имеет следующие методы:
- `getItems(): Promise<IProductItem[]>` - позволяет получить массив объектов с сервера.
- `orderItems(order: IOrder): Promise<IOrderResult>` - позволяет отправить заказ.

3. Класс `Model` используется для сохранения данных с сервера и получения данных.
- `getItems(): IProductItem[]` - получение массива товаров со слоя данных.
- `setItems(items: IProductItem[]): void` -  позволяет сохранить массив товаров в слой данных.
- `getItem(id: string): IProductItem` -  получение одного товара по ID из слоя данных.

## Описание слоя представления:
1. Класс `Basket` отвечает за отображение корзины, наследует методы и свойства класса `Component`.
#### Используется конструктор: 
`constructor(container: HTMLTemplateElement, protected events: EventEmitter)` в параметрах используется: 
1. Шаблон корзины.
2. Брокер событий.
#### Используются следующие свойства: 
1. `items(items: HTMLElement[])` - поместить товар в корзину.
2. `total(total: number)` - подсчитать общую стоимость.
3. `buttonText(value: string)` - установить текст на кнопку.

2. Класс `BasketItem` отвечает за отображение корзины, наследует методы и свойства класса `Component`.
#### Используется конструктор: 
`constructor(container: HTMLTemplateElement, protected events: EventEmitter)` 
1. Шаблон корзины.
2. Брокер событий.
#### Используются следующие методы: 
1. `render(item: IBasketItem): HTMLElement` - установка стоимости, названия и индекса для элемета в корзине.

3. Класс `Card` отвечает за создание карточки, наследует методы и свойства класса `Component`.
#### Используется конструктор: 
`constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions)` 
1. Поиск внутри переданного контейнера.
2. Место для отображения карточки.
3. Колбэк клика.
#### Используются следующие свойства: 
- `buttonText(value: string)` - установка текст на кнопку.
- `id(value: string)` - уставливает ID товара.
#### Используются следующие методы: 
- `toggleButton(state: boolean): void` - управление кнопкой.
- `render(data: IProductItem & { buttonText?: string }): HTMLElement` - отрисовка карточки товара.

4. Класс `Contacts` отвечает за отображение формы контактных данных, наследует методы и свойства класса `Component`.
#### Используется конструктор: 
`constructor(container: HTMLFormElement, protected events: EventEmitter)` 
1. Передается контейнер.
2. Передается брокер событий.
#### Используются следующие методы: 
- `_validateForm(): boolean` - осуществляется валидация формы.
- `_validateEmail(email: string): boolean` - осуществляется валидация электронной почты.
- `_validatePhone(phone: string): boolean` - осуществляется валидация телефонного номера.
#### Используются следующие свойства: 
- `valid(value: boolean)` - осуществляется блокировка / разблокировка кнопки отправки.
- `errors(value: string)` - осуществляется установка текста ошибки.

5. Класс `Form` отвечает за базовую функциональность форм, наследует методы и свойства класса `Component`.
#### Используется конструктор: 
`constructor(protected container: HTMLFormElement, protected events: IEvents)`
1. Передается контейнер.
2. Передается брокер событий.
#### Используются следующие методы: 
- `onInputChange(field: keyof T, value: string)` - реагирование на изменение данных в форме.
- `render(state: Partial<T> & IFormState)` - отрисовка формы.
#### Используются следующие свойства: 
- `valid(value: boolean)` - управление состоянием кнопки.
- `errors(value: string)` - установка текста ошибки.

6. Класс `Modal` отвечает за отображение модальных окон, наследует методы и свойства класса `Component`.
#### Используется конструктор: 
`constructor(container: HTMLElement, protected events: IEvents)`
1. Передается контейнер.
2. Передается брокер событий.
#### Используются следующие методы: 
- `open(): void` - открытие модального окна.
- `close(): void` - закрытие модального окна.
- `handleEscape = (event: KeyboardEvent)` - закрытие по Escape.
- `render(data: IModalData): HTMLElement` - отрисовка модального окна.

7.  Класс `Order` отвечает за отображение модальных окон, наследует методы и свойства класса `Component`.



` 






 
