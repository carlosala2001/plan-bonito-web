
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from 'react-router-dom';
import { plansApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle, PlusCircle, FileEdit, Trash2, Loader2 } from 'lucide-react';

interface PlanFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const PlanForm: React.FC<PlanFormProps> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    type: 'hosting',
    resources: {
      cpu: { value: '1', unit: 'vCores' },
      ram: { value: 1024, unit: 'MB' },
      disk: { value: 5120, unit: 'MB' },
      backups: 1,
      databases: 1,
      ports: 1
    },
    billing: 'por Mes',
    minCredits: 10000,
    description: {
      idealFor: '',
      perfectFor: ''
    },
    highlight: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: Number(value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    }
  };

  const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [_, resource, property] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        [resource]: {
          ...prev.resources[resource as keyof typeof prev.resources],
          [property]: property === 'value' && resource !== 'cpu' ? Number(value) : value
        }
      }
    }));
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleToggleHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlight: !prev.highlight
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del Plan</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div>
          <Label htmlFor="price">Precio (€)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            step="0.01" 
            value={formData.price} 
            onChange={handleNumberChange} 
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Plan</Label>
          <Select value={formData.type} onValueChange={(value) => handleSelectChange(value, 'type')}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hosting">Hosting (Game Servers)</SelectItem>
              <SelectItem value="vps">VPS (Servidores Virtuales)</SelectItem>
              <SelectItem value="metal">Metal (Servidores Dedicados)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="billing">Facturación</Label>
          <Input id="billing" name="billing" value={formData.billing} onChange={handleChange} />
        </div>
        
        <div>
          <Label htmlFor="minCredits">Créditos Mínimos</Label>
          <Input 
            id="minCredits" 
            name="minCredits" 
            type="number" 
            value={formData.minCredits} 
            onChange={handleNumberChange} 
          />
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-md">
        <h3 className="font-medium mb-3">Recursos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="resources.cpu.value">CPU (valor)</Label>
            <Input 
              id="resources.cpu.value" 
              name="resources.cpu.value" 
              value={formData.resources.cpu.value} 
              onChange={handleResourceChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="resources.cpu.unit">CPU (unidad)</Label>
            <Input 
              id="resources.cpu.unit" 
              name="resources.cpu.unit" 
              value={formData.resources.cpu.unit} 
              onChange={handleResourceChange} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="resources.ram.value">RAM (valor)</Label>
            <Input 
              id="resources.ram.value" 
              name="resources.ram.value" 
              type="number" 
              value={formData.resources.ram.value} 
              onChange={handleResourceChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="resources.ram.unit">RAM (unidad)</Label>
            <Input 
              id="resources.ram.unit" 
              name="resources.ram.unit" 
              value={formData.resources.ram.unit} 
              onChange={handleResourceChange} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="resources.disk.value">Disco (valor)</Label>
            <Input 
              id="resources.disk.value" 
              name="resources.disk.value" 
              type="number" 
              value={formData.resources.disk.value} 
              onChange={handleResourceChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="resources.disk.unit">Disco (unidad)</Label>
            <Input 
              id="resources.disk.unit" 
              name="resources.disk.unit" 
              value={formData.resources.disk.unit} 
              onChange={handleResourceChange} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="resources.backups">Copias de Seguridad</Label>
            <Input 
              id="resources.backups" 
              name="resources.backups" 
              type="number" 
              value={formData.resources.backups} 
              onChange={handleNumberChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="resources.databases">Bases de Datos</Label>
            <Input 
              id="resources.databases" 
              name="resources.databases" 
              type="number" 
              value={formData.resources.databases} 
              onChange={handleNumberChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="resources.ports">Puertos</Label>
            <Input 
              id="resources.ports" 
              name="resources.ports" 
              type="number" 
              value={formData.resources.ports} 
              onChange={handleNumberChange} 
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="description.idealFor">Ideal Para</Label>
          <Textarea 
            id="description.idealFor" 
            name="description.idealFor" 
            value={formData.description.idealFor} 
            onChange={handleChange}
            rows={2}
          />
        </div>
        
        <div>
          <Label htmlFor="description.perfectFor">Perfecto Para</Label>
          <Textarea 
            id="description.perfectFor" 
            name="description.perfectFor" 
            value={formData.description.perfectFor} 
            onChange={handleChange}
            rows={2}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          type="button" 
          variant={formData.highlight ? "default" : "outline"} 
          onClick={handleToggleHighlight}
          className={formData.highlight ? "bg-primary" : ""}
        >
          <CheckCircle className={`mr-2 h-4 w-4 ${formData.highlight ? "" : "text-muted-foreground"}`} />
          Plan Destacado
        </Button>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Plan'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

const PlansManager: React.FC = () => {
  const { type = 'hosting' } = useParams<{ type?: string }>();
  const [planType, setPlanType] = useState<'hosting' | 'vps' | 'metal'>(
    type === 'vps' || type === 'metal' ? type : 'hosting'
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans', planType],
    queryFn: () => plansApi.getPlans(planType),
  });

  const { mutate: createPlan, isPending: isCreating } = useMutation({
    mutationFn: plansApi.createPlan,
    onSuccess: () => {
      toast.success('Plan creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating plan:', error);
      toast.error('Error al crear el plan');
    },
  });

  const { mutate: updatePlan, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => plansApi.updatePlan(id, data),
    onSuccess: () => {
      toast.success('Plan actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      console.error('Error updating plan:', error);
      toast.error('Error al actualizar el plan');
    },
  });

  const { mutate: deletePlan, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => plansApi.deletePlan(id),
    onSuccess: () => {
      toast.success('Plan eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      console.error('Error deleting plan:', error);
      toast.error('Error al eliminar el plan');
    },
  });

  const handleSubmitPlan = (data: any) => {
    createPlan({
      ...data,
      type: planType
    });
  };

  const handleUpdatePlan = (data: any) => {
    if (!selectedPlan) return;
    updatePlan({
      id: selectedPlan.id,
      data: {
        ...data,
        type: planType
      }
    });
  };

  const handleDeletePlan = () => {
    if (!selectedPlan) return;
    deletePlan(selectedPlan.id);
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (plan: any) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Planes</h1>
          <p className="text-muted-foreground">
            Administra los planes de servicio que ofreces a tus clientes
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Plan
        </Button>
      </div>

      <Tabs defaultValue={planType} onValueChange={(value) => setPlanType(value as 'hosting' | 'vps' | 'metal')}>
        <TabsList className="mb-4">
          <TabsTrigger value="hosting">Game Servers</TabsTrigger>
          <TabsTrigger value="vps">VPS</TabsTrigger>
          <TabsTrigger value="metal">Dedicados</TabsTrigger>
        </TabsList>

        <TabsContent value={planType}>
          <Card>
            <CardHeader>
              <CardTitle>Planes de {planType === 'hosting' ? 'Game Servers' : planType === 'vps' ? 'VPS' : 'Servidores Dedicados'}</CardTitle>
              <CardDescription>
                Listado de planes disponibles y sus características
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">No hay planes disponibles</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                    Añadir un plan
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>CPU</TableHead>
                        <TableHead>RAM</TableHead>
                        <TableHead>Disco</TableHead>
                        <TableHead>Destacado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(plans) && plans.map((plan) => (
                        <TableRow key={plan.id} className={plan.highlight ? "bg-primary/5" : ""}>
                          <TableCell className="font-medium">{plan.name}</TableCell>
                          <TableCell>{plan.price} €</TableCell>
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
                          <TableCell>
                            {plan.highlight ? (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            ) : null}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditPlan(plan)}>
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(plan)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Plan</DialogTitle>
            <DialogDescription>
              Complete los detalles para crear un nuevo plan
            </DialogDescription>
          </DialogHeader>
          <PlanForm 
            onSubmit={handleSubmitPlan}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Plan</DialogTitle>
            <DialogDescription>
              Modifique los detalles del plan seleccionado
            </DialogDescription>
          </DialogHeader>
          <PlanForm 
            initialData={selectedPlan}
            onSubmit={handleUpdatePlan}
            onCancel={() => setIsEditDialogOpen(false)}
            isSubmitting={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar este plan? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePlan} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Plan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManager;
