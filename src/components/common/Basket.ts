import { Component } from '../base/component';
import { EventEmitter} from '../base/events';
import { createElement, ensureElement } from '../../utils/utils';
import { IBasketPage, IBasket} from '../../types';

export class Basket extends Component<IBasketPage> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter ) {
		
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = this.container.querySelector('.basket__button');
		
		if (this._button) {
			if (!this.items?.length) {
				this._button.disabled = true;
			}
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this._button.disabled = false;
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пустая',
				})
			);
			this._button.disabled = true;
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(price: number) {
		this.setText(this._total, `${price} синапсов`);
	}
}

interface IClick {
	onClick: (event: MouseEvent) => void;
}
export class BasketItem extends Component<IBasket> {
	protected _title: HTMLElement;
	protected _id: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _prices: number[] = [];

	constructor(container: HTMLElement, actions?: IClick) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._id = ensureElement<HTMLElement>('.basket__item-index', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button.addEventListener('click', actions.onClick);
	}
	set title(value: string) {
		this.setText(this._title, value);
	}

	set id(value: number) {
		this.setText(this._id, value);
	}

	set price(value: string) {
		this.setText(this._price, `${value} синапсов`);
		this._prices.push(parseFloat(value));
	}
}