import { ApiListResponse } from "../../components/base/api"

export type ErrorResponse = {
    error: string
}

export type Product = {
    id: string
    description: string
    image: string
    title: string
    category: string
    price: number | null
}

export type ProductList = ApiListResponse<Product>

export type ProductResponse = Product | ErrorResponse

export type ProductOrderRequest = {
    payment: string
    email: string
    phone: string
    address: string
    total: number
    items: string[] // ids of products
}

export type ProductOrderResponse = {
    id: string
    total: number
} | ErrorResponse