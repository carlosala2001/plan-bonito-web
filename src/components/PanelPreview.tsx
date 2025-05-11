
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileIcon, MonitorIcon, ServerIcon } from "lucide-react";

const PanelPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState("file-manager");

  const tabs = [
    {
      id: "file-manager",
      label: "File Manager",
      icon: <FileIcon className="h-4 w-4 mr-2" />,
      image: "/lovable-uploads/c8258c76-fe18-4f4c-976f-13ef0d1807e5.png",
      alt: "Panel de administración de archivos de ZenoScale"
    },
    {
      id: "web-console",
      label: "Web Console",
      icon: <MonitorIcon className="h-4 w-4 mr-2" />,
      image: "/lovable-uploads/e4b7e82d-cb5d-4faf-bad7-0ad1b93e8a88.png",
      alt: "Consola web de ZenoScale"
    },
    {
      id: "dash-preview",
      label: "Dash Preview",
      icon: <ServerIcon className="h-4 w-4 mr-2" />,
      image: "/lovable-uploads/21f7dd5b-e882-4e40-868c-272dd661e086.png",
      alt: "Vista previa del dashboard de ZenoScale"
    }
  ];

  return (
    <section id="panel-preview" className="py-16 md:py-24 bg-muted/30 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Echa un vistazo</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Ofrecemos un panel de control líder en la industria en todo el mundo.
            Velocidad, facilidad de uso, funciones y fiabilidad de primer nivel.
          </p>
        </div>

        <div className="mx-auto max-w-5xl animate-on-scroll opacity-0 translate-y-8">
          <Tabs 
            defaultValue="file-manager" 
            className="w-full"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 sm:grid-cols-3 md:min-w-[500px] p-1 bg-card dark:bg-slate-800/60 rounded-full shadow-md">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "rounded-full flex items-center justify-center px-6 py-3 transition-all duration-300",
                      activeTab === tab.id 
                        ? "bg-gradient-zenoscale text-white shadow-md font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className={cn(
                      "flex items-center transition-all duration-300",
                      activeTab === tab.id ? "scale-105" : ""
                    )}>
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="relative overflow-hidden rounded-xl border shadow-lg bg-card">
              {tabs.map((tab) => (
                <TabsContent 
                  key={tab.id} 
                  value={tab.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-500 transform",
                    activeTab === tab.id 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={tab.image}
                      alt={tab.alt}
                      className="w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none"></div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default PanelPreview;
