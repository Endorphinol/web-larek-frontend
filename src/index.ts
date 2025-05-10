import './scss/styles.scss';

import { Component } from './components/base/Component';
import { Model } from './components/model/Model';
import { Basket } from './components/view/Basket';
import { Form } from './components/view/Form';
import { Modal } from './components/view/Modal';
import { Order } from './components/view/Order';
import { Page } from './components/view/Page';
import { Success } from './components/view/Success';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { LarekAPI } from './components/base/LarekApi';
import { AppState, CatalogChangeEvent } from './components/model/AppData';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { Tabs } from './components/view/Tabs';
import { Card } from './components/view/Card';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);


// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');


// Модель данных приложения.
const appData = new AppState({}, events);

// Глобальные контейнеры.
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const tabs = new Tabs(cloneTemplate(tabsTemplate), {
    onClick: (name) => {
        if (name === 'closed') events.emit('basket:open');
        else events.emit('bids:open');
    }
});
const order = new Order(cloneTemplate(orderTemplate), events);
