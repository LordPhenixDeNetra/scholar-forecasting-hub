
import { useState } from "react";
import { StudentInput } from "@/types/student";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

interface StudentFormProps {
  onSubmit: (data: StudentInput) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StudentInput>({
    Sexe: "M",
    Série: "S1",
    Age_en_Décembre_2018: 18,
    MATH: 0,
    SCPH: 0,
    FR: 0,
    PHILO: 0,
    AN: 0,
    Moy_nde: 0,
    Moy_ère: 0,
    Moy_S_Term: 0,
    Moy_S_Term_1: 0,
    Moy_Gle: 0,
    Moy_sur_Mat_Fond: 0,
    Année_BAC: 2018,
    Nbre_Fois_au_BAC: 1,
    Mention: "Passable",
    Groupe_Résultat: 1,
    Tot_Pts_au_Grp: 0,
    Moyenne_au_Grp: 0,
    Résidence: "",
    Ets_de_provenance: "",
    Centre_Ec: "",
    Académie_de_Ets_Prov: "",
    REGION_DE_NAISSANCE: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.Résidence || !formData.Ets_de_provenance) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm animate-slideUpAndFade">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="Sexe">Sexe</Label>
          <select
            id="Sexe"
            name="Sexe"
            value={formData.Sexe}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="Mention">Mention</Label>
          <select
            id="Mention"
            name="Mention"
            value={formData.Mention}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Passable">Passable</option>
            <option value="Assez Bien">Assez Bien</option>
            <option value="Bien">Bien</option>
            <option value="Très Bien">Très Bien</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="Résidence">Résidence</Label>
          <Input
            type="text"
            id="Résidence"
            name="Résidence"
            value={formData.Résidence}
            onChange={handleChange}
            placeholder="Ville de résidence"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        Prédire la réussite
      </Button>
    </form>
  );
};
