# SheriaFlow - Payroll & Compliance System 🇰🇪

**SheriaFlow** is a modern, compliant payroll management dashboard designed for Kenyan businesses. It streamlines employee management, salary processing, and statutory reporting (KRA, NSSF, SHIF/NHIF, and Housing Levy).

## 🚀 Features

* **📊 Interactive Dashboard:** Real-time overview of payroll costs, active employees, and compliance status.
* **👥 Employee Management:** Track employee details, roles, and employment status.
* **💳 Payroll Processing:** Automated calculation of Basic Pay, Allowances, and Statutory Deductions.
* **📄 Statutory Reports:** Download ready-to-file reports for:
    * KRA PAYE (P10)
    * NSSF Contributions
    * SHIF / NHIF Deductions
    * Affordable Housing Levy
* **⚙️ Tax Configuration:** Toggle and configure statutory rates (e.g., enable/disable Housing Levy).
* **🔐 Authentication:** Secure Login and Registration pages.

## 🛠️ Tech Stack

* **Frontend Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Router:** React Router DOM

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Tracy832/SheriaFlow-Frontend.git](https://github.com/Tracy832/SheriaFlow-Frontend.git)
    cd SheriaFlow-Frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to view the application.

## 📂 Project Structure

```text
src/
├── components/
│   ├── common/       # Reusable UI components (StatCards, Buttons)
│   ├── dashboard/    # Widgets for the main dashboard view
│   ├── layout/       # Sidebar and Header components
│   └── pages/        # Full page views (Employees, Payroll, Reports, Settings)
├── App.tsx           # Main Route definitions
└── main.tsx          # Entry point