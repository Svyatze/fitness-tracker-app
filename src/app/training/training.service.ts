import { Exercise } from "./exercise.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map } from "rxjs/operators";

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();
    exercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    //@ts-ignore
    private runningExercise: Exercise | undefined | null;
    private exercises: Exercise[] = [];

    constructor(
        private db: AngularFirestore
    ) {
    }

    fetchAvailableExercises() {
        this.db
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
                this.availableExercises = exercises
                this.exercisesChanged.next([...this.availableExercises])
        })
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(
            ex => ex.id === selectedId
        );
        // @ts-ignore
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.exercises.push({
            ...this.runningExercise!,
            date: new Date(),
            state: 'completed'
        })
        this.runningExercise = null;
        this.exerciseChanged.next(null)
    }

    cancelExercise(progress: number) {
        this.exercises.push({
            ...this.runningExercise!,
            duration: this.runningExercise?.duration! * (progress / 100),
            calories: this.runningExercise?.calories! * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        })
        this.runningExercise = null;
        this.exerciseChanged.next(null)
    }

    getRunningExercise() {
        return {
            ...this.runningExercise
        }
    }

    getCompletedOrCancelledExercises() {
        return this.exercises.slice();
    }
}
