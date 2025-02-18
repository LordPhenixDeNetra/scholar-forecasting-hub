
import { PredictionResponse } from "@/types/student";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { AlertCircle, CheckCircle } from "lucide-react";

interface PredictionResultProps {
  result: PredictionResponse;
}

export const PredictionResult = ({ result }: PredictionResultProps) => {
  const getStatusColor = (probability: number) => {
    if (probability >= 75) return "success";
    if (probability >= 50) return "success-light";
    if (probability >= 25) return "warning";
    return "destructive";
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm space-y-6 animate-slideUpAndFade">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Résultat de la prédiction</h3>
        {result.probability >= 50 ? (
          <CheckCircle className="w-6 h-6 text-success" />
        ) : (
          <AlertCircle className="w-6 h-6 text-destructive" />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Probabilité de réussite</span>
            <span className="font-semibold">{result.probability}%</span>
          </div>
          <Progress value={result.probability} className="h-2" />
        </div>

        {/*<div className="grid grid-cols-2 gap-4">*/}
          {/*<div className="p-4 bg-gray-50 rounded-lg">*/}
            {/*<span className="text-sm text-gray-600">Statut</span>*/}
            {/*<span className="text-sm text-gray-600">Prédiction</span>*/}
            {/*<p className="font-semibold">{result.status}</p>*/}
          {/*</div>*/}
          {/*<div className="p-4 bg-gray-50 rounded-lg">*/}
          {/*  <span className="text-sm text-gray-600">Score</span>*/}
          {/*  <p className="font-semibold">{result.score.toFixed(2)}</p>*/}
          {/*</div>*/}
        {/*</div>*/}

        {/*<div className="bg-gray-50 p-4 rounded-lg">*/}
        {/*  <h4 className="font-semibold mb-2">Détails du score</h4>*/}
        {/*  <div className="space-y-2">*/}
        {/*    <div className="flex justify-between">*/}
        {/*      <span className="text-sm text-gray-600">Score en pourcentage</span>*/}
        {/*      <span>{result.details.score_percentage}%</span>*/}
        {/*    </div>*/}
        {/*    <div className="flex justify-between">*/}
        {/*      <span className="text-sm text-gray-600">Probabilité de base</span>*/}
        {/*      <span>{result.details.base_probability}%</span>*/}
        {/*    </div>*/}
        {/*    <div className="flex justify-between">*/}
        {/*      <span className="text-sm text-gray-600">Bonus mention</span>*/}
        {/*      <span>+{result.details.mention_bonus}%</span>*/}
        {/*    </div>*/}
        {/*    <div className="flex justify-between">*/}
        {/*      <span className="text-sm text-gray-600">Bonus série</span>*/}
        {/*      <span>+{result.details.serie_bonus}%</span>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Recommandation</h4>
          <p className="text-sm text-gray-700">{result.recommendation}</p>
        </div>
      </div>
    </Card>
  );
};
