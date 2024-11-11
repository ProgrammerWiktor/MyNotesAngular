import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { Note } from 'src/app/shared/Note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent {
  @Input() note!: Note;
  @Output() refreshNotes = new EventEmitter();

  constructor(private notesService: NotesService) {}

  deleteNote(event: MouseEvent) {
    event.stopPropagation();

    if (this.note.key !== undefined) {
      this.notesService.deleteNoteById(this.note.key).subscribe({
        next: () => {},
        error: () => alert('Nie udało się usunąć notatki'),
        complete: () => this.refreshNotes.emit()
      });
    }
  }
}
