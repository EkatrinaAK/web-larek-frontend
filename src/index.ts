import './scss/styles.scss';

import { API_URL, CDN_URL } from "./utils/constants";
import { CardAPI } from './components/CardAPI'
import { OrderAddress, OrderContact } from './components/Order';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket, BasketItem } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { ChangeEvent, IOrderForm } from './types';

import { ensureElement, cloneTemplate } from './utils/utils';
import { AuctionItem, Card } from './components/Card';
import { Farmed } from './components/common/Farmed';
import { AppContent, CardItem } from './components/AppState';

const api = new CardAPI (CDN_URL, API_URL);
const event = new EventEmitter();
const appState = new AppContent({}, event);

event.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const page = new Page(document.body, event);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), event);

const basket = new Basket(cloneTemplate(basketTemplate), event);
const order = new OrderAddress(cloneTemplate(orderTemplate), event);
const contact = new OrderContact(cloneTemplate(contactTemplate), event);

// запрс карточек
async function init () {
    const {items} = await api.getCardList();
    appState.setCatalog(items)
}

init();

// выводим на экран карточки
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
    
//открыть модальное окно 
event.on('card:select', (item: CardItem) => {
	appState.setPreview(item);
});

event.on('card:basket', (item: CardItem) => {
	appState.handleBasket(item);
});

//выводим на экран
event.on('card:open', (item: CardItem) => {
	const card = new AuctionItem(cloneTemplate(cardPreviewTemplate), {
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

//корзина 
event.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});
//удаление по кнопке в корзине
event.on('basket:delItem', (item: CardItem) => {
	appState.deleteBasket(item);
});
//добавление в корзину
event.on('lot:changed', () => {
	page.counter = appState.getBasketCard()?.length;

	basket.items = appState.getBasketCard().map((item, id) => {
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

	basket.total = appState.getCard();
});

// мадальное окно с адресом 
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

// мадальное окно с телефоном
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
		appState.setOrder(data.field, data.value);
	}
);
event.on('formErrorsContact:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});
// модальное окно оформлено
event.on('contacts:submit', () => {
    api
		.getOrderCard()
		.then((result) => {
			const success = new Farmed (cloneTemplate(successTemplate), {
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

// Блокируем прокрутку страницы если открыта модалка
event.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
event.on('modal:close', () => {
	page.locked = false;
});

