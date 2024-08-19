export interface ApiCategoryBody {
    data: Category[],
    status: number,
    error?: string | any
}

export interface Category {
    id: string,
    name: string
}