import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProductItem } from './types';
import { LarekAPI } from './components/model/LarekApi';
import { Success } from './components/view/Success';
import { Order } from './components/view/Order';
import { Card } from './components/view/Card';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { AppState } from './components/model/AppData';

// Инициализация основных объектов
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState(events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// Загрузка товаров
api.getItems()
    .then(items => {
        appData.setCatalog(items);
        page.counter = appData.getTotal();
    })
    .catch(err => {
        console.error('Ошибка загрузки товаров:', err);
    });

// Обработчики событий

// Обновление каталога
events.on('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
            id: item.id,
        });
    });
});

// Выбор товара
events.on('card:select', (item: IProductItem) => {
    appData.setPreview(item);
    const card = new Card('card', cloneTemplate(cardPreviewTemplate));
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
            id: item.id,
        })
    });
});

// Работа с корзиной
events.on('basket:changed', () => {
    page.counter = appData.basket.length;
    basket.items = appData.basket.map(id => {
        const item = appData.catalog.find(it => it.id === id);
        const card = new Card('card', cloneTemplate(basketTemplate), {
            onClick: () => events.emit('basket:remove')
        });
        return card.render({
            ...item,
            buttonText: 'Убрать'
        });
    });
    basket.total = appData.getTotal();
});

// Оформление заказа
events.on('order:submit', () => {
    api.orderItems(appData.order)
        .then(() => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                }
            });
            success.total = appData.getTotal();
            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error('Ошибка оформления заказа:', err);
        });
});

// Блокировка прокрутки при открытии модального окна
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокировка прокрутки при закрытии
events.on('modal:close', () => {
    page.locked = false;
});

// Обработка успешного оформления заказа
events.on('order:success', () => {
    const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
            modal.close();
            appData.clearBasket();
            events.emit('basket:changed');
        }
    });
    modal.render({
        content: success.render({})
    });
});