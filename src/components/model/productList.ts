import { ProductFilter } from "../../types";
import { Product, ProductList } from "../../types/api/api";
import { Api } from "../base/api";
import { AppData } from "../base/appData";
import { eventNames } from "../base/events";

export interface IProductList {
    getProduct(id: string): Product | null;
    getProducts(filter?: ProductFilter): Product[]
}

export class ProductListAPI implements IProductList {
    source: Api;
    loadedProducts: ProductList

    constructor(source: Api) {
        this.source = source;
        this.init();
    }

    init() {
        this.source.get("/product/").then((data) => {
            this.loadedProducts = data as ProductList;
            AppData.eventSystem.emit(eventNames.infoLoaded as string);
        });
    }

    getProduct(id: string): Product | null {
        return this.loadedProducts.items.find((product) => product.id == id);
    }
    
    getProducts(filter?: ProductFilter): Product[] {
        return filter != undefined ? this.loadedProducts.items.filter(filter) : this.loadedProducts.items;
    }
}