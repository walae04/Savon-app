import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';
import { IngredientService } from '../../services/ingredient.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-ingredient-manager-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './ingredient-manager-page.html',
  styleUrl: './ingredient-manager-page.css',
})
export class IngredientManagerPage implements OnInit {
  // Objet temporaire pour l'ajout ou la modification
  public ingredientSelectionne: Ingredient | null = null;
  // 1. Déclaration du tableau de stockage des ingrédients
  public ingredients: Ingredient[] = [];
  // Filtre corps gras : true = afficher uniquement les corps gras, false = tout afficher
  public afficherCorpsGras: boolean = false;
  // Propriété pour le suivi de l'import
  public importMessage: string = '';
  // 2. Injection du service :
  constructor(private ingredientService: IngredientService) { }
  // 3. Méthode d'initialisation du composant :
  ngOnInit(): void {
    this.getIngredients();
  }
  /***
  * Méthode d'appel du service pour récupérer les données par l'API
  */
  getIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => {
        this.ingredients = data;
        console.log("Ingrédients récupérés avec succès !")
      },
      error: (err) => {
        console.error("Erreur API : ", err);
      }
    });
  }
  /** Préparer l'ajout d'un nouvel ingrédient (ligne vide) */
  creerNouvelIngredient(): void {
    this.ingredientSelectionne = {
      id: 0, nom: '', sapo: 0, ins: 0, iode: 0,
      volMousse: 0, tenueMousse: 0, douceur: 0,
      lavant: 0, durete: 0, solubilite: 0, sechage: 0,
      estCorpsGras: true
    };
  }
  /** Lancer l'édition d'une ligne existante */
  editerIngredient(item: Ingredient): void {
    // On crée une copie pour éviter de modifier le tableau original avant validation
    this.ingredientSelectionne = { ...item };
  }
  /** Enregistrer (Ajout ou Update) */
  saveIngredient(): void {
    if (!this.ingredientSelectionne) return;
    const action = this.ingredientSelectionne.id === 0
      ? this.ingredientService.addIngredient(this.ingredientSelectionne)
      : this.ingredientService.updateIngredient(this.ingredientSelectionne);
    action.subscribe({
      next: () => {
        this.ingredientSelectionne = null;
        this.getIngredients(); // Rafraîchir la liste
      }
    });
  }
  /** Supprimer un ingrédient */
  deleteIngredient(id: number): void {
    if (confirm("Supprimer cet ingrédient ?")) {
      this.ingredientService.deleteIngredient(id).subscribe(() =>
        this.getIngredients());
    }
  }
  get ingredientsFiltres(): Ingredient[] {
    if (this.afficherCorpsGras) {
      return this.ingredients.filter(i => i.estCorpsGras === true);
    }
    return this.ingredients;
  }
  /**
 * Déclenché quand l'utilisateur choisit un fichier CSV
 */
onImportCSV(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const fichier = input.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const contenu = e.target?.result as string;
    this.parseEtImporterCSV(contenu);
  };

  reader.readAsText(fichier, 'UTF-8');
}

/**
 * Parse le contenu CSV et envoie chaque ligne à l'API
 */
parseEtImporterCSV(contenu: string): void {
  const lignes = contenu.trim().split('\n');
  // On ignore la 1ère ligne (en-têtes)
  const donnees = lignes.slice(1);

  let compteur = 0;

  donnees.forEach(ligne => {
    const cols = ligne.split(',');

    // Correspondance avec les colonnes du CSV
    const ingredient: Ingredient = {
      id: 0,
      nom:         cols[1].trim(),
      iode:        parseFloat(cols[2]),
      ins:         parseFloat(cols[3]),
      sapo:        parseFloat(cols[4]),
      volMousse:   parseFloat(cols[5]),
      tenueMousse: parseFloat(cols[6]),
      douceur:     parseFloat(cols[7]),
      lavant:      parseFloat(cols[8]),
      durete:      parseFloat(cols[9]),
      solubilite:  parseFloat(cols[10]),
      sechage:     parseFloat(cols[11]),
      estCorpsGras: cols[12].trim().toLowerCase() === 'true'
    };

    this.ingredientService.addIngredient(ingredient).subscribe({
      next: () => {
        compteur++;
        // Quand tous les ingrédients sont importés, on rafraîchit
        if (compteur === donnees.length) {
          this.importMessage = `✅ ${compteur} ingrédients importés avec succès !`;
          this.getIngredients();
        }
      },
      error: (err) => {
        console.error('Erreur import ligne :', err);
        this.importMessage = '❌ Erreur lors de l\'import.';
      }
    });
  });
}
}
