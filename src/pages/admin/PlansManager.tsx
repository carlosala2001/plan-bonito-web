
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "@/lib/api";
import { toast } from "sonner";
import { PlusCircle, FileEdit, Trash2, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlanFormProps {
  initialPlan?: any;
  planType: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface PlanType {
  id?: number;
  name: string;
  price: number;
  interval: string;
  type: string;
  popular?: boolean;
  features?: string[];
  description?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  bandwidth?: string;
  backups?: string;
  databases?: string;
  ddos_protection?: boolean;
  order?: number;
}

const PlanForm: React.FC<PlanFormProps> = ({ initialPlan, planType, onSubmit, onCancel, isSubmitting }) => {
  const [plan, setPlan] = useState<PlanType>({
    name: initialPlan?.name || "",
    price: initialPlan?.price || 0,
    interval: initialPlan?.interval || "monthly",
    type: planType,
    popular: initialPlan?.popular || false,
    description: initialPlan?.description || "",
    features: initialPlan?.features || [],
    cpu: initialPlan?.cpu || "",
    ram: initialPlan?.ram || "",
    storage: initialPlan?.storage || "",
    bandwidth: initialPlan?.bandwidth || "",
    backups: initialPlan?.backups || "Daily",
    databases: initialPlan?.databases || "Unlimited",
    ddos_protection: initialPlan?.ddos_protection || true,
    order: initialPlan?.order || 0,
  });
  
  const [featureInput, setFeatureInput] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPlan({ ...plan, [name]: checked });
    } else if (type === 'number') {
      setPlan({ ...plan, [name]: parseFloat(value) });
    } else {
      setPlan({ ...plan, [name]: value });
    }
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setPlan({ ...plan, [name]: value });
  };
  
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setPlan({
        ...plan,
        features: [...(plan.features || []), featureInput.trim()]
      });
      setFeatureInput("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...(plan.features || [])];
    newFeatures.splice(index, 1);
    setPlan({ ...plan, features: newFeatures });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Include the ID if we're editing
    const submitData = initialPlan?.id 
      ? { ...plan, id: initialPlan.id }
      : plan;
    onSubmit(submitData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del Plan</Label>
          <Input id="name" name="name" value={plan.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="price">Precio (€)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            min="0" 
            step="0.01" 
            value={plan.price} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="interval">Intervalo de Facturación</Label>
          <Select 
            value={plan.interval}
            onValueChange={(value) => handleSelectChange(value, 'interval')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar intervalo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="semiannual">Semestral</SelectItem>
              <SelectItem value="annual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <div className="flex items-center h-10 space-x-2">
            <input 
              type="checkbox" 
              id="popular" 
              name="popular"
              className="w-4 h-4 rounded border-gray-300" 
              checked={plan.popular}
              onChange={handleChange}
            />
            <Label htmlFor="popular">Plan Popular</Label>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={plan.description || ""} 
          onChange={handleChange} 
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cpu">CPU</Label>
          <Input id="cpu" name="cpu" value={plan.cpu} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="ram">RAM</Label>
          <Input id="ram" name="ram" value={plan.ram} onChange={handleChange} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="storage">Almacenamiento</Label>
          <Input id="storage" name="storage" value={plan.storage} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="bandwidth">Ancho de Banda</Label>
          <Input id="bandwidth" name="bandwidth" value={plan.bandwidth} onChange={handleChange} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="backups">Copias de Seguridad</Label>
          <Select 
            value={plan.backups}
            onValueChange={(value) => handleSelectChange(value, 'backups')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Diarias</SelectItem>
              <SelectItem value="Weekly">Semanales</SelectItem>
              <SelectItem value="None">Ninguna</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="databases">Bases de Datos</Label>
          <Input id="databases" name="databases" value={plan.databases} onChange={handleChange} />
        </div>
        <div className="flex items-end">
          <div className="flex items-center h-10 space-x-2">
            <input 
              type="checkbox" 
              id="ddos_protection" 
              name="ddos_protection"
              className="w-4 h-4 rounded border-gray-300" 
              checked={plan.ddos_protection}
              onChange={handleChange}
            />
            <Label htmlFor="ddos_protection">Protección DDoS</Label>
          </div>
        </div>
      </div>
      
      <div>
        <Label>Características</Label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="Nueva característica"
          />
          <Button type="button" onClick={handleAddFeature} variant="outline">Agregar</Button>
        </div>
        <div className="border rounded-md p-3 bg-muted/20">
          {!plan.features?.length && (
            <p className="text-muted-foreground text-center py-2 text-sm">No hay características agregadas</p>
          )}
          <ul className="space-y-1">
            {plan.features?.map((feature, index) => (
              <li key={index} className="flex justify-between items-center bg-background rounded p-2">
                <span>{feature}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleRemoveFeature(index)} 
                  className="h-7 w-7"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div>
        <Label htmlFor="order">Orden</Label>
        <Input 
          id="order" 
          name="order" 
          type="number" 
          min="0" 
          value={plan.order} 
          onChange={handleChange}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Determina el orden de visualización (menor número primero)
        </p>
      </div>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialPlan ? "Actualizando..." : "Guardando..."}
            </>
          ) : (
            initialPlan ? "Actualizar Plan" : "Guardar Plan"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

const PlansManager: React.FC = () => {
  const { type = 'hosting' } = useParams<{type?: string}>();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [search, setSearch] = useState("");
  
  const queryClient = useQueryClient();
  
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans', type],
    queryFn: () => plansApi.getPlans(type as 'hosting' | 'vps' | 'metal'),
  });
  
  const { mutate: createPlan, isPending: isCreating } = useMutation({
    mutationFn: plansApi.createPlan,
    onSuccess: () => {
      toast.success("Plan añadido correctamente");
      queryClient.invalidateQueries({ queryKey: ['plans', type] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Error al añadir plan");
      console.error("Error al añadir plan:", error);
    }
  });
  
  const { mutate: updatePlan, isPending: isUpdating } = useMutation({
    mutationFn: plansApi.updatePlan,
    onSuccess: () => {
      toast.success("Plan actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ['plans', type] });
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      toast.error("Error al actualizar plan");
      console.error("Error al actualizar plan:", error);
    }
  });
  
  const { mutate: deletePlan, isPending: isDeleting } = useMutation({
    mutationFn: plansApi.deletePlan,
    onSuccess: () => {
      toast.success("Plan eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ['plans', type] });
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      toast.error("Error al eliminar plan");
      console.error("Error al eliminar plan:", error);
    }
  });
  
  const handleCreatePlan = (data: any) => {
    createPlan(data);
  };
  
  const handleUpdatePlan = (data: any) => {
    if (data.id) {
      updatePlan({ id: data.id, planData: data });
    }
  };
  
  const handleDeletePlan = () => {
    if (selectedPlan?.id) {
      deletePlan(selectedPlan.id);
    }
  };
  
  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (plan: any) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };
  
  const handleTypeChange = (newType: string) => {
    navigate(`/admin/plans/${newType}`);
  };
  
  const filteredPlans = Array.isArray(plans) 
    ? plans.filter((plan: any) => 
        plan.name?.toLowerCase().includes(search.toLowerCase()) || 
        plan.description?.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  
  const typeNames = {
    hosting: "Hosting de Juegos",
    vps: "Servidores VPS",
    metal: "Servidores Dedicados"
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Planes</h1>
          <p className="text-muted-foreground">
            Administra los planes que ofreces a tus clientes
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Plan
        </Button>
      </div>
      
      <Tabs value={type} onValueChange={handleTypeChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="hosting">Hosting</TabsTrigger>
          <TabsTrigger value="vps">VPS</TabsTrigger>
          <TabsTrigger value="metal">Dedicados</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{typeNames[type as keyof typeof typeNames] || "Planes"}</CardTitle>
            <CardDescription>
              Listado de planes de {typeNames[type as keyof typeof typeNames]?.toLowerCase() || "servicios"}
            </CardDescription>
          </div>
          <div className="w-80">
            <Input
              placeholder="Buscar planes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              {search ? (
                <p className="text-muted-foreground">No se encontraron planes que coincidan con tu búsqueda</p>
              ) : (
                <>
                  <div className="mx-auto h-12 w-12 text-muted-foreground flex items-center justify-center border border-dashed rounded-full">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No hay planes configurados</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Añade algunos planes para mostrarlos en tu web
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Plan
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Recursos</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan: any) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        {plan.name}
                        <div className="text-xs text-muted-foreground mt-1">
                          {plan.description ? (
                            plan.description.length > 50 ? 
                              `${plan.description.substring(0, 50)}...` : 
                              plan.description
                          ) : (
                            'Sin descripción'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.price} € / {plan.interval === 'monthly' 
                          ? 'mes' 
                          : plan.interval === 'quarterly' 
                            ? 'trimestre' 
                            : plan.interval === 'semiannual' 
                              ? 'semestre' 
                              : 'año'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {plan.cpu && <div>CPU: {plan.cpu}</div>}
                          {plan.ram && <div>RAM: {plan.ram}</div>}
                          {plan.storage && <div>Almacenamiento: {plan.storage}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.popular ? (
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full mr-2 bg-primary" />
                            <span>Sí</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full mr-2 bg-muted" />
                            <span className="text-muted-foreground">No</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditPlan(plan)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(plan)}
                          >
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
      
      {/* Add Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Añadir Plan</DialogTitle>
            <DialogDescription>
              Añade un nuevo plan a tu catálogo de servicios
            </DialogDescription>
          </DialogHeader>
          <PlanForm 
            planType={type}
            onSubmit={handleCreatePlan}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Plan</DialogTitle>
            <DialogDescription>
              Modifica los detalles del plan seleccionado
            </DialogDescription>
          </DialogHeader>
          <PlanForm 
            initialPlan={selectedPlan}
            planType={type}
            onSubmit={handleUpdatePlan}
            onCancel={() => setIsEditDialogOpen(false)}
            isSubmitting={isUpdating}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Plan Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el plan "{selectedPlan?.name}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
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
