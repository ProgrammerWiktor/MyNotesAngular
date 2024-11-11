import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css'],
})
export class AddNoteComponent {
  isFormShown: boolean = false;
  @Output() refreshNotes = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private notesService: NotesService
  ) {}

  newNoteForm = this.formBuilder.group({
    title: '',
    content: '',
  });

  toggle() {
    this.isFormShown = !this.isFormShown;
  }

  onSubmit() {
    const titleControl: FormControl = this.newNoteForm?.controls['title'];
    const titleValue: string = titleControl?.value || '';

    const contentControl: FormControl = this.newNoteForm?.controls['content'];
    const contentValue: string = contentControl?.value || '';

    if (titleValue.length > 0 || contentValue.length > 0) {
      this.notesService.addNewNote(this.newNoteForm);
    }

    this.newNoteForm.reset();
    this.toggle();
  }
}