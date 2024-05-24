// интерфейс для карточки
export interface IProduct{
    id: string;
    description?: string;
    image?: string;
    title?: string;
    category?: string;
    price: number | null; 
    select: boolean;
}

//интерфейс товара в корзине
export interface IProductBascket {
    index: number;
}

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

// интерфейс для данных о заказе
 export interface IOrder extends IOrderContact, IOrderPay {
    items: string[];
    total: number;
 }

 //интерфейс покупки
export interface IorderResult {
    id: string[];
    total: number;
    error?: string;    
}

//интерфейс формы успешного заказа
export interface IFarmtdOrder {
    description: number;
}
//валидация полей заказа
 export type IorderValidate = IOrderContact & IOrderPay
    
export type IFormErrors = Partial<Record<keyof IOrder, string>>;

// нитерфейсглавной страницы 
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
// интерфейс корзины
export interface IBasket {
	list: HTMLElement[];
	total: number;
}
//интерфейс приложения
export interface IContent {
    catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
    
    setCatalog(items:IProduct[]):void;
    addBasket(product:IProduct):void;
    removeBasket(product:IProduct):void;
}

export type ChangeEvent = Pick <IContent, 'catalog'>
