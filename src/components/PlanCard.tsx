import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, CpuIcon, HardDriveIcon, DatabaseIcon } from "lucide-react";

export interface Plan {
  name: string;
  price: number;
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
  // Convert disk size from MB to GB
  const diskSizeGB = (plan.resources.disk.value / 1024).toFixed(1);

  const handleCreateServer = () => {
    window.open('https://dash.zenoscale.es', '_blank');
  };
  
  return (
    <Card className={plan.highlight ? "plan-card-highlight relative" : "plan-card"}>
      {plan.highlight && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-max px-6 py-1.5 rounded-full bg-gradient-zenoscale text-center text-xs font-semibold text-white shadow-md z-10">
          Recomendado
        </div>
      )}
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold">{plan.name}</h3>
          <span className="rounded-full bg-muted px-2 py-1 text-xs">No limit</span>
        </div>

        <div className="my-3 sm:my-4">
          <div className="mb-1 sm:mb-2 text-sm font-medium text-muted-foreground">Precio</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold">{plan.price}</span>
            <span className="text-base sm:text-lg font-medium text-muted-foreground">€/mes</span>
          </div>
        </div>

        <div className="my-4 sm:my-6 space-y-3 sm:space-y-4">
          <div>
            <div className="mb-3 sm:mb-4 text-sm font-medium">Datos de recursos:</div>
            
            {/* Enhanced Resources Display */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
              <div className="resource-card">
                <CpuIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <div className="resource-info">
                  <div className="text-xs text-muted-foreground">CPU</div>
                  <div className="text-sm sm:font-medium">{plan.resources.cpu.value} {plan.resources.cpu.unit}</div>
                </div>
              </div>
              
              <div className="resource-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5 text-primary">
                  <path d="M6 19v-3"></path>
                  <path d="M10 19v-3"></path>
                  <path d="M14 19v-3"></path>
                  <path d="M18 19v-3"></path>
                  <path d="M5 16h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1z"></path>
                </svg>
                <div className="resource-info">
                  <div className="text-xs text-muted-foreground">RAM</div>
                  <div className="text-sm sm:font-medium">{plan.resources.ram.value} {plan.resources.ram.unit}</div>
                </div>
              </div>
              
              <div className="resource-card">
                <HardDriveIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <div className="resource-info">
                  <div className="text-xs text-muted-foreground">Disco</div>
                  <div className="text-sm sm:font-medium">{diskSizeGB} GB</div>
                </div>
              </div>
              
              <div className="resource-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5 text-primary">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M6 8h.01"></path>
                  <path d="M6 12h.01"></path>
                  <path d="M6 16h.01"></path>
                  <path d="M10 8h8"></path>
                  <path d="M10 12h8"></path>
                  <path d="M10 16h8"></path>
                </svg>
                <div className="resource-info">
                  <div className="text-xs text-muted-foreground">Copias de Seguridad</div>
                  <div className="text-sm sm:font-medium">{plan.resources.backups}</div>
                </div>
              </div>
              
              <div className="resource-card">
                <DatabaseIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <div className="resource-info">
                  <div className="text-xs text-muted-foreground">MySQL Bases de Datos</div>
                  <div className="text-sm sm:font-medium">{plan.resources.databases}</div>
                </div>
              </div>
              
              <div className="resource-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5 text-primary">
                  <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <path d="M15 2v2"></path>
                  <path d="M15 20v2"></path>
                  <path d="M2 15h2"></path>
                  <path d="M20 15h2"></path>
                </svg>
                <div className="resource-info">
                  <div className="text-xs text-muted-foreground">Asignaciones (puertos)</div>
                  <div className="text-sm sm:font-medium">{plan.resources.ports}</div>
                </div>
              </div>
              
              <div className="resource-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5 text-primary">
                  <path d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2"></path>
                  <path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2"></path>
                  <rect x="14" y="14" width="8" height="8" rx="2"></rect>
                </svg>
                <div className="resource-info">
                  <div className="text-xs text-muted-foreground">Billing Period</div>
                  <div className="text-sm sm:font-medium">{plan.billing}</div>
                </div>
              </div>
              
              <div className="resource-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5 text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                <div className="resource-info">
                  <div className="text-xs text-muted-foreground">Mínimo Créditos</div>
                  <div className="text-sm sm:font-medium">{plan.minCredits.toLocaleString('es-ES')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="mb-2 sm:mb-3 text-sm font-medium">Descripción:</div>
            <div className="space-y-2 bg-muted/30 p-2 sm:p-3 rounded-lg">
              <div className="feature-item">
                <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm">{plan.description.idealFor}</span>
              </div>
              <div className="feature-item">
                <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm">{plan.description.perfectFor}</span>
              </div>
            </div>
          </div>
        </div>

        <Button 
          className="shine-effect mt-4 sm:mt-6 w-full bg-gradient-zenoscale text-white"
          onClick={handleCreateServer}
        >
          Crear Servidor
        </Button>
      </div>
    </Card>
  );
};

export default PlanCard;
