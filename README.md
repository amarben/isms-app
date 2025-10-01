# ISMS Application 🔒

A comprehensive **Information Security Management System (ISMS)** application built with React, TypeScript, and modern web technologies. This application helps organizations implement and manage ISO 27001:2022 compliant information security policies and procedures.

## ✨ Features

### 🏢 **ISMS Scope Definition**
- **Guided wizard** for defining organizational scope
- **20+ predefined exclusions** with professional justifications
- **AI-powered document generation** using DeepSeek Chat
- **Professional DOCX export** with rich formatting

### 📋 **Information Security Policy Module**
- **5-step policy creation wizard**
- **Predefined templates** for policy statements, objectives, and compliance requirements
- **Click-to-select interface** for common ISMS components
- **6 professional role templates** with detailed responsibilities
- **AI-enhanced policy generation** with comprehensive prompts
- **Multi-format export** (Markdown & DOCX)

### 🤖 **AI Integration**
- **DeepSeek Chat API** integration for professional document generation
- **Intelligent prompting** following ISO 27001:2022 standards
- **Context-aware content** generation based on organization details

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **DeepSeek API key** (for AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amarben/isms-app.git
   cd isms-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Add your DeepSeek API key to .env
   VITE_DEEPSEEK_API_KEY=your_api_key_here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Custom CSS utility classes (Tailwind-inspired)
- **AI Integration**: DeepSeek Chat API
- **Document Generation**: docx library for professional DOCX export
- **Icons**: Lucide React
- **Development**: ESLint, hot module replacement

## 📁 Project Structure

```
src/
├── components/
│   ├── ScopeDefinition.tsx      # ISMS scope definition wizard
│   └── InformationSecurityPolicy.tsx  # Policy creation module
├── index.css                    # Custom utility styles
├── App.tsx                      # Main application component
└── main.tsx                     # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Detail

### **Predefined Content Libraries**
- **15 security objectives** aligned with ISO 27001
- **20 common scope exclusions** with justifications
- **6 organizational roles** with detailed responsibilities
- **15 compliance requirements** (GDPR, SOX, HIPAA, etc.)
- **Multiple policy statement templates**

### **Professional Document Export**
- **Advanced markdown parsing** for DOCX generation
- **Rich formatting** with proper headings and styles
- **Professional layout** suitable for organizational use
- **Multi-format support** (MD, DOCX)

### **User Experience**
- **Intuitive wizard interfaces** with step-by-step guidance
- **Visual feedback** with green highlighting for selections
- **Hybrid approach** supporting both predefined and custom content
- **Responsive design** for desktop and mobile use

## 🔐 Security

- **API keys protected** with proper .gitignore configuration
- **Environment variable management** for sensitive data
- **Input validation** through TypeScript interfaces
- **Error handling** for API failures

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ for information security professionals**