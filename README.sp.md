[ 🌐 عربي ](README.ar.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Software de Estimación de Construcción y Constructor de Ensamblajes de Licitación

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Category](https://img.shields.io/badge/Category-Construction%20Tech-orange.svg)

**Construction Tender Assembly Builder** es una aplicación basada en navegador y una plantilla de estimación de Excel diseñada para automatizar la preparación de ofertas de construcción, gestionar el BOQ (Bill of Quantities, lista de cantidades) y estandarizar los cálculos de costos.

Al convertir estimaciones históricas en activos corporativos reutilizables, este software de estimación de licitaciones de construcción reduce el tiempo de preparación de ofertas de semanas a horas. Disponible como herramienta web gratuita o como libro de Excel descargable para estimadores profesionales y técnicos de cantidades (quantity surveyors).

> 🌐 **Versión web gratuita** → [*Abrir el software de estimación en el navegador*](https://hyvoid.github.io/construction-estimating/)
> 
> 📥 **Plantilla de Excel** → [*Descargar el banco de trabajo*](https://theseusworkshop.com/l/prkvr?utm_source=github&utm_medium=GitHub%20README)

## ¿Quieres probarlo?

Este proyecto está incluido en el Construction Toolkit.

Prueba esta y otras herramientas ligeras de construcción gratis durante 30 días — incluyendo herramientas para estimación, licitaciones, costeo de obras y operaciones diarias.

→ [Prueba el Construction Toolkit](https://theseusworkshop.com/l/fqtoi/BIDSEASON?utm_source=github&utm_medium=GitHub%20portfolio)

---

# Qué Te Ayuda a Gestionar

## Cómo Superar los Desafíos Comunes de la Estimación de Construcción

Este banco de trabajo está diseñado para resolver los cuellos de botella más frecuentes en la **preparación de ofertas de construcción** y la **ingeniería de costos**:

*   **Prevención de omisiones de alcance en el BOQ:** Deja de perder margen por partidas omitidas. El motor de mapeo de licitaciones cruza automáticamente el nuevo Bill of Quantities (BOQ) con bases de datos históricas para garantizar la integridad del alcance.
*   **Reutilización de datos históricos de construcción:** Deja de empezar cada oferta desde cero. Convierte las estimaciones de proyectos pasados en bibliotecas de ensamblajes dinámicas y reutilizables (Assembly Builder) para su recuperación instantánea.
*   **Mitigación de riesgos de productividad laboral:** Evita el uso de tarifas de mano de obra desactualizadas. Aplica factores dinámicos de ajuste de productividad a los datos históricos de mano de obra para reflejar las condiciones actuales de obra y las tarifas del mercado.
*   **Estandarización de códigos de costos (WBS):** Elimina el retrabajo posterior a la licitación. Estructura automáticamente tus estimaciones mediante códigos de costos estandarizados, haciéndolas exportables al instante a software de gestión de proyectos como Procore.

---

## Cómo Usar el Banco de Trabajo de Estimación: Guía de Inicio Rápido

### 1. Configuración de los Parámetros de Costos de Construcción
Abre el espacio de trabajo **Settings** para definir tu línea base corporativa de estimación. Establece reglas estandarizadas para tus ofertas:
*   **Margen comercial (markup) y costos indirectos:** Define márgenes brutos objetivo y porcentajes de costos indirectos.
*   **Riesgo y contingencia:** Establece tolerancias de riesgo base para materiales de construcción volátiles.
*   **Productividad de mano de obra:** Aplica factores de ajuste regionales para las tarifas de mano de obra de construcción.
*   *Resultado:* Configura estos parámetros una sola vez para establecer tu **marco de plantilla maestra de estimación de costos**.

### 2. Importación de Datos del Bill of Quantities (BOQ)
Integra sin fricciones tus datos de licitación existentes sin migraciones de base de datos complejas. Pega los datos en bruto directamente desde herramientas externas de levantamiento de cantidades (takeoff), sistemas contables o documentos de consultores del cliente en las hojas designadas:
*   BOQ de licitación (Bill of Quantities)
*   Schedule of Rates (SOR) de subcontratistas
*   Levantamientos de cantidades de materiales (QTO)

### 3. Automatización del Mapeo de Ensamblajes y el Cálculo de Costos
Cambia al **Estimating Engine**. El banco de trabajo ejecuta automáticamente la siguiente lógica:
*   Realiza la **normalización del BOQ**, mapeando las nuevas partidas de la licitación con tus ensamblajes históricos de construcción.
*   Calcula costos precisos de mano de obra, materiales y equipos según tus reglas de productividad predefinidas.
*   Genera un **resultado de estimación de costos** listo para licitación con desgloses transparentes de riesgo y margen.
*   👉 [*Prueba el mapeo automatizado de ensamblajes en el navegador*](https://hyvoid.github.io/construction-estimating/)

### 4. Construcción de una Base de Datos de Estimación Corporativa Reutilizable
Tras presentar la licitación, no descartes el archivo. Tus nuevos mapeos y ensamblajes WBS (Work Breakdown Structure, estructura de desglose del trabajo) personalizados se guardan directamente en el **History Repository**. El sistema evoluciona con cada oferta, transformando hojas de cálculo de un solo uso en una **base de datos de estimación de construcción** permanente.
*   👉 [*Descarga el Banco de Trabajo de Estimación en Excel para usarlo sin conexión*](https://gum.co/u/kt9yecmv)

---

# Para Quién Es Esto

Este banco de trabajo está diseñado para:

* Estimadores de construcción
* Gerentes comerciales
* Técnicos de cantidades (quantity surveyors)
* Gerentes de licitaciones
* Empresas de construcción pequeñas y medianas
* Contratistas que desarrollan estándares internos de estimación
* Organizaciones que se preparan para una futura implementación de Procore

### Casos de Uso Principales

*   **Técnicos de Cantidades (QS) e Ingenieros de Costos:** Valida rápidamente cotizaciones de subcontratistas y realiza levantamientos de cantidades (takeoff) precisos contra líneas base históricas.
*   **Contratistas Generales (Contratistas Principales):** Estandariza el proceso interno de ofertas entre múltiples equipos de estimación para reducir el riesgo comercial.
*   **Gerentes Comerciales:** Obtén visibilidad inmediata de la exposición al margen de la licitación, las tolerancias de riesgo y la asignación de costos indirectos antes de presentar la oferta.

No se requiere experiencia en hojas de cálculo.

Abre la versión en navegador o descarga el libro de Excel y comienza a construir ensamblajes de estimación reutilizables de inmediato.

---

## Por Qué Construí Esto: El Problema de la "Memoria de Estimación"

Después de analizar cientos de ofertas de construcción y trabajar con equipos comerciales, me di cuenta de una verdad fundamental: **La mayoría de las empresas de construcción no sufren realmente por falta de software de estimación. Sufren por falta de memoria institucional de estimación.**

En muchos equipos de quantity surveying (QS) y estimación, el flujo de trabajo de preparación de ofertas todavía se ve así:

```text
New BOQ Received
      ↓
Review Architectural Drawings
      ↓
Search Siloed Spreadsheets & Old Files
      ↓
Copy Previous Project Estimate
      ↓
Manually Modify Cost Rates
      ↓
Submit Tender (with hidden commercial risks)
```
---

## Hojas de Cálculo Tradicionales vs. Banco de Trabajo de Estimación

| Puntos de Dolor de la Estimación | Métodos Tradicionales con Hojas de Cálculo | Solución Automatizada del Banco de Trabajo |
| :--- | :--- | :--- |
| **Tiempo de preparación de ofertas** | Los estimadores pasan días reconstruyendo manualmente el WBS y los ensamblajes para proyectos similares. | Mapea automáticamente las estructuras de licitación, reutilizando ensamblajes existentes en horas. |
| **Precisión y variación de costos** | Grandes variaciones en las estimaciones según la experiencia de cada estimador individual. | Aplica bibliotecas de costos estandarizadas y reglas corporativas de estimación. |
| **Pérdida de conocimiento de datos** | El conocimiento de precios corporativo se pierde en archivos aislados tras presentar la licitación. | Los ensamblajes históricos se convierten en activos corporativos permanentes y consultables. |
| **Visibilidad de margen y riesgo** | Supuestos de contingencia ocultos enmascaran la exposición real al margen durante las revisiones de ofertas. | La lógica explícita de riesgo, contingencia y escalación se separa de los costos base. |

---

# Acerca de

Construyo herramientas ligeras de apoyo a la decisión para situaciones donde hay demasiadas variables en movimiento como para gestionarlas de forma confiable en la memoria.

La pregunta central detrás de cada herramienta es:

> **¿Qué información necesita existir en un solo lugar para tomar la siguiente decisión con confianza?**

El Construction Tender Assembly Builder & Estimating Workbench es un ejemplo de este enfoque: transformar conocimiento fragmentado de estimación, proyectos históricos y bibliotecas de costos en un sistema operativo de decisiones reutilizable.

---

# Detalles Técnicos

<details>
<summary>Para revisores técnicos, usuarios de Excel y colaboradores</summary>

## Arquitectura del Libro de Excel

| Hoja                  | Función                        |
| --------------------- | ------------------------------ |
| 01_Settings           | Supuestos globales de estimación |
| 02_Cost_Library       | Base de datos de costos estandarizada |
| 03_Assembly_Library   | Ensamblajes de estimación reutilizables |
| 04_Tender_Import      | Datos de licitación en bruto |
| 05_Tender_Mapping     | Normalización y mapeo del BOQ |
| 06_Assembly_Builder   | Motor de creación de ensamblajes |
| 07_Estimate_Engine    | Cálculos de costos |
| 08_Risk_Margin        | Análisis de riesgo y precios |
| 09_Tender_Output      | Entregables de licitación |
| 10_Procore_Export     | Estructuras de exportación de presupuesto |
| 11_History_Repository | Conocimiento corporativo de estimación |
| 12_Dashboard          | Reportes gerenciales |

### Flujo de Datos

```text
Tender Import
        ↓
Tender Mapping
        ↓
Assembly Builder
        ↓
Cost Library
        ↓
Estimate Engine
        ↓
Risk/Margin
        ↓
Tender Output
        ↓
Procore Export
```

---

## Tres Trampas que Atrapan Incluso a los Estimadores con Experiencia

### Trampa 1 — Reutilizar Estimaciones Históricas Sin Normalización del Alcance

Se tomó una decisión:

> Usar el Proyecto A como base para el Proyecto B.

La estimación se basó en un supuesto pasado por alto:

> Se asumió que las categorías de alcance eran idénticas.

| Histórico | Nueva Licitación |
| ---------- | ---------- |
| Excavación | Movimiento de Tierras |
| Estructural | Concreto   |
| Instalaciones | MEP        |

Resultado:

* El 18% de los costos fue omitido.

El razonamiento es incorrecto porque la terminología de la licitación rara vez coincide con las definiciones operativas del alcance.

Enfoque correcto:

```text
Tender Item
      ↓
Scope Mapping
      ↓
Assembly Matching
      ↓
Cost Library
```

Resultado correcto:

* Integridad del alcance restaurada.
* Variación de la estimación reducida significativamente.

<details>
<summary>Lógica de Fórmulas</summary>

```excel
=XLOOKUP(Tender_Item,
Mapping_Table[Tender],
Mapping_Table[Assembly])

=SUMIFS(Costs[Amount],
Costs[Assembly],
Current_Assembly)
```

</details>

---

### Trampa 2 — Asumir que la Productividad Histórica Sigue Siendo Válida

Decisión:

> Usar las tarifas y la productividad de mano de obra del año pasado.

Supuesto erróneo:

> La productividad permanece constante.

Ejemplo:

| Año     | Productividad |
| -------- | ------------ |
| Anterior | 8 m²/hr      |
| Actual  | 5.9 m²/hr    |

Resultado:

* Costos de mano de obra subestimados en un 35%.

Enfoque correcto:

```text
Historical Productivity
       ×
Adjustment Factor
       ×
Current Conditions
```

Resultado correcto:

* Las estimaciones de mano de obra reflejan las condiciones actuales del mercado.

<details>
<summary>Lógica de Fórmulas</summary>

```excel
=Base_Productivity
* Adjustment_Factor

=Quantity
/ Adjusted_Productivity
```

</details>

---

### Trampa 3 — Aplicar el Margen Antes del Riesgo

Decisión:

> Aplicar el margen objetivo directamente.

Supuesto erróneo:

> La exposición al riesgo ya está reflejada.

Resultado:

```text
Cost = $10M
Margin = 10%
Bid = $11M
```

Riesgo no reconocido:

```text
Risk Exposure = $1.5M
```

Enfoque correcto:

```text
Base Cost
      +
Risk
      +
Contingency
      +
Margin
```

Resultado correcto:

```text
$10M + $1.5M + 10%
= $12.65M
```

<details>
<summary>Lógica de Fórmulas</summary>

```excel
=Direct_Cost
+ Risk
+ Contingency

=Adjusted_Cost
* (1+Margin)
```

</details>

---

## Escenario de Ejemplo

Un contratista recibe una licitación de expansión hospitalaria.

Entrada:

| Concepto            | Valor |
| ------------------- | ----- |
| Valor de la Licitación | $48M  |
| Partidas del BOQ | 1,240 |
| Proyectos Históricos | 42    |
| Ensamblajes Existentes | 680   |

Procesamiento:

```text
1240 BOQ items
        ↓
892 auto-mapped
        ↓
278 assembly matches
        ↓
348 manual reviews
```

Resultado de la estimación:

| Componente      | Costo   |
| -------------- | ------ |
| Materiales      | $19.4M |
| Mano de Obra    | $11.2M |
| Equipos      | $5.1M  |
| Subcontratistas | $7.8M  |
| Costos Indirectos      | $1.6M  |
| Riesgo           | $1.9M  |

Licitación final:

```text
Direct Cost:
$45.1M

Margin:
8%

Tender Price:
$48.7M
```

Implicación operativa:

En lugar de pasar tres semanas reconstruyendo estimaciones históricas, el estimador se concentra solo en las excepciones de alcance y la estrategia comercial.

---

## Referencia de Fórmulas

<details>
<summary>Mapeo de Ensamblajes</summary>

```excel
XLOOKUP()
INDEX/MATCH()
TEXTAFTER()
TEXTBEFORE()
```

</details>

<details>
<summary>Cálculo de la Estimación</summary>

```excel
SUMIFS()
SUMPRODUCT()
LET()
LAMBDA()
```

</details>

<details>
<summary>Análisis de Riesgo</summary>

```excel
IF()
IFS()
CHOOSE()
SWITCH()
```

</details>

---

## Reglas de Validación

| Campo          | Regla                     | Comportamiento ante Errores     |
| -------------- | ------------------------ | ------------------ |
| Código de Costo      | Debe existir en la biblioteca    | Advertencia de validación |
| ID de Ensamblaje    | Debe ser único           | Rechazar entrada       |
| Cantidad       | Mayor que cero        | Resaltar error    |
| Productividad   | Dentro del rango aceptado    | Advertencia            |
| Margen         | Entre 0–50%            | Rechazar             |
| Escalación     | Entre -20% y +50%    | Advertencia            |
| Mapeo de Licitación | Debe resolverse a un ensamblaje | Cola de excepciones    |
| Exportación a Procore | Se requiere WBS válido       | Exportación bloqueada     |

</details>

---

# Otras Herramientas de Esta Serie

* **DTC Inventory Planning Workbench** — Planificación de inventario y análisis de reabastecimiento estilo ensamblajes.
* **Marketing Budget Allocation Simulator** — Optimización de presupuesto de medios basada en escenarios.
* **Project Time & Cost Analytics Console** — Análisis de asignación de mano de obra y rentabilidad.
* **VAT Compliance Calculation Workbench** — Reportes fiscales y conciliación multiplataforma.

Más herramientas disponibles a través del perfil de GitHub y el repositorio de versiones (releases).

---

# Licencia

Este proyecto está licenciado bajo la **Apache License 2.0**.

Consulta el archivo LICENSE para más detalles.