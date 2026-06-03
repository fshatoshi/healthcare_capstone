# Task for **Francois** – Implémentation des fonctionnalités (FR)

> **Action à réaliser avant jeudi 28 mai 2026** : créer une branche de travail séparée et pousser les changements (`git push`) avant le jeudi suivant.

## Branch à créer
par exemple  : 
```bash
git checkout -b feature/patient-doctor-communication 
```

> **Ne pas** utiliser les branches déjà existantes.

---

| **Feature** | **Description** | **Règles métier** | **Interfaces concernées** |
|------------|-----------------|-------------------|---------------------------|
| **0 – Liaison patient ↔ médecin** | Un·e médecin voit les patients **sans médecin assigné** et peut les **assigner**. | • Un patient ne possède **qu’un seul** médecin.<br>• Un médecin peut être assigné à **plusieurs** patients.<br>• Dès qu’un patient est assigné, il disparaît de la liste « sans médecin ».<br>• L’assignation ouvre la **Feature 1**. | • **Doctor Dashboard** (liste des patients non assignés, bouton “Assign”).<br>• **Patient Profile** (affichage du médecin assigné). |
| **1 – Communication patient ↔ médecin** | Boîte de messagerie privée **texte** et **voix** entre le patient et son médecin. | • Les messages sont **isolés** : aucun croisement entre patients.<br>• Historique complet (type chat) stocké côté serveur (MongoDB).<br>• Les messages vocaux sont sauvegardés comme fichiers media et référencés dans le même thread.<br>• La boîte se charge à l’ouverture de la conversation et se met à jour en temps réel (WebSocket/FCM). | • **Patient Message Center** (liste de threads, affichage chronologique).<br>• **Doctor Message Center** (vue du même thread du point de vue du médecin). |
| **2 – Multilingue (FR / AR)** | L’interface propose les langues **français** et **arabe**. | • Texte affiché selon le **langage choisi** par l’utilisateur (switch UI).<br>• Traductions gérées via **i18n** (ex. `react‑i18next`).<br>• Tous les libellés, placeholders, dates sont traduits. | • **Toute l’application** (dashboards, formulaires, messages, etc.).<br>• Sélecteur de langue dans le menu principal. |

---

*Instructions* :
1. Créez la branche indiquée ci‑dessus.
2. Ajoutez les changements nécessaires au code.
3. Commitez (`git add . && git commit -m "implémentation features FR"`).
4. Poussez la branche avant le **jeudi 28 mai 2026** (`git push -u origin feature/patient-doctor-communication`).
