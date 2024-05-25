import { IOrderContact } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class OrderContact extends Form<IOrderContact> {
	protected _phoneNumber: HTMLInputElement;
	protected _email: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneNumber = container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		this._email = container.elements.namedItem('email') as HTMLInputElement;
	}

	set phoneNumber(value: string) {
		this._phoneNumber.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}

	clear() {
		this._phoneNumber.value = '';
		this._email.value = '';
	}
}