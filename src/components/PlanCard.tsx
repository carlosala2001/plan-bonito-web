
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export interface Plan {
  name: string;
  price: number;
  credits: number;
  resources: {
    cpu: {
      value: string;
      unit: string;
    };
    ram: {
      value: number;
      unit: string;
    };
    disk: {
      value: number;
      unit: string;
    };
    backups: number;
    databases: number;
    ports: number;
  };
  billing: string;
  minCredits: number;
  description: {
    idealFor: string;
    perfectFor: string;
  };
  highlight?: boolean;
}

interface PlanCardProps {
  plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <Card className={plan.highlight ? "plan-card-highlight" : "plan-card"}>
      {plan.highlight && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-40 rounded-full bg-gradient-zenoscale px-4 py-1 text-center text-xs font-semibold text-white shadow-md">
          Recomendado
        </div>
      )}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <span className="rounded-full bg-muted px-3 py-1 text-xs">No limit</span>
        </div>

        <div className="my-4">
          <div className="mb-2 text-sm font-medium text-muted-foreground">Precio</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{plan.price}</span>
            <span className="text-lg font-medium text-muted-foreground">€/mes</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{plan.credits} Créditos</div>
        </div>

        <div className="my-6 space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium">Datos de recursos:</div>
            <div className="space-y-2">
              <div className="feature-item">
                <span className="text-muted-foreground">CPU:</span>
                <span className="font-medium">{plan.resources.cpu.value} {plan.resources.cpu.unit}</span>
              </div>
              <div className="feature-item">
                <span className="text-muted-foreground">Ram:</span>
                <span className="font-medium">{plan.resources.ram.value} {plan.resources.ram.unit}</span>
              </div>
              <div className="feature-item">
                <span className="text-muted-foreground">Disco:</span>
                <span className="font-medium">{plan.resources.disk.value} {plan.resources.disk.unit}</span>
              </div>
              <div className="feature-item">
                <span className="text-muted-foreground">Copias de Seguridad:</span>
                <span className="font-medium">{plan.resources.backups}</span>
              </div>
              <div className="feature-item">
                <span className="text-muted-foreground">MySQL Bases de Datos:</span>
                <span className="font-medium">{plan.resources.databases}</span>
              </div>
              <div className="feature-item">
                <span className="text-muted-foreground">Asignaciones (puertos):</span>
                <span className="font-medium">{plan.resources.ports}</span>
              </div>
              <div className="feature-item">
                <span className="text-muted-foreground">Billing Period:</span>
                <span className="font-medium">{plan.billing}</span>
              </div>
              <div className="feature-item">
                <span className="text-muted-foreground">Mínimo Créditos:</span>
                <span className="font-medium">{plan.minCredits.toLocaleString('es-ES')}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">Descripción:</div>
            <div className="space-y-2">
              <div className="feature-item">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">{plan.description.idealFor}</span>
              </div>
              <div className="feature-item">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">{plan.description.perfectFor}</span>
              </div>
            </div>
          </div>
        </div>

        <Button className="shine-effect mt-6 w-full bg-gradient-zenoscale text-white">
          Crear Servidor
        </Button>
      </div>
    </Card>
  );
};

export default PlanCard;
