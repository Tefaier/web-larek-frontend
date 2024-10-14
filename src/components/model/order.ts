import { Product, ProductOrderRequest, ProductOrderResponse } from "../../types/api/api";
import { Api } from "../base/api";
import { AppData } from "../base/appData";
import { eventNames } from "../base/events";
import { IProductList } from "./productList";

export abstract class Order {
    order: Set<string>;
    orderInfo: Partial<ProductOrderRequest>;
    productList: IProductList;

    init() {
        this.order = new Set<string>();
        this.orderInfo = {};
    }

    abstract makeOrder(): Promise<ProductOrderResponse>;
    abstract addProduct(id: string): void;
    abstract removeProduct(id: string): void;

    totalCost(): number {
        return this.productList
        .getProducts((product) => this.order.has(product.id))
        .reduce((value, product) => value + (product.price ? product.price : 0), 0);
    }
}

export class OrderApi extends Order {
    source: Api;
    
    constructor(source: Api, productList: IProductList) {
        super();
        this.source = source;
        this.productList = productList;
        this.init();
    }
    
    init(): void {
        super.init();
        AppData.eventSystem.on(eventNames.addItemToBasket, (product: Product) => this.addProduct(product.id));
        AppData.eventSystem.on(eventNames.removeItemFromBasket, (product: Product) => this.removeProduct(product.id));
    }
    
    makeOrder(): Promise<ProductOrderResponse> {
        this.updateOrderInfo();
        const promise = this.source.post("/order", this.orderInfo) as Promise<ProductOrderResponse>;
        
        promise.then((result) => {
            if (result.error == undefined) {
                this.order = new Set<string>();
                this.updateOrderInfo();
                AppData.eventSystem.emit(eventNames.basketEmpty as string);
            }
        })
        return promise;
    }

    addProduct(id: string): void {
        this.order.add(id);
        this.updateOrderInfo();
    }

    removeProduct(id: string): void {
        this.order.delete(id);
        this.updateOrderInfo();
    }

    updateOrderInfo() {
        this.orderInfo.items = Array.from(this.order);
        this.orderInfo.total = this.totalCost();
    }
}