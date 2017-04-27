export interface MyGlobal {

}

export abstract class GlobalRef {
  abstract get nativeGlobal(): MyGlobal;
}

export class BrowserGlobalRef extends GlobalRef {
  get nativeGlobal(): MyGlobal {
  	return window as MyGlobal;
  }
}
