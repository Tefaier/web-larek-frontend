import { Product } from "./api/api"

export type ProductFilter = (arg: Product) => boolean;

export type InputValue = string | number;

export type ValidationFunction = (value: InputValue) => boolean;

export var InputFieldType: {[key: string]: number} = {
    password: 0
};

export type InputFieldStat = {
    value?: object
    options?: object[]
    element?: HTMLElement
    type: string
    validation: ValidationFunction
    onInput: (value: object) => void
};

export var defaultInputFieldStats: {[key: number]: ValidationFunction} = {
    0: (value: InputValue) => {return true}
};

export type ListSettings = {
    columns: number
}


