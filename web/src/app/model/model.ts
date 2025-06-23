/** Representa um registro identificável por uma chave ID. */
export class Model<K> {

  public id: K;
  public is_active: boolean;
  public created_at: Date;
  public updated_at: Date;
  public sequence_id: number;

  constructor() {
  }

  static equals(model1: Model<any>, model2: Model<any>): boolean {
    if (!model1 && !model2) {
      return true;
    }

    if (model1 && !model2) {
      return false;
    }

    if (!model1 && model2) {
      return false;
    }

    return model1.id === model2.id;
  }
}
