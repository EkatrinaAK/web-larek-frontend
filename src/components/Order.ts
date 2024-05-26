import { IOrderPay, IOrderContact, IOrderForm} from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';
import { ensureElement } from '../utils/utils';

export class OrderContact extends Form<IOrderContact> { 
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}

export class OrderPay extends Form<IOrderPay> {
	payment:string;
	protected _containerPay: HTMLDivElement;
	protected _PayCash: HTMLButtonElement;
	protected _PayOnline: HTMLButtonElement;
;

	constructor(
		container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container, events);

		this._containerPay = ensureElement<HTMLDivElement>(
			'.order__buttons',
			this.container
		);
		this._PayCash = this._containerPay.querySelector('[name=cash]');
		this._PayOnline = this._containerPay.querySelector('[name=card]');

		if (this._PayCash) {
			this._PayCash.addEventListener('click', (e) => {
				e.preventDefault();
				this.setPayment('payment', 'При получении');
				this._PayCash.classList.add('button_alt-active');
				this._PayOnline.classList.remove('button_alt-active');
			});
		}

		if (this._PayOnline) {
			this._PayOnline.addEventListener('click', (e) => {
				e.preventDefault();
				this.setPayment('payment', 'Онлайн');
				this._PayOnline.classList.add('button_alt-active');
				this._PayCash.classList.remove('button_alt-active');
			});
		}
	}

	set address(value: string) {
		(this.container.elements?.namedItem('address') as HTMLInputElement).value =
			'';
	}

	protected setPayment(field: keyof IOrderForm, value: string) {
		this.events.emit('order.payment:change', {
			field,
			value,
		});
	}
}