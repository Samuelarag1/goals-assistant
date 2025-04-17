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
  Download,
  Calculator,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const encryptData = (data: string, key: string): string => {
  return btoa(data + key);
};

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

const PRODUCTOS = {
  "Producto A": 700000,
  "Producto B": 900000,
  "Producto C": 1100000,
  "Producto D": 1300000,
  "Producto E": 1500000,
  "Producto F": 1700000,
  "Producto G": 1900000,
  "Producto H": 2100000,
};

// const PRODUCTOS = {
//   "15 Piezas": 4990000,
//   "8 Piezas": 3649000,
//   "5 Piezas completas": 1640000,
//   "Olla 6Lts. con tapa": 910000,
//   "Olla 4Lts. con tapa": 720000,
//   "Bloque completo (RP ALL-IN-ONE)": 1750000,
//   "RP Juego de cuchillos 5 piezas (CHEF)": 625000,
//   'Paellera de 14" con tapa': 1080000,
//   "Sarten 26cm con tapa": 1080000,
//   "Max Tractor": 2500000,
// };
const COMISIONES = [
  { id: "noob", label: "Novato (10%)", value: "10%" },
  { id: "intermediate", label: "Intermedio (15%)", value: "15%" },
  { id: "senior", label: "Vendedor Senior (20%)", value: "20%" },
  { id: "dist_jr", label: "Distribuidor Junior (35%)", value: "35%" },
  { id: "dist_sr", label: "Distribuidor Independiente (40%)", value: "40%" },
];

const TASAS_CIERRE: Record<string, number> = {
  "10%": 0.3,
  "15%": 0.35,
  "20%": 0.7,
  "35%": 0.5,
  "40%": 0.5,
};

export default function SalesGoalCalculator() {
  const { toast } = useToast();
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yy");
  const secretKey = useRef("SinergiaCreativa2025");

  const [nombre, setNombre] = useState("");
  const [mes, setMes] = useState(format(currentDate, "MMMM", { locale: es }));
  const [ticketPromedio, setTicketPromedio] = useState<number | string>(" ");
  const [valorUSD, setValorUSD] = useState<number | string>(" ");
  const [comision, setComision] = useState<keyof typeof TASAS_CIERRE>("10%");
  const [producto, setProducto] = useState<keyof typeof PRODUCTOS | "">("");
  const [objetivo, setObjetivo] = useState(0);
  const [activeTab, setActiveTab] = useState<"variables" | "resultados">(
    "variables"
  );
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

  useEffect(() => {
    const saved = localStorage.getItem("metasData");
    if (!saved) return;
    try {
      const data = JSON.parse(decryptData(saved, secretKey.current));
      setNombre(data.nombre);
      setMes(data.mes);
      setTicketPromedio(data.ticketPromedio);
      setValorUSD(data.valorUSD);
      setComision(data.comision);
      setProducto(data.producto);
      setObjetivo(data.objetivo);
      setHistorialObjetivos(data.historialObjetivos || []);
      toast({
        title: "Datos cargados",
        description: "Datos recuperados de tu última sesión.",
      });
    } catch {
      console.warn("No se pudo descifrar o parsear metasData");
    }
  }, []);
  const handleCalculate = () => {
    const pct = Number(comision.replace("%", "")) / 100;
    const base = PRODUCTOS[producto as keyof typeof PRODUCTOS] ?? 0;
    const ganancia = (base / 1.21) * pct;
    setGananciaNetaHoy(+ganancia.toFixed(2));

    const wantSell = (objetivo / pct) * 1.21;
    setTengoQueVender(+wantSell.toFixed(2));

    const volumen = wantSell / Number(valorUSD);
    setVolumenCarrera(+volumen.toFixed(2));

    const tickets = volumen / Number(ticketPromedio);

    setTotalVentasMes(Math.ceil(tickets));

    setNuevosProspectos(Math.round(tickets * 6));
    const tasaCierre = TASAS_CIERRE[comision];
    setPresentacionesMes(Math.ceil(tickets / tasaCierre));
    console.log(TASAS_CIERRE[comision]);
    setPresentacionesSemana(Math.ceil(tickets / tasaCierre / 4));
    console.log(presentacionesMes, presentacionesSemana);

    const nuevaEntrada = { fecha: format(new Date(), "dd/MM/yyyy"), objetivo };
    setHistorialObjetivos((prev) => [
      { ...nuevaEntrada, objetivo: Number(objetivo) },
      ...prev,
    ]);

    const toSave = {
      nombre,
      mes,
      ticketPromedio,
      valorUSD,
      comision,
      producto,
      objetivo,
      historialObjetivos: [nuevaEntrada, ...historialObjetivos],
    };
    localStorage.setItem(
      "metasData",
      encryptData(JSON.stringify(toSave), secretKey.current)
    );

    setActiveTab("resultados");
  };
  useEffect(() => {
    if (!producto) {
      setGananciaNetaHoy(0);
      return;
    }
    const pct = Number(comision.replace("%", "")) / 100;
    const base = PRODUCTOS[producto as keyof typeof PRODUCTOS] || 0;
    const ganancia = (base / 1.21) * pct;
    setGananciaNetaHoy(+ganancia.toFixed(2));
  }, [producto, comision]);
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
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "variables" | "resultados")
        }
        className="w-full"
      >
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
                    placeholder="Ingrese su nombre"
                    required
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mes">Mes</Label>
                  <Select required onValueChange={setMes} value={mes}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un mes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="january">Enero</SelectItem>
                        <SelectItem value="february">Febrero</SelectItem>
                        <SelectItem value="march">Marzo</SelectItem>
                        <SelectItem value="april">Abril</SelectItem>
                        <SelectItem value="may">Mayo</SelectItem>
                        <SelectItem value="juny">Junio</SelectItem>
                        <SelectItem value="july">Julio</SelectItem>
                        <SelectItem value="august">Agosto</SelectItem>
                        <SelectItem value="september">Septiembre</SelectItem>
                        <SelectItem value="october">Octubre</SelectItem>
                        <SelectItem value="november">Noviembre</SelectItem>
                        <SelectItem value="december">Diciembre</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket">Mi Ticket Promedio en USD</Label>
                  <Input
                    id="ticket"
                    type="text"
                    required
                    value={
                      Number(ticketPromedio) > 0
                        ? ticketPromedio
                        : "Ingrese ticket promedio"
                    }
                    onChange={(e) => setTicketPromedio(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorUSD">Valor USD</Label>
                  <Input
                    id="valorUSD"
                    type="text"
                    placeholder="Ingrese valor del USD"
                    required
                    value={
                      Number(valorUSD) > 0 ? valorUSD : "Indique su objetivo"
                    }
                    onChange={(e) => setValorUSD(+e.target.value)}
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
                    onValueChange={(val) =>
                      setComision(val as keyof typeof TASAS_CIERRE)
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                OBJETIVO ¿Cuánto quiero ganar este mes en mi venta personal?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="objetivo">Mi objetivo en ARS$</Label>
                <Input
                  id="objetivo"
                  value={objetivo ? objetivo : "Indique su objetivo"}
                  onChange={(e) => setObjetivo(Number(e.target.value))}
                  type="text"
                  className="text-lg"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleCalculate}
              >
                <Calculator className="h-4 w-4" />
                Calcular
              </Button>
            </CardFooter>
          </Card>
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
          </Card>
          <Card>
            <CardContent className="flex flex-col md:flex-row items-stretch gap-4 p-4 h-full">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 h-10 md:h-20"
                onClick={() =>
                  window.open("https://sinergiacreativa.casa/slides", "_blank")
                }
              >
                <Award className="h-5 w-5" />
                Ir al Campus
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 h-10 md:h-20"
                onClick={() =>
                  window.open(
                    "https://sinergiacreativa.casa/web/login",
                    "_blank"
                  )
                }
              >
                <Target className="h-5 w-5" />
                Ir al CRM
              </Button>
            </CardContent>
          </Card>

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
