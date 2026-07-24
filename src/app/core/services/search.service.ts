import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { DECLARATION_STATUS_LABELS, CERTIFICATE_TYPE_LABELS } from '../models';
import { GlobalSearchResults, SearchResultItem } from '../models/search.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/search`;

  search(term: string): Observable<GlobalSearchResults> {
    const params = new HttpParams().set('q', term);
    return this.http.get<GlobalSearchResults>(this.baseUrl, { params });
  }

  /** Aplati les résultats groupés du backend en une liste unique prête à afficher. */
  toResultItems(results: GlobalSearchResults): SearchResultItem[] {
    const items: SearchResultItem[] = [];

    for (const agent of results.agents) {
      items.push({
        category: 'agent',
        id: agent.id,
        icon: 'badge',
        title: `${agent.firstName} ${agent.lastName}`,
        subtitle: `Agent • ${agent.matricule}`,
        routerLink: ['/agents'],
      });
    }

    for (const doctor of results.doctors) {
      items.push({
        category: 'doctor',
        id: doctor.id,
        icon: 'medical_services',
        title: `Dr ${doctor.firstName} ${doctor.lastName}`,
        subtitle: `Médecin • ${doctor.specialty}`,
        routerLink: ['/doctors'],
      });
    }

    for (const declaration of results.declarations) {
      const agentName = declaration.agent ? `${declaration.agent.firstName} ${declaration.agent.lastName}` : '';
      items.push({
        category: 'declaration',
        id: declaration.id,
        icon: 'assignment',
        title: declaration.number,
        subtitle: [DECLARATION_STATUS_LABELS[declaration.status], agentName].filter(Boolean).join(' • '),
        routerLink: ['/declarations'],
      });
    }

    for (const certificate of results.certificates) {
      items.push({
        category: 'certificate',
        id: certificate.id,
        icon: 'verified',
        title: certificate.declaration?.number ?? 'Certificat',
        subtitle: `Certificat • ${CERTIFICATE_TYPE_LABELS[certificate.type]}`,
        routerLink: ['/certificates'],
      });
    }

    return items;
  }
}
