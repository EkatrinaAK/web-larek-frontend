import { Model } from './base/Model';
import { IProduct, IFormErrors, IOrder, IContent, IOrderForm } from '../types/index';

export class AppContent extends Model<IContent> {
	basket: IProduct[]= [];
	catalog: IProduct[] = [];
	order = {
		email: '',
		phone: '',
		payment: '',
		address: '',
		items: [],
	} as IOrder;
	preview: string | null;
	formErrors: IFormErrors = {};

	// каталог
	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed',  this.catalog);
    }
	//карточки
	setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }
	//добаить
	addCardBasket(item: IProduct) {
		this.order.items.push(item.id)
	}
	//карточка в корзине
	setCardToBasket(item: IProduct) {
		this.basket.push(item)
	}
	//список  в корзине
	get basketList(): IProduct[] {
		return this.basket
	}
	//информация о составе в корзине
	get statusBasket(): boolean {
		return this.basket.length === 0
	}
	//сумма 
	set total(value: number) {
		this.order.total = value;
	  }
	  //сумма заказа 
	  getTotal () {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}
	// удальть из корзины
	deleteCardToBasket(item: IProduct) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
		  this.basket.splice( index, 1 );
		}
	}
	//очистить козину
	clearBasket() {
		this.basket = []
		this.order.items = []
	}
	//поле доставки 
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		} 
	}
	//поле контакты
	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
	
		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		} 
	}

	//валидация данных
	validateOrder() {
		const errors: typeof this.formErrors = {};
    	const deliveryRegex = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
    	if (!this.order.address) errors.address = 'Необходимо указать адрес';
    	else if (!deliveryRegex.test(this.order.address)) errors.address = 'Укажите настоящий адрес';
    	else if(!this.order.payment) errors.payment='Выберите способ оплаты';
		this.formErrors = errors;
    	this.events.emit('formErrors:change', this.formErrors);
    	return Object.keys(errors).length === 0;
  }
	// валидация контактов
	validateContacts() {
		const errors: typeof this.formErrors = {};
		const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
		if (this.order.phone.startsWith('8')) this.order.phone = '+7' + this.order.phone.slice(1);
		if (!this.order.email) errors.email = 'Необходимо указать email';
		else if (!emailRegex.test(this.order.email)) errors.email = 'Некорректный адрес электронной почты';
		if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
		else if (!phoneRegex.test(this.order.phone)) errors.phone ='Некорректный формат номера телефона';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//очистить
	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			payment: 'cash',
			address: '',
			items: [],
			total: 0,
		};
	}
}




