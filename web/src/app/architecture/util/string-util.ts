
export class StringUtil {

  /** Verifica se uma string está undefined, null ou vazia. */
  static isEmpty(text: string): boolean {
    return !text || text.length === 0;
  }

  /** Verifica se uma string não tem conteúdo. */
  static isBlank(text: string): boolean {
    return (!text || /^\s*$/.test(text));
  }

  /** Verifica se uma string contem algum dígito. */
  static hasNumbers(text: string) {
    return /\d/.test(text);
  }

  /** Verifica se uma string contem alguma letra. */
  static hasLetters(text: string) {
    return /[a-zA-Z]/g.test(text);
  }

  /** Converte os caracteres de quebra de linha de uma string para tags de quebra de linhas de HTML.
   * @param text
   * @returns texto com quebra de linha de HTML
   */
  static convertLineBreaksToHtmlTags(text: string): string {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
  }

  /** Substitue os caracteres de quebra de linha de uma string para caracteres de espaço em branco.
   * @param text
   * @returns string sem quebra de linha
   */
  static convertLineBreaksToWhiteSpaces(text: string): string {
    return text.replace(/(?:\r\n|\r|\n)/g, ' ');
  }

  /** Remove os caracteres de quebra de linha de uma string.
   * @param text
   * @returns string sem quebra de linha
   */
  static removeLineBreaks(text: string): string {
    return text.replace(/(?:\r\n|\r|\n)/g, '');
  }

  /** Faz com que palavras muito longas de uma string sejam quebráveis no HTML.
   * @param text
   * @param maxWordLength
   * @returns string sem palavras longas inquebráveis no HTML
   */
  static avoidUnbreakableLongWordsForHtml(text: string, maxWordLength?: number): string {
    if (maxWordLength == undefined) {
      //  A maior palavra da lingua portuguesa (que ninguem usa) tem menos de 50 caracteres.
      maxWordLength = 50;
    }
    let combinedLetters: number = 0;
    for (let i = 0; i < text.length; i++) {
      if (!/\s/.test(text.charAt(i))) {
        combinedLetters++;
      } else {
        combinedLetters = 0;
      }
      if (combinedLetters > maxWordLength) {
        i -= 1;
        text = text.substring(0, i) + '<wbr>' + text.substring(i);
        i += 5;
        combinedLetters = 0;
      }
    }
    return text;
  }

  /** Verifica se uma string inclue a outra, igorando maiúsculas e minúsculas.
   * @param text
   * @param search
   * @returns Inclue Sim/Não
   */
  static includesIngoreCase(text: string, search: string): boolean {
    return text.toUpperCase().includes(search.toUpperCase());
  }

  /** Remove determinas palavras de uma texto.
   * @param text
   * @param wordsToRemove palavras a serem removidas
   * @returns Texto com determinadas palavras removidas
   */
  static removeWords(text: string, wordsToRemove?: string): string {
    if (wordsToRemove == undefined) {
      wordsToRemove = text;
    }
    let combinedLetters: number = 0;
    for (let i = 0; i <= wordsToRemove.length; i++) {
      if (i < wordsToRemove.length
        && !/\s/.test(wordsToRemove.charAt(i))
      ) {
        combinedLetters++;
      } else if (combinedLetters > 0) {
        const word: string = wordsToRemove.substring(i - combinedLetters, i);
        if (text.startsWith(word + ' ')) {
          text = text.substring(combinedLetters);
        }
        if (text.includes(' ' + word + ' ')) {
          text = text.replace(' ' + word + ' ', ' ');
        }
        if (text.endsWith(' ' + word)) {
          text = text.substring(0, text.length - combinedLetters);
        }
        combinedLetters = 0;
      }
    }
    return text;
  }

  /** Remove palavras no começo do texto.
   * @param text
   * @param dontStartWith palavras a serem removidas do começo do texto
   * @returns Texto sem determinadas palavras no começo
   */
  static removeAtStart(text: string, dontStartWith: string[]): string {
    for (let i = 0; i < dontStartWith.length; i++) {
      const word: string = dontStartWith[i];
      if (text.startsWith(word)) {
        text = text.substring(word.length, text.length);
      }
    }
    return text;
  }

  /** Remove palavras no fim do texto.
   * @param text
   * @param dontEndWith palavras a serem removidas do final do texto
   * @returns Texto sem determinadas palavras no final
   */
  static removeAtEnd(text: string, dontEndWith: string[]): string {
    for (let i = 0; i < dontEndWith.length; i++) {
      const word: string = dontEndWith[i];
      if (text.endsWith(word)) {
        text = text.substring(0, text.length - word.length);
      }
    }
    return text;
  }

  /** Remove palavras no começo e no fim de um determinado texto.
   * @param text
   * @param dontStarOrEndtWith palavras a serem removidas no começo e no final do texto
   * @returns Texto sem determinadas palavras no começo e no final
   */
  static removeAtStartAndEnd(text: string, dontStarOrEndtWith: string[]): string {
    for (let i = 0; i < dontStarOrEndtWith.length; i++) {
      const word: string = dontStarOrEndtWith[i];
      if (text.startsWith(word)) {
        text = text.substring(word.length, text.length);
      }
      if (text.endsWith(word)) {
        text = text.substring(0, text.length - word.length);
      }
    }
    return text;
  }

  /** Remove determinadas palavras no começo ou no fim de um determinado texto.
   * @param text
   * @param dontStarWith palavras a serem removidas no começo do texto
   * @param dontEndWith palavras a serem removidas no final do texto
   * @returns Texto sem determinadas palavras no começo e no final
   */
  static removeAtStartOrEnd(text: string, dontStarWith: string[], dontEndWith: string[]): string {
    if (dontStarWith) {
      text = this.removeAtStart(text, dontStarWith);
    }
    if (dontEndWith) {
      text = this.removeAtEnd(text, dontEndWith);
    }
    return text;
  }

  static compare(x: string, y: string): number {
    if (x) {
      if (y) {
        return x > y ? +1 : x < y ? -1 : 0;
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

  static capitalizeFirstLetter(text: string): string {
    return text.substring(0,1).toUpperCase() + text.substring(1);
  }

  /** Imprime lista, pontuando entre cada item.
   * @param list
   * @returns Lista de itens escrita por extenso
   */
  static printList(list: any[]): string {
    let ret: string = '';

		let count: number = 0;
    for (const item of list) {
      ret += item;
			count++;
			if (count < (list.length - 1)) {
            ret += ', ';
      } else if (count == (list.length - 1)) {
            ret += ' e ';
      }
    }
    return ret;
  }

  /** Descreve os itens de uma lista até um certo ponto.
   * @param list
   * @param minLength         quantidade mínima de caracteres para exibição dos itens
   * @param remainingPlural   texto para quando houver múltiplos itens não exibidos
   * @param remainingSingular texto para quando houver apenas um item não exibido
   * @returns Descrição contendo alguns itens.
   */
  static displaySomeItems(list: any[], minLength?: number, remainingPlural?: string, remainingSingular?: string): string {
    if (!minLength) {
      minLength = 100;
    }
    if (!remainingPlural) {
      remainingPlural = 'itens';
    }
    if (!remainingSingular) {
      remainingSingular = 'item';
    }
    let descricao: string = '';
    for (let i: number = 0; i < list.length; i++) {
      if (i > 0) {
        if ((i + 1) === list.length) {
          descricao += ' e ';
        } else {
          descricao += ', ';
        }
      }
      descricao += list[i];
      if (  descricao.length > minLength
        &&  (i + 1) !== list.length
      ) {
        const restantes = (list.length - (i + 1));
        descricao += ' e mais ' + ((restantes !== 1) ? (restantes + ' ' + remainingPlural) : ('1 ' + remainingSingular));
        break;
      }
    }
    return descricao;
  }

  /** Substitue digitos e letras de uma string por um outro valor.
   * @param text
   * @param replaceWith O que substituirá as letras e digitos.
   * @param firstNonReplaceableChars Quantidades de caracteres para não substituir no início.
   * @returns Texto com letras e digitos substituídos
   */
  static replaceDigitsAndLetters(
    text: string,
    replaceWith?: string,
    firstNonReplaceableChars?: number
  ): string {
    if (text) {
      if (!replaceWith) {
        replaceWith = '';
      }
      if (!firstNonReplaceableChars) {
        firstNonReplaceableChars = 0;
      }

      const array: string[] = [];
      for (let i: number = 0; i < text.length; i++) {
        let c: string  = text.charAt(i);
        if (StringUtil.hasLetters(c) || StringUtil.hasNumbers(c)) {
          if (firstNonReplaceableChars > 0) {
            firstNonReplaceableChars--;
          } else {
            c = replaceWith;
          }
        }
        array.push(c);
      }
      text = array.join('');
    }
    return text;
  }

  static substituirAspasDuplasPorAspasSimples(
    txt: string
  ) : string {
    return txt.replace(/(['"])/g, "\'");
  }

  static getFirstNames(text: string, names?: number) {
    return StringUtil.getFirstWords(text, names, 3);
  }

  static getFirstWords(text: string, words?: number, minLength?: number) {
    if (!words) {
      words = 1;
    }
    if (!minLength) {
      minLength = 1;
    }
    text = text.trim();
    const ret: string[] = [];
    let startingChar: number = 0;
    for (let i = 0; i < text.length + 1; i++) {
      if (/\s/.test(text.charAt(i)) || i === text.length) {
        const wrd: string = text.substring(startingChar, i);
        if (wrd.length >= minLength) {
          ret.push(wrd);
        }
        startingChar = i + 1;
        if (ret.length >= words) {
          break;
        }
      }
    }
    return ret.join(' ');
  }


  public static resizeIfExceedMaxLength(value: string, maxLength: number, ellipsis?: string): string {
    if (!ellipsis) {
      ellipsis = '…';
    }
    return value.length > maxLength
      ? value.substring(0, maxLength - 1) + ellipsis
      : value;
  }

}
