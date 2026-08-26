# Construction Estimating Software & Tender Assembly Builder

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Category](https://img.shields.io/badge/Category-Construction%20Tech-orange.svg)

**Construction Tender Assembly Builder** is a browser-based application and Excel estimating template designed to automate construction bid preparation, manage BOQ (Bill of Quantities), and standardize cost calculations. 

By turning historical estimates into reusable corporate assets, this construction tender estimating software reduces bid preparation time from weeks to hours. Available as a free web tool or a downloadable Excel workbench for professional estimators and quantity surveyors.

> 🌐 **Free Web Version** → [*Open Estimating Software in Browser*](https://hyvoid.github.io/construction-estimating/)
> 
> 📥 **Excel Template** → [*Download Workbench*](https://alexhasgreatestuff.gumroad.com/l/prkvr?wanted=true)
---

# What It Helps You Track

## Overcoming Common Construction Estimating Challenges

This workbench is engineered to solve the most frequent bottlenecks in **construction bid preparation** and **cost engineering**:

*   **Preventing Scope Omissions in BOQ:** Stop losing margin due to missed items. The tender mapping engine automatically cross-references new Bill of Quantities (BOQ) with historical databases to ensure scope completeness.
*   **Reusing Historical Construction Data:** Stop starting every bid from scratch. Convert past project estimates into dynamic, reusable assembly libraries (Assembly Builder) for instant retrieval.
*   **Mitigating Labor Productivity Risks:** Avoid using outdated labor rates. Apply dynamic productivity adjustment factors to historical labor data to match current site conditions and market rates.
*   **Standardizing Cost Codes (WBS):** Eliminate post-tender rework. Automatically structure your estimates using standardized cost codes, making them instantly exportable to project management software like Procore.

---

## How to Use the Estimating Workbench: Quick Start Guide

### 1. Setup Construction Cost Parameters
Open the **Settings** workspace to define your corporate estimating baseline. Establish standardized rules for your bids:
*   **Markup & Overhead:** Define target gross margins and overhead percentages.
*   **Risk & Contingency:** Set baseline risk allowances for volatile construction materials.
*   **Labor Productivity:** Apply regional adjustment factors for construction labor rates.
*   *Outcome:* Set these parameters once to establish your master **cost estimation template framework**.

### 2. Import Bill of Quantities (BOQ) Data
Seamlessly integrate your existing tender data without complex database migration. Paste raw data directly from external takeoff tools, accounting systems, or client consultant documents into the designated worksheets:
*   Tender BOQ (Bill of Quantities)
*   Subcontractor Schedule of Rates (SOR)
*   Material Quantity Takeoffs (QTO)

### 3. Automate Assembly Mapping & Cost Calculation
Switch to the **Estimating Engine**. The workbench automatically executes the following logic:
*   Performs **BOQ normalization**, mapping new tender line items to your historical construction assemblies.
*   Calculates precise labor, material, and equipment costs based on your predefined productivity rules.
*   Generates a tender-ready **cost estimate output** with transparent risk and margin breakdowns.
*   👉 [*Test the Automated Assembly Mapping in Browser*](https://hyvoid.github.io/construction-estimating/)

### 4. Build a Reusable Corporate Estimating Database
After tender submission, do not discard the file. Your new mappings and custom WBS (Work Breakdown Structure) assemblies are saved directly into the **History Repository**. The system evolves with every bid, transforming single-use spreadsheets into a permanent **construction estimating database**.
*   👉 [*Download the Excel Estimating Workbench for Offline Use*](https://alexhasgreatestuff.gumroad.com/l/prkvr?wanted=true)

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

### Primary Use Cases

*   **Quantity Surveyors (QS) & Cost Engineers:** Rapidly validate subcontractor quotes and perform accurate quantity takeoffs against historical baselines.
*   **General Contractors (Main Contractors):** Standardize the internal bidding process across multiple estimating teams to reduce commercial risk.
*   **Commercial Managers:** Gain immediate visibility into tender margin exposure, risk allowances, and overhead allocation before bid submission.

No spreadsheet expertise is required.

Open the browser version or download the Excel workbook and begin building reusable estimating assemblies immediately.

---

## Why I Built This: The "Estimating Memory" Problem

After analyzing hundreds of construction bids and working with commercial teams, I realized a fundamental truth: **Most construction companies do not actually suffer from a lack of estimating software. They suffer from a lack of institutional estimating memory.**

In many quantity surveying (QS) and estimating teams, the bid preparation workflow still looks like this:

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

---

## Traditional Spreadsheets vs. Estimating Workbench

| Estimating Pain Points | Traditional Spreadsheet Methods | Workbench Automated Solution |
| :--- | :--- | :--- |
| **Bid Preparation Time** | Estimators spend days manually reconstructing WBS and assemblies for similar projects. | Auto-maps tender structures, reusing existing assemblies in hours. |
| **Cost Accuracy & Variance** | Large estimate variations depending on the individual estimator's experience. | Enforces standardized cost libraries and corporate estimating rules. |
| **Data Knowledge Loss** | Corporate pricing knowledge is lost in isolated files after tender submission. | Historical assemblies become permanent, searchable corporate assets. |
| **Margin & Risk Visibility** | Hidden contingency assumptions mask true margin exposure during bid reviews. | Explicit risk, contingency, and escalation logic are separated from base costs. |

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
