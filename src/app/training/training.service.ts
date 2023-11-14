import {Exercise} from "./exercise.model";
import {Injectable} from "@angular/core";
import {Subject, Subscription} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";
import {UiService} from "../shared/ui.service";

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  //@ts-ignore
  private runningExercise: Exercise | null;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) {
  }

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges().pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              //@ts-ignore
              ...doc.payload.doc.data()
            };
          })
        })
      ).subscribe((exercises: Exercise[]) => {
        this.uiService.loadingStateChanged.next(false);
        this.availableExercises = exercises
        this.exercisesChanged.next([...this.availableExercises])
      }))
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({ lastSelected: new Date()})
    this.runningExercise = <Exercise>this.availableExercises.find(
      ex => ex.name === selectedId
    );
    this.exerciseChanged.next({...this.runningExercise});

  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise!,
      date: new Date(),
      state: 'completed'
    })
    this.runningExercise = null;
    // @ts-ignore
    this.exerciseChanged.next(null)
  }

  cancelExercise(progress: number) {
    //@ts-ignore
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise!.duration * (progress / 100),
      calories: this.runningExercise!.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    })
    this.runningExercise = null;
    // @ts-ignore
    this.exerciseChanged.next(null)
  }

  getRunningExercise() {
    return {
      ...this.runningExercise
    }
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((value: unknown[]) => {
        const exercises = value as Exercise[];
        this.finishedExercisesChanged.next(exercises);
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(subscription => subscription.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
