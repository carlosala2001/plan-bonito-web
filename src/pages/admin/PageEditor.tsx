
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagesApi } from '@/lib/api';
import { toast } from 'sonner';
import { CheckIcon, ChevronLeft, Eye, Save, Loader2, FileCode, Image, Layout, LayoutDashboard, Type } from 'lucide-react';

const PageEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState<any>({ sections: [] });
  
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    meta_description: '',
    status: 'draft',
    content: JSON.stringify({ sections: [] }),
    layout: 'default'
  });
  
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: () => id !== 'new' ? pagesApi.getPage(id!) : null,
    enabled: !!id && id !== 'new',
  });
  
  const { mutate: createPage, isPending: isCreating } = useMutation({
    mutationFn: pagesApi.createPage,
    onSuccess: (createdPage) => {
      toast.success('Página creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      navigate(`/admin/pages/${createdPage.id}`);
    }
  });
  
  const { mutate: updatePage, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => pagesApi.updatePage(id, data),
    onSuccess: () => {
      toast.success('Página actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', id] });
    }
  });
  
  // Initialize form when page data loads
  useEffect(() => {
    if (page) {
      setPageData({
        title: page.title || '',
        slug: page.slug || '',
        meta_description: page.meta_description || '',
        status: page.status || 'draft',
        content: page.content || JSON.stringify({ sections: [] }),
        layout: page.layout || 'default'
      });
      
      try {
        const parsedContent = typeof page.content === 'string' 
          ? JSON.parse(page.content) 
          : page.content;
        setContent(parsedContent || { sections: [] });
      } catch (error) {
        console.error('Error parsing content:', error);
        setContent({ sections: [] });
      }
    }
  }, [page]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setPageData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSection = (type: string) => {
    const newSection: any = { type, id: Date.now().toString() };
    
    switch (type) {
      case 'hero':
        newSection.title = 'Título Principal';
        newSection.subtitle = 'Subtítulo descriptivo para captar la atención';
        newSection.buttonText = 'Ver Más';
        newSection.buttonUrl = '#features';
        break;
      case 'features':
        newSection.title = 'Características';
        newSection.subtitle = 'Descubre nuestras características principales';
        newSection.features = [
          { title: 'Característica 1', description: 'Descripción de la característica 1' },
          { title: 'Característica 2', description: 'Descripción de la característica 2' },
          { title: 'Característica 3', description: 'Descripción de la característica 3' }
        ];
        break;
      case 'text':
        newSection.heading = 'Encabezado';
        newSection.content = 'Contenido de texto...';
        break;
      case 'image':
        newSection.url = '';
        newSection.alt = 'Descripción de la imagen';
        break;
      case 'partners':
        newSection.title = 'Nuestros Partners';
        newSection.subtitle = 'Trabajamos con las mejores empresas';
        newSection.partners = [
          { name: 'Partner 1', logo: '' }
        ];
        break;
      case 'technologies':
        newSection.title = 'Tecnologías Disponibles';
        newSection.subtitle = 'Múltiples opciones para tus proyectos';
        newSection.technologies = [
          { name: 'Technology 1', icon: '🚀' },
          { name: 'Technology 2', icon: '💻' },
          { name: 'Technology 3', icon: '⚙️' }
        ];
        break;
    }
    
    setContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };
  
  const handleUpdateSection = (index: number, updatedSection: any) => {
    const newSections = [...content.sections];
    newSections[index] = updatedSection;
    setContent({ ...content, sections: newSections });
  };
  
  const handleDeleteSection = (index: number) => {
    const newSections = content.sections.filter((_: any, i: number) => i !== index);
    setContent({ ...content, sections: newSections });
  };
  
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === content.sections.length - 1)
    ) {
      return;
    }
    
    const newSections = [...content.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    
    setContent({ ...content, sections: newSections });
  };
  
  const handleSave = () => {
    // Update content field with serialized content
    const updatedPageData = {
      ...pageData,
      content: JSON.stringify(content)
    };
    
    if (id === 'new') {
      createPage(updatedPageData);
    } else {
      updatePage({ id: parseInt(id!, 10), data: updatedPageData });
    }
  };
  
  const renderSectionEditor = (section: any, index: number) => {
    switch (section.type) {
      case 'hero':
        return (
          <Card key={section.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <CardTitle>Sección Hero</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'up')} 
                  disabled={index === 0}
                >
                  <ChevronLeft className="h-4 w-4 rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'down')} 
                  disabled={index === content.sections.length - 1}
                >
                  <ChevronLeft className="h-4 w-4 -rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteSection(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`hero-title-${index}`}>Título</Label>
                <Input 
                  id={`hero-title-${index}`} 
                  value={section.title} 
                  onChange={(e) => {
                    const updated = { ...section, title: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`hero-subtitle-${index}`}>Subtítulo</Label>
                <Textarea 
                  id={`hero-subtitle-${index}`} 
                  value={section.subtitle} 
                  onChange={(e) => {
                    const updated = { ...section, subtitle: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`hero-button-text-${index}`}>Texto del Botón</Label>
                  <Input 
                    id={`hero-button-text-${index}`} 
                    value={section.buttonText} 
                    onChange={(e) => {
                      const updated = { ...section, buttonText: e.target.value };
                      handleUpdateSection(index, updated);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`hero-button-url-${index}`}>URL del Botón</Label>
                  <Input 
                    id={`hero-button-url-${index}`} 
                    value={section.buttonUrl} 
                    onChange={(e) => {
                      const updated = { ...section, buttonUrl: e.target.value };
                      handleUpdateSection(index, updated);
                    }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'features':
        return (
          <Card key={section.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5" />
                <CardTitle>Características</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'up')} 
                  disabled={index === 0}
                >
                  <ChevronLeft className="h-4 w-4 rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'down')} 
                  disabled={index === content.sections.length - 1}
                >
                  <ChevronLeft className="h-4 w-4 -rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteSection(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`features-title-${index}`}>Título</Label>
                <Input 
                  id={`features-title-${index}`} 
                  value={section.title} 
                  onChange={(e) => {
                    const updated = { ...section, title: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`features-subtitle-${index}`}>Subtítulo</Label>
                <Textarea 
                  id={`features-subtitle-${index}`} 
                  value={section.subtitle} 
                  onChange={(e) => {
                    const updated = { ...section, subtitle: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Características</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const features = [...(section.features || [])];
                      features.push({ title: 'Nueva Característica', description: 'Descripción de la característica' });
                      const updated = { ...section, features };
                      handleUpdateSection(index, updated);
                    }}
                  >
                    Añadir Característica
                  </Button>
                </div>
                
                {(section.features || []).map((feature: any, featureIndex: number) => (
                  <Card key={featureIndex} className="mb-2">
                    <CardContent className="pt-4">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`feature-title-${index}-${featureIndex}`}>Título</Label>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              const features = section.features.filter((_: any, i: number) => i !== featureIndex);
                              const updated = { ...section, features };
                              handleUpdateSection(index, updated);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </Button>
                        </div>
                        <Input 
                          id={`feature-title-${index}-${featureIndex}`} 
                          value={feature.title} 
                          onChange={(e) => {
                            const features = [...section.features];
                            features[featureIndex] = { ...features[featureIndex], title: e.target.value };
                            const updated = { ...section, features };
                            handleUpdateSection(index, updated);
                          }} 
                        />
                        <Label htmlFor={`feature-desc-${index}-${featureIndex}`}>Descripción</Label>
                        <Textarea 
                          id={`feature-desc-${index}-${featureIndex}`} 
                          value={feature.description} 
                          onChange={(e) => {
                            const features = [...section.features];
                            features[featureIndex] = { ...features[featureIndex], description: e.target.value };
                            const updated = { ...section, features };
                            handleUpdateSection(index, updated);
                          }} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      
      case 'text':
        return (
          <Card key={section.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Type className="mr-2 h-5 w-5" />
                <CardTitle>Texto</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'up')} 
                  disabled={index === 0}
                >
                  <ChevronLeft className="h-4 w-4 rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'down')} 
                  disabled={index === content.sections.length - 1}
                >
                  <ChevronLeft className="h-4 w-4 -rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteSection(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`text-heading-${index}`}>Encabezado</Label>
                <Input 
                  id={`text-heading-${index}`} 
                  value={section.heading} 
                  onChange={(e) => {
                    const updated = { ...section, heading: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`text-content-${index}`}>Contenido</Label>
                <Textarea 
                  id={`text-content-${index}`} 
                  value={section.content} 
                  onChange={(e) => {
                    const updated = { ...section, content: e.target.value };
                    handleUpdateSection(index, updated);
                  }}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case 'image':
        return (
          <Card key={section.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Image className="mr-2 h-5 w-5" />
                <CardTitle>Imagen</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'up')} 
                  disabled={index === 0}
                >
                  <ChevronLeft className="h-4 w-4 rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'down')} 
                  disabled={index === content.sections.length - 1}
                >
                  <ChevronLeft className="h-4 w-4 -rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteSection(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`image-url-${index}`}>URL de la imagen</Label>
                <Input 
                  id={`image-url-${index}`} 
                  value={section.url} 
                  onChange={(e) => {
                    const updated = { ...section, url: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`image-alt-${index}`}>Texto alternativo</Label>
                <Input 
                  id={`image-alt-${index}`} 
                  value={section.alt} 
                  onChange={(e) => {
                    const updated = { ...section, alt: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              {section.url && (
                <div className="mt-4 border rounded-md p-2">
                  <img src={section.url} alt={section.alt} className="max-w-full h-auto" />
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'technologies':
        return (
          <Card key={section.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <FileCode className="mr-2 h-5 w-5" />
                <CardTitle>Tecnologías</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'up')} 
                  disabled={index === 0}
                >
                  <ChevronLeft className="h-4 w-4 rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'down')} 
                  disabled={index === content.sections.length - 1}
                >
                  <ChevronLeft className="h-4 w-4 -rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteSection(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`tech-title-${index}`}>Título</Label>
                <Input 
                  id={`tech-title-${index}`} 
                  value={section.title} 
                  onChange={(e) => {
                    const updated = { ...section, title: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`tech-subtitle-${index}`}>Subtítulo</Label>
                <Textarea 
                  id={`tech-subtitle-${index}`} 
                  value={section.subtitle} 
                  onChange={(e) => {
                    const updated = { ...section, subtitle: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Tecnologías</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const technologies = [...(section.technologies || [])];
                      technologies.push({ name: 'Nueva Tecnología', icon: '🔧' });
                      const updated = { ...section, technologies };
                      handleUpdateSection(index, updated);
                    }}
                  >
                    Añadir Tecnología
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {(section.technologies || []).map((tech: any, techIndex: number) => (
                    <Card key={techIndex} className="mb-2">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1">
                            <Label htmlFor={`tech-icon-${index}-${techIndex}`}>Icono</Label>
                            <Input 
                              id={`tech-icon-${index}-${techIndex}`} 
                              value={tech.icon} 
                              onChange={(e) => {
                                const technologies = [...section.technologies];
                                technologies[techIndex] = { ...technologies[techIndex], icon: e.target.value };
                                const updated = { ...section, technologies };
                                handleUpdateSection(index, updated);
                              }} 
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`tech-name-${index}-${techIndex}`}>Nombre</Label>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => {
                                  const technologies = section.technologies.filter((_: any, i: number) => i !== techIndex);
                                  const updated = { ...section, technologies };
                                  handleUpdateSection(index, updated);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                                  <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </Button>
                            </div>
                            <Input 
                              id={`tech-name-${index}-${techIndex}`} 
                              value={tech.name} 
                              onChange={(e) => {
                                const technologies = [...section.technologies];
                                technologies[techIndex] = { ...technologies[techIndex], name: e.target.value };
                                const updated = { ...section, technologies };
                                handleUpdateSection(index, updated);
                              }} 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'partners':
        return (
          <Card key={section.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Layout className="mr-2 h-5 w-5" />
                <CardTitle>Partners</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'up')} 
                  disabled={index === 0}
                >
                  <ChevronLeft className="h-4 w-4 rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveSection(index, 'down')} 
                  disabled={index === content.sections.length - 1}
                >
                  <ChevronLeft className="h-4 w-4 -rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteSection(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`partners-title-${index}`}>Título</Label>
                <Input 
                  id={`partners-title-${index}`} 
                  value={section.title} 
                  onChange={(e) => {
                    const updated = { ...section, title: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`partners-subtitle-${index}`}>Subtítulo</Label>
                <Textarea 
                  id={`partners-subtitle-${index}`} 
                  value={section.subtitle} 
                  onChange={(e) => {
                    const updated = { ...section, subtitle: e.target.value };
                    handleUpdateSection(index, updated);
                  }} 
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Partners</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const partners = [...(section.partners || [])];
                      partners.push({ name: 'Nuevo Partner', logo: '' });
                      const updated = { ...section, partners };
                      handleUpdateSection(index, updated);
                    }}
                  >
                    Añadir Partner
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {(section.partners || []).map((partner: any, partnerIndex: number) => (
                    <Card key={partnerIndex} className="mb-2">
                      <CardContent className="pt-4">
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`partner-name-${index}-${partnerIndex}`}>Nombre</Label>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                const partners = section.partners.filter((_: any, i: number) => i !== partnerIndex);
                                const updated = { ...section, partners };
                                handleUpdateSection(index, updated);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-destructive h-4 w-4">
                                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </Button>
                          </div>
                          <Input 
                            id={`partner-name-${index}-${partnerIndex}`} 
                            value={partner.name} 
                            onChange={(e) => {
                              const partners = [...section.partners];
                              partners[partnerIndex] = { ...partners[partnerIndex], name: e.target.value };
                              const updated = { ...section, partners };
                              handleUpdateSection(index, updated);
                            }} 
                          />
                          <Label htmlFor={`partner-logo-${index}-${partnerIndex}`}>Logo URL</Label>
                          <Input 
                            id={`partner-logo-${index}-${partnerIndex}`} 
                            value={partner.logo} 
                            onChange={(e) => {
                              const partners = [...section.partners];
                              partners[partnerIndex] = { ...partners[partnerIndex], logo: e.target.value };
                              const updated = { ...section, partners };
                              handleUpdateSection(index, updated);
                            }} 
                          />
                          {partner.logo && (
                            <div className="mt-2">
                              <img 
                                src={partner.logo} 
                                alt={partner.name} 
                                className="max-h-20 object-contain" 
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="animate-fade-in pb-16">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/pages')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver a Páginas
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open(`/${pageData.slug}`, '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
          <Button onClick={handleSave} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {id === 'new' ? 'Creando...' : 'Actualizando...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {id === 'new' ? 'Crear Página' : 'Guardar Cambios'}
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Editor de Página</CardTitle>
              <CardDescription>
                Arrastra y suelta componentes para crear tu página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.sections.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <p className="text-muted-foreground mb-4">No hay secciones añadidas</p>
                  <p className="text-sm text-muted-foreground">Utiliza el panel lateral para añadir secciones a tu página</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {content.sections.map((section: any, index: number) => renderSectionEditor(section, index))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="lg:sticky lg:top-20">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Propiedades de la Página</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={pageData.title} 
                    onChange={handleInputChange}
                    placeholder="Título de la página" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    value={pageData.slug} 
                    onChange={handleInputChange}
                    placeholder="url-de-la-pagina"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    La URL será: {window.location.origin}/{pageData.slug}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Descripción SEO</Label>
                  <Textarea 
                    id="meta_description" 
                    name="meta_description" 
                    value={pageData.meta_description} 
                    onChange={handleInputChange}
                    placeholder="Breve descripción para motores de búsqueda"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="layout">Diseño</Label>
                  <Select 
                    value={pageData.layout}
                    onValueChange={(value) => handleSelectChange(value, 'layout')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar diseño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Predeterminado</SelectItem>
                      <SelectItem value="full-width">Ancho Completo</SelectItem>
                      <SelectItem value="sidebar">Con Barra Lateral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select 
                    value={pageData.status}
                    onValueChange={(value) => handleSelectChange(value, 'status')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Añadir Secciones</CardTitle>
                <CardDescription>
                  Haz clic para añadir componentes a tu página
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleAddSection('hero')}>
                    <LayoutDashboard className="mb-2 h-5 w-5" />
                    <span>Hero</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleAddSection('features')}>
                    <CheckIcon className="mb-2 h-5 w-5" />
                    <span>Características</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleAddSection('text')}>
                    <Type className="mb-2 h-5 w-5" />
                    <span>Texto</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleAddSection('image')}>
                    <Image className="mb-2 h-5 w-5" />
                    <span>Imagen</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleAddSection('partners')}>
                    <Layout className="mb-2 h-5 w-5" />
                    <span>Partners</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleAddSection('technologies')}>
                    <FileCode className="mb-2 h-5 w-5" />
                    <span>Tecnologías</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
