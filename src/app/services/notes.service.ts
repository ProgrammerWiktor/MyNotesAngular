import { Injectable } from '@angular/core';
import { Note } from '../shared/Note';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, exhaustMap, take } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  notesChanged = new Subject<Note[]>();
  notes: Note[] = [];

  userId: string = '';
  userToken: string = '';

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getNotes(): void {
    this.authService.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<Note[]>(`https://mynotes-1aa60-default-rtdb.europe-west1.firebasedatabase.app/${user?.id}/notes.json`,
      {
        params: new HttpParams().set('auth', new String(user?.token).toString())
      });
    })).subscribe(notes => {
      this.notes = Object.entries(notes ?? []).map(([key, note]) => ({ key, ...note }));
      this.notesChanged.next(this.notes ?? []);
    });
  }

  getNoteById(noteId: string): Observable<Note> {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<Note>(`https://mynotes-1aa60-default-rtdb.europe-west1.firebasedatabase.app/${user?.id}/notes/${noteId}.json`,
      {
        params: new HttpParams().set('auth', new String(user?.token).toString())
      });
    }))
  }

  addNewNote(newNoteForm: FormGroup): void {
    let newNote: Note = new Note();
    newNote.title = newNoteForm.controls['title'].value;
    newNote.content = newNoteForm.controls['content'].value;

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.userId = new String(user?.id).toString();
      this.userToken = new String(user?.token).toString();
    });

    this.http
      .post(
        `https://mynotes-1aa60-default-rtdb.europe-west1.firebasedatabase.app/${this.userId}/notes.json`,
        newNote,
        {
          params: new HttpParams().set('auth', this.userToken),
        }
      )
      .subscribe({
        next: () => {},
        error: () => alert('Nie udało się dodać notatki'),
        complete: () => this.getNotes()
      });
  }

  deleteNoteById(noteId: string): Observable<null> {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.userId = new String(user?.id).toString();
      this.userToken = new String(user?.token).toString();
    });

    return this.http.delete<null>(`https://mynotes-1aa60-default-rtdb.europe-west1.firebasedatabase.app/${this.userId}/notes/${noteId}.json`,
    {
      params: new HttpParams().set('auth', this.userToken),
    });
  }

  editNote(noteId: string, noteTitle: string, noteContent: string): Observable<Note> {
    let newNote: Note = new Note();
    newNote.title = noteTitle;
    newNote.content = noteContent;
    
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.userId = new String(user?.id).toString();
      this.userToken = new String(user?.token).toString();
    });

    return this.http.put<Note>(`https://mynotes-1aa60-default-rtdb.europe-west1.firebasedatabase.app/${this.userId}/notes/${noteId}.json`,
    newNote,
    {
      params: new HttpParams().set('auth', this.userToken),
    });
  }
}