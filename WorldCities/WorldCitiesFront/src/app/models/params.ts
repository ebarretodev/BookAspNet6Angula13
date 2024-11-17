export interface Sort {
    sortColumn: string,
    sortOrder?: 'asc' | 'desc'
}

export interface Filter {
    filterColumn?: string,
    filterQuery?: string
}

export interface PageEventInternal {
    pageIndex: number
    pageSize: number
}

export interface Params {
    pageEvent?: PageEventInternal,
    sortValues?: Sort,
    filtersValues?: Filter
}