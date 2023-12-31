import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Exercise} from "../exercise.model";
import {UiService} from "../../shared/ui.service";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  //@ts-ignore
  exercises: Exercise[];
  isLoading = true;
  private exerciseSubscription: Subscription = new Subscription();
  private loadingSubscription = new Subscription();

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService
  ) {
  }

  ngOnInit() {
    this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading
    });
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (
        this.exercises = exercises
      )
    );
    this.fetchExercises();
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
