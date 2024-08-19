export interface ApiUnitBody {
    data: Unit[],
    status: number,
    error?: string | any
}

export interface Unit {
    id: string,
    name: string
}