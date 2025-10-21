import React, { useState } from 'react'
import { FileText, Shield, Target, Users, Settings, CheckCircle, AlertTriangle, BarChart3, Calendar, ClipboardCheck, AlertCircle, Scale, Lock, Code, RefreshCcw, Home } from 'lucide-react'
import Dashboard from './components/Dashboard'
import ScopeDefinition from './components/ScopeDefinition'
import InformationSecurityPolicy from './components/InformationSecurityPolicy'
import RiskAssessment from './components/RiskAssessment'
import RiskTreatment from './components/RiskTreatment'
import StatementOfApplicability from './components/StatementOfApplicability'
import RiskTreatmentPlan from './components/RiskTreatmentPlan'
import Implementation from './components/Implementation'
import InternalAuditProcedure from './components/InternalAuditProcedure'
import AcceptableUsePolicy from './components/AcceptableUsePolicy'
import IncidentResponseProcedure from './components/IncidentResponseProcedure'
import LegalRegulatoryRequirements from './components/LegalRegulatoryRequirements'
import SecurityOperatingProcedures from './components/SecurityOperatingProcedures'
import SecureDevelopmentPolicy from './components/SecureDevelopmentPolicy'
import TrainingAwareness from './components/TrainingAwareness'
import InformationSecurityObjectives from './components/InformationSecurityObjectives'
import ManagementReview from './components/ManagementReview'
import CorrectiveActions from './components/CorrectiveActions'
import './App.css'

interface ScopeData {
  organizationName: string
  organizationType: string
  industry: string
  policyVersion: string
  ceoName: string
  cisoName: string
  effectiveDate: string
  nextReviewDate: string
  internalIssues: string[]
  externalIssues: string[]
  interestedParties: Array<{
    party: string
    requirements: string
    influence: string
  }>
  interfaces: Array<{
    system: string
    dependency: string
    impact: string
  }>
  exclusions: Array<{
    item: string
    justification: string
  }>
  scopeDocument: {
    processesAndServices: string[]
    departments: string[]
    physicalLocations: string[]
    additionalNotes: string
  }
}

interface Step {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  status: 'not-started' | 'in-progress' | 'completed'
  subItems?: Step[]
}

const steps: Step[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of your ISMS implementation progress',
    icon: Home,
    status: 'completed'
  },
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
    status: 'in-progress'
  },
  {
    id: 'risk-treatment',
    title: 'Risk Treatment',
    description: 'Evaluate risks and select treatment options (reduce, transfer, avoid, accept)',
    icon: Shield,
    status: 'not-started'
  },
  {
    id: 'soa',
    title: 'Statement of Applicability',
    description: 'Document which Annex A controls are applicable and justify decisions',
    icon: CheckCircle,
    status: 'not-started'
  },
  {
    id: 'treatment-plan',
    title: 'Risk Treatment Plan',
    description: 'Define implementation details for selected controls',
    icon: Calendar,
    status: 'not-started'
  },
  {
    id: 'objectives',
    title: 'Information Security Objectives',
    description: 'Define measurable security objectives and key performance indicators',
    icon: Target,
    status: 'not-started'
  },
  {
    id: 'implementation',
    title: 'Implement Security Controls',
    description: 'Execute the risk treatment plan and implement controls',
    icon: Settings,
    status: 'not-started',
    subItems: [
      {
        id: 'acceptable-use-policy',
        title: 'Acceptable Use of Assets',
        description: 'Control A.5.10 - IT Security Policy',
        icon: Shield,
        status: 'not-started'
      },
      {
        id: 'incident-response-procedure',
        title: 'Incident Response Procedure',
        description: 'Control A.5.26 - Incident Management Procedure',
        icon: AlertCircle,
        status: 'not-started'
      },
      {
        id: 'legal-regulatory-requirements',
        title: 'Legal & Regulatory Requirements',
        description: 'Control A.5.31 - List of Legal, Regulatory, and Contractual Requirements',
        icon: Scale,
        status: 'not-started'
      },
      {
        id: 'security-operating-procedures',
        title: 'Security Operating Procedures',
        description: 'Control A.5.37 - Security Procedures for IT Department',
        icon: Lock,
        status: 'not-started'
      },
      {
        id: 'secure-development-policy',
        title: 'Secure System Engineering',
        description: 'Control A.8.27 - Secure Development Policy',
        icon: Code,
        status: 'not-started'
      }
    ]
  },
  {
    id: 'training',
    title: 'Training & Awareness',
    description: 'Ensure competence and awareness',
    icon: Users,
    status: 'not-started'
  },
  {
    id: 'internal-audit',
    title: 'Internal Audit Procedure',
    description: 'Create systematic internal audit procedures',
    icon: ClipboardCheck,
    status: 'not-started'
  },
  {
    id: 'management-review',
    title: 'Management Review',
    description: 'Review ISMS performance, make decisions, and ensure alignment with business strategy',
    icon: BarChart3,
    status: 'not-started'
  },
  {
    id: 'corrective-actions',
    title: 'Corrective Actions',
    description: 'Identify non-conformities, analyze root causes, and implement systematic corrections',
    icon: RefreshCcw,
    status: 'not-started'
  }
]

function App() {
  const [activeStep, setActiveStep] = useState('dashboard')
  const [scopeData, setScopeData] = useState<ScopeData | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())

  const getStepContent = () => {
    console.log('Current activeStep:', activeStep)
    switch (activeStep) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveStep} />
      case 'scope':
        return <ScopeDefinition onScopeComplete={setScopeData} />
      case 'policy':
        return <InformationSecurityPolicy scopeData={scopeData} />
      case 'risk-assessment':
        return <RiskAssessment scopeData={scopeData} />
      case 'risk-treatment':
        return <RiskTreatment scopeData={scopeData} />
      case 'soa':
        return <StatementOfApplicability scopeData={scopeData} />
      case 'treatment-plan':
        return <RiskTreatmentPlan scopeData={scopeData} />
      case 'objectives':
        return <InformationSecurityObjectives scopeData={scopeData} />
      case 'implementation':
        return <Implementation scopeData={scopeData} />
      case 'internal-audit':
        return <InternalAuditProcedure scopeData={scopeData} />
      case 'acceptable-use-policy':
        return <AcceptableUsePolicy scopeData={scopeData} />
      case 'incident-response-procedure':
        return <IncidentResponseProcedure scopeData={scopeData} />
      case 'legal-regulatory-requirements':
        return <LegalRegulatoryRequirements scopeData={scopeData} />
      case 'security-operating-procedures':
        return <SecurityOperatingProcedures scopeData={scopeData} />
      case 'secure-development-policy':
        return <SecureDevelopmentPolicy scopeData={scopeData} />
      case 'training':
        return <TrainingAwareness scopeData={scopeData} />
      case 'management-review':
        return <ManagementReview scopeData={scopeData} />
      case 'corrective-actions':
        return <CorrectiveActions scopeData={scopeData} />
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
              const isExpanded = expandedMenus.has(step.id)
              const hasSubItems = step.subItems && step.subItems.length > 0

              return (
                <div key={step.id}>
                  <div
                    onClick={() => {
                      if (hasSubItems) {
                        const newExpanded = new Set(expandedMenus)
                        if (isExpanded) {
                          newExpanded.delete(step.id)
                        } else {
                          newExpanded.add(step.id)
                        }
                        setExpandedMenus(newExpanded)
                      } else {
                        console.log('Navigation clicked:', step.id, 'Current:', activeStep)
                        setActiveStep(step.id)
                      }
                    }}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      isActive && !hasSubItems
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      isActive && !hasSubItems ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isActive && !hasSubItems ? 'text-blue-900' : 'text-gray-900'}`}>
                        {step.title}
                      </p>
                      <p className={`text-xs ${isActive && !hasSubItems ? 'text-blue-600' : 'text-gray-500'}`}>
                        {hasSubItems ? `${step.subItems.length} procedures` : `Step ${index + 1} of ${steps.length}`}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {hasSubItems ? (
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      ) : (
                        <>
                          {step.status === 'completed' && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                          {step.status === 'in-progress' && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                          {step.status === 'not-started' && (
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Submenu items */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {step.subItems!.map((subItem, subIndex) => {
                        const SubIcon = subItem.icon
                        const isSubActive = activeStep === subItem.id

                        return (
                          <div
                            key={subItem.id}
                            onClick={() => {
                              console.log('Sub-navigation clicked:', subItem.id, 'Current:', activeStep)
                              setActiveStep(subItem.id)
                            }}
                            className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mr-3 ${
                              isSubActive ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <SubIcon className="w-3 h-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${isSubActive ? 'text-blue-900 font-medium' : 'text-gray-800'}`}>
                                {subItem.title}
                              </p>
                              <p className={`text-xs ${isSubActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                {subItem.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              {subItem.status === 'completed' && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                              {subItem.status === 'in-progress' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                              {subItem.status === 'not-started' && (
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1" style={{ height: '100vh', overflow: 'auto', backgroundColor: '#f3f4f6' }}>
        <div style={{ padding: '32px', minHeight: '100%' }}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{ maxWidth: '896px', margin: '0 auto' }}>
            {getStepContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
