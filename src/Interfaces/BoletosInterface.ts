export interface Boleto {
    nomeSacado: string,
    unidade: number,
    valor: number,
    linhaDigitavel: string,
    idLote?: number 
}