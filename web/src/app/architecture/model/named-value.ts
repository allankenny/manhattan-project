
/**
  Classe que armazena um nome e um objeto.

  Utilizado no lugar de Map ou WeakMap quando queremos só armazenar valores de
  formulário em session. O stringify do JSON ignora classes Map e WeakMap, por
  isso a necessidade desta classe.
*/
export class NamedValue {

  public name: string;
  public value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }

}
