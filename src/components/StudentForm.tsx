import { useState, useEffect } from "react";
import {Academie, Region, StudentInput} from "@/types/student";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {buildApiUrl} from "@/config/api.ts";

interface StudentFormProps {
  onSubmit: (data: StudentInput) => Promise<void>;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [regions, setRegions] = useState<Region[]>([]);
  const [academies, setAcademies] = useState<Academie[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

  const [formData, setFormData] = useState<StudentInput>({
    Année_BAC: 2018,
    Groupe_Résultat: 1,
    Mention: "",
    Nbre_Fois_au_BAC: 1,
    Tot_Pts_au_Grp: 0,
    Sexe: "",
    Série: "",
    Age_en_Décembre_2018: undefined,
    MATH: undefined,
    SCPH: undefined,
    FR: undefined,
    PHILO: undefined,
    AN: undefined,
    Moy_nde: 10,
    Moy_ère: 10,
    Moy_S_Term: 10,
    Moy_S_Term_1: 10,
    Moy_Gle: undefined,
    Moy_sur_Mat_Fond: undefined,
    Moyenne_au_Grp: undefined,
    Résidence: "",
    Ets_de_provenance: "",
    Centre_Ec: "",
    Académie_de_Ets_Prov: "",
    REGION_DE_NAISSANCE: "",
    SVT: undefined,
    HG: undefined,
    EPS: undefined,
    AFTA: undefined,
    COME: undefined,
    Moyenne_BAC: undefined,
    isInapteEPS: false,
  });

  const validateField = (name: string, value: string | number | undefined): string | null => {
    // if (value === undefined || value === "") return "Ce champ est obligatoire.";

    const numericFields = ["MATH", "SCPH", "FR", "PHILO", "AN", "Moy_nde", "Moy_ère", "Moy_S_Term", "Moy_S_Term_1"];
    if (numericFields.includes(name) && (value < 1 || value > 20)) {
      return "La valeur doit être comprise entre 1 et 20.";
    }

    // Validation spécifique pour la moyenne de seconde
    if (name === "Moy_nde" && value < 9.5) {
      return "La moyenne de seconde doit être supérieure à 9,5 pour passer en première";
    }

    // Validation spécifique pour la moyenne de première
    if (name === "Moy_ère" && value < 9.5) {
      return "La moyenne de première doit être supérieure à 9,5 pour passer en terminale";
    }

    if (name === "Age_en_Décembre_2018" && (value < 15 || value > 23)) {
      return "L'âge doit être entre 15 et 23 ans.";
    }

    return null;
  };

  const loadRegions = async () => {
    try {
      const response = await fetch(buildApiUrl("/regions/"));
      if (!response.ok) throw new Error("Erreur lors du chargement des régions");
      const data = await response.json();
      setRegions(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les régions",
        variant: "destructive",
      });
    }
  };

  const loadAcademies = async (regionId: number) => {
    try {
      const response = await fetch(buildApiUrl(`/regions/${regionId}/academies`));
      if (!response.ok) throw new Error("Erreur lors du chargement des académies");
      const data = await response.json();
      setAcademies(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les académies",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadRegions();
  }, []);

  // const validateCurrentStep = (): boolean => {
  //   const fieldsToValidate: string[] =
  //       step === 1 ? ["Sexe", "Age_en_Décembre_2018", "Résidence", "Académie_de_Ets_Prov"] :
  //           step === 2 ? ["Moy_nde", "Moy_ère", "Moy_S_Term", "Moy_S_Term_1"] :
  //               ["MATH", "SCPH", "FR", "PHILO", "AN", "Série"];
  //
  //   return fieldsToValidate.every(field => validateField(field, formData[field]) === null);
  // };

  // Remplacer la validation du step 3 dans validateCurrentStep
  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 1:
        return ["Sexe", "Age_en_Décembre_2018", "Résidence", "Académie_de_Ets_Prov"]
            .every(field => validateField(field, formData[field]) === null);
      case 2:
        return ["Moy_nde", "Moy_ère", "Moy_S_Term", "Moy_S_Term_1"]
            .every(field => validateField(field, formData[field]) === null);
      case 3:
        return validateStep3();
      default:
        return false;
    }
  };

  const validateStep3 = (): boolean => {
    // Si la série n'est pas sélectionnée, retourner false
    if (!formData.Série) return false;

    // Vérifier les champs de base requis pour toutes les séries
    const baseFields = ["MATH", "SCPH", "FR", "PHILO", "AN"];
    const baseFieldsValid = baseFields.every(field =>
        validateField(field, formData[field]) === null
    );
    if (!baseFieldsValid) return false;

    // Validation spécifique selon la série
    switch (formData.Série) {
      case "S1":
      case "S2": {
        // Vérifier les champs supplémentaires pour S1 et S2
        const additionalFields = ["SVT", "HG"];
        const additionalFieldsValid = additionalFields.every(field =>
            validateField(field, formData[field]) === null
        );
        if (!additionalFieldsValid) return false;

        // Vérifier EPS sauf si inapte
        if (!formData.isInapteEPS && !formData.EPS) return false;
        break;
      }
      case "S3": {
        // Vérifier les champs supplémentaires pour S3
        const s3Fields = ["COME", "AFTA"];
        const s3FieldsValid = s3Fields.every(field =>
            validateField(field, formData[field]) === null
        );
        if (!s3FieldsValid) return false;

        // Vérifier EPS sauf si inapte
        if (!formData.isInapteEPS && !formData.EPS) return false;
        break;
      }
      default:
        return false;
    }

    // Vérifier la moyenne du BAC
    if (!formData.Moyenne_BAC) return false;

    // Calculer et vérifier la moyenne
    const calculatedAverage = calculateSerieAverage(formData.Série, formData, formData.isInapteEPS);
    if (calculatedAverage === null) return false;

    // Vérifier si la moyenne correspond à celle saisie
    if (Math.abs(calculatedAverage - formData.Moyenne_BAC) > 0.01) return false;

    // Vérifier si la moyenne est suffisante pour l'orientation
    if (calculatedAverage < 10) return false;

    return true;
  };

  // // Calculer les moyennes automatiquement
  // useEffect(() => {
  //   setFormData(prev => {
  //     const moyenneGenerale = (
  //         ((prev.Moy_S_Term_1 || 0) + (prev.Moy_S_Term || 0)) / 2 +
  //         ((prev.Moy_nde || 0) + (prev.Moy_ère || 0))
  //     ) / 3;
  //
  //     const moyenneMatieresFondamentales = ((prev.MATH || 0) + (prev.SCPH || 0)) / 2;
  //
  //     return {
  //       ...prev,
  //       Moy_Gle: parseFloat(moyenneGenerale.toFixed(2)),
  //       Moy_sur_Mat_Fond: parseFloat(moyenneMatieresFondamentales.toFixed(2)),
  //       Moyenne_au_Grp: parseFloat(moyenneGenerale.toFixed(2))
  //     };
  //   });
  // }, [formData.Moy_S_Term_1, formData.Moy_S_Term, formData.Moy_nde, formData.Moy_ère, formData.MATH, formData.SCPH]);

  useEffect(() => {
    setFormData(prev => {
      let moyenneMatieresFondamentales;

      if (prev.Série === "S1") {
        // Pour S1: MATH(8) et PC(8)
        const sumNotes = (prev.MATH || 0) * 8 + (prev.SCPH || 0) * 8;
        const sumCoef = 16; // 8 + 8
        moyenneMatieresFondamentales = sumNotes / sumCoef;
      } else if (prev.Série === "S2") {
        // Pour S2: MATH(5), PC(6) et SVT(6)
        const sumNotes = (prev.MATH || 0) * 5 + (prev.SCPH || 0) * 6 + (prev.SVT || 0) * 6;
        const sumCoef = 17; // 5 + 6 + 6
        moyenneMatieresFondamentales = sumNotes / sumCoef;
      } else if (prev.Série === "S3") {
        // Pour S3: MATH(8), PC(8) et COME(8)
        const sumNotes = (prev.MATH || 0) * 8 + (prev.SCPH || 0) * 8 + (prev.COME || 0) * 8;
        const sumCoef = 24; // 8 + 8 + 8
        moyenneMatieresFondamentales = sumNotes / sumCoef;
      }

      const moyenneGenerale = calculateSerieAverage(prev.Série, prev, prev.isInapteEPS);

      return {
        ...prev,
        Moy_Gle: moyenneGenerale || 0,
        Moy_sur_Mat_Fond: parseFloat(moyenneMatieresFondamentales?.toFixed(2) || "0"),
        Moyenne_au_Grp: moyenneGenerale || 0
      };
    });
  }, [formData.Série, formData.MATH, formData.SCPH, formData.SVT, formData.FR, formData.AN,
    formData.PHILO, formData.EPS, formData.HG, formData.COME, formData.AFTA, formData.isInapteEPS]);

  // Valider le formulaire à chaque changement
  useEffect(() => {
    const isValid = validateCurrentStep();
    setIsCurrentStepValid(isValid);
  }, [formData, step]);


  const calculateSerieAverage = (serie: string, notes: any, isInapteEPS: boolean): number | null => {
    const hasAllRequiredNotes = (requiredFields: string[]) => {
      return requiredFields.every(field =>
          field === 'EPS' ? (isInapteEPS || notes[field]) : notes[field]
      );
    };

    if (serie === "S1") {
      const requiredFields = ['MATH', 'SCPH', 'SVT', 'FR', 'AN', 'PHILO', 'EPS', 'HG'];
      if (!hasAllRequiredNotes(requiredFields)) return null;

      const total =
          (notes.MATH || 0) * 8 +
          (notes.SCPH || 0) * 8 +
          (notes.SVT || 0) * 2 +
          (notes.FR || 0) * 3 +
          (notes.AN || 0) * 2 +
          (notes.PHILO || 0) * 2 +
          (isInapteEPS ? 0 : (notes.EPS || 0)) * (isInapteEPS ? 0 : 1) +
          (notes.HG || 0) * 2;

      const totalCoef = isInapteEPS ? 27 : 28; // Ajuster le coefficient total si inapte en EPS
      return parseFloat((total / totalCoef).toFixed(2));
    }

    if (serie === "S2") {
      const requiredFields = ['MATH', 'SCPH', 'SVT', 'FR', 'AN', 'PHILO', 'EPS', 'HG'];
      if (!hasAllRequiredNotes(requiredFields)) return null;

      const total =
          (notes.MATH || 0) * 5 +
          (notes.SCPH || 0) * 6 +
          (notes.SVT || 0) * 6 +
          (notes.FR || 0) * 3 +
          (notes.AN || 0) * 2 +
          (notes.PHILO || 0) * 2 +
          (isInapteEPS ? 0 : (notes.EPS || 0)) * (isInapteEPS ? 0 : 1) +
          (notes.HG || 0) * 2;

      const totalCoef = isInapteEPS ? 26 : 27;
      return parseFloat((total / totalCoef).toFixed(2));
    }

    if (serie === "S3") {
      const requiredFields = ['MATH', 'SCPH', 'COME', 'AFTA', 'FR', 'AN', 'PHILO', 'EPS'];
      if (!hasAllRequiredNotes(requiredFields)) return null;

      const total =
          (notes.MATH || 0) * 8 +
          (notes.SCPH || 0) * 8 +
          (notes.COME || 0) * 8 +
          (notes.AFTA || 0) * 3 +
          (notes.FR || 0) * 3 +
          (notes.AN || 0) * 2 +
          (notes.PHILO || 0) * 2 +
          (isInapteEPS ? 0 : (notes.EPS || 0)) * (isInapteEPS ? 0 : 1);

      const totalCoef = isInapteEPS ? 34 : 35;
      return parseFloat((total / totalCoef).toFixed(2));
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "Résidence") {
      const region = regions.find(r => r.name === value);
      if (region) {
        setSelectedRegionId(region.id);
        loadAcademies(region.id);
      }
      setFormData(prev => ({
        ...prev,
        [name]: value,
        Académie_de_Ets_Prov: "" // Réinitialiser l'académie quand la région change
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === "number" ? parseFloat(value) || 0 : value
      }));
    }
  };



  // const handleNext = () => {
  //   const isValid = validateCurrentStep();
  //   if (isValid) {
  //     setStep(prev => Math.min(prev + 1, totalSteps));
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   } else {
  //     toast({
  //       title: "Erreur de validation",
  //       description: "Veuillez remplir tous les champs requis avant de continuer.",
  //       variant: "destructive"
  //     });
  //   }
  // };

  const handleNext = () => {
    const isValid = validateCurrentStep();
    if (isValid) {
      // Si on est à l'étape 1, passer directement à l'étape 3
      if (step === 1) {
        setStep(3);
      } else {
        setStep(prev => Math.min(prev + 1, totalSteps));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs requis avant de continuer.",
        variant: "destructive"
      });
    }
  };

  // const handlePrev = () => {
  //   setStep(prev => Math.max(prev - 1, 1));
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  const handlePrev = () => {
    // Si on est à l'étape 3, revenir directement à l'étape 1
    if (step === 3) {
      setStep(1);
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setStep(1);
    setFormData({
      Année_BAC: 2018,
      Groupe_Résultat: 1,
      Mention: "",
      Nbre_Fois_au_BAC: 1,
      Tot_Pts_au_Grp: 0,
      Sexe: "",
      Série: "",
      Age_en_Décembre_2018: undefined,
      MATH: undefined,
      SCPH: undefined,
      FR: undefined,
      PHILO: undefined,
      AN: undefined,
      Moy_nde: 10,
      Moy_ère: 10,
      Moy_S_Term: 10,
      Moy_S_Term_1: 10,
      Moy_Gle: undefined,
      Moy_sur_Mat_Fond: undefined,
      Moyenne_au_Grp: undefined,
      Résidence: "",
      Ets_de_provenance: "",
      Centre_Ec: "",
      Académie_de_Ets_Prov: "",
      REGION_DE_NAISSANCE: "",
      SVT: undefined,
      HG: undefined,
      EPS: undefined,
      AFTA: undefined,
      COME: undefined,
      Moyenne_BAC: undefined,
      isInapteEPS: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCurrentStepValid) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs avant de soumettre.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const preparedData = {
        Année_BAC: 2018,
        Groupe_Résultat: 1,
        Mention: formData.Mention,
        Nbre_Fois_au_BAC: 1,
        Tot_Pts_au_Grp: formData.Tot_Pts_au_Grp || 0,
        Sexe: formData.Sexe,
        Série: formData.Série,
        Age_en_Décembre_2018: Number(formData.Age_en_Décembre_2018),
        MATH: Number(formData.MATH),
        SCPH: Number(formData.SCPH),
        FR: Number(formData.FR),
        PHILO: Number(formData.PHILO),
        AN: Number(formData.AN),
        Moy_nde: Number(formData.Moy_nde),
        Moy_ère: Number(formData.Moy_ère),
        Moy_S_Term: Number(formData.Moy_S_Term),
        Moy_S_Term_1: Number(formData.Moy_S_Term_1),
        Moy_Gle: Number(formData.Moy_Gle),
        Moy_sur_Mat_Fond: Number(formData.Moy_sur_Mat_Fond),
        Moyenne_au_Grp: Number(formData.Moyenne_au_Grp),
        Résidence: formData.Résidence,
        Ets_de_provenance: formData.Ets_de_provenance || "",
        Centre_Ec: formData.Centre_Ec || "",
        Académie_de_Ets_Prov: formData.Académie_de_Ets_Prov,
        REGION_DE_NAISSANCE: formData.REGION_DE_NAISSANCE || ""
      };

      // Calculer la moyenne selon la série sélectionnée
      if (formData.Série) {
        const calculatedAverage = calculateSerieAverage(formData.Série, formData, formData.isInapteEPS);
        if (calculatedAverage !== null && formData.Moyenne_BAC) {
          // Vérifier si la moyenne calculée correspond à la moyenne saisie
          if (Math.abs(calculatedAverage - formData.Moyenne_BAC) > 0.01) {
            toast({
              title: "Erreur de validation",
              description: "La moyenne calculée ne correspond pas à la moyenne saisie au BAC",
              variant: "destructive"
            });
            setIsSubmitting(false);
            return;
          }

          // Vérifier si la moyenne est suffisante pour l'orientation
          if (calculatedAverage < 10) {
            toast({
              title: "Erreur de validation",
              description: "La moyenne est insuffisante pour l'orientation (inférieure à 10)",
              variant: "destructive"
            });
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Log pour débogage
      console.log("Données préparées pour soumission:", preparedData);

      // Appel à la fonction de soumission du composant parent
      await onSubmit(preparedData);
      setIsSubmitted(true);

      toast({
        title: "Prédiction réussie",
        description: "Les résultats ont été calculés avec succès !",
        duration: 3000,
      });

    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la prédiction. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Card className="p-4 max-w-2xl mx-auto">
        {!isSubmitted ? (
            <>
              <CardHeader>

                {/*<CardTitle>*/}
                {/*  {(() => {*/}
                {/*    switch (step) {*/}
                {/*      case 1:*/}
                {/*        return "Informations Personnelles";*/}
                {/*      case 2:*/}
                {/*        return "Moyennes Scolaires";*/}
                {/*      case 3:*/}
                {/*        return "Notes et Informations BAC";*/}
                {/*      default:*/}
                {/*        return "";*/}
                {/*    }*/}
                {/*  })()}*/}
                {/*  <span className="text-gray-500 text-sm ml-2">*/}
                {/*    (Étape {step} sur {totalSteps})*/}
                {/*  </span>*/}
                {/*</CardTitle>*/}

                <CardTitle>
                  {(() => {
                    switch (step) {
                      case 1:
                        return "Informations Personnelles";
                      case 3:
                        return "Notes et Informations BAC";
                      default:
                        return "";
                    }
                  })()}
                  <span className="text-gray-500 text-sm ml-2">
                      (Étape {step === 3 ? "2" : "1"} sur 2)
                  </span>
                </CardTitle>


              </CardHeader>


              <CardContent>

                {/*<Progress value={(step / totalSteps) * 100} className="mb-4 h-2" />*/}

                <Progress
                    value={step === 1 ? 33 : step === 3 ? 100 : 0}
                    className="mb-4 h-2"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="Sexe">Sexe *</Label>
                          <select
                              id="Sexe"
                              name="Sexe"
                              value={formData.Sexe}
                              onChange={handleChange}
                              className="w-full border rounded-lg p-2"
                              required
                          >
                            <option value="" disabled>Choisir...</option>
                            <option value="M">Masculin</option>
                            <option value="F">Féminin</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="Age_en_Décembre_2018">Âge (entre 15 et 23)*</Label>
                          <Input
                              type="number"
                              id="Age_en_Décembre_2018"
                              name="Age_en_Décembre_2018"
                              value={formData["Age_en_Décembre_2018"] ?? ""}
                              onChange={handleChange}
                              min={10}
                              max={30}
                              className="rounded-lg"
                              required
                          />
                          {(() => {
                            const errorMessage = validateField("Age_en_Décembre_2018", formData["Age_en_Décembre_2018"]);
                            return errorMessage ? <p className="text-sm text-red-500 mt-1">{errorMessage}</p> : null;
                          })()}
                        </div>
                        <div>
                          <Label htmlFor="Résidence">Résidence *</Label>
                          <select
                              id="Résidence"
                              name="Résidence"
                              value={formData.Résidence}
                              onChange={handleChange}
                              className="w-full border rounded-lg p-2"
                              required
                          >
                            <option value="" disabled>Choisir...</option>
                            {regions.map(region => (
                                <option key={region.id} value={region.name}>
                                  {region.name}
                                </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="Académie_de_Ets_Prov">Académie *</Label>
                          <select
                              id="Académie_de_Ets_Prov"
                              name="Académie_de_Ets_Prov"
                              value={formData.Académie_de_Ets_Prov}
                              onChange={handleChange}
                              className="w-full border rounded-lg p-2"
                              required
                              disabled={!selectedRegionId}
                          >
                            <option value="" disabled>
                              {!selectedRegionId ? "Sélectionnez d'abord une région" : "Choisir..."}
                            </option>
                            {academies.map(academie => (
                                <option key={academie.id} value={academie.name}>
                                  {academie.name}
                                </option>
                            ))}
                          </select>
                        </div>


                      </div>
                  )}

                  {/*{step === 2 && (*/}
                  {/*    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
                  {/*      {["Moy_nde", "Moy_ère", "Moy_S_Term_1", "Moy_S_Term"].map(field => {*/}
                  {/*        const errorMessage = validateField(field, formData[field]);*/}
                  {/*        return (*/}
                  {/*            <div key={field} className="space-y-2">*/}
                  {/*              <Label htmlFor={field}>{field.replace(/_/g, ' ')} *</Label>*/}
                  {/*              <Input*/}
                  {/*                  type="number"*/}
                  {/*                  id={field}*/}
                  {/*                  name={field}*/}
                  {/*                  value={formData[field] ?? ""}*/}
                  {/*                  onChange={handleChange}*/}
                  {/*                  min={1}*/}
                  {/*                  max={20}*/}
                  {/*                  step="0.5"*/}
                  {/*                  className={`rounded-lg ${errorMessage ? 'border-red-500' : ''}`}*/}
                  {/*              />*/}
                  {/*              {errorMessage && (*/}
                  {/*                  <p className="text-sm text-red-500 mt-1">{errorMessage}</p>*/}
                  {/*              )}*/}
                  {/*            </div>*/}
                  {/*        );*/}
                  {/*      })}*/}
                  {/*    </div>*/}
                  {/*)}*/}



                  {step === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Sélection de la série */}
                        <div>
                          <Label htmlFor="Série">Série *</Label>
                          <select
                              id="Série"
                              name="Série"
                              value={formData.Série}
                              onChange={handleChange}
                              className="w-full border rounded-lg p-2"
                              required
                          >
                            <option value="" disabled>Choisir...</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                          </select>
                        </div>

                        {/* Notes de base communes à toutes les séries */}
                        {["MATH", "SCPH", "FR", "AN", "PHILO"].map(field => (
                            <div key={field}>
                              <Label htmlFor={field}>Note en {field} *</Label>
                              <Input
                                  type="number"
                                  id={field}
                                  name={field}
                                  value={formData[field] ?? ""}
                                  onChange={handleChange}
                                  min={1}
                                  max={20}
                                  step="0.5"
                                  className="rounded-lg"
                                  required
                              />
                            </div>
                        ))}

                        {/* Champs spécifiques pour S1 et S2 */}
                        {(formData.Série === "S1" || formData.Série === "S2") && (
                            <>
                              {["SVT", "HG"].map(field => (
                                  <div key={field}>
                                    <Label htmlFor={field}>Note en {field} *</Label>
                                    <Input
                                        type="number"
                                        id={field}
                                        name={field}
                                        value={formData[field] ?? ""}
                                        onChange={handleChange}
                                        min={1}
                                        max={20}
                                        step="0.5"
                                        className="rounded-lg"
                                        required
                                    />
                                  </div>
                              ))}
                            </>
                        )}

                        {/* Champs spécifiques pour S3 */}
                        {formData.Série === "S3" && (
                            <>
                              {["COME", "AFTA"].map(field => (
                                  <div key={field}>
                                    <Label htmlFor={field}>Note en {field} *</Label>
                                    <Input
                                        type="number"
                                        id={field}
                                        name={field}
                                        value={formData[field] ?? ""}
                                        onChange={handleChange}
                                        min={1}
                                        max={20}
                                        step="0.5"
                                        className="rounded-lg"
                                        required
                                    />
                                  </div>
                              ))}
                            </>
                        )}

                        {/* Gestion EPS avec option d'inaptitude */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="EPS">Note en EPS</Label>
                            <label className="flex items-center space-x-2">
                              <input
                                  type="checkbox"
                                  checked={formData.isInapteEPS}
                                  onChange={(e) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      isInapteEPS: e.target.checked,
                                      EPS: e.target.checked ? undefined : prev.EPS
                                    }));
                                  }}
                                  className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-600">Inapte</span>
                            </label>
                          </div>
                          <Input
                              type="number"
                              id="EPS"
                              name="EPS"
                              value={formData.EPS ?? ""}
                              onChange={handleChange}
                              min={1}
                              max={20}
                              step="0.5"
                              className="rounded-lg"
                              disabled={formData.isInapteEPS}
                              required={!formData.isInapteEPS}
                          />
                        </div>

                        {/* Saisie de la moyenne BAC */}
                        <div>
                          <Label htmlFor="Moyenne_BAC">Moyenne au BAC *</Label>
                          <Input
                              type="number"
                              id="Moyenne_BAC"
                              name="Moyenne_BAC"
                              value={formData.Moyenne_BAC ?? ""}
                              onChange={handleChange}
                              min={0}
                              max={20}
                              step="0.01"
                              className="rounded-lg"
                              required
                          />
                        </div>

                        {/* Affichage des moyennes et validations */}
                        {formData.Série && formData.Moyenne_BAC && (
                            <div className="col-span-full mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                              {/*<div className="flex items-center justify-between">*/}
                              {/*  <span>Moyenne calculée :</span>*/}
                              {/*  <span className="font-semibold">*/}
                              {/*    {calculateSerieAverage(formData.Série, formData, formData.isInapteEPS)?.toFixed(2)}*/}
                              {/*  </span>*/}
                              {/*</div>*/}
                              <div className="flex items-center justify-between">
                                <span>Moyenne saisie :</span>
                                <span className="font-semibold">{formData.Moyenne_BAC}</span>
                              </div>
                              {calculateSerieAverage(formData.Série, formData, formData.isInapteEPS) !== null && (
                                  <>
                                    {Math.abs(calculateSerieAverage(formData.Série, formData, formData.isInapteEPS)! - formData.Moyenne_BAC) > 0.01 && (
                                        <p className="text-red-500 text-sm mt-2">
                                          ⚠️ La moyenne calculée ne correspond pas à la moyenne saisie
                                        </p>
                                    )}
                                    {calculateSerieAverage(formData.Série, formData, formData.isInapteEPS)! < 10 && (
                                        <p className="text-red-500 text-sm mt-2">
                                          ⚠️ Moyenne insuffisante pour l'orientation (inférieure à 10)
                                        </p>
                                    )}
                                  </>
                              )}
                            </div>
                        )}

                        {/*/!* Bouton de soumission *!/*/}
                        {/*<div className="col-span-full">*/}
                        {/*  <Button*/}
                        {/*      type="submit"*/}
                        {/*      disabled={isSubmitting || !isCurrentStepValid}*/}
                        {/*      className="w-full rounded-lg"*/}
                        {/*  >*/}
                        {/*    {isSubmitting ? "Prédiction en cours..." : "Soumettre"}*/}
                        {/*  </Button>*/}
                        {/*</div>*/}

                      </div>
                  )}


                  <div className="flex justify-between">
                    {step > 1 && (
                        <Button type="button" onClick={handlePrev} variant="outline" className="rounded-lg">
                          <ChevronLeft className="mr-2"/> Précédent
                        </Button>
                    )}

                    {step < totalSteps ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            className="rounded-lg"
                            disabled={!isCurrentStepValid}
                        >
                          Suivant <ChevronRight className="ml-2" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isCurrentStepValid}
                            className="rounded-lg"
                        >
                          {isSubmitting ? "Prédiction en cours..." : "Soumettre"}
                        </Button>
                    )}
                  </div>


                </form>
              </CardContent>
            </>
        ) : (
            <>
              <CardHeader>
                <CardTitle>Résultats de la Prédiction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  {/* Ici, vous pouvez afficher les résultats de la prédiction */}
                </div>
                <Button
                    onClick={handleReset}
                    className="w-full mt-4"
                >
                  Faire une nouvelle prédiction
                </Button>
              </CardContent>
            </>
        )}
      </Card>
  );
};







// import {useState, useEffect} from "react";
// import {StudentInput} from "@/types/student";
// import {Button} from "./ui/button";
// import {Input} from "./ui/input";
// import {Label} from "./ui/label";
// import {useToast} from "@/hooks/use-toast";
// import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
// import {Progress} from "@/components/ui/progress";
// import {CheckCircle2, ChevronRight, ChevronLeft} from "lucide-react";
//
// interface StudentFormProps {
//   onSubmit: (data: StudentInput) => void;
// }
//
// export const StudentForm = ({onSubmit}: StudentFormProps) => {
//   const {toast} = useToast();
//   const [step, setStep] = useState(1);
//   const totalSteps = 3;
//   const [isSubmitting, setIsSubmitting] = useState(false);
//
//   const [formData, setFormData] = useState<StudentInput>({
//     Sexe: "M",
//     Série: "S1",
//     Age_en_Décembre_2018: 18,
//     MATH: 1,
//     SCPH: 1,
//     FR: 1,
//     PHILO: 1,
//     AN: 1,
//     Moy_nde: 1,
//     Moy_ère: 1,
//     Moy_S_Term: 1,
//     Moy_S_Term_1: 1,
//     Moy_Gle: 1,
//     Moy_sur_Mat_Fond: 1,
//     Année_BAC: 2018,
//     Nbre_Fois_au_BAC: 1,
//     Mention: "Passable",
//     Groupe_Résultat: 1,
//     Tot_Pts_au_Grp: 1,
//     Moyenne_au_Grp: 1,
//     Résidence: "",
//     Ets_de_provenance: "",
//     Centre_Ec: "",
//     Académie_de_Ets_Prov: "",
//     REGION_DE_NAISSANCE: ""
//   });
//
//   useEffect(() => {
//     setFormData(prev => {
//       const moyenneGenerale = (
//           ((prev.Moy_S_Term_1 + prev.Moy_S_Term) / 2 + (prev.Moy_nde + prev.Moy_ère)) / 3
//       );
//       const moyenneMatieresFondamentales = (prev.MATH + prev.SCPH) / 2;
//       const moyenneGroupe = (
//           ((prev.Moy_S_Term_1 + prev.Moy_S_Term) / 2 + (prev.Moy_nde + prev.Moy_ère)) / 3
//       );
//       return {
//         ...prev,
//         Moy_Gle: parseFloat(moyenneGenerale.toFixed(2)),
//         Moy_sur_Mat_Fond: parseFloat(moyenneMatieresFondamentales.toFixed(2)),
//         Moyenne_au_Grp: parseFloat(moyenneGroupe.toFixed(2))
//       };
//     });
//   }, [formData.Moy_S_Term_1, formData.Moy_S_Term, formData.Moy_nde, formData.Moy_ère, formData.MATH, formData.SCPH]);
//
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const {name, value} = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: e.target.type === "number" ? parseFloat(value) || 0 : value
//     }));
//   };
//
//   const handleNext = () => {
//     if (step < totalSteps) {
//       setStep(prev => prev + 1);
//       window.scrollTo({top: 0, behavior: 'smooth'});
//     }
//   };
//
//   const handlePrev = () => {
//     if (step > 1) {
//       setStep(prev => prev - 1);
//       window.scrollTo({top: 0, behavior: 'smooth'});
//     }
//   };
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (step === totalSteps && !isSubmitting) {
//       setIsSubmitting(true);
//       try {
//         await onSubmit(formData);
//         toast({
//           title: "Succès",
//           description: "Vos données ont été soumises avec succès",
//         });
//       } catch (error) {
//         toast({
//           title: "Erreur",
//           description: "Une erreur est survenue lors de la soumission",
//           variant: "destructive",
//         });
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };
//
//   const getStepTitle = () => {
//     switch (step) {
//       case 1:
//         return "Informations Personnelles";
//       case 2:
//         return "Informations du Lycee";
//       case 3:
//         return "Informations du BAC";
//       default:
//         return "";
//     }
//   };
//
//   const renderStepIndicator = () => {
//     return (
//         <div className="mb-8">
//           <div className="flex justify-between mb-2">
//             {Array.from({length: totalSteps}, (_, i) => (
//                 <div
//                     key={i + 1}
//                     className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                         i + 1 === step
//                             ? 'bg-primary text-white'
//                             : i + 1 < step
//                                 ? 'bg-green-500 text-white'
//                                 : 'bg-gray-200 text-gray-600'
//                     }`}
//                 >
//                   {i + 1 < step ? (
//                       <CheckCircle2 className="w-5 h-5"/>
//                   ) : (
//                       <span>{i + 1}</span>
//                   )}
//                 </div>
//             ))}
//           </div>
//           <Progress value={(step / totalSteps) * 100} className="h-2"/>
//         </div>
//     );
//   };
//
//   const renderStep1 = () => (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-2">
//           <Label htmlFor="Sexe">Sexe</Label>
//           <select
//               id="Sexe"
//               name="Sexe"
//               value={formData.Sexe}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
//           >
//             <option value="M">Masculin</option>
//             <option value="F">Féminin</option>
//           </select>
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Age_en_Décembre_2018">Âge</Label>
//           <Input
//               type="number"
//               id="Age_en_Décembre_2018"
//               name="Age_en_Décembre_2018"
//               value={formData.Age_en_Décembre_2018}
//               onChange={handleChange}
//               className="rounded-lg"
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Résidence">Résidence</Label>
//           <Input
//               type="text"
//               id="Résidence"
//               name="Résidence"
//               value={formData.Résidence}
//               onChange={handleChange}
//               className="rounded-lg"
//           />
//         </div>
//
//         {/*<div className="space-y-2">*/}
//         {/*  <Label htmlFor="REGION_DE_NAISSANCE">Région de naissance</Label>*/}
//         {/*  <Input*/}
//         {/*      type="text"*/}
//         {/*      id="REGION_DE_NAISSANCE"*/}
//         {/*      name="REGION_DE_NAISSANCE"*/}
//         {/*      value={formData.REGION_DE_NAISSANCE}*/}
//         {/*      onChange={handleChange}*/}
//         {/*      className="rounded-lg"*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         <div className="space-y-2">
//           <Label htmlFor="Ets_de_provenance">Établissement de provenance</Label>
//           <Input
//               type="text"
//               id="Ets_de_provenance"
//               name="Ets_de_provenance"
//               value={formData.Ets_de_provenance}
//               onChange={handleChange}
//               className="rounded-lg"
//           />
//         </div>
//
//         {/*<div className="space-y-2">*/}
//         {/*  <Label htmlFor="Académie_de_Ets_Prov">Académie</Label>*/}
//         {/*  <Input*/}
//         {/*      type="text"*/}
//         {/*      id="Académie_de_Ets_Prov"*/}
//         {/*      name="Académie_de_Ets_Prov"*/}
//         {/*      value={formData.Académie_de_Ets_Prov}*/}
//         {/*      onChange={handleChange}*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//       </div>
//   );
//
//   const renderStep2 = () => (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_nde">Moyenne Seconde</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="Moy_nde"
//               name="Moy_nde"
//               value={formData.Moy_nde}
//               onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_ère">Moyenne Première</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="Moy_ère"
//               name="Moy_ère"
//               value={formData.Moy_ère}
//               onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_S_Term_1">Moyenne Terminale 1er Semestre</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="Moy_S_Term_1"
//               name="Moy_S_Term_1"
//               value={formData.Moy_S_Term_1}
//               onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_S_Term">Moyenne Terminale</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="Moy_S_Term"
//               name="Moy_S_Term"
//               value={formData.Moy_S_Term}
//               onChange={handleChange}
//           />
//         </div>
//
//
//         {/*<div className="space-y-2">*/}
//         {/*  <Label htmlFor="Moy_Gle" className="flex items-center">*/}
//         {/*    Moyenne Générale*/}
//         {/*    <span className="ml-2 text-sm text-gray-500">(Calculée automatiquement)</span>*/}
//         {/*  </Label>*/}
//         {/*  <Input*/}
//         {/*      type="number"*/}
//         {/*      id="Moy_Gle"*/}
//         {/*      name="Moy_Gle"*/}
//         {/*      value={formData.Moy_Gle}*/}
//         {/*      readOnly*/}
//         {/*      className="bg-gray-50 rounded-lg"*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         {/*<div className="space-y-2">*/}
//         {/*  <Label htmlFor="Moy_sur_Mat_Fond" className="flex items-center">*/}
//         {/*    Moyenne Matières Fondamentales*/}
//         {/*    <span className="ml-2 text-sm text-gray-500">(Calculée automatiquement)</span>*/}
//         {/*  </Label>*/}
//         {/*  <Input*/}
//         {/*      type="number"*/}
//         {/*      id="Moy_sur_Mat_Fond"*/}
//         {/*      name="Moy_sur_Mat_Fond"*/}
//         {/*      value={formData.Moy_sur_Mat_Fond}*/}
//         {/*      readOnly*/}
//         {/*      className="bg-gray-50 rounded-lg"*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//
//       </div>
//   );
//
//   const renderStep3 = () => (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//
//         <div className="space-y-2">
//           <Label htmlFor="Série">Série</Label>
//           <select
//               id="Série"
//               name="Série"
//               value={formData.Série}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
//           >
//             <option value="S1">S1</option>
//             <option value="S2">S2</option>
//             <option value="S3">S3</option>
//           </select>
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Nbre_Fois_au_BAC">Nombre de fois au BAC</Label>
//           <Input
//               type="number"
//               id="Nbre_Fois_au_BAC"
//               name="Nbre_Fois_au_BAC"
//               value={formData.Nbre_Fois_au_BAC}
//               onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="MATH">Note en Mathématiques</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="MATH"
//               name="MATH"
//               value={formData.MATH}
//               onChange={handleChange}
//               className="rounded-lg"
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="SCPH">Note en Sciences Physiques</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="SCPH"
//               name="SCPH"
//               value={formData.SCPH}
//               onChange={handleChange}
//               className="rounded-lg"
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="FR">Note en Français</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="FR"
//               name="FR"
//               value={formData.FR}
//               onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="PHILO">Note en Philosophie</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="PHILO"
//               name="PHILO"
//               value={formData.PHILO}
//               onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="AN">Note en Anglais</Label>
//           <Input
//               type="number"
//               step="0.5"
//               id="AN"
//               name="AN"
//               value={formData.AN}
//               onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Mention">Mention</Label>
//           <select
//               id="Mention"
//               name="Mention"
//               value={formData.Mention}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
//           >
//             <option value="Passable">Passable</option>
//             <option value="Assez Bien">Assez Bien</option>
//             <option value="Bien">Bien</option>
//             <option value="Très Bien">Très Bien</option>
//           </select>
//         </div>
//
//       </div>
//   );
//
//   return (
//       <Card className="w-full max-w-4xl mx-auto">
//         <CardHeader>
//           <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {renderStepIndicator()}
//
//             <div className="space-y-6">
//               {step === 1 && renderStep1()}
//               {step === 2 && renderStep2()}
//               {step === 3 && renderStep3()}
//             </div>
//
//             <div className="flex justify-between pt-6 border-t">
//               <Button
//                   type="button"
//                   onClick={handlePrev}
//                   disabled={step === 1}
//                   variant="outline"
//                   className="flex items-center gap-2"
//               >
//                 <ChevronLeft className="w-4 h-4"/> Précédent
//               </Button>
//
//               {step < totalSteps ? (
//                   <Button
//                       type="button"
//                       onClick={handleNext}
//                       className="flex items-center gap-2"
//                   >
//                     Suivant <ChevronRight className="w-4 h-4"/>
//                   </Button>
//               ) : (
//                   <Button
//                       type="submit"
//                       className="bg-green-600 hover:bg-green-700"
//                       disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Traitement..." : "Prédire la réussite"}
//                   </Button>
//               )}
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//   );
// };
















//
// import { useState } from "react";
// import { StudentInput } from "@/types/student";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { useToast } from "@/hooks/use-toast";
//
// interface StudentFormProps {
//   onSubmit: (data: StudentInput) => void;
// }
//
// export const StudentForm = ({ onSubmit }: StudentFormProps) => {
//   const { toast } = useToast();
//   const [formData, setFormData] = useState<StudentInput>({
//     Sexe: "M",
//     Série: "S1",
//     Age_en_Décembre_2018: 18,
//     MATH: 1,
//     SCPH: 1,
//     FR: 1,
//     PHILO: 1,
//     AN: 1,
//     Moy_nde: 1,
//     Moy_ère: 1,
//     Moy_S_Term: 1,
//     Moy_S_Term_1: 1,
//     Moy_Gle: 1,
//     Moy_sur_Mat_Fond: 1,
//     Année_BAC: 2018,
//     Nbre_Fois_au_BAC: 1,
//     Mention: "Passable",
//     Groupe_Résultat: 1,
//     Tot_Pts_au_Grp: 1,
//     Moyenne_au_Grp: 1,
//     Résidence: "Dakar",
//     Ets_de_provenance: "Lycée Seydina Limamou Laye",
//     Centre_Ec: "Dakar",
//     Académie_de_Ets_Prov: "Dakar",
//     REGION_DE_NAISSANCE: "Dakar"
//   });
//
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };
//
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: e.target.type === "number" ? parseFloat(value) || 0 : value
//     }));
//   };
//
//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm animate-slideUpAndFade">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-2">
//           <Label htmlFor="Sexe">Sexe</Label>
//           <select
//             id="Sexe"
//             name="Sexe"
//             value={formData.Sexe}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
//           >
//             <option value="M">Masculin</option>
//             <option value="F">Féminin</option>
//           </select>
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Série">Série</Label>
//           <select
//             id="Série"
//             name="Série"
//             value={formData.Série}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
//           >
//             <option value="S1">S1</option>
//             <option value="S2">S2</option>
//             <option value="S3">S3</option>
//           </select>
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Age_en_Décembre_2018">Âge</Label>
//           <Input
//             type="number"
//             id="Age_en_Décembre_2018"
//             name="Age_en_Décembre_2018"
//             value={formData.Age_en_Décembre_2018}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="MATH">Note en Mathématiques</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="MATH"
//             name="MATH"
//             value={formData.MATH}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="SCPH">Note en Sciences Physiques</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="SCPH"
//             name="SCPH"
//             value={formData.SCPH}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="FR">Note en Français</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="FR"
//             name="FR"
//             value={formData.FR}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="PHILO">Note en Philosophie</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="PHILO"
//             name="PHILO"
//             value={formData.PHILO}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="AN">Note en Anglais</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="AN"
//             name="AN"
//             value={formData.AN}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_nde">Moyenne Seconde</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="Moy_nde"
//             name="Moy_nde"
//             value={formData.Moy_nde}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_ère">Moyenne Première</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="Moy_ère"
//             name="Moy_ère"
//             value={formData.Moy_ère}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_S_Term">Moyenne Terminale</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="Moy_S_Term"
//             name="Moy_S_Term"
//             value={formData.Moy_S_Term}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_S_Term_1">Moyenne Terminale 1er Semestre</Label>
//           <Input
//             type="number"
//             step="0.5"
//             id="Moy_S_Term_1"
//             name="Moy_S_Term_1"
//             value={formData.Moy_S_Term_1}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_Gle">Moyenne Générale</Label>
//           <Input
//               type="number"
//               // type="hidden"
//             step="0.5"
//             id="Moy_Gle"
//             name="Moy_Gle"
//             value={formData.Moy_Gle}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moy_sur_Mat_Fond">Moyenne Matières Fondamentales</Label>
//           <Input
//               // type="hidden"
//               type="number"
//             step="0.5"
//             id="Moy_sur_Mat_Fond"
//             name="Moy_sur_Mat_Fond"
//             value={formData.Moy_sur_Mat_Fond}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Année_BAC">Année du BAC</Label>
//           <Input
//             type="number"
//             id="Année_BAC"
//             name="Année_BAC"
//             value={formData.Année_BAC}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Nbre_Fois_au_BAC">Nombre de fois au BAC</Label>
//           <Input
//             type="number"
//             id="Nbre_Fois_au_BAC"
//             name="Nbre_Fois_au_BAC"
//             value={formData.Nbre_Fois_au_BAC}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Mention">Mention</Label>
//           <select
//             id="Mention"
//             name="Mention"
//             value={formData.Mention}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
//           >
//             <option value="Passable">Passable</option>
//             <option value="Assez Bien">Assez Bien</option>
//             <option value="Bien">Bien</option>
//             <option value="Très Bien">Très Bien</option>
//           </select>
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Tot_Pts_au_Grp">Total Points au Groupe</Label>
//           <Input
//               // type="hidden"
//               type="number"
//             id="Tot_Pts_au_Grp"
//             name="Tot_Pts_au_Grp"
//             value={formData.Tot_Pts_au_Grp}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Moyenne_au_Grp">Moyenne au Groupe</Label>
//           <Input
//               // type="hidden"
//               type="number"
//             step="0.5"
//             id="Moyenne_au_Grp"
//             name="Moyenne_au_Grp"
//             value={formData.Moyenne_au_Grp}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Résidence">Résidence</Label>
//           <Input
//               // type="hidden"
//             type="text"
//             id="Résidence"
//             name="Résidence"
//             value={formData.Résidence}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Ets_de_provenance">Établissement de provenance</Label>
//           <Input
//             type="text"
//             id="Ets_de_provenance"
//             name="Ets_de_provenance"
//             value={formData.Ets_de_provenance}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Centre_Ec">Centre d'examen</Label>
//           <Input
//               // type="hidden"
//             type="text"
//             id="Centre_Ec"
//             name="Centre_Ec"
//             value={formData.Centre_Ec}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="Académie_de_Ets_Prov">Académie</Label>
//           <Input
//             type="text"
//             id="Académie_de_Ets_Prov"
//             name="Académie_de_Ets_Prov"
//             value={formData.Académie_de_Ets_Prov}
//             onChange={handleChange}
//           />
//         </div>
//
//         <div className="space-y-2">
//           <Label htmlFor="REGION_DE_NAISSANCE">Région de naissance</Label>
//           <Input
//             type="text"
//             id="REGION_DE_NAISSANCE"
//             name="REGION_DE_NAISSANCE"
//             value={formData.REGION_DE_NAISSANCE}
//             onChange={handleChange}
//           />
//         </div>
//       </div>
//
//       <Button
//         type="submit"
//         className="w-full bg-primary hover:bg-primary/90 text-white"
//       >
//         Prédire la réussite
//       </Button>
//     </form>
//   );
// };


