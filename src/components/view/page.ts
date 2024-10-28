import { ensureElement } from "../../utils/utils";
import { UIElement } from "../base/view";

interface IPageLayout {
    locked: boolean,
}

export class PageLayout extends UIElement<IPageLayout> {
    protected page: HTMLElement;
    protected pageWrapper: HTMLElement;


    constructor(container: HTMLElement) {
        super();
        this.page = container;
        this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
    }

    set locked(value: boolean) {
        this.pageWrapper.classList.toggle('page__wrapper_locked', value);
    }

    render(data?: IPageLayout): HTMLElement {
        if (data) this.locked = data.locked;
        return this.page;
    }

    update(): void {
    }
}