
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PlusCircle, FileEdit, Trash2, Globe, Eye, Loader2 } from "lucide-react";

const PagesManager: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: pagesApi.getPages,
  });
  
  const { mutate: deletePage, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => pagesApi.deletePage(id),
    onSuccess: () => {
      toast.success('Página eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting page:', error);
      toast.error('Error al eliminar la página');
    }
  });
  
  const handleDeletePage = () => {
    if (selectedPage) {
      deletePage(selectedPage.id);
    }
  };

  const filteredPages = Array.isArray(pages) 
    ? pages.filter((page: any) => 
        page.title?.toLowerCase().includes(search.toLowerCase()) || 
        page.slug?.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestor de Páginas</h1>
          <p className="text-muted-foreground">
            Cree y gestione las páginas de su sitio web
          </p>
        </div>
        <Button onClick={() => navigate('/admin/pages/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Página
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Páginas</CardTitle>
            <CardDescription>
              Lista de todas las páginas de su sitio web
            </CardDescription>
          </div>
          <div className="w-80">
            <Input
              placeholder="Buscar páginas..."
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
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              {search ? (
                <p className="text-muted-foreground">No se encontraron páginas que coincidan con su búsqueda</p>
              ) : (
                <>
                  <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No hay páginas</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Comience creando su primera página
                  </p>
                  <Button onClick={() => navigate('/admin/pages/new')} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva Página
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Última Actualización</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page: any) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="font-mono text-sm">/{page.slug}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${page.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}`} />
                          <span className="capitalize">{page.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(page.updated_at || page.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/${page.slug}`, '_blank')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/pages/${page.id}`)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setSelectedPage(page);
                              setIsDeleteDialogOpen(true);
                            }}
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
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar la página "{selectedPage?.title}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePage} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Página'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PagesManager;
