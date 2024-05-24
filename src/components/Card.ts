import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IProductBascket } from '../types';

interface ICardEvent {
	onClick: (event: MouseEvent) => void;
}

const CardCategory = {
    ['софт-скил']: 'soft',
	['другое']: 'other',
	['кнопка']: 'button',
	['хард-скил']: 'hard',
	['дополнительное']: 'additional',
}

export interface ICard <T>{
    description?: string | string[];
    image: string;
    title: string;
    category: string;
    price: number | null; 
    status: T;
    index: number;	
}

export class Card <T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _categoty: HTMLElement;
	protected _price: HTMLElement;


constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardEvent
) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._button = container.querySelector(`.${blockName}__button`);
    this._description = container.querySelector(`.${blockName}__text`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._categoty = container.querySelector(`.${blockName}__category`);


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
set price(value: string | null) {
    this.setText(this._price, value ?? '');
}
get price(): string {
    return this._price.textContent || null;
}

//img
set image(value: string) {
    this.setImage(this._image, value, this.title);
}

//desription
set description(value: string | string[]) {
    if (Array.isArray(value)) {
        this._description.replaceWith(
            ...value.map((str) => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            })
        );
    } else {
        this.setText(this._description, value);
    }
}
//category
set category(value: keyof typeof CardCategory) {
    if (this._categoty) {
        this.setText(this._categoty, value);
        const categoryStyle = `card__category_${CardCategory[value]}`;
        this._categoty.classList.add(categoryStyle);
    }
}
get category(): keyof typeof CardCategory {
    return this._categoty.textContent as keyof typeof CardCategory;
}
}
//корзина 
export class BasketCard extends Card<IProductBascket> {
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardEvent) {
		super('card', container, actions);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._button = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}
}
//
export type ItemStatus = {
	status: boolean;
};

export class CatalogItem extends Card<ItemStatus> {
	constructor(container: HTMLElement, actions?: ICardEvent) {
		super('card', container, actions);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
	}

	set status({ status }: ItemStatus) {
		if (this._button) {
			if (this.price === 'Бесценно') {
				this.setText(this._button, 'Недоступно');
				this._button.disabled = true;
			} else {
				this.setText(this._button, status ? 'Уже в корзине' : 'В корзину');
				this._button.disabled = status;
			}
		}
	}
}






