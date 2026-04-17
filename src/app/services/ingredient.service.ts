import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {

  private readonly API_URL_INGREDIENT = 'http://localhost:8080/api-savon/v1/ingredient';
  private readonly TOKEN_KEY = 'savapp_jwt_token';

  constructor(private http: HttpClient) { }

  /**
   * Construit les headers HTTP avec le token JWT
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /** Récupère la liste de tous les ingrédients */
  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.API_URL_INGREDIENT,
      { headers: this.getHeaders() });
  }

  /** Récupère un ingrédient par son id */
  getIngredientById(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.API_URL_INGREDIENT}/${id}`,
      { headers: this.getHeaders() });
  }

  /** Ajoute un nouvel ingrédient */
  addIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.API_URL_INGREDIENT, ingredient,
      { headers: this.getHeaders() });
  }

  /** Met à jour un ingrédient existant */
  updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.API_URL_INGREDIENT}/${ingredient.id}`, ingredient,
      { headers: this.getHeaders() });
  }

  /** Supprime un ingrédient par son ID */
  deleteIngredient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL_INGREDIENT}/${id}`,
      { headers: this.getHeaders() });
  }

  /** Supprime tous les ingrédients */
  deleteAllIngredients(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL_INGREDIENT}/all`,
      { headers: this.getHeaders() });
  }
}