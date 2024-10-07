import { FormField } from "../components/view/form";
import { Product } from "./api/api"

export type ProductFilter = (arg: Product) => boolean;

export type InputValue = string | number;

export type ValidationResponse = {
    passed: boolean
    errorMessage?: string
}

export type ValidationFunction = (value: InputValue) => ValidationResponse;

export var InputFieldType: {[key: string]: number} = {
    password: 0
};

export type InputFieldStat = {
    options?: object[]
    element?: HTMLInputElement
    type: string
    validation: ValidationFunction
    onInput: (form: FormField, value: string) => void
    locateQuery: string
};

export type SubmitFieldStat = {
    element?: HTMLButtonElement
    locateQuery: string
    onSubmit: () => void
}

export const defaultInputFieldStats: {[key: number]: ValidationFunction} = {
    0: (value: InputValue) => {return {passed: true};}
};

export type ListSettings = {
    useExisting?: HTMLElement,
    countWithClass?: string
}


