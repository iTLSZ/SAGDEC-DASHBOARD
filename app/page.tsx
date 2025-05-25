"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts"
import {
  GraduationCap,
  Users,
  Filter,
  Download,
  ExternalLink,
  BarChart3,
  PieChartIcon,
  ScatterChartIcon as Scatter3D,
  Table,
  Building2,
  Globe,
  Award,
  Target,
} from "lucide-react"

// Datos simulados basados en las especificaciones
const mockData = {
  establecimientos: [
    { zona: "Urbana", count: 1800, percentage: 75 },
    { zona: "Rural", count: 604, percentage: 25 },
  ],
  scatterData: Array.from({ length: 200 }, (_, i) => ({
    sedes: Math.random(),
    estrato: Math.floor(Math.random() * 6) + 1,
    cluster: Math.floor(Math.random() * 8) + 1,
    zona: Math.random() > 0.25 ? "Urbana" : "Rural",
    secretaria: ["Antioquia", "Bogotá", "Valle", "Atlántico", "Cundinamarca"][Math.floor(Math.random() * 5)],
  })),
  reglas: [
    {
      antecedente: "Niveles educativos",
      consecuente: "Sin reservas indígenas",
      soporte: 67.7,
      confianza: 0.9,
      lift: 1.2,
      impacto: "Alto",
    },
    {
      antecedente: "Urbana + niveles",
      consecuente: "Sin reservas",
      soporte: 48.8,
      confianza: 0.85,
      lift: 1.1,
      impacto: "Alto",
    },
    {
      antecedente: "Estrato alto",
      consecuente: "Jornada completa",
      soporte: 35.2,
      confianza: 0.78,
      lift: 1.05,
      impacto: "Medio",
    },
    {
      antecedente: "Rural + básica",
      consecuente: "Jornada mañana",
      soporte: 28.4,
      confianza: 0.72,
      lift: 0.98,
      impacto: "Medio",
    },
    {
      antecedente: "Múltiples sedes",
      consecuente: "Zona urbana",
      soporte: 22.1,
      confianza: 0.68,
      lift: 0.95,
      impacto: "Bajo",
    },
  ],
  clusters: [
    {
      id: 1,
      nombre: "Pequeños Urbanos Tradicionales",
      porcentaje: 63.2,
      caracteristicas: "Pequeños, urbanos, modelo tradicional, inglés",
      color: "#FF6384",
      descripcion: "Instituciones urbanas de tamaño pequeño con enfoque tradicional",
    },
    {
      id: 2,
      nombre: "Rurales Básicos",
      porcentaje: 15.8,
      caracteristicas: "Rurales, educación básica, recursos limitados",
      color: "#36A2EB",
      descripcion: "Colegios rurales con educación básica y recursos limitados",
    },
    {
      id: 3,
      nombre: "Urbanos Grandes",
      porcentaje: 8.4,
      caracteristicas: "Múltiples sedes, urbanos, diversa oferta",
      color: "#FFCE56",
      descripcion: "Instituciones urbanas grandes con múltiples sedes",
    },
    {
      id: 4,
      nombre: "Técnicos Especializados",
      porcentaje: 4.9,
      caracteristicas: "Educación técnica, estrato medio-alto",
      color: "#4BC0C0",
      descripcion: "Instituciones especializadas en educación técnica",
    },
    {
      id: 5,
      nombre: "Inclusivos Rurales",
      porcentaje: 3.2,
      caracteristicas: "Rurales, programas de inclusión",
      color: "#9966FF",
      descripcion: "Colegios rurales con programas de inclusión social",
    },
    {
      id: 6,
      nombre: "Nocturnos Urbanos",
      porcentaje: 2.8,
      caracteristicas: "Jornada nocturna, adultos",
      color: "#FF9F40",
      descripcion: "Instituciones urbanas con jornada nocturna para adultos",
    },
    {
      id: 7,
      nombre: "Bilingües Premium",
      porcentaje: 1.4,
      caracteristicas: "Bilingües, estrato alto",
      color: "#66BB6A",
      descripcion: "Instituciones bilingües de estrato socioeconómico alto",
    },
    {
      id: 8,
      nombre: "Especializados Únicos",
      porcentaje: 0.3,
      caracteristicas: "Características únicas, casos especiales",
      color: "#B0BEC5",
      descripcion: "Instituciones con características únicas y especiales",
    },
  ],
  estadisticas: [
    { label: "Total Establecimientos", value: "2,404", icon: Building2, color: "text-blue-600" },
    { label: "Departamentos", value: "32", icon: Globe, color: "text-green-600" },
    { label: "Clusters Identificados", value: "8", icon: Target, color: "text-purple-600" },
    { label: "Reglas de Asociación", value: "156", icon: Award, color: "text-orange-600" },
  ],
}

const clusterColors = {
  1: "#FF6384",
  2: "#36A2EB",
  3: "#FFCE56",
  4: "#4BC0C0",
  5: "#9966FF",
  6: "#FF9F40",
  7: "#66BB6A",
  8: "#B0BEC5",
}

export default function SAGDECDashboard() {
  const [filters, setFilters] = useState({
    zona: "Todas",
    secretaria: "Todas",
    estrato: "Todos",
    cluster: "Todos",
    jornada: "Todas",
  })

  const filteredScatterData = mockData.scatterData.filter((item) => {
    return (
      (filters.zona === "Todas" || item.zona === filters.zona) &&
      (filters.secretaria === "Todas" || item.secretaria === filters.secretaria) &&
      (filters.estrato === "Todos" || item.estrato.toString() === filters.estrato) &&
      (filters.cluster === "Todos" || item.cluster.toString() === filters.cluster)
    )
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-xl shadow-xl border-gray-200">
          <p className="font-semibold text-gray-800">{`${label}: ${payload[0].value.toLocaleString()} colegios`}</p>
          <p className="text-sm text-gray-600">{`${payload[0].payload.percentage}% del total`}</p>
        </div>
      )
    }
    return null
  }

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border rounded-xl shadow-xl border-gray-200">
          <p className="font-semibold text-gray-800">{`Cluster ${data.cluster}`}</p>
          <p className="text-sm text-gray-600">{`Zona: ${data.zona}`}</p>
          <p className="text-sm text-gray-600">{`Estrato: ${data.estrato}`}</p>
          <p className="text-sm text-gray-600">{`Sedes: ${(data.sedes * 10).toFixed(1)}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Mejorado */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    SAGDEC Analytics Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 mt-1 font-medium">
                    Sistema de Análisis y Gestión de Datos Educativos de Colombia
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all duration-200">
                <Download className="h-5 w-5 mr-2" />
                Exportar Datos
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Google Colab
              </Button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
            <p className="text-gray-700 font-medium">
              📊 Análisis de <span className="font-bold text-blue-600">2,404 establecimientos educativos</span> para
              identificar brechas, patrones y oportunidades de mejora en el sistema educativo colombiano.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Estadísticas Clave */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {mockData.estadisticas.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color === "text-blue-600" ? "from-blue-100 to-blue-200" : stat.color === "text-green-600" ? "from-green-100 to-green-200" : stat.color === "text-purple-600" ? "from-purple-100 to-purple-200" : "from-orange-100 to-orange-200"}`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtros Mejorados */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mr-3">
                <Filter className="h-5 w-5 text-purple-600" />
              </div>
              Filtros Interactivos
            </CardTitle>
            <CardDescription className="text-base">
              Personaliza la visualización de datos según tus necesidades de análisis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { key: "zona", label: "Zona Geográfica", options: ["Todas", "Urbana", "Rural"] },
                {
                  key: "secretaria",
                  label: "Secretaría de Educación",
                  options: ["Todas", "Antioquia", "Bogotá", "Valle", "Atlántico", "Cundinamarca"],
                },
                { key: "estrato", label: "Estrato Socioeconómico", options: ["Todos", "1", "2", "3", "4", "5", "6"] },
                {
                  key: "cluster",
                  label: "Cluster de Análisis",
                  options: ["Todos", "1", "2", "3", "4", "5", "6", "7", "8"],
                },
                { key: "jornada", label: "Jornada Académica", options: ["Todas", "Mañana", "Completa", "Nocturna"] },
              ].map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">{filter.label}</label>
                  <Select
                    value={filters[filter.key as keyof typeof filters]}
                    onValueChange={(value) => setFilters({ ...filters, [filter.key]: value })}
                  >
                    <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {filter.key === "estrato" && option !== "Todos"
                            ? `Estrato ${option}`
                            : filter.key === "cluster" && option !== "Todos"
                              ? `Cluster ${option}`
                              : option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grid de visualizaciones mejorado */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Visualización 1: Histograma Mejorado */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                Distribución Geográfica
              </CardTitle>
              <CardDescription className="text-base">
                Análisis de la distribución entre zonas urbanas y rurales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockData.establecimientos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="zona" tick={{ fontSize: 14, fontWeight: 500 }} axisLine={{ stroke: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 14 }} axisLine={{ stroke: "#6b7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {mockData.establecimientos.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.zona === "Urbana" ? "url(#urbanGradient)" : "url(#ruralGradient)"}
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="urbanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4CAF50" />
                      <stop offset="100%" stopColor="#2E7D32" />
                    </linearGradient>
                    <linearGradient id="ruralGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF5733" />
                      <stop offset="100%" stopColor="#C62828" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Visualización 2: Scatter Plot Mejorado */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
                  <Scatter3D className="h-5 w-5 text-blue-600" />
                </div>
                Análisis de Correlación
              </CardTitle>
              <CardDescription className="text-base">
                Relación entre número de sedes y estrato socioeconómico por cluster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart data={filteredScatterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis
                    dataKey="sedes"
                    name="Número de Sedes (normalizado)"
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: "#6b7280" }}
                  />
                  <YAxis
                    dataKey="estrato"
                    name="Estrato"
                    domain={[1, 6]}
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: "#6b7280" }}
                  />
                  <Tooltip content={<ScatterTooltip />} />
                  <Scatter dataKey="estrato" fill="#8884d8">
                    {filteredScatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={clusterColors[entry.cluster as keyof typeof clusterColors]}
                        opacity={0.8}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Visualización 3: Tabla de Reglas Mejorada */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl">
              <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mr-3">
                <Table className="h-5 w-5 text-orange-600" />
              </div>
              Reglas de Asociación Significativas
            </CardTitle>
            <CardDescription className="text-base">
              Patrones identificados mediante algoritmo Apriori, ordenados por nivel de confianza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50 rounded-tl-lg">Antecedente</th>
                    <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50">Consecuente</th>
                    <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50">Soporte (%)</th>
                    <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50">Confianza</th>
                    <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50">Lift</th>
                    <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50 rounded-tr-lg">Impacto</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.reglas.map((regla, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <td className="p-4 font-medium text-gray-800">{regla.antecedente}</td>
                      <td className="p-4 text-gray-700">{regla.consecuente}</td>
                      <td className="p-4">
                        <span className="font-semibold text-blue-600">{regla.soporte}%</span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={regla.confianza > 0.8 ? "default" : regla.confianza > 0.6 ? "secondary" : "outline"}
                          className={`font-semibold ${
                            regla.confianza > 0.8
                              ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                              : regla.confianza > 0.6
                                ? "bg-blue-100 text-blue-800"
                                : ""
                          }`}
                        >
                          {regla.confianza.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{regla.lift.toFixed(2)}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`${
                            regla.impacto === "Alto"
                              ? "border-red-300 text-red-700 bg-red-50"
                              : regla.impacto === "Medio"
                                ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                                : "border-green-300 text-green-700 bg-green-50"
                          }`}
                        >
                          {regla.impacto}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Visualización 4: Clusters Mejorados */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-xl">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mr-3">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
              </div>
              Análisis de Clusters Educativos
            </CardTitle>
            <CardDescription className="text-base">
              Segmentación de establecimientos educativos basada en características similares
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockData.clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-white/50 backdrop-blur-sm ${
                    filters.cluster === cluster.id.toString()
                      ? "ring-4 ring-blue-300 shadow-xl transform -translate-y-1"
                      : "hover:border-opacity-60"
                  }`}
                  style={{ borderColor: cluster.color }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: cluster.color }}></div>
                      <h3 className="font-bold text-lg text-gray-800">Cluster {cluster.id}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-semibold">
                      {cluster.porcentaje}%
                    </Badge>
                  </div>

                  <h4 className="font-semibold text-gray-800 mb-3 text-base">{cluster.nombre}</h4>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{cluster.descripcion}</p>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Características: {cluster.caracteristicas}</p>
                  </div>

                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: cluster.color,
                          width: `${cluster.porcentaje}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pie de página mejorado */}
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 mt-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-xl text-white mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Equipo de Investigación
              </h4>
              <div className="space-y-2 text-gray-300">
                <p className="font-medium">• Luis Alejandro López Suárez</p>
                <p className="font-medium">• Oscar Iván Rodríguez Barreto</p>
                <p className="font-medium">• Jhon Jairo Chinchay Campos</p>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <p className="font-bold text-blue-300">Universidad de La Guajira</p>
                <p className="text-sm text-gray-400">Facultad de Ingeniería • 2025</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-xl text-white mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Fuentes de Información
              </h4>
              <div className="space-y-2 text-gray-300">
                <p className="font-medium">• Datos Abiertos Colombia</p>
                <p className="font-medium">• Ministerio de Educación Nacional</p>
                <p className="font-medium">• Período de análisis: 2016</p>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Dataset: <span className="font-semibold text-blue-300">2,404 establecimientos educativos</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-xl text-white mb-4 flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Recursos Adicionales
              </h4>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Notebook de Google Colab
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Código Fuente
                </Button>
              </div>
              <p className="text-xs text-gray-400 pt-3 border-t border-gray-700">
                Accede al análisis completo, metodología y resultados detallados
              </p>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2025 Universidad de La Guajira. Proyecto de investigación en análisis de datos educativos.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Dashboard desarrollado para la optimización del sistema educativo colombiano mediante técnicas de machine
              learning y análisis de datos.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
