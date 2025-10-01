import React, { useState } from 'react'
import { FileText, Shield, Target, Users, Settings, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react'
import ScopeDefinition from './components/ScopeDefinition'
import InformationSecurityPolicy from './components/InformationSecurityPolicy'
import './App.css'

interface Step {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  status: 'not-started' | 'in-progress' | 'completed'
}

const steps: Step[] = [
  {
    id: 'scope',
    title: 'Define ISMS Scope',
    description: 'Determine the boundaries and applicability of the ISMS',
    icon: Target,
    status: 'in-progress'
  },
  {
    id: 'policy',
    title: 'Information Security Policy',
    description: 'Establish management direction and support',
    icon: FileText,
    status: 'not-started'
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Identify and analyze information security risks',
    icon: AlertTriangle,
    status: 'not-started'
  },
  {
    id: 'risk-treatment',
    title: 'Risk Treatment',
    description: 'Select and implement security controls',
    icon: Shield,
    status: 'not-started'
  },
  {
    id: 'soa',
    title: 'Statement of Applicability',
    description: 'Document applicable controls and justifications',
    icon: CheckCircle,
    status: 'not-started'
  },
  {
    id: 'implementation',
    title: 'Implementation',
    description: 'Implement the ISMS and security controls',
    icon: Settings,
    status: 'not-started'
  },
  {
    id: 'training',
    title: 'Training & Awareness',
    description: 'Ensure competence and awareness',
    icon: Users,
    status: 'not-started'
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Review',
    description: 'Monitor, measure, and review ISMS performance',
    icon: BarChart3,
    status: 'not-started'
  }
]

function App() {
  const [activeStep, setActiveStep] = useState('scope')

  const getStepContent = () => {
    console.log('Current activeStep:', activeStep)
    switch (activeStep) {
      case 'scope':
        return <ScopeDefinition />
      case 'policy':
        return <InformationSecurityPolicy />
      default:
        const currentStepInfo = steps.find(s => s.id === activeStep)
        const Icon = currentStepInfo?.icon || FileText

        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentStepInfo?.title}
              </h2>
              <p className="text-gray-600 mb-8">
                {currentStepInfo?.description}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm font-medium">
                  🚧 This step is coming soon!
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  We're working on implementing this feature. For now, you can use the Scope Definition and Information Security Policy steps.
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return (
          <div className="relative w-5 h-5">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )
      default:
        return (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">ISO 27001 ISMS</h1>
          <p className="text-sm text-gray-600 mt-1">Implementation Guide</p>
          <div className="mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full inline-block">
            ✓ UI Updated
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === step.id

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    console.log('Navigation clicked:', step.id, 'Current:', activeStep)
                    setActiveStep(step.id)
                  }}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    isActive ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                      {step.title}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      Step {index + 1} of {steps.length}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {step.status === 'completed' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {step.status === 'in-progress' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                    {step.status === 'not-started' && (
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1" style={{ overflow: 'auto', backgroundColor: '#f3f4f6', padding: '32px' }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{ maxWidth: '896px', margin: '0 auto' }}>
          {getStepContent()}
        </div>
      </div>
    </div>
  )
}

export default App
