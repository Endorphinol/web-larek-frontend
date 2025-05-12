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
import { BasketItem } from './components/view/BasketItem';

// Инициализация основных объектов
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState(events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(cardBasketTemplate), events);
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

// Обновление каталога
events.on('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            ...item,
            price: item.price,
            buttonText: 'В корзину'
        });
    });
});

// Выбор товара
events.on('card:select', (item: IProductItem) => {
    appData.setPreview(item);
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('basket:toggle', item) 
    });
    modal.render({
        content: card.render({
            ...item,
            price: item.price,
            buttonText: appData.basket.includes(item.id) ? 'Убрать' : 'В корзину',
        })
    });
});

// Работа с корзиной
events.on('basket:changed', () => {
    page.counter = appData.basket.length;
    basket.items = appData.basket.map(id => {
        const item = appData.catalog.find(it => it.id === id);
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove')
        });
        return card.render({
            ...item,
            price: item.price,
            buttonText: 'Убрать',
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

// Открытие корзины.
page.basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

// Добавление/удаление товара
events.on('basket:toggle', (item: IProductItem) => {
    if (appData.basket.includes(item.id)) {
        appData.removeFromBasket(item.id);
    } else {
        appData.addToBasket(item);
    }
});

// Обновление корзины
events.on('basket:open', () => {
    basket.items = appData.basket.map(id => {
        const item = appData.catalog.find(item => item.id === id);
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', { id }) 
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

// Удаление товара из корзины.
events.on('basket:remove', (event: { id: string }) => {
    appData.removeFromBasket(event.id);
    events.emit('basket:changed');
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

// Добавление и удаление товара из корзины.
events.on('basket:open', () => {
    basket.items = appData.basket.map((id, index) => {
        const item = appData.catalog.find(item => item.id === id);
        if (!item) return document.createElement('div');
        
        const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', { id })
        });
        
        return basketItem.render({
            index: index + 1,
            title: item.title,
            price: item.price
        });
    });
    
    basket.total = appData.getTotal();
    modal.render({
        content: basket.render()
    });
});