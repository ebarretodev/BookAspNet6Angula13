
export interface Sort {
    sortColumn: string,
    sortOrder: 'asc' | 'desc'
}

export interface Filter {
    filterColumn?: string,
    filterQuery?: string
}

export interface Params {
    sortValues?: Sort,
    filtersValues?: Filter
}