
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { plansData } from "@/data/plans";
import { CheckIcon, XIcon } from "lucide-react";

const PlanComparison: React.FC = () => {
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
              {plansData.map((plan, index) => (
                <TableRow key={index} className={plan.highlight ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.resources.cpu.value} {plan.resources.cpu.unit}</TableCell>
                  <TableCell>{plan.resources.ram.value} {plan.resources.ram.unit}</TableCell>
                  <TableCell>{plan.resources.disk.value} {plan.resources.disk.unit}</TableCell>
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
                <TableHead>Mínimo Créditos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plansData.map((plan, index) => (
                <TableRow key={index} className={plan.highlight ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="max-w-[300px] whitespace-normal">{plan.description.idealFor}</TableCell>
                  <TableCell className="max-w-[300px] whitespace-normal">{plan.description.perfectFor}</TableCell>
                  <TableCell><CheckIcon className="h-4 w-4 text-green-500" /></TableCell>
                  <TableCell>{plan.minCredits.toLocaleString('es-ES')}</TableCell>
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
