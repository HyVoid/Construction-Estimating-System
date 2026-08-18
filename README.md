# Construction Tender Assembly Builder & Estimating Workbench

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool](https://img.shields.io/badge/Tool-Decision%20Support-orange.svg)

**Standardize construction tender estimating, reduce bid preparation time from weeks to hours, and turn every completed estimate into a reusable corporate estimating asset — with a free browser version and a downloadable Excel workbench.**

> ## **No signup. No installation. Free.**
>
> 🌐 **Open in Browser** → [*HTML Interactive Version*](https://hyvoid.github.io/Construction-Tender-Assembly-Builder-Estimating-Workbench/)
>
> 📥 **Download Excel** → [Download Link](https://alexhasgreatestuff.gumroad.com/l/prkvr?utm_source=github&utm_medium=GitHub%20README&utm_campaign=readme%20new%20launch&utm_content=construction-tender-estimating)

---

# What It Helps You Track

* Tender scope items that have already been estimated in previous projects and can be reused immediately.
* Planned project costs versus actual assembly composition and estimating assumptions.
* Margin exposure, contingency allocation, escalation assumptions, and tender risk position.
* Assembly reuse rates across historical projects and estimators.
* Standardized cost code structures required for downstream budgeting and project execution.
* Corporate estimating knowledge accumulation instead of one-off spreadsheet outputs.

---

# Quick Start Workflow

### 1. Configure Estimating Parameters Once

Open the **Settings** worksheet and define company-wide estimating assumptions, including:

* Overhead percentages
* Target gross margin
* Risk allowances
* Escalation assumptions
* Currency and taxation rules
* Productivity adjustment factors

These parameters become the standard estimating framework used across all tenders.

---

### 2. Import Existing Tender Data

Paste or import existing project information into the designated worksheets:

* Tender BOQ
* Scope schedules
* Schedule of rates
* Quantity takeoffs
* Historical pricing references

No database migration is required. Existing exports from estimating software, accounting systems, spreadsheets, or consultant documents can be used directly.

---

### 3. Generate Estimates Automatically

Switch to the estimating workspace.

The system automatically:

* Maps tender items to historical assemblies
* Retrieves standardized cost components
* Applies labor and productivity assumptions
* Calculates risk, escalation, and margin impacts
* Produces tender-ready estimate outputs

No manual recalculation or rebuilding is required.

---

### 4. Refresh and Build Corporate Knowledge

When new tenders arrive:

* Import the new BOQ
* Reuse existing mappings
* Create additional assemblies only where necessary
* Save new estimating knowledge back into the corporate repository

The estimating system improves over time instead of restarting from zero for every project.

> **Set a few key parameters. Drop in existing tender data. Get the estimate. Refresh when needed.**

---

# Why I Built This

Most construction companies do not actually suffer from a lack of estimating software.

They suffer from a lack of **estimating memory**.

In many estimating teams, the workflow still looks like this:

```text
New Tender
      ↓
Review Drawings
      ↓
Search Old Files
      ↓
Copy Previous Estimate
      ↓
Modify Numbers
      ↓
Submit Bid
```

The problem is not that estimators cannot price projects.

The problem is that every tender becomes a one-time exercise, where:

* historical assemblies disappear,
* mapping logic is lost,
* productivity assumptions remain undocumented,
* and estimating quality depends heavily on individual experience.

I built this workbook as a **productized estimating framework**, not as another estimating spreadsheet.

For example:

### Before

Tender:

```text
Earthworks
Concrete
Services
```

Historical estimate:

```text
Excavation
Structural Concrete
MEP
```

Result:

* No direct matching
* Manual reconstruction required
* Several days spent rebuilding assemblies

---

### After

The assembly engine recognizes:

```text
Earthworks → Excavation Assembly
Concrete → Structural Concrete Assembly
Services → MEP Assembly
```

The estimator only reviews exceptions instead of rebuilding the entire estimate.

The result changes from:

> "How do we estimate this project?"

to:

> "Which existing corporate estimating knowledge already solves most of this project?"

This workbook turns estimating from a repetitive activity into a reusable organizational asset.

---

# Common Construction Estimating Problems This Solves

| Problem                                       | Without This Tool                                      | With This Tool                                |
| --------------------------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| Every tender requires rebuilding assemblies   | Estimators spend days reconstructing similar estimates | Existing assemblies are reused automatically  |
| Different estimators produce different prices | Large estimate variation between staff                 | Standardized cost libraries and rules         |
| Historical projects cannot be reused          | Corporate knowledge is lost after submission           | Historical assemblies become permanent assets |
| Tender structures change constantly           | Previous estimates cannot be mapped efficiently        | Tender mapping engine normalizes structures   |
| Procore implementation starts from scratch    | Budget structures require rework                       | Standard WBS and cost codes already exist     |
| Risk assumptions remain undocumented          | Margin exposure is hidden                              | Risk and contingency logic becomes visible    |

---

# Who This Is For

This workbench is designed for:

* Construction estimators
* Commercial managers
* Quantity surveyors
* Tender managers
* Small and medium construction companies
* Contractors building internal estimating standards
* Organizations preparing for future Procore implementation

This workbench is not designed for:

* Enterprise ERP replacement
* Real-time collaborative estimating platforms
* Enterprise database management systems
* Full construction project management suites

No spreadsheet expertise is required.

Open the browser version or download the Excel workbook and begin building reusable estimating assemblies immediately.

---

# About

I build lightweight decision-support tools for situations where there are too many moving parts to reliably manage in memory.

The central question behind every tool is:

> **What information needs to exist in one place to make the next decision confidently?**

The Construction Tender Assembly Builder & Estimating Workbench is one example of this approach: transforming fragmented estimating knowledge, historical projects, and cost libraries into a reusable operational decision system.

---

# Technical Details

<details>
<summary>For technical reviewers, Excel practitioners, and collaborators</summary>

## Workbook Architecture

| Sheet                 | Function                       |
| --------------------- | ------------------------------ |
| 01_Settings           | Global estimating assumptions  |
| 02_Cost_Library       | Standardized cost database     |
| 03_Assembly_Library   | Reusable estimating assemblies |
| 04_Tender_Import      | Raw tender data                |
| 05_Tender_Mapping     | BOQ normalization and mapping  |
| 06_Assembly_Builder   | Assembly creation engine       |
| 07_Estimate_Engine    | Cost calculations              |
| 08_Risk_Margin        | Risk and pricing analysis      |
| 09_Tender_Output      | Tender deliverables            |
| 10_Procore_Export     | Budget export structures       |
| 11_History_Repository | Corporate estimating knowledge |
| 12_Dashboard          | Management reporting           |

### Data Flow

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

## Three Traps That Catch Even Experienced Estimators

### Trap 1 — Reusing Historical Estimates Without Scope Normalization

A decision was made:

> Use Project A as the basis for Project B.

The estimate relied on an unnoticed assumption:

> Scope categories were assumed to be identical.

| Historical | New Tender |
| ---------- | ---------- |
| Excavation | Earthworks |
| Structural | Concrete   |
| Services   | MEP        |

Result:

* 18% of costs were omitted.

The reasoning is incorrect because tender terminology rarely matches operational scope definitions.

Correct approach:

```text
Tender Item
      ↓
Scope Mapping
      ↓
Assembly Matching
      ↓
Cost Library
```

Correct outcome:

* Scope completeness restored.
* Estimate variance reduced significantly.

<details>
<summary>Formula Logic</summary>

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

### Trap 2 — Assuming Historical Productivity Remains Valid

Decision:

> Use last year's labor rates and productivity.

Faulty assumption:

> Productivity remains constant.

Example:

| Year     | Productivity |
| -------- | ------------ |
| Previous | 8 m²/hr      |
| Current  | 5.9 m²/hr    |

Result:

* Labor costs understated by 35%.

Correct approach:

```text
Historical Productivity
       ×
Adjustment Factor
       ×
Current Conditions
```

Correct outcome:

* Labor estimates reflect current market conditions.

<details>
<summary>Formula Logic</summary>

```excel
=Base_Productivity
* Adjustment_Factor

=Quantity
/ Adjusted_Productivity
```

</details>

---

### Trap 3 — Applying Margin Before Risk

Decision:

> Apply target margin directly.

Faulty assumption:

> Risk exposure is already reflected.

Result:

```text
Cost = $10M
Margin = 10%
Bid = $11M
```

Unrecognized risk:

```text
Risk Exposure = $1.5M
```

Correct approach:

```text
Base Cost
      +
Risk
      +
Contingency
      +
Margin
```

Correct outcome:

```text
$10M + $1.5M + 10%
= $12.65M
```

<details>
<summary>Formula Logic</summary>

```excel
=Direct_Cost
+ Risk
+ Contingency

=Adjusted_Cost
* (1+Margin)
```

</details>

---

## Example Scenario

A contractor receives a hospital expansion tender.

Input:

| Item                | Value |
| ------------------- | ----- |
| Tender Value        | $48M  |
| BOQ Items           | 1,240 |
| Historical Projects | 42    |
| Existing Assemblies | 680   |

Processing:

```text
1240 BOQ items
        ↓
892 auto-mapped
        ↓
278 assembly matches
        ↓
348 manual reviews
```

Estimate output:

| Component      | Cost   |
| -------------- | ------ |
| Materials      | $19.4M |
| Labour         | $11.2M |
| Equipment      | $5.1M  |
| Subcontractors | $7.8M  |
| Overheads      | $1.6M  |
| Risk           | $1.9M  |

Final tender:

```text
Direct Cost:
$45.1M

Margin:
8%

Tender Price:
$48.7M
```

Operational implication:

Instead of spending three weeks rebuilding historical estimates, the estimator focuses only on scope exceptions and commercial strategy.

---

## Formula Reference

<details>
<summary>Assembly Mapping</summary>

```excel
XLOOKUP()
INDEX/MATCH()
TEXTAFTER()
TEXTBEFORE()
```

</details>

<details>
<summary>Estimate Calculation</summary>

```excel
SUMIFS()
SUMPRODUCT()
LET()
LAMBDA()
```

</details>

<details>
<summary>Risk Analysis</summary>

```excel
IF()
IFS()
CHOOSE()
SWITCH()
```

</details>

---

## Validation Rules

| Field          | Rule                     | Error Behavior     |
| -------------- | ------------------------ | ------------------ |
| Cost Code      | Must exist in library    | Validation warning |
| Assembly ID    | Must be unique           | Reject entry       |
| Quantity       | Greater than zero        | Highlight error    |
| Productivity   | Within accepted range    | Warning            |
| Margin         | Between 0–50%            | Reject             |
| Escalation     | Between -20% and +50%    | Warning            |
| Tender Mapping | Must resolve to assembly | Exception queue    |
| Procore Export | Valid WBS required       | Export blocked     |

</details>

---

# Other Tools in This Series

* **DTC Inventory Planning Workbench** — Assembly-style inventory planning and replenishment analysis.
* **Marketing Budget Allocation Simulator** — Scenario-based media budget optimization.
* **Project Time & Cost Analytics Console** — Labor allocation and profitability analysis.
* **VAT Compliance Calculation Workbench** — Cross-platform tax reporting and reconciliation.

More tools available through the GitHub profile and release repository.

---

# License

This project is licensed under the **Apache License 2.0**.

See the LICENSE file for details.
