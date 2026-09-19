# Roomeefy — AI-Powered Architectural Visualization SaaS 🏛️✨

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Puter.js](https://img.shields.io/badge/Puter.js-Cloud_OS-8A2BE2?style=for-the-badge)](https://puter.com/)

Roomeefy is a generative AI SaaS platform designed for architects, interior designers, and real estate developers. It transforms 2D architectural sketches, floor plans, and elevation drawings into photorealistic 3D structural renders with cloud hosting and persistent metadata.

---

## 🌟 Key Features

- **2D-to-3D Photorealistic Rendering:** Converts raw 2D floor plans and room layouts into high-fidelity 3D interior and exterior renders using multimodal vision models.
- **Multimodal AI Integration:** Powered by **Claude 3.5 Sonnet** and **Google Gemini Vision** models for spatial and architectural precision.
- **Serverless Cloud Infrastructure:** Built on top of **Puter Cloud**, utilizing serverless workers, persistent file storage, and Puter Key-Value (KV) databases.
- **Community Discovery Gallery:** Global feed showcasing community-generated renders with live prompt inspection and design exploration.
- **Strict TypeScript Architecture:** Robust type-safety across all component states, cloud APIs, and render pipelines.

---

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React
- **Cloud & AI Infrastructure:** Puter.js SDK (Serverless Workers, Puter KV Database, Permanent Cloud Storage)
- **AI Vision Models:** Anthropic Claude 3.5, Google Gemini Vision

---

## 🏗️ System Architecture

```text
[ React + TypeScript Client ]
         │
         ├── Puter SDK (Auth & Worker Dispatch)
         ├── Claude 3.5 & Gemini Vision (Prompt Optimization & 3D Render Engine)
         └── Puter KV & File Store (Metadata & Asset Hosting)
         ▼
[ Community Visualizer & Gallery Feed ]
```

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dhruv261d/Roomeefy.git
   cd Roomeefy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
