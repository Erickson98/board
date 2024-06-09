import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appAutoResize]',
  standalone: true,
})
export class AutoResizeDirective {
  @Input() externalHeight = 0;
  @Output() enterPressed = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  @HostListener('input')
  onInput(): void {
    console.log('first');
    this.adjust();
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    console.log('first');
    this.enterPressed.emit();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('first');
  }
  ngOnInit() {
    console.log('first');
    this.setFocus();

    this.adjust(this.externalHeight);
  }
  ngAfterViewInit(): void {
    this.adjust(this.externalHeight + 10);

    this.setFocus();
    console.log('first');
  }
  private adjustHeight(): void {
    const textarea = this.elementRef.nativeElement;
    this.renderer.setStyle(textarea, 'height', `${this.externalHeight}px`);
  }
  private setFocus(): void {
    const textarea = this.elementRef.nativeElement;
    textarea.focus();
  }
  private adjust(h3Heigth = 0): void {
    const textarea = this.elementRef.nativeElement;
    this.renderer.setStyle(textarea, 'height', 'auto');
    if (h3Heigth === 0) {
      this.renderer.setStyle(textarea, 'height', `${textarea.scrollHeight}px`);
      return;
    }
    this.renderer.setStyle(textarea, 'height', `${this.externalHeight}px`);

    console.log(this.externalHeight);
  }
}
