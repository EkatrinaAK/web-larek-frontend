import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrderApi} from '../types';

export interface ICardAPI {
    getCardList: () => Promise <ApiListResponse<IProduct>>;
    getCardItem: (id:string) => Promise<IProduct>;
    getOrderCard: (order: IOrderApi) => Promise <IOrderApi>;
}

export class CardAPI extends Api implements ICardAPI {
    readonly cdn: string;

    constructor ( cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
        console.log(cdn);
    }
    getCardItem(id:string): Promise <IProduct> {
        return this.get(`/product/${id}`).then ( 
            (item:IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        )
     }
     
    async getCardList(): Promise <ApiListResponse<IProduct>> {
        const result = (await this.get('/product')) as ApiListResponse<IProduct>;
        return { 
            total: result.total,
            items: result.items.map ((item:IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        };
    }

    getOrderCard(order:IOrderApi): Promise <IOrderApi> {
        return this.post('/order',order).then((data:IOrderApi)=>data);
    }

}