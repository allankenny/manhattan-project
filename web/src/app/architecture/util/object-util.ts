export class ObjectUtil {

  static isNull(obj: any): boolean {
    return obj === undefined || obj === null;
  }

  static isNotNull(obj: any): boolean {
    return !this.isNull(obj);
  }

  public static isDefined(dado: any): boolean {
    return (dado) && (dado !== 'undefined') && (dado !== 'null');
  }

  public static isBlank(dado: any): boolean {
    const text: string = dado + '';
    return !text.length || !text.trim().length;
  }

  public static isEmpty(dado: any): boolean {
    return (!ObjectUtil.isDefined(dado)) || (this.isBlank(dado));
  }

  public static isNotEmpty(dado: any): boolean {
    return !ObjectUtil.isEmpty(dado);
  }

  /** Compara os objetos utilizando o critérios que valores null ficam por último.
   * Utilizado para ordenações onde é preciso realizar nullchecks em variáveis.
   *
   * @param x primeira variável
   * @param y segunda variável
   * @returns
   * - Valor negativo (-1) se a primeira variável for null e a segunda não.
   * - Valor zero (0) se ambas forem null;
   * - Valor zero (0) se ambas não forem null;
   * - Valor positivo (+1) se a primeira variável não for null e a segunda for;
   */
  static compare(x: any, y: any): number {
    if (x) {
      if (y) {
        return 0;
      } else {
        return +1;
      }
    } else {
      if (y) {
        return -1;
      } else {
        return 0;
      }
    }
  }

}
