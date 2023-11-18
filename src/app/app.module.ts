import {NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import {WelcomeComponent} from './welcome/welcome.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './navigation/header/header.component';
import {SidenavListComponent} from './navigation/sidenav-list/sidenav-list.component';
import {AuthService} from "./auth/auth.service";
import {TrainingService} from "./training/training.service";
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {UiService} from "./shared/ui.service";
import {AuthModule} from "./auth/auth.module";
import {TrainingModule} from "./training/training.module";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HammerModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    TrainingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),

  ],
  providers: [
    AuthService,
    TrainingService,
    UiService,
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
