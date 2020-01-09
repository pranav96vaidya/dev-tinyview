import { Action } from '@ngrx/store';

export const EDIT_TITLE  = 'Edit';


export class EditText implements Action {
  readonly type = EDIT_TITLE;

  constructor(public payload: string) {}
}

export type All
  = EditText;
