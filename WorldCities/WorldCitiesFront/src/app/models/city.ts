export interface City {
    id: number;
    name: string;
    lat: number;
    lon: number;
}

export interface Sort {
    sortColumn: string,
    sortOrder: 'asc' | 'desc'
}