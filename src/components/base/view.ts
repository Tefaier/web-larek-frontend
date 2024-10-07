export abstract class UIElement<T extends Object> {
    abstract render(data?: T): HTMLElement
    abstract update(): void
}