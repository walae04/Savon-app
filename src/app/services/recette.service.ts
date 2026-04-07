import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recette } from '../models/recette.model';
import { RecetteFormDTO } from '../models/dto.model';

@Injectable({
  providedIn: 'root',
})
export class RecetteService {
  // URL de base de notre API :
  private readonly API_URL_Recette = 'http://localhost:8080/api-savon/v1/recette';
  constructor(private http: HttpClient) { }
  /**
* Récupère la liste de tous les recettes depuis le backend. 
* @returns Un Observable contenant le tableau des recettes.
*/
  getRecette(): Observable<Recette[]> {
    return this.http.get<Recette[]>(this.API_URL_Recette);
  }
  /**
    * Récupère un ingrédient spécifique par son identifiant.
    * @param id L'identifiant de l'ingrédient
    */
  getRecetteById(id: number): Observable<Recette> {
    return this.http.get<Recette>(`${this.API_URL_Recette}/${id}`);
  }
  /**
* Enregistre une nouvelle recette.
* @param recette - L'objet Recette à enregistrer.
* @returns Un Observable contenant la recette enregistrée.
*/
createRecette(recette: RecetteFormDTO): Observable<Recette> {
  console.log(recette);
  
return this.http.post<Recette>(this.API_URL_Recette, recette);
}
  /** * Met à jour un ingrédient existant.
*/
  updateRecette(recette: Recette): Observable<Recette> {
    return this.http.put<Recette>
      (`${this.API_URL_Recette}/${recette.id}`, recette);
  }
  /** * Supprime un ingrédient par son ID.
  */
  deleteRecette(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL_Recette}/${id}`);
  }
  /** * Supprime tous les ingrédients de la base.
  */
  deleteAllRecettes(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL_Recette}/all`);
  }
}
