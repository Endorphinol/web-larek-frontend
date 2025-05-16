import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { FormErrors, IContactsForm, IOrderForm, IProductItem } from './types';
import { LarekAPI } from './components/model/LarekApi';
import { Success } from './components/view/Success';
import { Order } from './components/view/Order';
import { Card } from './components/view/Card';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { AppState } from './components/model/AppData';
import { BasketItem } from './components/view/BasketItem';
import { Contacts } from './components/view/Contacts';

// Инициализация основных объектов.
const events = new EventEmitter();
const appData = new AppState(events);
const api = new LarekAPI(CDN_URL, API_URL);

// Шаблоны.
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketItemTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты.
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(cardBasketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Загрузка товаров.
api
	.getItems()
	.then((items) => {
		appData.setCatalog(items);
		page.counter = appData.getTotal();
	})
	.catch((err) => {
		console.error('Ошибка загрузки товаров:', err);
	});

// Обновление каталога.
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		});
	});
});

// Выбор товара.
events.on('card:select', (item: IProductItem) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('basket:toggle', item);
			card.buttonText = appData.basket.includes(item.id)
				? 'Убрать'
				: 'В корзину';
		},
	});

	modal.render({
		content: card.render({
			...item,
			buttonText: appData.basket.includes(item.id) ? 'Убрать' : 'В корзину',
		}),
	});
});

// Работа с элеметом корзины корзиной
events.on('basket:changed', () => {
	page.counter = appData.basket.length;
	basket.items = appData.basket.map((id, index) => {
		const item = appData.catalog.find((item) => item.id === id);
		const basketItem = new BasketItem(
			cloneTemplate(cardBasketItemTemplate),
			events,
			{
				onClick: () => events.emit('basket:toggle', { id }),
			}
		);
		return basketItem.render({
			index: index + 1,
			title: item.title,
			price: item.price,
			id: id,
		});
	});
	basket.total = appData.getTotal();
});

// Открытие корзины.
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Добавление/удаление товара.
events.on('basket:toggle', (item: IProductItem) => {
	if (appData.basket.includes(item.id)) {
		appData.removeFromBasket(item.id);
	} else {
		appData.addToBasket(item);
	}
});

// Блокировка прокрутки при открытии модального окна.
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокировка прокрутки при закрытии.
events.on('modal:close', () => {
	page.locked = false;
});

// Обработка успешного оформления заказа.
events.on('order:success', (data: { total: number }) => {
	const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => modal.close(),
	});

	modal.render({
		content: success.render({
			description: `Списано ${data.total} синапсов`,
		}),
	});
});

// Форма заказа.
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: appData.order.payment,
			address: appData.order.address,
		}),
	});
});

// Изменение способа оплаты.
events.on(
	'order.payment:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
		order.valid = appData.validateOrder();
	}
);

// Изменение адреса.
events.on(
	'order.address:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
		order.valid = appData.validateOrder();
	}
);

// Изменение email.
events.on(
	'contacts.email:change',
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field as 'email' | 'phone', data.value);
		contacts.valid = appData.validateContacts();
	}
);

// Изменение телефона.
events.on(
	'contacts.phone:change',
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field as 'email' | 'phone', data.value);
		contacts.valid = appData.validateContacts();
	}
);

// Оформление заказа.
events.on('order:submit', (data: { payment: string; address: string }) => {
    if (appData.validateOrder()) {
        appData.setOrderField('payment', data.payment);
        appData.setOrderField('address', data.address);
        events.emit('contacts:open');
        events.emit('modal:close');
    }
});

// Модальное окно контакты.
events.on('contacts:open', () => {
	modal.render({
		content: contacts.render({
			email: appData.order.email,
			phone: appData.order.phone,
		}),
	});
});

// Обновление состояния формы.
events.on('formErrors:change', (errors: FormErrors) => {
	const messages = Object.values(errors).filter(Boolean).join('; ');
	order.errors = messages;
	contacts.errors = messages;
});

// Отправка контактов форма.
events.on('contacts:submit', () => {
    if (appData.validateContacts()) {
        const total = appData.getTotal();
        api.orderItems({
            payment: appData.order.payment,
            address: appData.order.address,
            email: appData.order.email,
            phone: appData.order.phone,
            items: appData.basket,
            total: total
        }).then(() => {
            modal.close();
            events.emit('order:success', { total });
            appData.clearBasket();
        });
    }
});
