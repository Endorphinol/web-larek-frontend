// import { Model } from "./Model";
// import {  formatNumber } from "../../utils/utils";
// import { FormErrors, IOrder, IProductItem } from "../../types";
// import { Card } from "../view/Card";
// import { IOrderForm } from "../view/Order";

// export type CatalogChangeEvent = {
//     catalog: LotItem[]
// };

// export class LotItem extends Model {
//     about: string;
//     description: string;
//     id: string;
//     image: string;
//     title: string;
//     datetime: string;
//     history: number[];
//     minPrice: number;
//     price: number;

//     protected myLastBid: number = 0;

//     clearBid() {
//         this.myLastBid = 0;
//     }

//     placeBid(price: number): void {
//         this.price = price;
//         this.history = [...this.history.slice(1), price];
//         this.myLastBid = price;

//         if (price > (this.minPrice * 10)) {
//             this.status = 'closed';
//         }
//         this.('auction:changed', { id: this.id, price });
//     }

//     get isMyBid(): boolean {
//         return this.myLastBid === this.price;
//     }

//     get isParticipate(): boolean {
//         return this.myLastBid !== 0;
//     }


//     get auctionStatus(): string {
//         switch (this.status) {
//             case 'closed':
//                 return `Продано за ${formatNumber(this.price)}₽`;
//             case 'wait':
//                 return 'До начала аукциона';
//             case 'active':
//                 return 'До закрытия лота';
//             default:
//                 return '';
//         }
//     }

//     get nextBid(): number {
//         return Math.floor(this.price * 1.1);
//     }
// }

// export class AppState extends Model {
//     basket: string[];
//     catalog: LotItem[];
//     loading: boolean;
//     order: IOrder = {
//         email: '',
//         phone: '',
//         items: []
//     };
//     preview: string | null;
//     formErrors: FormErrors = {};
//     events: any;


//     // clearBasket() {
//     //     this.order.items.forEach(id => {
//     //         this.toggleOrderedLot(id, false);
//     //         this.catalog.find(it => it.id === id).clearBid();
//     //     });
//     // }

//     // getTotal() {
//     //     return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
//     // }

//     setCatalog(items: IProductItem[]) {
//         this.catalog = items.map(item => new Card(this.events));
//         this.events.emit('items:changed', { catalog: this.catalog });
//     }

//     setPreview(item: IProductItem) {
//         this.preview = item.id;
//         this.events.emit('preview:changed', item);
//     }

//     getActiveLots(): IProductItem[] {
//         return this.catalog
//             .filter(item => item.status === 'active' && item.isParticipate);
//     }

//     getClosedLots(): LotItem[] {
//         return this.catalog
//             .filter(item => item.status === 'closed' && item.isMyBid)
//     }

//     setOrderField(field: keyof IOrderForm, value: string) {
//         this.order[field] = value;

//         if (this.validateOrder()) {
//             this.events.emit('order:ready', this.order);
//         }
//     }

//     validateOrder() {
//         const errors: typeof this.formErrors = {};
//         if (!this.order.email) {
//             errors.email = 'Необходимо указать email';
//         }
//         if (!this.order.phone) {
//             errors.phone = 'Необходимо указать телефон';
//         }
//         this.formErrors = errors;
//         this.events.emit('formErrors:change', this.formErrors);
//         return Object.keys(errors).length === 0;
//     }
// }