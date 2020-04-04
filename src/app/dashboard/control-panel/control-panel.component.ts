import { Component, OnChanges, Output, EventEmitter, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Subscription, Observable, BehaviorSubject, interval, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, takeWhile, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.css'],
})
export class ControlPanelComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Output() selectDataType: EventEmitter<string> = new EventEmitter<string>();

    @Output() selectDate: EventEmitter<number> = new EventEmitter<number>();

    @Input() maxDate: number; 

    sliderValue: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    sliderValueObservable: Observable<number> = this.sliderValue.asObservable();
    
    myRange: HTMLElement;
    onSliderSub: Subscription;
    isSliderDisabled: Boolean = false;
    isPlaying: Boolean = false;

    playCounter$ = interval(500);
    stopClick$;

    constructor() {
        this.sliderValueObservable.pipe(
            map(value => {
                return +value;
            }),
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(x => {
            this.selectDate.emit(x);
        });

    }

    ngOnChanges() {

    }

    ngAfterViewInit() {
        this.stopClick$ = fromEvent(document.getElementById('stop-button'), 'click'); 
    }
    
    ngOnDestroy() {
    }


    onDataTypeSelected(event) {
        this.selectDataType.emit(event.target.value);
    }

    onClickPlay() {
        this.isPlaying = true;
        this.isSliderDisabled = true;
        this.playCounter$.pipe(
            takeWhile(value => value <= this.maxDate),
            takeUntil(this.stopClick$)
        ).subscribe({
            next: (value) => {
                this.sliderValue.next(value);
            },
            error: err => {
                console.log(err);
            },
            complete: () => {
                this.isPlaying = false;
                this.isSliderDisabled = false;
            }
        })
        
    }


}