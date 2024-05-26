import './scss/styles.scss';

import { API_URL, CDN_URL } from "./utils/constants";
import { CardAPI } from './components/CardAPI'
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { ensureElement, cloneTemplate } from './utils/utils';
import { AppContent, ProductItem } from './components/AppState';
import { Basket, BasketItem } from './components/common/Basket';
import { IOrderPay, ChangeEvent, IProduct, IOrderForm } from './types';
import { Card, Item } from './components/Card';
import { OrderPay, OrderContact } from './components/Order';
import { Success } from './components/common/Success';


const api = new CardAPI (CDN_URL, API_URL);// управление API
const event = new EventEmitter();//управление событиями
const appState = new AppContent({},event);//модель данных

// для карточки
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
//для заказа
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
//для корзины
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
// контейнеры
const page = new Page(document.body, event);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), event);

const basket = new Basket( cloneTemplate(basketTemplate), event);
const order = new OrderPay(cloneTemplate(orderTemplate), event);
const contact = new OrderContact(cloneTemplate(contactTemplate), event);

//запрс карточек
async function init () {
    const {items} = await api.getCardList();
	appState.setCatalog (items);
	console.log(items);
}

init();

// блокируем прокрутку страницы
event.on('modal:open', () => {
	page.locked = true;
});

// разблокируем
event.on('modal:close', () => {
	page.locked = false;
});
// каталог карточек
event.on<ChangeEvent>('catalog:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => event.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});
//карточка
event.on('card:select', (item: ProductItem) => {
	appState.setPreview(item);
});

event.on('card:basket', (item: ProductItem) => {
	appState.handleBasket(item);
});
// 
event.on('card:open', (item: ProductItem) => {
	const card = new Item(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			event.emit('card:basket', item);
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			button: item.select,
		}),
	});
});
// корзина
event.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});
//добавить
event.on('lot:changed', () => {
	page.counter = appState.getBasketProduct()?.length;

	basket.items = appState.getBasketProduct().map((item, id) => {
		const CardItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				event.emit('basket:delItem', item);
			},
		});
		return CardItem.render({
			title: item.title,
			price: item.price,
			id: id + 1,
		});
	});

	basket.total = appState.getTotal();
});
//удалить
event.on('basket:delItem', (item: ProductItem) => {
	appState.deleteFromBasket(item);
});
// мадальное окно оплаты
event.on('order:open', () => {
	modal.render({
		content: order.render({
			address: order.address,
			payment: order.payment,
			valid: false,
			errors: [],
		}),
	});
});
event.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});
// мадальное окно контакты
event.on('order:submit', () => {
	modal.render({
		content: contact.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});
event.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setOrderField(data.field, data.value);
	}
);

event.on('formErrorsContact:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

event.on('contacts:submit', () => {
	api
		.getOrderCard({
			...appState.order,
			total: appState.getTotal(),
			items: appState.getBasketProduct().map((e) => e.id),
		})
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appState.clearBasket();
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
	});
	