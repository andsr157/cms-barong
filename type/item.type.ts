export interface ApiItemBody {
    data: Item[],
    error?: string | any,
    status: number
}

export interface Item {
    id: string,
    name: string,
    minPrice: number,
    maxPrice: number,
    category: {
        id: string,
        name: string
    }
    unit: {
        id: string,
        name: string
    }
}