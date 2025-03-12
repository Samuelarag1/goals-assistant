"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const COMISIONES = ["10%", "15%", "20%", "35%", "40%"];

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

const TASAS_CIERRE = {
  "10%": 0.3,
  "15%": 0.35,
  "20%": 0.7,
  "35%": 0.5,
  "40%": 0.5,
};

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

export default function SalesGoalCalculator() {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yy");

  const [nombre, setNombre] = useState("Martín Rodríguez");
  const [mes, setMes] = useState(format(currentDate, "MMMM", { locale: es }));
  const [ticketPromedio, setTicketPromedio] = useState(1100);
  const [valorUSD, setValorUSD] = useState(1055);
  const [comision, setComision] = useState<keyof typeof TASAS_CIERRE>("10%");
  const [producto, setProducto] =
    useState<keyof typeof PRODUCTOS>("Producto A");
  const [objetivo, setObjetivo] = useState(1800000);

  const [gananciaNetaHoy, setGananciaNetaHoy] = useState(0);
  const [tengoQueVender, setTengoQueVender] = useState(0);
  const [volumenCarrera, setVolumenCarrera] = useState(0);
  const [totalVentasMes, setTotalVentasMes] = useState(0);
  const [nuevosProspectos, setNuevosProspectos] = useState(0);
  const [presentacionesMes, setPresentacionesMes] = useState(0);
  const [presentacionesSemana, setPresentacionesSemana] = useState(0);

  useEffect(() => {
    const gananciaHoy = GANANCIAS[comision]?.[producto] || 0;
    setGananciaNetaHoy(gananciaHoy);

    const ventasNecesarias = TENGO_QUE_VENDER[comision] || 0;

    const factorObjetivo = objetivo / 1800000; // Factor de ajuste basado en el objetivo predeterminado
    const ventasAjustadas = ventasNecesarias * factorObjetivo;
    setTengoQueVender(ventasAjustadas);

    // Calcular volumen en carrera
    const volumen = ventasAjustadas / valorUSD;
    setVolumenCarrera(volumen);

    // Calcular total de ventas necesarias
    // ;
    const totalVentas = Math.floor(volumen / valorUSD);
    console.log(totalVentas);
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
  }, [nombre, mes, ticketPromedio, valorUSD, comision, producto, objetivo]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="h-10 w-10 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight">
            Asistente de Metas Mensuales
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Fecha: {formattedDate}
        </div>
      </div>

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
                        <SelectItem key={com} value={com}>
                          {com}
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

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
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
          </Card>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-6">
          <Card className="bg-black text-white">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Resultados de tu Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-300">Tengo que Vender</p>
                  <p className="text-xl font-bold">
                    ${Math.round(tengoQueVender).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-300">
                    Me sumará un Volumen en carrera de
                  </p>
                  <p className="text-xl font-bold">
                    {Math.round(volumenCarrera).toLocaleString()} USD
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-300">
                    Total de Ventas en el Mes
                  </p>
                  <p className="text-xl font-bold">{totalVentasMes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                TU PLAN DE ACCIÓN desde HOY
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-full">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <span>Nuevos Datos a Prospectar</span>
                  </div>
                  <span className="font-bold text-lg">{nuevosProspectos}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-full">
                      <PieChart className="h-5 w-5 text-white" />
                    </div>
                    <span>Mínimo Presentaciones x Mes</span>
                  </div>
                  <span className="font-bold text-lg">{presentacionesMes}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-full">
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
                    <div className="bg-blue-600 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <span>Capacitación Mínima Sugerida</span>
                  </div>
                  <span className="font-bold text-lg">20Hs semanales</span>
                </div>
              </div>
            </CardContent>
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
            Versión Moderna - Sinergia Creativa
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
