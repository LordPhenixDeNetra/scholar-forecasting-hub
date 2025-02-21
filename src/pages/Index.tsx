import { useState } from "react";
import { StudentForm } from "@/components/StudentForm";
// import { PredictionResult } from "@/components/PredictionResult";
import { PredictionResultV2 } from "@/components/PredictionResultV2";
import { UniversityPredictionLayout } from "@/components/UniversityPredictionLayout";
import type {StudentInput, PredictionResponseV2} from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import {buildApiUrl} from "@/config/api.ts";

const Index = () => {
  // const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [predictionResultV2, setPredictionResult] = useState<PredictionResponseV2 | null>(null);

  const { toast } = useToast();

  const handleSubmit = async (data: StudentInput) => {
    // ec2-3-87-44-69.compute-1.amazonaws.com
    try {
      const response = await fetch(buildApiUrl("/predict_v2"), {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la prédiction");
      }

      const result = await response.json();
      setPredictionResult(result);

      // Afficher un toast de succès
      toast({
        title: "Succès",
        description: "La prédiction a été effectuée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la prédiction",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <UniversityPredictionLayout
            onSubmitWithPrediction={handleSubmit}
            headerContent={
              // <div className="text-center mb-8">
              //   <img src="/logo_uacd.png" alt="Logo DIORES" className="w-8 h-8 text-center"/>
              //   <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              //     DIORES
              //   </h1>
              //   <p className="mt-3 text-base text-gray-500 sm:text-lg">
              //     Prédiction de la réussite des étudiants
              //   </p>
              // </div>

              <div className="text-center mb-8">
                <img src="/logo_uacd.png" alt="Logo DIORES" className="w-12 h-12 mx-auto"/>
                <span className="text-2xl"> Dispositif Intelligent d'Orientation et de Réorientation des Étudiants du Supérieur </span>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  DIORES
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:text-lg">
                  Prédiction de la réussite des étudiants
                </p>
              </div>

            }
        >
          {/*{predictionResult && <PredictionResult result={predictionResult}/>}*/}
          {predictionResultV2 && <PredictionResultV2 result={predictionResultV2}/>}
        </UniversityPredictionLayout>
      </div>
  );
};

export default Index;


//
// import { useState } from "react";
// import { StudentForm } from "@/components/StudentForm";
// import { PredictionResult } from "@/components/PredictionResult";
// import type { StudentInput, PredictionResponse } from "@/types/student";
// import { useToast } from "@/hooks/use-toast";
//
// const Index = () => {
//   const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
//   const { toast } = useToast();
//
//   const handleSubmit = async (data: StudentInput) => {
//
//     try {
//       const response = await fetch("http://ec2-44-204-15-212.compute-1.amazonaws.com:8000/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//
//       if (!response.ok) {
//         throw new Error("Erreur lors de la prédiction");
//       }
//
//       const result = await response.json();
//       setPredictionResult(result);
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Une erreur est survenue lors de la prédiction",
//         variant: "destructive",
//       });
//     }
//   };
//
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
//             DIORES
//           </h1>
//           <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
//             Prédiction de la réussite des étudiants pour la Filière MPI
//           </p>
//         </div>
//
//         <div className="space-y-12">
//           <StudentForm onSubmit={handleSubmit} />
//           {predictionResult && <PredictionResult result={predictionResult} />}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Index;


// Index
