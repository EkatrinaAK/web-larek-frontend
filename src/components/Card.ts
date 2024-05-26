import { Component } from './base/component';
import { ensureElement } from '../utils/utils';


interface ICardEvent {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
    description?: string | string[];
    image: string;
    title: string;
    category: string;
    price: number | null; 
    button?: boolean
}

export class Card  extends Component<ICard> {
    protected _id: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _price?: HTMLElement;


constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardEvent
) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`,container);
    this._button = container.querySelector(`.${blockName}__button`);
    this._description = container.querySelector(`.${blockName}__text`);
    this._price = container.querySelector(`.${blockName}__price`);

    if (actions?.onClick) {
        if (this._button) {
            this._button.addEventListener('click', actions.onClick);
        } else {
            container.addEventListener('click', actions.onClick);
        }
    }
}
//ID
set id(value: string) {
    this.container.dataset.id = value;
}
get id(): string {
    return this.container.dataset.id || '';
}

// title
set title(value: string) {
    this.setText(this._title, value);
}
get title(): string {
    return this._title.textContent || '';
}

//price
set price(value: string) {
    if (value == null) {
        this.setText(this._price, 'Бесценно');
    } else {
        this.setText(this._price, value + ' синапсов');
    }
}

get price(): string {
    return this._price.textContent || '';
}

//img
set image(value: string) {
    this.setImage(this._image, value, this.title);
}

//desription
set description(value: string) {
    this.setText(this._description, value);
}

//category
set category(value: string) {
    const categoryElement = this.container.querySelector(
        `.${this.blockName}__category`
    );

    categoryElement.textContent = value;

    let categoryValue = '';

    switch (value) {
        case 'софт-скил':
            categoryValue = 'soft';
            break;
        case 'другое':
            categoryValue = 'other';
            break;
        case 'кнопка':
            categoryValue = 'button';
            break;
        case 'хард-скил':
            categoryValue = 'hard';
            break;
        case 'дополнительное':
            categoryValue = 'additional';
            break;
        default:
            categoryValue = '';
            break;
    }
    categoryElement.classList.add(
        `${this.blockName}__category_${categoryValue}`
    );
}

get category(): string {
    return this._category.textContent || '';
}
}

export class Item extends Card {
	protected _status: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardEvent) {
		super('card', container, actions);
	}

	set button(value: boolean) {
		const price = this._price.innerText;

		if (price === 'Бесценно') {
			this._button.disabled = true;
		} else {
			this._button.disabled = false;
		}

		this.setText(this._button, value ? 'Удалить' : 'В корзину');
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}