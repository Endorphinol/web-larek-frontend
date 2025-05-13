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
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState(events);

// Шаблоны.
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты.
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(cardBasketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

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
		const basketItem = new BasketItem(cloneTemplate(cardBasketItemTemplate), {
			onClick: () => events.emit('basket:remove', { id }),
		});
		return basketItem.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});
	basket.total = appData.getTotal();
});

// Открытие корзины.
page.basketButton.addEventListener('click', () => {
	events.emit('basket:open');
});

// Добавление/удаление товара.
events.on('basket:toggle', (item: IProductItem) => {
	if (appData.basket.includes(item.id)) {
		appData.removeFromBasket(item.id);
	} else {
		appData.addToBasket(item);
	}
});

// Обновление корзины.
events.on('basket:open', () => {
	basket.items = appData.basket.map((id) => {
		const item = appData.catalog.find((item) => item.id === id);
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove', { id }),
		});
		return card.render({
			...item,
			buttonText: 'Убрать',
		});
	});
	basket.total = appData.getTotal();
	modal.render({
		content: basket.render(),
	});
});

// Удаление товара из корзины.
events.on('basket:remove', (event: { id: string }) => {
	appData.removeFromBasket(event.id);
	events.emit('basket:changed');
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

// Добавление и удаление товара из корзины.
events.on('basket:open', () => {
	basket.items = appData.basket.map((id) => {
		const item = appData.catalog.find((item) => item.id === id);
		if (!item) return document.createElement('div');

		const basketItem = new BasketItem(cloneTemplate(cardBasketItemTemplate), {
			onClick: () => events.emit('basket:remove', { id }),
		});

		return basketItem.render({
			title: item.title,
			price: item.price,
			index: item.index,
		});
	});

	basket.total = appData.getTotal();
	modal.render({
		content: basket.render(),
	});
});

// Форма заказа.
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
		}),
	});
});

// Изменение способа оплаты.
events.on(
	'order.payment:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменение адреса.
events.on(
	'order.address:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменение email.
events.on(
	'contacts.email:change',
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field as 'email' | 'phone', data.value);
	}
);

// Изменение телефона.
events.on(
	'contacts.phone:change',
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field as 'email' | 'phone', data.value);
	}
);

// Оформление заказа.
events.on('order:submit', (data: { payment: string; address: string }) => {
	appData.setOrderField('payment', data.payment);
	appData.setOrderField('address', data.address);

	events.emit('contacts:open');
	events.emit('modal:close');
});

// Модальное окно контакты.
events.on('contacts:open', () => {
	const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
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
});

// Отправка контактов форма.
events.on('contacts:submit', (data: { email: string; phone: string }) => {
	appData.setOrderField('email', data.email);
	appData.setOrderField('phone', data.phone);

	if (appData.validateOrder()) {
		const total = appData.getTotal();
		api
			.orderItems({
				payment: appData.order.payment,
				address: appData.order.address,
				email: appData.order.email,
				phone: appData.order.phone,
				items: appData.basket,
				total: total,
			})
			.then(() => {
				modal.close();
				events.emit('order:success', { total });
				appData.clearBasket();
			})
			.catch((err) => {
				console.error(err);
			});
	}
});
