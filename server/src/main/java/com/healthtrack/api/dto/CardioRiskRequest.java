package com.healthtrack.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Données saisies par le patient pour l'évaluation du risque cardiovasculaire.
 * Les bornes correspondent à celles validées côté service IA (double garde-fou).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardioRiskRequest {

    @Min(1) @Max(120)
    private double ageYears;

    @Min(1) @Max(2)          // 1=femme, 2=homme (codage du dataset)
    private int gender;

    @Min(120) @Max(220)
    private double height;   // cm

    @Min(30) @Max(300)
    private double weight;   // kg

    @Min(70) @Max(250)
    private int apHi;        // tension systolique

    @Min(40) @Max(200)
    private int apLo;        // tension diastolique

    @Min(1) @Max(3)
    private int cholesterol; // 1=normal, 2=élevé, 3=très élevé

    @Min(1) @Max(3)
    private int gluc;

    @Min(0) @Max(1)
    private int smoke;

    @Min(0) @Max(1)
    private int alco;

    @Min(0) @Max(1)
    private int active;
}
