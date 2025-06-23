import { BaseModel } from "./base-model";


export class ModelImport extends BaseModel {

  value: string;
  label: string;

  constructor() {
    super();
    this.value = null;
    this.label = null;
  }

}