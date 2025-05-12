import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/model/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState } from './components/model/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { Order } from './components/view/Order';
import { Success } from './components/view/Success';
import { IProductItem } from './types';

// Инициализация основных компонентов
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState(events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные компоненты
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// Отображение каталога товаров
events.on('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            ...item,
            buttonText: 'В корзину'
        });
    });
});

// Просмотр карточки товара
events.on('card:select', (item: IProductItem) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('basket:add', item);
            card.buttonText = appData.basket.includes(item.id) ? 'Убрать' : 'В корзину';
        }
    });
    
    modal.render({
        content: card.render({
            ...item,
            buttonText: appData.basket.includes(item.id) ? 'Убрать' : 'В корзину'
        })
    });
});

// Работа с корзиной
events.on('basket:add', (item: IProductItem) => {
    appData.addToBasket(item);
    page.counter = appData.basket.length;
});

events.on('basket:remove', (item: IProductItem) => {
    appData.removeFromBasket(item.id);
    page.counter = appData.basket.length;
    basket.total = appData.getTotal();
});

events.on('basket:open', () => {
    basket.items = appData.basket.map(id => {
        const item = appData.catalog.find(it => it.id === id);
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', item)
        });
        return card.render({
            ...item,
            buttonText: 'Убрать'
        });
    });
    basket.total = appData.getTotal();
    modal.render({
        content: basket.render()
    });
});

// Оформление заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Отправка заказа.
events.on('order:submit', () => {
    api.orderItems(appData.order)
        .then(() => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close()
            });
            success.total = appData.getTotal();
            modal.render({
                content: success.render({})
            });
            appData.clearBasket();
            page.counter = 0;
        })
        .catch(err => {
            console.error(err);
        });
});

// Загрузка товаров с сервера.
api.getItems()
    .then(data => {
        appData.setCatalog(data);
        page.counter = appData.basket.length;
    })
    .catch(err => {
        console.error(err);
    });