
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gamesApi } from "@/lib/api";
import { toast } from "sonner";
import { PlusCircle, FileEdit, Trash2, Gamepad2, Upload, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GameFormProps {
  initialGame?: any;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ initialGame, onSubmit, onCancel, isSubmitting }) => {
  const [game, setGame] = useState({
    id: initialGame?.id || 0,
    name: initialGame?.name || "",
    slug: initialGame?.slug || "",
    description: initialGame?.description || "",
    category: initialGame?.category || "survival",
    popular: initialGame?.popular || false,
    image_url: initialGame?.image_url || ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialGame?.image_url || "");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGame(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name if it's a new game
    if (name === 'name' && (!initialGame || !initialGame.slug)) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setGame(prev => ({ ...prev, slug }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setGame(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePopularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGame(prev => ({ ...prev, popular: e.target.checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.entries(game).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del Juego</Label>
          <Input 
            id="name" 
            name="name" 
            value={game.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input 
            id="slug" 
            name="slug" 
            value={game.slug} 
            onChange={handleChange} 
            required 
          />
          <p className="text-xs text-muted-foreground mt-1">
            Identificador único para URLs
          </p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={game.description} 
          onChange={handleChange} 
          rows={3} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select 
            value={game.category}
            onValueChange={(value) => handleSelectChange(value, 'category')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="survival">Supervivencia</SelectItem>
              <SelectItem value="sandbox">Sandbox</SelectItem>
              <SelectItem value="adventure">Aventura</SelectItem>
              <SelectItem value="rpg">RPG</SelectItem>
              <SelectItem value="fps">FPS</SelectItem>
              <SelectItem value="strategy">Estrategia</SelectItem>
              <SelectItem value="simulation">Simulación</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <div className="flex items-center h-10 space-x-2">
            <input 
              type="checkbox" 
              id="popular" 
              className="w-4 h-4 rounded border-gray-300" 
              checked={game.popular}
              onChange={handlePopularChange}
            />
            <Label htmlFor="popular">Juego Popular</Label>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="image">Imagen</Label>
        <div className="flex items-center gap-4 mt-2">
          <div className="border rounded flex flex-col items-center justify-center bg-muted/20 w-32 h-32">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                <Gamepad2 className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">No hay imagen</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="border border-dashed rounded-md p-4 text-center hover:bg-muted/20 transition-colors">
                <Upload className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Haga clic para subir</p>
                <p className="text-xs text-muted-foreground">SVG, PNG o JPG (max. 2MB)</p>
              </div>
              <Input 
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </Label>
            {initialGame?.image_url && !imageFile && (
              <p className="text-xs text-muted-foreground mt-2">
                Se mantendrá la imagen actual si no sube una nueva
              </p>
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialGame ? "Actualizando..." : "Guardando..."}
            </>
          ) : (
            initialGame ? "Actualizar Juego" : "Guardar Juego"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

const GamesManager: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [search, setSearch] = useState("");
  
  const queryClient = useQueryClient();
  
  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games-admin'],
    queryFn: gamesApi.getGames,
  });
  
  const { mutate: createGame, isPending: isCreating } = useMutation({
    mutationFn: gamesApi.createGame,
    onSuccess: () => {
      toast.success("Juego añadido correctamente");
      queryClient.invalidateQueries({ queryKey: ['games-admin'] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Error al añadir juego");
      console.error("Error al crear juego:", error);
    }
  });
  
  const { mutate: updateGame, isPending: isUpdating } = useMutation({
    mutationFn: ({id, formData}: {id: number, formData: FormData}) => gamesApi.updateGame(id, formData),
    onSuccess: () => {
      toast.success("Juego actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ['games-admin'] });
      setIsEditDialogOpen(false);
      setSelectedGame(null);
    },
    onError: (error) => {
      toast.error("Error al actualizar juego");
      console.error("Error al actualizar juego:", error);
    }
  });
  
  const { mutate: deleteGame, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => gamesApi.deleteGame(id),
    onSuccess: () => {
      toast.success("Juego eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ['games-admin'] });
      setIsDeleteDialogOpen(false);
      setSelectedGame(null);
    },
    onError: (error) => {
      toast.error("Error al eliminar juego");
      console.error("Error al eliminar juego:", error);
    }
  });
  
  const handleCreateGame = (formData: FormData) => {
    createGame(formData);
  };
  
  const handleUpdateGame = (formData: FormData) => {
    if (selectedGame) {
      updateGame({id: selectedGame.id, formData});
    }
  };
  
  const handleDeleteGame = () => {
    if (selectedGame) {
      deleteGame(selectedGame.id);
    }
  };
  
  const handleEditGame = (game: any) => {
    setSelectedGame(game);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (game: any) => {
    setSelectedGame(game);
    setIsDeleteDialogOpen(true);
  };
  
  const filteredGames = Array.isArray(games) 
    ? games.filter((game: any) => 
        game.name?.toLowerCase().includes(search.toLowerCase()) || 
        game.description?.toLowerCase().includes(search.toLowerCase()) ||
        game.category?.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Juegos Soportados</h1>
          <p className="text-muted-foreground">
            Gestiona los juegos que ofreces en tu plataforma
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Juego
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Juegos</CardTitle>
            <CardDescription>
              Lista de juegos soportados en tu plataforma
            </CardDescription>
          </div>
          <div className="w-80">
            <Input
              placeholder="Buscar juegos..."
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
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              {search ? (
                <p className="text-muted-foreground">No se encontraron juegos que coincidan con tu búsqueda</p>
              ) : (
                <>
                  <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No hay juegos configurados</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Añade algunos juegos para mostrarlos en tu web
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Juego
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game: any) => (
                    <TableRow key={game.id}>
                      <TableCell>
                        {game.image_url ? (
                          <img 
                            src={game.image_url} 
                            alt={game.name} 
                            className="w-10 h-10 object-contain rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                            <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {game.name}
                        <div className="text-xs text-muted-foreground mt-1">
                          {game.description ? (
                            game.description.length > 50 ? 
                              `${game.description.substring(0, 50)}...` : 
                              game.description
                          ) : (
                            'Sin descripción'
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{game.category || 'Sin categoría'}</TableCell>
                      <TableCell>
                        {game.popular ? (
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
                            onClick={() => handleEditGame(game)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(game)}
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
      
      {/* Add Game Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Juego</DialogTitle>
            <DialogDescription>
              Añade un nuevo juego a la plataforma
            </DialogDescription>
          </DialogHeader>
          <GameForm 
            onSubmit={handleCreateGame}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Game Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Juego</DialogTitle>
            <DialogDescription>
              Modifica los detalles del juego
            </DialogDescription>
          </DialogHeader>
          <GameForm 
            initialGame={selectedGame}
            onSubmit={handleUpdateGame}
            onCancel={() => setIsEditDialogOpen(false)}
            isSubmitting={isUpdating}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Game Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el juego "{selectedGame?.name}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteGame} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Juego'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesManager;
