
export interface StudentInput {
  Sexe: string;
  Série: string;
  Age_en_Décembre_2018: number;
  MATH: number;
  SCPH: number;
  FR: number;
  PHILO: number;
  AN: number;
  Moy_nde: number;
  Moy_ère: number;
  Moy_S_Term: number;
  Moy_S_Term_1: number;
  Moy_Gle: number;
  Moy_sur_Mat_Fond: number;
  Année_BAC: number;
  Nbre_Fois_au_BAC: number;
  Mention: string;
  Groupe_Résultat: number;
  Tot_Pts_au_Grp: number;
  Moyenne_au_Grp: number;
  Résidence: string;
  Ets_de_provenance: string;
  Centre_Ec: string;
  Académie_de_Ets_Prov: string;
  REGION_DE_NAISSANCE: string;
}

export interface PredictionResponse {
  status: string;
  score: number;
  probability: number;
  details: {
    score_percentage: number;
    base_probability: number;
    mention_bonus: number;
    serie_bonus: number;
  };
  recommendation: string;
}


export interface PredictionResponseV2 {
  status: string;
  score: number;
  orientation_probability: number;
  success_probability: number;
  orientation_probability_message: string;
  success_probability_message : string;


  // details: {
  //   score_percentage: number;
  //   base_probability: number;
  //   mention_bonus: number;
  //   serie_bonus: number;
  // };
  // recommendation: string;
}
