
import React, { useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/api";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Pencil, Trash2, Check, X, AlertTriangle } from "lucide-react";

// Define plan type
interface PlanType {
  id?: number;
  name: string;
  type: string;
  price: number;
  discountPrice?: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  recommended: boolean;
  order: number;
  active: boolean;
}

const planTypes = [
  { id: "hosting", label: "Game Hosting" },
  { id: "vps", label: "VPS" },
  { id: "dedicated", label: "Dedicated Servers" }
];

const initialPlanState: PlanType = {
  name: "",
  type: "hosting",
  price: 0,
  discountPrice: 0,
  currency: "EUR",
  period: "month",
  description: "",
  features: [],
  recommended: false,
  order: 0,
  active: true
};

const PlansManager: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedType, setSelectedType] = useState(type || "hosting");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanType | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>(initialPlanState);
  const [newFeature, setNewFeature] = useState("");
  
  // Select plan type tab
  useEffect(() => {
    if (type && planTypes.find(t => t.id === type)) {
      setSelectedType(type);
    }
  }, [type]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setSelectedType(value);
    navigate(`/admin/plans/${value}`);
  };

  // Fetch plans of the selected type
  const {
    data: plans,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['plans', selectedType],
    queryFn: () => adminApi.getPlans(selectedType)
  });
  
  // Create new plan
  const createMutation = useMutation({
    mutationFn: (plan: PlanType) => adminApi.createPlan(plan),
    onSuccess: () => {
      toast({
        title: "Plan creado",
        description: "El plan ha sido creado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['plans', selectedType] });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el plan: ${error}`,
      });
    }
  });
  
  // Update plan
  const updateMutation = useMutation({
    mutationFn: ({id, planData}: {id: number, planData: PlanType}) => {
      return adminApi.updatePlan(id, planData);
    },
    onSuccess: () => {
      toast({
        title: "Plan actualizado",
        description: "El plan ha sido actualizado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['plans', selectedType] });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar el plan: ${error}`,
      });
    }
  });
  
  // Delete plan
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deletePlan(id),
    onSuccess: () => {
      toast({
        title: "Plan eliminado",
        description: "El plan ha sido eliminado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['plans', selectedType] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el plan: ${error}`,
      });
    }
  });

  // Reset form
  const resetForm = () => {
    setCurrentPlan({
      ...initialPlanState,
      type: selectedType
    });
    setEditingPlan(null);
  };
  
  // Open create dialog
  const handleCreateClick = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  // Open edit dialog
  const handleEditClick = (plan: PlanType) => {
    setEditingPlan(plan);
    setCurrentPlan({
      ...plan,
      features: Array.isArray(plan.features) ? plan.features : []
    });
    setIsDialogOpen(true);
  };
  
  // Open delete dialog
  const handleDeleteClick = (plan: PlanType) => {
    setEditingPlan(plan);
    setIsDeleteDialogOpen(true);
  };
  
  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPlan && editingPlan.id) {
      updateMutation.mutate({ id: editingPlan.id, planData: currentPlan });
    } else {
      createMutation.mutate(currentPlan);
    }
  };
  
  // Add feature to plan
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    setCurrentPlan(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()]
    }));
    setNewFeature("");
  };
  
  // Remove feature from plan
  const handleRemoveFeature = (index: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Planes</h1>
        <Button onClick={handleCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>

      <Tabs defaultValue={selectedType} value={selectedType} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          {planTypes.map(type => (
            <TabsTrigger key={type.id} value={type.id}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {planTypes.map(type => (
          <TabsContent key={type.id} value={type.id} className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-500">Error</CardTitle>
                  <CardDescription>
                    Ocurrió un error al cargar los planes: {String(error)}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['plans', selectedType] })}
                  >
                    Reintentar
                  </Button>
                </CardFooter>
              </Card>
            ) : Array.isArray(plans) && plans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Descuento</TableHead>
                    <TableHead className="text-center">Destacado</TableHead>
                    <TableHead className="text-center">Activo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(plans) && plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.order}</TableCell>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>
                        {plan.price} {plan.currency}/{plan.period}
                      </TableCell>
                      <TableCell>
                        {plan.discountPrice ? `${plan.discountPrice} ${plan.currency}` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {plan.recommended ? <Check size={18} className="mx-auto text-green-500" /> : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {plan.active ? <Check size={18} className="mx-auto text-green-500" /> : <X size={18} className="mx-auto text-red-500" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(plan)}>
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClick(plan)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No hay planes</CardTitle>
                  <CardDescription>
                    No se encontraron planes para esta categoría.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={handleCreateClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Plan
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Create/Edit Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Editar Plan" : "Nuevo Plan"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Modifica los detalles del plan seleccionado"
                : "Rellena los detalles para crear un nuevo plan"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={currentPlan.name}
                  onChange={(e) =>
                    setCurrentPlan({
                      ...currentPlan,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={currentPlan.type}
                  onValueChange={(value) =>
                    setCurrentPlan({
                      ...currentPlan,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {planTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={currentPlan.price}
                  onChange={(e) =>
                    setCurrentPlan({
                      ...currentPlan,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Precio con descuento (opcional)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  value={currentPlan.discountPrice || ""}
                  onChange={(e) =>
                    setCurrentPlan({
                      ...currentPlan,
                      discountPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Select
                  value={currentPlan.currency}
                  onValueChange={(value) =>
                    setCurrentPlan({
                      ...currentPlan,
                      currency: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Periodo</Label>
                <Select
                  value={currentPlan.period}
                  onValueChange={(value) =>
                    setCurrentPlan({
                      ...currentPlan,
                      period: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Mensual</SelectItem>
                    <SelectItem value="year">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Orden</Label>
                <Input
                  id="order"
                  type="number"
                  value={currentPlan.order}
                  onChange={(e) =>
                    setCurrentPlan({
                      ...currentPlan,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="recommended"
                  checked={currentPlan.recommended}
                  onCheckedChange={(checked) =>
                    setCurrentPlan({
                      ...currentPlan,
                      recommended: checked === true,
                    })
                  }
                />
                <label
                  htmlFor="recommended"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Destacado
                </label>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="active"
                  checked={currentPlan.active}
                  onCheckedChange={(checked) =>
                    setCurrentPlan({
                      ...currentPlan,
                      active: checked === true,
                    })
                  }
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Activo
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={currentPlan.description}
                onChange={(e) =>
                  setCurrentPlan({
                    ...currentPlan,
                    description: e.target.value,
                  })
                }
                rows={3}
                required
              />
            </div>
            <div className="mt-4">
              <Label>Características</Label>
              <div className="flex mt-1 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Nueva característica"
                  className="mr-2"
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  variant="secondary"
                >
                  Añadir
                </Button>
              </div>
              <div className="border rounded-md p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
                {currentPlan.features && currentPlan.features.length > 0 ? (
                  <ul className="space-y-1">
                    {currentPlan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-1 hover:bg-muted/50 rounded"
                      >
                        <span>{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFeature(index)}
                          className="h-6 w-6 text-red-500"
                        >
                          <X size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground p-4">
                    No hay características añadidas
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingPlan ? "Actualizar" : "Crear"} Plan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el plan <span className="font-semibold">{editingPlan?.name}</span>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => editingPlan?.id && deleteMutation.mutate(editingPlan.id)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManager;
