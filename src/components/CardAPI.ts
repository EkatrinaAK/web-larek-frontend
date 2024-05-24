import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder} from '../types';

export interface ICardAPI {
    getCardList: () => Promise <ApiListResponse<IProduct>>;
    getCardItem: (id:string) => Promise<IProduct>;
    getOrderCard: (order: IOrder) => Promise <IOrder>;
}

export class CardAPI extends Api implements ICardAPI {
    readonly cdn: string;

    constructor ( cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    getCardItem(id:string): Promise <IProduct> {
        return this.get(`/product/${id}`).then ( 
            (item:IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        )
     }
    getCardList(): Promise <ApiListResponse<IProduct>> {
        return this.get('/product') as  Promise <ApiListResponse<IProduct>> ;
    }
    getOrderCard(order:IOrder): Promise <IOrder> {
        return this.post('/order',order).then((data:IOrder)=>data);
    }

}