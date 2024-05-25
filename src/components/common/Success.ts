import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { ISuccessOrder } from '../../types';

interface ISuccessEvent {
	onClick: () => void;
}

export class Success extends Component<ISuccessOrder> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;
	protected _title: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessEvent) {
		super(container);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			`.order-success__description`,
			this.container
		);
		this._title = ensureElement<HTMLElement>(
			'.order-success__title',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}