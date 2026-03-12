import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Recette } from '../../models/recette.model';
import { RecetteService } from '../../services/recette.service';
@Component({
  selector: 'app-recipe-manager-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-manager-page.html',
  styleUrl: './recipe-manager-page.css',
})
export class RecipeManagerPage implements OnInit {
  // Objet temporaire pour l'ajout ou la modification
  public recetteSelectionne: Recette | null = null;
  // 1. Déclaration du tableau de stockage des recettes
  public recettes: Recette[] = [];
  // 2. Injection du service :
  constructor(private recetteService: RecetteService) { }
  // 3. Méthode d'initialisation du composant :
  ngOnInit(): void {
    this.getRecette();
  }
  /***
    * Méthode d'appel du service pour récupérer les données par l'API
    */
  getRecette(): void {
    this.recetteService.getRecette().subscribe({
      next: (data) => {
        this.recettes = data;
        console.log("Recettes récupérés avec succès !")
      },
      error: (err) => {
        console.error("Erreur API : ", err);
      }
    });
  }
  // /** Préparer l'ajout d'un nouvel recette (ligne vide) */
  // creerNouvelleRecette(): void {
  //   this.recetteSelectionne = {
  //     id: 0, titre: '',description: '', surgraissage: 0, apportEnEau: 0, avecSoude: true,
  //     qteAlcalin: 0, tenueMousse: 0, douceur: 0,
  //     lavant: 0, durete: 0, solubilite: 0, sechage: 0,
  //     estCorpsGras: true
  //   };
  // }
  // /** Lancer l'édition d'une ligne existante */
  // editerRecette(item: Recette): void {
  //   // On crée une copie pour éviter de modifier le tableau original avant validation
  //   this.recetteSelectionne = { ...item };
  // }
  // /** Enregistrer (Ajout ou Update) */
  // saveRecette(): void {
  //   if (!this.recetteSelectionne) return;
  //   const action = this.recetteSelectionne.id === 0
  //     ? this.recetteService.addRecette(this.recetteSelectionne)
  //     : this.recetteService.updateRecette(this.recetteSelectionne);
  //   action.subscribe({
  //     next: () => {
  //       this.recetteSelectionne = null;
  //       this.getRecette(); // Rafraîchir la liste
  //     }
  //   });
  // }
  /** Supprimer un recette */
  deleteRecette(id: number): void {
    if (confirm("Supprimer cette recette ?")) {
      this.recetteService.deleteRecette(id).subscribe(() =>
        this.getRecette());
    }
  }
}
