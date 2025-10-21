import React, { useState } from 'react'
import { Download, FileText, CheckCircle, Target, Search, ClipboardList, FileBarChart, RefreshCw } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

interface AuditProcedureData {
  organizationName: string
  documentId: string
  version: string
  owner: string
  approver: string
  auditPlan: {
    scope: string[]
    objectives: string[]
    methodology: string
    schedule: string
    resources: string[]
  }
  preparation: {
    requiredDocuments: string[]
    checklistItems: string[]
  }
  execution: {
    openingMeetingAgenda: string[]
    evidenceCollection: string[]
  }
  reporting: {
    findingTypes: string[]
    reportSections: string[]
  }
  followUp: {
    correctiveActionProcess: string[]
    trackingMethods: string[]
  }
  auditFrequency: {
    highRisk: string
    mediumRisk: string
    lowRisk: string
    newProcesses: string
  }
  leadAuditorRequirements: string[]
  auditorRequirements: string[]
  independenceRequirements: string[]
  reportingTimeline: {
    notification: string
    finalReport: string
    correctiveActions: string
  }
  kpis: {
    programCompletion: string
    correctionTime: string
    repeatNonConformities: string
    competenceMaintenance: string
  }
}

interface ScopeData {
  organizationName: string
}

interface InternalAuditProcedureProps {
  scopeData?: ScopeData | null
}

const InternalAuditProcedure: React.FC<InternalAuditProcedureProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [procedureData, setProcedureData] = useState<AuditProcedureData>({
    organizationName: scopeData?.organizationName || 'TechCorp Industries Ltd.',
    documentId: 'ISMS-PROC-001',
    version: '1.0',
    owner: 'Sarah Johnson - ISMS Manager',
    approver: 'Michael Chen - Chief Information Security Officer',
    auditPlan: {
      scope: [
        'Information Security Policy compliance',
        'Risk management processes',
        'Access control implementation',
        'Incident management procedures',
        'Physical and environmental security'
      ],
      objectives: [
        'Verify ISMS effectiveness',
        'Assess compliance with ISO 27001:2022',
        'Evaluate risk treatment implementation',
        'Check control effectiveness',
        'Identify improvement opportunities'
      ],
      methodology: 'Risk-based approach',
      schedule: 'Annual program',
      resources: [
        'Lead auditor',
        'Internal auditors',
        'Technical specialists',
        'Documentation access',
        'System access credentials'
      ]
    },
    preparation: {
      requiredDocuments: [
        'Information Security Policy',
        'Risk Assessment Report',
        'Statement of Applicability (SoA)',
        'Risk Treatment Plan',
        'ISMS procedures and processes',
        'Previous audit reports',
        'Training records'
      ],
      checklistItems: [
        'Policy compliance verification',
        'Control implementation status',
        'Risk treatment effectiveness',
        'Documentation completeness',
        'Training completion verification',
        'Incident handling procedures'
      ]
    },
    execution: {
      openingMeetingAgenda: [
        'Introduce audit team and participants',
        'Confirm audit scope and objectives',
        'Review audit plan and schedule',
        'Explain audit methodology',
        'Discuss communication protocols'
      ],
      evidenceCollection: [
        'Document and record review',
        'Personnel interviews',
        'Process observation',
        'System configuration checks',
        'Control testing'
      ]
    },
    reporting: {
      findingTypes: [
        'Major non-conformity',
        'Minor non-conformity',
        'Observation',
        'Good practice',
        'Improvement opportunity'
      ],
      reportSections: [
        'Executive summary',
        'Audit scope and objectives',
        'Audit methodology',
        'Key findings summary',
        'Detailed findings',
        'Recommendations'
      ]
    },
    followUp: {
      correctiveActionProcess: [
        'Root cause analysis',
        'Corrective action planning',
        'Implementation timeline',
        'Responsible person assignment',
        'Verification method definition'
      ],
      trackingMethods: [
        'Regular status meetings',
        'Progress reports',
        'Milestone reviews',
        'Re-audit verification',
        'Management review'
      ]
    },
    auditFrequency: {
      highRisk: '6 months',
      mediumRisk: '12 months',
      lowRisk: '18 months',
      newProcesses: '3 months'
    },
    leadAuditorRequirements: [
      'ISO 27001 Lead Auditor certification',
      '5+ years information security experience',
      'Knowledge of ISO 27001:2022 requirements',
      'Previous internal audit experience'
    ],
    auditorRequirements: [
      'ISO 27001 Internal Auditor training',
      '2+ years information security experience',
      'Understanding of ISMS processes',
      'Communication skills'
    ],
    independenceRequirements: [
      'Must not audit their own work',
      'No direct reporting relationship with auditee',
      'Minimum 12-month separation from audited area',
      'Declaration of independence signed'
    ],
    reportingTimeline: {
      notification: '2 weeks',
      finalReport: '5 working days',
      correctiveActions: '10 working days'
    },
    kpis: {
      programCompletion: '100%',
      correctionTime: '≤30 days',
      repeatNonConformities: '≤5%',
      competenceMaintenance: '100%'
    }
  })

  const predefinedAuditScopes = [
    'Information Security Policy compliance',
    'Risk management processes',
    'Access control implementation',
    'Incident management procedures',
    'Business continuity planning',
    'Supplier relationship security',
    'Physical and environmental security',
    'Operations security',
    'Communications security',
    'System acquisition and development',
    'Compliance monitoring'
  ]

  const predefinedAuditObjectives = [
    'Verify ISMS effectiveness',
    'Assess compliance with ISO 27001:2022',
    'Evaluate risk treatment implementation',
    'Check control effectiveness',
    'Identify improvement opportunities',
    'Validate documentation accuracy',
    'Assess training effectiveness',
    'Review incident response capability'
  ]

  const predefinedResources = [
    'Lead auditor',
    'Internal auditors',
    'Technical specialists',
    'Process owners',
    'Documentation access',
    'System access credentials',
    'Interview facilities',
    'Audit tools and checklists'
  ]

  const predefinedDocuments = [
    'Information Security Policy',
    'Risk Assessment Report',
    'Statement of Applicability (SoA)',
    'Risk Treatment Plan',
    'ISMS procedures and processes',
    'Previous audit reports',
    'Corrective action records',
    'Training records',
    'Incident reports',
    'Management review minutes'
  ]

  const predefinedChecklistItems = [
    'Policy compliance verification',
    'Control implementation status',
    'Risk treatment effectiveness',
    'Documentation completeness',
    'Training completion verification',
    'Incident handling procedures',
    'Management review execution',
    'Corrective action implementation',
    'Continuous improvement evidence',
    'Legal and regulatory compliance'
  ]

  const predefinedOpeningAgenda = [
    'Introduce audit team and participants',
    'Confirm audit scope and objectives',
    'Review audit plan and schedule',
    'Explain audit methodology',
    'Discuss communication protocols',
    'Address questions and concerns',
    'Confirm resource availability'
  ]

  const predefinedEvidenceCollection = [
    'Document and record review',
    'Personnel interviews',
    'Process observation',
    'System configuration checks',
    'Control testing',
    'Sample verification',
    'Physical inspection',
    'Log file analysis'
  ]

  const predefinedFindingTypes = [
    'Major non-conformity',
    'Minor non-conformity',
    'Observation',
    'Good practice',
    'Improvement opportunity'
  ]

  const predefinedReportSections = [
    'Executive summary',
    'Audit scope and objectives',
    'Audit methodology',
    'Key findings summary',
    'Detailed findings',
    'Recommendations',
    'Conclusion'
  ]

  const predefinedCorrectiveActions = [
    'Root cause analysis',
    'Corrective action planning',
    'Implementation timeline',
    'Responsible person assignment',
    'Verification method definition',
    'Effectiveness monitoring',
    'Closure verification'
  ]

  const predefinedTrackingMethods = [
    'Regular status meetings',
    'Progress reports',
    'Milestone reviews',
    'Re-audit verification',
    'Document updates',
    'Management review',
    'Dashboard monitoring'
  ]

  const predefinedLeadAuditorRequirements = [
    'ISO 27001 Lead Auditor certification',
    '5+ years information security experience',
    'Knowledge of ISO 27001:2022 requirements',
    'Previous internal audit experience',
    'Understanding of audit methodologies',
    'Risk assessment expertise'
  ]

  const predefinedAuditorRequirements = [
    'ISO 27001 Internal Auditor training',
    '2+ years information security experience',
    'Understanding of ISMS processes',
    'Basic audit knowledge',
    'Communication skills',
    'Attention to detail'
  ]

  const predefinedIndependenceRequirements = [
    'Must not audit their own work',
    'No direct reporting relationship with auditee',
    'Minimum 12-month separation from audited area',
    'Declaration of independence signed',
    'No financial interest in audit outcomes',
    'Professional objectivity maintained'
  ]

  const steps = [
    { id: 1, title: 'Plan the Audit', icon: Target },
    { id: 2, title: 'Prepare for Audit', icon: Search },
    { id: 3, title: 'Conduct the Audit', icon: ClipboardList },
    { id: 4, title: 'Report Findings', icon: FileBarChart },
    { id: 5, title: 'Follow Up & Improve', icon: RefreshCw },
    { id: 6, title: 'Configuration & Export', icon: CheckCircle }
  ]

  const handleArrayToggle = (
    section: keyof AuditProcedureData,
    subsection: string,
    item: string
  ) => {
    setProcedureData(prev => {
      const currentSection = prev[section] as any
      const currentArray = currentSection[subsection] || []

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [subsection]: currentArray.includes(item)
            ? currentArray.filter((i: string) => i !== item)
            : [...currentArray, item]
        }
      }
    })
  }

  const handleRequirementToggle = (
    section: 'leadAuditorRequirements' | 'auditorRequirements' | 'independenceRequirements',
    requirement: string
  ) => {
    setProcedureData(prev => ({
      ...prev,
      [section]: prev[section].includes(requirement)
        ? prev[section].filter(req => req !== requirement)
        : [...prev[section], requirement]
    }))
  }

  const generateMarkdown = () => {
    return `# Internal Audit Procedure
**Document ID:** ${procedureData.documentId}
**Version:** ${procedureData.version}
**Effective Date:** ${new Date().toLocaleDateString()}
**Owner:** ${procedureData.owner}
**Approved by:** ${procedureData.approver}

---

## 1. PURPOSE

This procedure establishes the requirements for planning, conducting, reporting, and following up on internal audits of the Information Security Management System (ISMS) for ${procedureData.organizationName} to ensure compliance with ISO 27001:2022 requirements and organizational policies.

## 2. SCOPE

This procedure applies to all internal audits of the ISMS, covering all processes, controls, and organizational units within the defined ISMS scope of ${procedureData.organizationName}.

## 3. DETAILED AUDIT PROCESS

### 3.1 STEP 1: PLAN THE AUDIT

**Audit Scope Areas:**
${procedureData.auditPlan.scope.map(item => `- ${item}`).join('\n')}

**Audit Objectives:**
${procedureData.auditPlan.objectives.map(item => `- ${item}`).join('\n')}

**Methodology:** ${procedureData.auditPlan.methodology}
**Schedule:** ${procedureData.auditPlan.schedule}

**Resources Required:**
${procedureData.auditPlan.resources.map(item => `- ${item}`).join('\n')}

### 3.2 STEP 2: PREPARE FOR THE AUDIT

**Required Documents:**
${procedureData.preparation.requiredDocuments.map(item => `- ${item}`).join('\n')}

**Audit Checklist Items:**
${procedureData.preparation.checklistItems.map(item => `- ${item}`).join('\n')}

### 3.3 STEP 3: CONDUCT THE AUDIT

**Opening Meeting Agenda:**
${procedureData.execution.openingMeetingAgenda.map(item => `- ${item}`).join('\n')}

**Evidence Collection Methods:**
${procedureData.execution.evidenceCollection.map(item => `- ${item}`).join('\n')}

### 3.4 STEP 4: REPORT AUDIT FINDINGS

**Finding Types:**
${procedureData.reporting.findingTypes.map(item => `- ${item}`).join('\n')}

**Report Sections:**
${procedureData.reporting.reportSections.map(item => `- ${item}`).join('\n')}

### 3.5 STEP 5: FOLLOW UP ON CORRECTIVE ACTIONS

**Corrective Action Process:**
${procedureData.followUp.correctiveActionProcess.map(item => `- ${item}`).join('\n')}

**Tracking Methods:**
${procedureData.followUp.trackingMethods.map(item => `- ${item}`).join('\n')}

## 4. AUDIT FREQUENCY

- **High-risk areas:** Every ${procedureData.auditFrequency.highRisk}
- **Medium-risk areas:** Every ${procedureData.auditFrequency.mediumRisk}
- **Low-risk areas:** Every ${procedureData.auditFrequency.lowRisk}
- **New processes/controls:** Within ${procedureData.auditFrequency.newProcesses} of implementation

## 5. AUDITOR REQUIREMENTS

### 5.1 Lead Auditor Requirements
${procedureData.leadAuditorRequirements.map(req => `- ${req}`).join('\n')}

### 5.2 Internal Auditor Requirements
${procedureData.auditorRequirements.map(req => `- ${req}`).join('\n')}

### 5.3 Independence Requirements
${procedureData.independenceRequirements.map(req => `- ${req}`).join('\n')}

## 6. REPORTING TIMELINE

- **Audit Notification:** ${procedureData.reportingTimeline.notification} before audit
- **Final Report:** Within ${procedureData.reportingTimeline.finalReport} of audit completion
- **Corrective Actions:** Submit plans within ${procedureData.reportingTimeline.correctiveActions}

## 7. KEY PERFORMANCE INDICATORS

- **Audit Program Completion:** ${procedureData.kpis.programCompletion}
- **Average Corrective Action Closure:** ${procedureData.kpis.correctionTime}
- **Repeat Non-conformities Rate:** ${procedureData.kpis.repeatNonConformities}
- **Auditor Competence Maintenance:** ${procedureData.kpis.competenceMaintenance}

---

**Document Control:**
- Created: ${new Date().toLocaleDateString()}
- Organization: ${procedureData.organizationName}
- Version: ${procedureData.version}
`
  }

  const exportToMarkdown = () => {
    const markdown = generateMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Internal_Audit_Procedure_${procedureData.organizationName.replace(/\s+/g, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToDocx = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Internal Audit Procedure",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Document ID: ", bold: true }),
              new TextRun(procedureData.documentId),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Version: ", bold: true }),
              new TextRun(procedureData.version),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Organization: ", bold: true }),
              new TextRun(procedureData.organizationName),
            ],
          }),
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Internal_Audit_Procedure_${procedureData.organizationName.replace(/\s+/g, '_')}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Plan the Audit</h3>
              <p className="text-gray-600 mb-6">Define scope, objectives, and develop an audit plan with methodology, resources, and responsibilities.</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Audit Scope</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedAuditScopes.map((scope, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.auditPlan.scope.includes(scope)}
                          onChange={() => handleArrayToggle('auditPlan', 'scope', scope)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Audit Objectives</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedAuditObjectives.map((objective, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.auditPlan.objectives.includes(objective)}
                          onChange={() => handleArrayToggle('auditPlan', 'objectives', objective)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{objective}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Methodology
                    </label>
                    <select
                      value={procedureData.auditPlan.methodology}
                      onChange={(e) => setProcedureData(prev => ({
                        ...prev,
                        auditPlan: { ...prev.auditPlan, methodology: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Risk-based approach">Risk-based approach</option>
                      <option value="Process-based approach">Process-based approach</option>
                      <option value="Systems-based approach">Systems-based approach</option>
                      <option value="Compliance-based approach">Compliance-based approach</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Type
                    </label>
                    <select
                      value={procedureData.auditPlan.schedule}
                      onChange={(e) => setProcedureData(prev => ({
                        ...prev,
                        auditPlan: { ...prev.auditPlan, schedule: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Annual program">Annual program</option>
                      <option value="Quarterly program">Quarterly program</option>
                      <option value="Rolling program">Rolling program</option>
                      <option value="Event-driven">Event-driven</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Resources Required</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedResources.map((resource, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.auditPlan.resources.includes(resource)}
                          onChange={() => handleArrayToggle('auditPlan', 'resources', resource)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{resource}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Prepare for the Audit</h3>
              <p className="text-gray-600 mb-6">Gather documentation, create audit checklists, and ensure auditor competence.</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Required ISMS Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedDocuments.map((doc, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.preparation.requiredDocuments.includes(doc)}
                          onChange={() => handleArrayToggle('preparation', 'requiredDocuments', doc)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Audit Checklist Items</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {predefinedChecklistItems.map((item, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.preparation.checklistItems.includes(item)}
                          onChange={() => handleArrayToggle('preparation', 'checklistItems', item)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Conduct the Audit</h3>
              <p className="text-gray-600 mb-6">Perform opening meeting, collect evidence, and assess compliance against ISO 27001:2022 requirements.</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Opening Meeting Agenda</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {predefinedOpeningAgenda.map((item, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.execution.openingMeetingAgenda.includes(item)}
                          onChange={() => handleArrayToggle('execution', 'openingMeetingAgenda', item)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Evidence Collection Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedEvidenceCollection.map((method, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.execution.evidenceCollection.includes(method)}
                          onChange={() => handleArrayToggle('execution', 'evidenceCollection', method)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 4: Report Audit Findings</h3>
              <p className="text-gray-600 mb-6">Document findings, present results to management, and provide corrective action recommendations.</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Finding Types</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedFindingTypes.map((type, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.reporting.findingTypes.includes(type)}
                          onChange={() => handleArrayToggle('reporting', 'findingTypes', type)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Audit Report Sections</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedReportSections.map((section, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.reporting.reportSections.includes(section)}
                          onChange={() => handleArrayToggle('reporting', 'reportSections', section)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 5: Follow Up & Improve</h3>
              <p className="text-gray-600 mb-6">Implement corrective actions, track progress, and review process effectiveness for continuous improvement.</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Corrective Action Process</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {predefinedCorrectiveActions.map((action, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.followUp.correctiveActionProcess.includes(action)}
                          onChange={() => handleArrayToggle('followUp', 'correctiveActionProcess', action)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Tracking and Verification Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedTrackingMethods.map((method, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={procedureData.followUp.trackingMethods.includes(method)}
                          onChange={() => handleArrayToggle('followUp', 'trackingMethods', method)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 6: Configuration & Export</h3>
              <p className="text-gray-600 mb-6">Configure audit frequency, auditor requirements, and export your comprehensive procedure.</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Document Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={procedureData.organizationName}
                        onChange={(e) => setProcedureData(prev => ({ ...prev, organizationName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document ID
                      </label>
                      <input
                        type="text"
                        value={procedureData.documentId}
                        onChange={(e) => setProcedureData(prev => ({ ...prev, documentId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., ISMS-PROC-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Version
                      </label>
                      <input
                        type="text"
                        value={procedureData.version}
                        onChange={(e) => setProcedureData(prev => ({ ...prev, version: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Owner
                      </label>
                      <input
                        type="text"
                        value={procedureData.owner}
                        onChange={(e) => setProcedureData(prev => ({ ...prev, owner: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., ISMS Manager"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approved By
                      </label>
                      <input
                        type="text"
                        value={procedureData.approver}
                        onChange={(e) => setProcedureData(prev => ({ ...prev, approver: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Management Representative"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Export Options</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h5 className="text-sm font-medium text-gray-800 mb-3">Document Summary</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Organization:</span>
                          <span className="ml-2 text-gray-600">{procedureData.organizationName}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Document ID:</span>
                          <span className="ml-2 text-gray-600">{procedureData.documentId}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Version:</span>
                          <span className="ml-2 text-gray-600">{procedureData.version}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Owner:</span>
                          <span className="ml-2 text-gray-600">{procedureData.owner}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Audit Scope Items:</span>
                          <span className="ml-2 text-gray-600">{procedureData.auditPlan.scope.length} selected</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Audit Objectives:</span>
                          <span className="ml-2 text-gray-600">{procedureData.auditPlan.objectives.length} selected</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={exportToMarkdown}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export as Markdown
                      </button>
                      <button
                        onClick={exportToDocx}
                        className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Export as DOCX
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Internal Audit Procedure</h1>
        <p className="text-gray-600">Create a comprehensive internal audit procedure for your ISMS</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentStep < steps.length ? (
          <button
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <div className="text-green-600 font-medium">
            ✅ Procedure Complete
          </div>
        )}
      </div>
    </div>
  )
}

export default InternalAuditProcedure