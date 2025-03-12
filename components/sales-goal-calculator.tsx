"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Target,
  DollarSign,
  BarChart3,
  Calendar,
  User,
  PieChart,
  Award,
  Save,
  Download,
  History,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Función de cifrado simple (solo para demostración)
const encryptData = (data: string, key: string): string => {
  return btoa(data + key);
};

// Función de descifrado simple (solo para demostración)
const decryptData = (encrypted: string, key: string): string => {
  try {
    const decoded = atob(encrypted);
    if (decoded.endsWith(key)) {
      return decoded.slice(0, -key.length);
    }
    return "";
  } catch (e) {
    return "";
  }
};

// Definición de productos con sus valores originales
const PRODUCTOS = {
  "Producto A": 10000,
  "Producto B": 20000,
  "Producto C": 30000,
  "Producto D": 40000,
  "Producto E": 50000,
  "Producto F": 60000,
  "Producto G": 70000,
  "Producto H": 80000,
};

// Opciones de comisión con nombres personalizados
const COMISIONES = [
  { id: "inicial", label: "Inicial (10%)", value: "10%" },
  { id: "avanzado", label: "Avanzado (15%)", value: "15%" },
  { id: "experto", label: "Experto (20%)", value: "20%" },
  { id: "elite", label: "Elite (35%)", value: "35%" },
  { id: "master", label: "Master (40%)", value: "40%" },
];

// Matriz de ganancias por producto y comisión
const GANANCIAS: { [key: string]: { [key: string]: number } } = {
  "10%": {
    "Producto A": 826,
    "Producto B": 1652,
    "Producto C": 2478,
    "Producto D": 3304,
    "Producto E": 4130,
    "Producto F": 4956,
    "Producto G": 5782,
    "Producto H": 6608,
  },
  "15%": {
    "Producto A": 1240,
    "Producto B": 2480,
    "Producto C": 3720,
    "Producto D": 4960,
    "Producto E": 6200,
    "Producto F": 7440,
    "Producto G": 8680,
    "Producto H": 9920,
  },
  "20%": {
    "Producto A": 1653,
    "Producto B": 3306,
    "Producto C": 4959,
    "Producto D": 6612,
    "Producto E": 8265,
    "Producto F": 9918,
    "Producto G": 11571,
    "Producto H": 13224,
  },
  "35%": {
    "Producto A": 2893,
    "Producto B": 5786,
    "Producto C": 8679,
    "Producto D": 11572,
    "Producto E": 14465,
    "Producto F": 17358,
    "Producto G": 20251,
    "Producto H": 23144,
  },
  "40%": {
    "Producto A": 4000,
    "Producto B": 8000,
    "Producto C": 12000,
    "Producto D": 16000,
    "Producto E": 20000,
    "Producto F": 24000,
    "Producto G": 28000,
    "Producto H": 32000,
  },
};

// Tasas de cierre por comisión
const TASAS_CIERRE = {
  "10%": 0.3,
  "15%": 0.35,
  "20%": 0.7,
  "35%": 0.5,
  "40%": 0.5,
};

// Valores "Tengo que vender" por comisión
const TENGO_QUE_VENDER = {
  "10%": 21780000,
  "15%": 14374800,
  "20%": 10890000,
  "35%": 6207300,
  "40%": 3920400,
};

// Presentaciones mínimas por mes según comisión
const PRESENTACIONES_MES = {
  "10%": 63,
  "15%": 35,
  "20%": 13,
  "35%": 11,
  "40%": 7,
};

// Niveles de progreso con mensajes motivacionales
const NIVELES_PROGRESO = [
  { min: 0, max: 20, mensaje: "Estás comenzando. ¡Sigue adelante!" },
  { min: 21, max: 40, mensaje: "Buen progreso. Mantén el enfoque." },
  { min: 41, max: 60, mensaje: "Vas por buen camino. No te detengas." },
  { min: 61, max: 80, mensaje: "¡Excelente trabajo! Casi llegas a tu meta." },
  { min: 81, max: 100, mensaje: "¡Increíble! Estás muy cerca de tu objetivo." },
];

export default function SalesGoalCalculator() {
  const { toast } = useToast();
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yy");
  const secretKey = useRef("SinergiaCreativa2025");

  // Estados para las variables del usuario
  const [nombre, setNombre] = useState("Martín Rodríguez");
  const [mes, setMes] = useState(format(currentDate, "MMMM", { locale: es }));
  const [ticketPromedio, setTicketPromedio] = useState(1100);
  const [valorUSD, setValorUSD] = useState(1055);
  const [comision, setComision] = useState<keyof typeof TASAS_CIERRE>("10%");
  const [producto, setProducto] =
    useState<keyof typeof PRODUCTOS>("Producto A");
  const [objetivo, setObjetivo] = useState(1800000);
  const [progreso, setProgreso] = useState(0);

  // Estados calculados
  const [gananciaNetaHoy, setGananciaNetaHoy] = useState(0);
  const [tengoQueVender, setTengoQueVender] = useState(0);
  const [volumenCarrera, setVolumenCarrera] = useState(0);
  const [totalVentasMes, setTotalVentasMes] = useState(0);
  const [nuevosProspectos, setNuevosProspectos] = useState(0);
  const [presentacionesMes, setPresentacionesMes] = useState(0);
  const [presentacionesSemana, setPresentacionesSemana] = useState(0);
  const [historialObjetivos, setHistorialObjetivos] = useState<
    { fecha: string; objetivo: number }[]
  >([]);

  // Calcular valores cuando cambian las entradas
  useEffect(() => {
    // Calcular ganancia neta hoy basada en la matriz de ganancias
    const gananciaHoy = GANANCIAS[comision]?.[producto] || 0;
    setGananciaNetaHoy(gananciaHoy);

    // Obtener "Tengo que vender" de la matriz según la comisión
    const ventasNecesarias = TENGO_QUE_VENDER[comision] || 0;

    // Ajustar "Tengo que vender" según el objetivo personalizado
    const factorObjetivo = objetivo / 1800000; // Factor de ajuste basado en el objetivo predeterminado
    const ventasAjustadas = ventasNecesarias * factorObjetivo;
    setTengoQueVender(ventasAjustadas);

    // Calcular volumen en carrera
    const volumen = ventasAjustadas / valorUSD;
    setVolumenCarrera(volumen);

    // Calcular total de ventas necesarias
    const totalVentas = Math.floor(volumen / valorUSD);
    setTotalVentasMes(totalVentas);

    // Obtener presentaciones mínimas por mes según comisión
    const presentaciones = PRESENTACIONES_MES[comision] || 0;
    // Ajustar según el objetivo personalizado
    const presentacionesAjustadas = Math.floor(presentaciones * factorObjetivo);
    setPresentacionesMes(presentacionesAjustadas);

    // Calcular presentaciones por semana (mensual / 4 + 1)
    const presentacionesSem = Math.floor(presentacionesAjustadas / 4) + 1;
    setPresentacionesSemana(presentacionesSem);

    // Calcular nuevos prospectos (total ventas * 6)
    const prospectos = totalVentas * 6;
    setNuevosProspectos(prospectos);

    // Simular progreso (solo para demostración)
    const progresoCalculado = Math.min(
      Math.round((gananciaHoy / (objetivo / 12)) * 100),
      100
    );
    setProgreso(progresoCalculado);
  }, [nombre, mes, ticketPromedio, valorUSD, comision, producto, objetivo]);

  // Cargar datos guardados
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("metasData");
      if (savedData) {
        const decrypted = decryptData(savedData, secretKey.current);
        if (decrypted) {
          const data = JSON.parse(decrypted);
          setNombre(data.nombre || nombre);
          setMes(data.mes || mes);
          setTicketPromedio(data.ticketPromedio || ticketPromedio);
          setValorUSD(data.valorUSD || valorUSD);
          setComision(data.comision || comision);
          setProducto(data.producto || producto);
          setObjetivo(data.objetivo || objetivo);
          setHistorialObjetivos(data.historialObjetivos || []);

          toast({
            title: "Datos cargados",
            description: "Se han cargado tus datos guardados anteriormente",
          });
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }, []);

  // Guardar datos
  const guardarDatos = () => {
    try {
      const dataToSave = {
        nombre,
        mes,
        ticketPromedio,
        valorUSD,
        comision,
        producto,
        objetivo,
        historialObjetivos: [
          ...historialObjetivos,
          { fecha: formattedDate, objetivo },
        ].slice(-5), // Mantener solo los últimos 5
      };

      const encrypted = encryptData(
        JSON.stringify(dataToSave),
        secretKey.current
      );
      localStorage.setItem("metasData", encrypted);

      setHistorialObjetivos(dataToSave.historialObjetivos);

      toast({
        title: "Datos guardados",
        description: "Tus datos han sido guardados exitosamente",
      });
    } catch (error) {
      console.error("Error al guardar datos:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los datos",
        variant: "destructive",
      });
    }
  };

  // Exportar informe
  const exportarInforme = () => {
    try {
      const informe = {
        titulo: "Informe de Metas Mensuales",
        fecha: formattedDate,
        usuario: nombre,
        mes,
        objetivo,
        resultados: {
          gananciaNetaHoy,
          tengoQueVender,
          volumenCarrera,
          totalVentasMes,
        },
        planAccion: {
          nuevosProspectos,
          presentacionesMes,
          presentacionesSemana,
        },
      };

      const blob = new Blob([JSON.stringify(informe, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `informe-metas-${nombre
        .replace(/\s+/g, "-")
        .toLowerCase()}-${formattedDate}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Informe exportado",
        description: "Tu informe ha sido exportado exitosamente",
      });
    } catch (error) {
      console.error("Error al exportar informe:", error);
      toast({
        title: "Error",
        description: "No se pudo exportar el informe",
        variant: "destructive",
      });
    }
  };

  // Obtener mensaje motivacional según progreso
  const getMensajeMotivacional = () => {
    const nivel = NIVELES_PROGRESO.find(
      (n) => progreso >= n.min && progreso <= n.max
    );
    return nivel?.mensaje || "¡Establece tus metas y comienza!";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-lg text-white">
        <div className="flex items-center gap-3">
          <Award className="h-10 w-10 text-yellow-300" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Asistente de Metas Mensuales
            </h1>
            <p className="text-sm text-blue-100">Versión Exclusiva</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Fecha: {formattedDate}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={guardarDatos}
                >
                  <Save className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Guardar datos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={exportarInforme}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar informe</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {historialObjetivos.length > 0 && (
        <div className="flex items-center gap-2 justify-end">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Historial: {historialObjetivos.length} objetivos guardados
          </span>
        </div>
      )}

      <Card className="border-t-4 border-t-blue-600">
        <CardHeader className="pb-2">
          <CardTitle>Tu progreso actual</CardTitle>
          <CardDescription>{getMensajeMotivacional()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso hacia tu meta mensual</span>
              <span className="font-medium">{progreso}%</span>
            </div>
            <Progress value={progreso} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="variables" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="variables">Variables del Usuario</TabsTrigger>
          <TabsTrigger value="resultados">Resultados y Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="variables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de Socio/a</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mes">Mes</Label>
                  <Input
                    id="mes"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket">Mi Ticket Promedio en USD</Label>
                  <Input
                    id="ticket"
                    type="number"
                    value={ticketPromedio}
                    onChange={(e) => setTicketPromedio(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorUSD">Valor USD</Label>
                  <Input
                    id="valorUSD"
                    type="number"
                    value={valorUSD}
                    onChange={(e) => setValorUSD(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Simulador de Venta Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="comision">Comisión Actual</Label>
                  <Select
                    value={comision}
                    onValueChange={(value) =>
                      setComision(value as keyof typeof TASAS_CIERRE)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione comisión" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMISIONES.map((com) => (
                        <SelectItem key={com.id} value={com.value}>
                          {com.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="producto">
                    Seleccione un Ticket de Venta
                  </Label>
                  <Select
                    value={producto}
                    onValueChange={(value) =>
                      setProducto(value as keyof typeof PRODUCTOS)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PRODUCTOS).map((prod) => (
                        <SelectItem key={prod} value={prod}>
                          {prod} - $
                          {PRODUCTOS[
                            prod as keyof typeof PRODUCTOS
                          ].toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tu Ganancia Neta Hoy:</span>
                  <span className="text-xl font-bold text-blue-700">
                    ${gananciaNetaHoy.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tasa de Cierre:</span>
                  <span className="text-lg font-medium">
                    {TASAS_CIERRE[comision] || 0}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  (Variables de configuración)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                OBJETIVO ¿Cuánto quiero Ganar este mes en mi Venta personal?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="objetivo">Mi objetivo en $</Label>
                <Input
                  id="objetivo"
                  type="number"
                  value={objetivo}
                  onChange={(e) => setObjetivo(Number(e.target.value))}
                  className="text-lg font-bold"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                className="gap-2"
                onClick={guardarDatos}
              >
                <Save className="h-4 w-4" />
                Guardar Objetivo
              </Button>
            </CardFooter>
          </Card>

          {historialObjetivos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historial de Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {historialObjetivos.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border-b"
                    >
                      <span>{item.fecha}</span>
                      <span className="font-medium">
                        ${item.objetivo.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resultados" className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Resultados de tu Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 bg-white/10 p-4 rounded-lg">
                  <p className="text-sm text-blue-200">Tengo que Vender</p>
                  <p className="text-xl font-bold">
                    ${Math.round(tengoQueVender).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1 bg-white/10 p-4 rounded-lg">
                  <p className="text-sm text-blue-200">
                    Me sumará un Volumen en carrera de
                  </p>
                  <p className="text-xl font-bold">
                    {Math.round(volumenCarrera).toLocaleString()} USD
                  </p>
                </div>
                <div className="space-y-1 bg-white/10 p-4 rounded-lg">
                  <p className="text-sm text-blue-200">
                    Total de Ventas en el Mes
                  </p>
                  <p className="text-xl font-bold">{totalVentasMes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                TU PLAN DE ACCIÓN desde HOY
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <span>Nuevos Datos a Prospectar</span>
                  </div>
                  <span className="font-bold text-lg">{nuevosProspectos}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full">
                      <PieChart className="h-5 w-5 text-white" />
                    </div>
                    <span>Mínimo Presentaciones x Mes</span>
                  </div>
                  <span className="font-bold text-lg">{presentacionesMes}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span>Mínimo Presentaciones x Sem.</span>
                  </div>
                  <span className="font-bold text-lg">
                    {presentacionesSemana}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <span>Capacitación Mínima Sugerida</span>
                  </div>
                  <span className="font-bold text-lg">20Hs semanales</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full gap-2" onClick={exportarInforme}>
                <Download className="h-4 w-4" />
                Exportar Plan de Acción
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">Firma Supervisor</p>
              <Separator className="my-2" />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">Firma emprendedor</p>
              <Separator className="my-2" />
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Versión Exclusiva - Sinergia Creativa</p>
            <p className="text-xs mt-1">
              ID:{" "}
              {encryptData(
                nombre.substring(0, 3) + currentDate.getTime(),
                secretKey.current
              ).substring(0, 12)}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
