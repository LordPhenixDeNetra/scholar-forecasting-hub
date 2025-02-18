import {useState, useEffect} from "react";
import {StudentInput} from "@/types/student";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {useToast} from "@/hooks/use-toast";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {CheckCircle2, ChevronRight, ChevronLeft} from "lucide-react";

interface StudentFormProps {
  onSubmit: (data: StudentInput) => void;
}

export const StudentForm = ({onSubmit}: StudentFormProps) => {
  const {toast} = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<StudentInput>({
    Sexe: "M",
    Série: "S1",
    Age_en_Décembre_2018: 18,
    MATH: 1,
    SCPH: 1,
    FR: 1,
    PHILO: 1,
    AN: 1,
    Moy_nde: 1,
    Moy_ère: 1,
    Moy_S_Term: 1,
    Moy_S_Term_1: 1,
    Moy_Gle: 1,
    Moy_sur_Mat_Fond: 1,
    Année_BAC: 2018,
    Nbre_Fois_au_BAC: 1,
    Mention: "Passable",
    Groupe_Résultat: 1,
    Tot_Pts_au_Grp: 1,
    Moyenne_au_Grp: 1,
    Résidence: "Dakar",
    Ets_de_provenance: "Lycée Seydina Limamou Laye",
    Centre_Ec: "Dakar",
    Académie_de_Ets_Prov: "Dakar",
    REGION_DE_NAISSANCE: "Dakar"
  });

  useEffect(() => {
    setFormData(prev => {
      const moyenneGenerale = (
          ((prev.Moy_S_Term_1 + prev.Moy_S_Term) / 2 + (prev.Moy_nde + prev.Moy_ère)) / 3
      );
      const moyenneMatieresFondamentales = (prev.MATH + prev.SCPH) / 2;
      const moyenneGroupe = (
          ((prev.Moy_S_Term_1 + prev.Moy_S_Term) / 2 + (prev.Moy_nde + prev.Moy_ère)) / 3
      );
      return {
        ...prev,
        Moy_Gle: parseFloat(moyenneGenerale.toFixed(2)),
        Moy_sur_Mat_Fond: parseFloat(moyenneMatieresFondamentales.toFixed(2)),
        Moyenne_au_Grp: parseFloat(moyenneGroupe.toFixed(2))
      };
    });
  }, [formData.Moy_S_Term_1, formData.Moy_S_Term, formData.Moy_nde, formData.Moy_ère, formData.MATH, formData.SCPH]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        toast({
          title: "Succès",
          description: "Vos données ont été soumises avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la soumission",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Informations Personnelles";
      case 2:
        return "Informations du Lycee";
      case 3:
        return "Informations du BAC";
      default:
        return "";
    }
  };

  const renderStepIndicator = () => {
    return (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({length: totalSteps}, (_, i) => (
                <div
                    key={i + 1}
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        i + 1 === step
                            ? 'bg-primary text-white'
                            : i + 1 < step
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {i + 1 < step ? (
                      <CheckCircle2 className="w-5 h-5"/>
                  ) : (
                      <span>{i + 1}</span>
                  )}
                </div>
            ))}
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2"/>
        </div>
    );
  };

  const renderStep1 = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="Sexe">Sexe</Label>
          <select
              id="Sexe"
              name="Sexe"
              value={formData.Sexe}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="Age_en_Décembre_2018">Âge</Label>
          <Input
              type="number"
              id="Age_en_Décembre_2018"
              name="Age_en_Décembre_2018"
              value={formData.Age_en_Décembre_2018}
              onChange={handleChange}
              className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="Résidence">Résidence</Label>
          <Input
              type="text"
              id="Résidence"
              name="Résidence"
              value={formData.Résidence}
              onChange={handleChange}
              className="rounded-lg"
          />
        </div>

        {/*<div className="space-y-2">*/}
        {/*  <Label htmlFor="REGION_DE_NAISSANCE">Région de naissance</Label>*/}
        {/*  <Input*/}
        {/*      type="text"*/}
        {/*      id="REGION_DE_NAISSANCE"*/}
        {/*      name="REGION_DE_NAISSANCE"*/}
        {/*      value={formData.REGION_DE_NAISSANCE}*/}
        {/*      onChange={handleChange}*/}
        {/*      className="rounded-lg"*/}
        {/*  />*/}
        {/*</div>*/}

        <div className="space-y-2">
          <Label htmlFor="Ets_de_provenance">Établissement de provenance</Label>
          <Input
              type="text"
              id="Ets_de_provenance"
              name="Ets_de_provenance"
              value={formData.Ets_de_provenance}
              onChange={handleChange}
              className="rounded-lg"
          />
        </div>

        {/*<div className="space-y-2">*/}
        {/*  <Label htmlFor="Académie_de_Ets_Prov">Académie</Label>*/}
        {/*  <Input*/}
        {/*      type="text"*/}
        {/*      id="Académie_de_Ets_Prov"*/}
        {/*      name="Académie_de_Ets_Prov"*/}
        {/*      value={formData.Académie_de_Ets_Prov}*/}
        {/*      onChange={handleChange}*/}
        {/*  />*/}
        {/*</div>*/}

      </div>
  );

  const renderStep2 = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        <div className="space-y-2">
          <Label htmlFor="Moy_nde">Moyenne Seconde</Label>
          <Input
              type="number"
              step="0.5"
              id="Moy_nde"
              name="Moy_nde"
              value={formData.Moy_nde}
              onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="Moy_ère">Moyenne Première</Label>
          <Input
              type="number"
              step="0.5"
              id="Moy_ère"
              name="Moy_ère"
              value={formData.Moy_ère}
              onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="Moy_S_Term_1">Moyenne Terminale 1er Semestre</Label>
          <Input
              type="number"
              step="0.5"
              id="Moy_S_Term_1"
              name="Moy_S_Term_1"
              value={formData.Moy_S_Term_1}
              onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="Moy_S_Term">Moyenne Terminale</Label>
          <Input
              type="number"
              step="0.5"
              id="Moy_S_Term"
              name="Moy_S_Term"
              value={formData.Moy_S_Term}
              onChange={handleChange}
          />
        </div>


        {/*<div className="space-y-2">*/}
        {/*  <Label htmlFor="Moy_Gle" className="flex items-center">*/}
        {/*    Moyenne Générale*/}
        {/*    <span className="ml-2 text-sm text-gray-500">(Calculée automatiquement)</span>*/}
        {/*  </Label>*/}
        {/*  <Input*/}
        {/*      type="number"*/}
        {/*      id="Moy_Gle"*/}
        {/*      name="Moy_Gle"*/}
        {/*      value={formData.Moy_Gle}*/}
        {/*      readOnly*/}
        {/*      className="bg-gray-50 rounded-lg"*/}
        {/*  />*/}
        {/*</div>*/}

        {/*<div className="space-y-2">*/}
        {/*  <Label htmlFor="Moy_sur_Mat_Fond" className="flex items-center">*/}
        {/*    Moyenne Matières Fondamentales*/}
        {/*    <span className="ml-2 text-sm text-gray-500">(Calculée automatiquement)</span>*/}
        {/*  </Label>*/}
        {/*  <Input*/}
        {/*      type="number"*/}
        {/*      id="Moy_sur_Mat_Fond"*/}
        {/*      name="Moy_sur_Mat_Fond"*/}
        {/*      value={formData.Moy_sur_Mat_Fond}*/}
        {/*      readOnly*/}
        {/*      className="bg-gray-50 rounded-lg"*/}
        {/*  />*/}
        {/*</div>*/}


      </div>
  );

  const renderStep3 = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="space-y-2">
          <Label htmlFor="Série">Série</Label>
          <select
              id="Série"
              name="Série"
              value={formData.Série}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="Nbre_Fois_au_BAC">Nombre de fois au BAC</Label>
          <Input
              type="number"
              id="Nbre_Fois_au_BAC"
              name="Nbre_Fois_au_BAC"
              value={formData.Nbre_Fois_au_BAC}
              onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="MATH">Note en Mathématiques</Label>
          <Input
              type="number"
              step="0.5"
              id="MATH"
              name="MATH"
              value={formData.MATH}
              onChange={handleChange}
              className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="SCPH">Note en Sciences Physiques</Label>
          <Input
              type="number"
              step="0.5"
              id="SCPH"
              name="SCPH"
              value={formData.SCPH}
              onChange={handleChange}
              className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="FR">Note en Français</Label>
          <Input
              type="number"
              step="0.5"
              id="FR"
              name="FR"
              value={formData.FR}
              onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="PHILO">Note en Philosophie</Label>
          <Input
              type="number"
              step="0.5"
              id="PHILO"
              name="PHILO"
              value={formData.PHILO}
              onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="AN">Note en Anglais</Label>
          <Input
              type="number"
              step="0.5"
              id="AN"
              name="AN"
              value={formData.AN}
              onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="Mention">Mention</Label>
          <select
              id="Mention"
              name="Mention"
              value={formData.Mention}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="Passable">Passable</option>
            <option value="Assez Bien">Assez Bien</option>
            <option value="Bien">Bien</option>
            <option value="Très Bien">Très Bien</option>
          </select>
        </div>

      </div>
  );

  return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStepIndicator()}

            <div className="space-y-6">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  variant="outline"
                  className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4"/> Précédent
              </Button>

              {step < totalSteps ? (
                  <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2"
                  >
                    Suivant <ChevronRight className="w-4 h-4"/>
                  </Button>
              ) : (
                  <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? "Traitement..." : "Prédire la réussite"}
                  </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
  );
};


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


