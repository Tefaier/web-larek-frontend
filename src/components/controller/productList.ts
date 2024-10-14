import { ProductFilter } from "../../types"
import { Product } from "../../types/api/api";
import { AppData } from "../base/appData";
import { IProductList } from "../model/productList"
import { ProductListUI } from "../view/products"

export class ProductListController {
    filter: ProductFilter;
    productsSource: IProductList;
    productsList: ProductListUI;

    constructor(filter: ProductFilter, productsSource: IProductList, productsList: ProductListUI, renderOn?: string) {
        this.filter = filter;
        this.productsSource = productsSource;
        this.productsList = productsList;

        if (renderOn) {
            AppData.eventSystem.on(renderOn, () => this.render());
        }
    }

    render(): HTMLElement {
        return this.productsList.render(this.getFiltered());
    }

    getFiltered(): Product[] {
        return this.productsSource.getProducts(this.filter);
    }
}