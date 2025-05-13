
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, XIcon } from "lucide-react";

interface PlanResource {
  value: string | number;
  unit: string;
}

interface PlanDescription {
  idealFor: string;
  perfectFor: string;
}

interface Plan {
  name: string;
  price: number;
  resources: {
    cpu: PlanResource;
    ram: PlanResource;
    disk: PlanResource;
    backups: number;
    databases: number;
    ports: number;
  };
  billing: string;
  minCredits: number;
  description: PlanDescription;
  highlight?: boolean;
}

interface PlanComparisonProps {
  plans: Plan[];
}

const PlanComparison: React.FC<PlanComparisonProps> = ({ plans = [] }) => {
  // Ensure plans is always an array
  const plansList = Array.isArray(plans) ? plans : [];
  
  return (
    <div className="w-full">
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="specs">Especificaciones</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
        </TabsList>
        
        <TabsContent value="specs" className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Plan</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Disco</TableHead>
                <TableHead>Copias de Seguridad</TableHead>
                <TableHead>MySQL Bases de Datos</TableHead>
                <TableHead>Asignaciones</TableHead>
                <TableHead>Precio (€/mes)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plansList.map((plan, index) => (
                <TableRow key={index} className={plan.highlight ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium whitespace-nowrap">{plan.name}</TableCell>
                  <TableCell>{plan.resources.cpu.value} {plan.resources.cpu.unit}</TableCell>
                  <TableCell>
                    {typeof plan.resources.ram.value === 'number' && plan.resources.ram.value >= 1024 
                      ? `${(plan.resources.ram.value / 1024).toFixed(1)} GB` 
                      : `${plan.resources.ram.value} ${plan.resources.ram.unit}`}
                  </TableCell>
                  <TableCell>
                    {typeof plan.resources.disk.value === 'number' && plan.resources.disk.value >= 1024 
                      ? `${(plan.resources.disk.value / 1024).toFixed(1)} GB` 
                      : `${plan.resources.disk.value} ${plan.resources.disk.unit}`}
                  </TableCell>
                  <TableCell>{plan.resources.backups}</TableCell>
                  <TableCell>{plan.resources.databases}</TableCell>
                  <TableCell>{plan.resources.ports}</TableCell>
                  <TableCell className="font-medium">{plan.price} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="features" className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Plan</TableHead>
                <TableHead>Ideal Para</TableHead>
                <TableHead>Perfecto Para</TableHead>
                <TableHead>Sin Límite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plansList.map((plan, index) => (
                <TableRow key={index} className={plan.highlight ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium whitespace-nowrap">{plan.name}</TableCell>
                  <TableCell className="max-w-[300px] whitespace-normal">{plan.description.idealFor}</TableCell>
                  <TableCell className="max-w-[300px] whitespace-normal">{plan.description.perfectFor}</TableCell>
                  <TableCell><CheckIcon className="h-4 w-4 text-green-500" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanComparison;
