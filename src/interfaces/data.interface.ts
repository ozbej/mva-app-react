interface HeaderRowInterface {
    title: string;
    type: string;
}

interface DataInterface {
    data: number[][];
    headerRow: HeaderRowInterface[];
}

export type { HeaderRowInterface, DataInterface };