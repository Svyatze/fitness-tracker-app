import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";


@Injectable()
export class UiService {
  constructor(
    private snackBar: MatSnackBar
  ) {
  }

  loadingStateChanged = new Subject<boolean>();

  showSnackBar(message: string, action?: string | undefined, duration?: number) {
    this.snackBar.open(message, action, {duration})
  }
}
