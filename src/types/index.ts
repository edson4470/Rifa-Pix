export interface Rifa {
  id: string;
  titulo: string;
  descricao?: string;
  preco_bilhete: number;
  quantidade_numeros: number;
  status: string;
  data_sorteio?: string;
}