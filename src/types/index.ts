// интерфейс для карточки
export interface IProduct{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null; 
    select: boolean;
}
export type IProductOrder = Pick <IProduct, 'select'>

// интерфейс контактные данные 
export interface IOrderContact {
    email: string;
    phone: string
}
// интерфейс данных оплаты 
export interface IOrderPay {
    address: string;
	payment: string;
}
export type IOrderForm = IOrderContact & IOrderPay;

// интерфейс для данных о заказе
 export interface IOrder extends IOrderForm{
    items: IProduct[];
 }
 export interface IOrderApi extends IOrderForm {
    items: string[];
    total: number;
 }
    
export type IFormErrors = Partial<Record<keyof IOrder, string>>;

//интерфейс  главной страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
//интерфейс корзины
export interface IBasketPage {
	items: HTMLElement[];
	total: number;
	selected: string[];
}
 export interface IBasket {
	title: string;
	id: number;
	price: string | number;
}

export interface ISuccessForm {
	total: number;
}

//интерфейс приложения
export interface IContent {
    catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

export type ChangeEvent = Pick <IContent, 'catalog'>