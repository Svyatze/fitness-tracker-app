import {NgModule} from "@angular/core";
import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
  ],
  imports: [
    SharedModule,
    provideAuth(() => getAuth()),
  ],
  exports: []
})
export class AuthModule {

}
