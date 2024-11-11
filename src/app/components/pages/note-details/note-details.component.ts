import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes.service';
import { Note } from 'src/app/shared/Note';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.css'],
})
export class NoteDetailsComponent implements OnInit {
  note: Note = new Note();
  isDeleting: boolean = false;
  isEditing: boolean = false;
  isNoteNotFound: boolean = false;
  noteId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private notesService: NotesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['noteId']) {
        this.noteId = params['noteId'];

        this.notesService.getNoteById(this.noteId).subscribe({
          next: result => this.note = result,
          error: () => alert('Nie udało się pobrać notatki')
        });
      }
    });
  }

  deleteNote(): void {
    this.isDeleting = true;

    if (this.noteId !== undefined)
    this.notesService.deleteNoteById(this.noteId).subscribe({
      next: () => this.isDeleting = false,
      error: () => {
        this.isDeleting = false;
        alert('Nie udało się usunąć notatki');
      },
      complete: () => this.router.navigate(['/notes'])
    });
  }

  editNote(noteTitle: string, noteContent: string) {
    if (noteTitle !== this.note.title || noteContent !== this.note.content) {
      this.isEditing = true;
      
      this.notesService.editNote(this.noteId, noteTitle, noteContent).subscribe({
        next: () => this.isEditing = false,
        error: () => {
          this.isEditing = false;
          alert('Nie udało się edytować notatki')
        },
        complete: () => this.router.navigate(['/notes'])
      });
    }
  }
}
