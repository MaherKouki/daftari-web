import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadState } from './me.service';

export interface SchoolClassDto {
  id: number;
  level: number;
  name: string;
  schoolYear: string;
  subjects: string[];
  createdAt: string;
}

export interface ClassRequest {
  level: number;
  name: string;
  subjects: string[];
}

/** Classes de l'enseignante connectée. Fourni au niveau de la route /app (voir MeService). */
@Injectable()
export class ClassesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/v1`;

  readonly classes = signal<SchoolClassDto[]>([]);
  readonly state = signal<LoadState>('idle');

  async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.classes.set(await firstValueFrom(this.http.get<SchoolClassDto[]>(`${this.base}/classes`)));
      this.state.set('ready');
    } catch {
      this.state.set('error');
    }
  }

  async ensureLoaded(): Promise<void> {
    if (this.state() === 'idle') await this.load();
  }

  async create(request: ClassRequest): Promise<SchoolClassDto> {
    const created = await firstValueFrom(this.http.post<SchoolClassDto>(`${this.base}/classes`, request));
    await this.load();
    return created;
  }

  async archive(id: number): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${this.base}/classes/${id}/archive`, {}));
    this.classes.update((list) => list.filter((c) => c.id !== id));
  }

  defaultSubjects(): Promise<string[]> {
    return firstValueFrom(this.http.get<string[]>(`${this.base}/subjects/defaults`));
  }
}