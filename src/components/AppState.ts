import { Model } from './base/Model';
import { IProduct, IProductOrder, IFormErrors, IOrder, IContent, IOrderForm, ChangeEvent } from '../types/index';
import { IEvents } from './base/events';

export class ProductItem extends Model<IProduct> {
	id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null; 
    select: boolean;
	status: IProductOrder;
	about: string;
}

export class AppContent extends Model<IContent> {
	basket: IProduct[]= [];
	catalog: IProduct[] = [];
	order: IOrder = {
		email: '',
		phone: '',
		payment: '',
		address: '',
		items: [],
	} 
	preview: string | null;
	formErrors: IFormErrors = {};

	constructor (data: Partial<IContent>, events: IEvents) {
		super (data, events);
		this.events = events;
	}


	// каталог
	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductItem (item, this.events));
		this.emitChanges('catalog:changed', { catalog: this.catalog });
    }
	//карточки
	setPreview(item: ProductItem): void {
        this.preview = item.id;
        this.emitChanges('card:open', item);
    }
	//добаить
	addBasket(item: ProductItem): void {
		this.catalog.map((e)=> {
			if(item.id === e.id){
				e.select=true;
			}
		});
		this.emitChanges('card:open', item);
		this.emitChanges('lot:changed', item);
	}
	// удалить 
	deleteBasket(item: ProductItem): void {
		this.catalog.map((e) => {
			if (item.id === e.id) {
				e.select = false;
			}
		});

		this.emitChanges('card:open', item);
		this.emitChanges('lot:changed', item);
	}
//очистить
clearBasket(): void {
	this.catalog.forEach((e) => {
		e.select = false;
	});
	this.emitChanges('lot:changed');
}
// удалить из корзины
deleteFromBasket(item: ProductItem): void {
	this.catalog.map((e) => {
		if (item.id === e.id) {
			e.select = false;
		}
	});
	this.emitChanges('lot:changed', item);
}

handleBasket(item: ProductItem): void {
	if (item.select) {
		this.deleteBasket(item);
	} else {
		this.addBasket(item);
	}
}

getBasketProduct = (): IProduct[] => this.catalog.filter((item) => item.select);

getTotal() {
	return this.catalog
		.filter((item) => item.select)
		.reduce((acc, e) => acc + e.price, 0);
}

setOrderField(field: keyof IOrderForm, value: string) {
	this.order[field] = value;

	if (this.validateOrderPay()) {
		this.events.emit('order:ready', this.order);
	}

	if (this.validateOrderContact()) {
		this.events.emit('order:ready', this.order);
	}
}
//валидация
validateOrderPay() {
	const errors: typeof this.formErrors = {};

	if (!this.order.address) {
		errors.address = 'Укажите адрес';
	}
	if (!this.order.payment) {
		errors.payment = 'Укажите способ оплаты';
	}

	this.formErrors = errors;
	this.events.emit('formErrors:change', this.formErrors);

	return Object.keys(errors).length === 0;
}

validateOrderContact() {
	const errors: typeof this.formErrors = {};

	if (!this.order.email) {
		errors.email = 'Укажите email';
	}

	if (!this.order.phone) {
		errors.phone = 'Укажите телефон';
	}

	this.formErrors = errors;
	this.events.emit('formErrorsContact:change', this.formErrors);

	return Object.keys(errors).length === 0;
}
}


	