import React, { useState, useEffect } from 'react'
import { Download, FileText, CheckCircle, Target, Search, ClipboardList, FileBarChart, RefreshCw, Plus, X, Calendar, Users, Shield, AlertTriangle, TrendingUp, Clock, Award, BookOpen, Settings, Filter, Eye, ExternalLink, Info } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from 'docx'

// Import the Annex A controls
interface ISO27001Control {
  id: string
  title: string
  description: string
  category: string
  domain: string
  objective: string
  implementationGuidance: string
  typicalEvidence: string[]
  relatedControls: string[]
  mandatory: boolean
}

// SoA Control Applicability Interface
interface ControlApplicability {
  controlId: string
  status: 'applicable' | 'not-applicable' | 'partially-applicable'
  implementationStatus: 'not-implemented' | 'planned' | 'in-progress' | 'implemented'
  justification: string
  implementationDescription: string
  responsibleParty: string
  targetDate: string
  evidence: string[]
  notes: string
}

// Sample Annex A controls (in a real app, this would be imported from soa-controls.ts)
const sampleAnnexAControls: ISO27001Control[] = [
  {
    id: 'A.5.1',
    title: 'Policies for information security',
    description: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.',
    category: 'Organizational Controls',
    domain: 'Organizational',
    objective: 'Establish clear information security governance and policy framework',
    implementationGuidance: 'Develop comprehensive information security policies covering all aspects of information security management.',
    typicalEvidence: ['Information security policy document', 'Policy approval records', 'Communication and training records'],
    relatedControls: ['A.5.2', 'A.5.4', 'A.5.35'],
    mandatory: true
  },
  {
    id: 'A.5.2',
    title: 'Information Security Roles and Responsibilities',
    description: 'Information security roles and responsibilities shall be defined and allocated in accordance with the organization needs.',
    category: 'Organizational Controls',
    domain: 'Organizational',
    objective: 'Ensure clear accountability for information security activities',
    implementationGuidance: 'Define and document roles and responsibilities for information security throughout the organization.',
    typicalEvidence: ['Role and responsibility matrix', 'Job descriptions with security responsibilities', 'RACI matrix'],
    relatedControls: ['A.5.1', 'A.5.4', 'A.6.2'],
    mandatory: true
  },
  {
    id: 'A.8.1',
    title: 'User access management',
    description: 'A user access management process shall be implemented to assign or revoke access rights for all user types to all systems and services.',
    category: 'Technology Controls',
    domain: 'Technology',
    objective: 'Ensure proper access control management',
    implementationGuidance: 'Implement formal user access management procedures covering access provisioning, modification, and removal.',
    typicalEvidence: ['Access management procedures', 'User access logs', 'Access review records'],
    relatedControls: ['A.8.2', 'A.8.3', 'A.8.5'],
    mandatory: true
  },
  {
    id: 'A.8.2',
    title: 'Privileged access rights',
    description: 'The allocation and use of privileged access rights shall be restricted and managed.',
    category: 'Technology Controls',
    domain: 'Technology',
    objective: 'Control privileged access to prevent misuse',
    implementationGuidance: 'Implement strict controls over privileged access including approval processes and monitoring.',
    typicalEvidence: ['Privileged access procedures', 'Approval records', 'Monitoring logs'],
    relatedControls: ['A.8.1', 'A.8.3', 'A.8.12'],
    mandatory: true
  }
]

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
    riskBasedApproach: boolean
    previousAuditConsideration: boolean
  }
  preparation: {
    requiredDocuments: string[]
    checklistItems: string[]
    notificationPeriod: string
    preAuditMeeting: boolean
  }
  execution: {
    openingMeetingAgenda: string[]
    evidenceCollection: string[]
    dailyBriefings: boolean
    closingMeeting: boolean
  }
  reporting: {
    findingTypes: string[]
    reportSections: string[]
    distributionList: string[]
    reportingTimeline: string
  }
  followUp: {
    correctiveActionProcess: string[]
    trackingMethods: string[]
    verificationTimeline: string
    processImprovement: boolean
  }
  auditFrequency: {
    highRisk: string
    mediumRisk: string
    lowRisk: string
    newProcesses: string
  }
  competenceManagement: {
    leadAuditorRequirements: string[]
    auditorRequirements: string[]
    independenceRequirements: string[]
    trainingRequirements: string[]
  }
  monitoring: {
    kpis: {
      programCompletion: string
      correctionTime: string
      repeatRate: string
      competenceMaintenance: string
    }
    reviewFrequency: string
    improvementActions: string[]
  }
  recordManagement: {
    retentionPeriod: string
    accessControls: string[]
    backupProcedures: string[]
  }
  annexAControls: {
    selectedControls: string[]
    auditQuestions: { [controlId: string]: string[] }
    evidenceRequirements: { [controlId: string]: string[] }
    controlCategories: string[]
  }
}

interface InternalAuditProcedureProps {
  scopeData: any
}

const InternalAuditProcedure: React.FC<InternalAuditProcedureProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [soaData, setSoaData] = useState<ControlApplicability[]>([])
  const [isLoadingSoA, setIsLoadingSoA] = useState(true)
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
        'Physical and environmental security',
        'Business continuity planning',
        'Supplier and third-party management'
      ],
      objectives: [
        'Verify ISMS effectiveness',
        'Assess compliance with ISO 27001:2022',
        'Evaluate risk treatment implementation',
        'Check control effectiveness',
        'Identify improvement opportunities',
        'Validate documented procedures'
      ],
      methodology: 'Risk-based approach',
      schedule: 'Annual program with quarterly reviews',
      resources: [
        'Lead auditor',
        'Internal auditors',
        'Technical specialists',
        'Documentation access',
        'System access credentials',
        'Audit tools and checklists'
      ],
      riskBasedApproach: true,
      previousAuditConsideration: true
    },
    preparation: {
      requiredDocuments: [
        'Information Security Policy',
        'Risk Assessment Report',
        'Statement of Applicability (SoA)',
        'Risk Treatment Plan',
        'ISMS procedures and processes',
        'Previous audit reports',
        'Training records',
        'Incident reports',
        'Change management records'
      ],
      checklistItems: [
        'Policy compliance verification',
        'Control implementation status',
        'Risk treatment effectiveness',
        'Documentation completeness',
        'Training completion verification',
        'Incident handling procedures',
        'Change management compliance',
        'Third-party management verification'
      ],
      notificationPeriod: '2 weeks before audit',
      preAuditMeeting: true
    },
    execution: {
      openingMeetingAgenda: [
        'Introduce audit team and participants',
        'Confirm audit scope and objectives',
        'Review audit plan and schedule',
        'Explain audit methodology',
        'Discuss communication protocols',
        'Address questions and concerns',
        'Confirm resource availability and access',
        'Set expectations for the audit process'
      ],
      evidenceCollection: [
        'Document and record review',
        'Personnel interviews',
        'Process observation',
        'System configuration checks',
        'Control testing',
        'Physical security inspection',
        'Sample testing of controls'
      ],
      dailyBriefings: true,
      closingMeeting: true
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
        'Recommendations',
        'Appendices with supporting evidence',
        'Distribution list'
      ],
      distributionList: [
        'Auditee management',
        'ISMS Manager',
        'Management Representative',
        'Process owners (relevant sections)'
      ],
      reportingTimeline: 'Within 5 working days of audit completion'
    },
    followUp: {
      correctiveActionProcess: [
        'Root cause analysis',
        'Corrective action planning',
        'Implementation timeline',
        'Responsible person assignment',
        'Verification method definition',
        'Effectiveness monitoring',
        'Closure verification'
      ],
      trackingMethods: [
        'Regular status meetings',
        'Progress reports',
        'Milestone reviews',
        'Re-audit verification',
        'Management review'
      ],
      verificationTimeline: 'Within 30 days of implementation',
      processImprovement: true
    },
    auditFrequency: {
      highRisk: 'Every 6 months',
      mediumRisk: 'Every 12 months',
      lowRisk: 'Every 18 months',
      newProcesses: 'Within 3 months of implementation'
    },
    competenceManagement: {
      leadAuditorRequirements: [
        'ISO 27001 Lead Auditor certification',
        '5+ years information security experience',
        'Knowledge of ISO 27001:2022 requirements',
        'Previous internal audit experience',
        'Understanding of audit methodologies',
        'Risk assessment expertise',
        'Report writing skills'
      ],
      auditorRequirements: [
        'ISO 27001 Internal Auditor training',
        '2+ years information security experience',
        'Understanding of ISMS processes',
        'Communication skills',
        'Basic audit knowledge',
        'Attention to detail',
        'Professional integrity'
      ],
      independenceRequirements: [
        'Must not audit their own work',
        'No direct reporting relationship with auditee',
        'Minimum 12-month separation from audited area',
        'Declaration of independence signed',
        'Professional objectivity maintained',
        'No conflicts of interest'
      ],
      trainingRequirements: [
        'Annual training on audit techniques',
        'ISO 27001 standard updates training',
        'Peer review of audit performance',
        'Continuous professional development'
      ]
    },
    monitoring: {
      kpis: {
        programCompletion: 'Target 100%',
        correctionTime: 'Target ≤30 days',
        repeatRate: 'Target ≤5%',
        competenceMaintenance: 'Target 100%'
      },
      reviewFrequency: 'Quarterly program review, Annual effectiveness assessment',
      improvementActions: [
        'Analyze audit trends and patterns',
        'Review audit methodology effectiveness',
        'Implement improvements to audit process',
        'Update procedures based on lessons learned'
      ]
    },
    recordManagement: {
      retentionPeriod: 'Minimum 3 years',
      accessControls: [
        'Role-based access to audit records',
        'Confidentiality agreements for auditors',
        'Secure storage with appropriate access controls'
      ],
      backupProcedures: [
        'Regular backup of electronic records',
        'Offsite storage of critical audit documentation',
        'Disaster recovery procedures for audit records'
      ]
    },
    annexAControls: {
      selectedControls: [], // Will be populated from SoA data
      auditQuestions: {
        'A.5.1': [
          'Is there a documented information security policy?',
          'Has the policy been approved by management?',
          'Is the policy communicated to all relevant personnel?',
          'Is the policy reviewed at planned intervals?'
        ],
        'A.5.2': [
          'Are information security roles and responsibilities defined?',
          'Are security responsibilities documented in job descriptions?',
          'Is there a clear accountability structure for security?'
        ],
        'A.8.1': [
          'Is there a formal user access management process?',
          'Are access rights granted based on business requirements?',
          'Is access regularly reviewed and updated?'
        ],
        'A.8.2': [
          'Are privileged access rights restricted and managed?',
          'Is there approval process for privileged access?',
          'Are privileged activities monitored and logged?'
        ]
      },
      evidenceRequirements: {
        'A.5.1': [
          'Information security policy document',
          'Management approval records',
          'Communication and acknowledgment records'
        ],
        'A.5.2': [
          'Role and responsibility matrix',
          'Job descriptions with security responsibilities',
          'Organizational charts'
        ],
        'A.8.1': [
          'User access management procedures',
          'Access request and approval forms',
          'Access review reports'
        ],
        'A.8.2': [
          'Privileged access procedures',
          'Privileged access logs',
          'Approval records for privileged access'
        ]
      },
      controlCategories: ['Organizational Controls', 'People Controls', 'Physical Controls', 'Technology Controls']
    }
  })

  // Load and sync with SoA data
  useEffect(() => {
    const loadSoAData = () => {
      try {
        const savedSOA = localStorage.getItem('statementOfApplicability')
        if (savedSOA) {
          const soaControls: ControlApplicability[] = JSON.parse(savedSOA)
          setSoaData(soaControls)

          // Get applicable controls from SoA
          const applicableControls = soaControls
            .filter(ca => ca.status === 'applicable' || ca.status === 'partially-applicable')
            .map(ca => ca.controlId)

          // Update procedure data with SoA applicable controls
          setProcedureData(prev => ({
            ...prev,
            annexAControls: {
              ...prev.annexAControls,
              selectedControls: applicableControls,
              // Initialize audit questions for applicable controls
              auditQuestions: applicableControls.reduce((acc, controlId) => {
                const control = sampleAnnexAControls.find(c => c.id === controlId)
                if (control) {
                  acc[controlId] = [
                    `Is ${control.title.toLowerCase()} properly implemented?`,
                    `Are there documented procedures for ${control.title.toLowerCase()}?`,
                    `Is the implementation effective and regularly reviewed?`,
                    `Are all requirements of this control being met?`
                  ]
                }
                return acc
              }, {} as { [controlId: string]: string[] }),
              // Initialize evidence requirements from SoA
              evidenceRequirements: applicableControls.reduce((acc, controlId) => {
                const soaControl = soaControls.find(ca => ca.controlId === controlId)
                const control = sampleAnnexAControls.find(c => c.id === controlId)
                if (soaControl && control) {
                  acc[controlId] = [
                    ...control.typicalEvidence,
                    ...(soaControl.evidence || []),
                    'Implementation documentation',
                    'Operational records'
                  ]
                }
                return acc
              }, {} as { [controlId: string]: string[] })
            }
          }))
        }
      } catch (error) {
        console.error('Error loading SoA data:', error)
      } finally {
        setIsLoadingSoA(false)
      }
    }

    loadSoAData()
  }, [])

  const syncWithSoA = () => {
    setIsLoadingSoA(true)
    setTimeout(() => {
      const savedSOA = localStorage.getItem('statementOfApplicability')
      if (savedSOA) {
        const soaControls: ControlApplicability[] = JSON.parse(savedSOA)
        setSoaData(soaControls)

        const applicableControls = soaControls
          .filter(ca => ca.status === 'applicable' || ca.status === 'partially-applicable')
          .map(ca => ca.controlId)

        setProcedureData(prev => ({
          ...prev,
          annexAControls: {
            ...prev.annexAControls,
            selectedControls: applicableControls
          }
        }))
      }
      setIsLoadingSoA(false)
    }, 500)
  }

  const steps = [
    {
      id: 'overview',
      title: 'Procedure Overview',
      description: 'Define the purpose, scope, and document information',
      icon: FileText
    },
    {
      id: 'planning',
      title: 'Audit Planning',
      description: 'Plan audit scope, objectives, methodology, and resources',
      icon: Target
    },
    {
      id: 'preparation',
      title: 'Audit Preparation',
      description: 'Gather documents, create checklists, and prepare audit team',
      icon: Search
    },
    {
      id: 'execution',
      title: 'Audit Execution',
      description: 'Conduct opening meeting, collect evidence, and assess compliance',
      icon: ClipboardList
    },
    {
      id: 'reporting',
      title: 'Audit Reporting',
      description: 'Document findings, classify non-conformities, and distribute reports',
      icon: FileBarChart
    },
    {
      id: 'followup',
      title: 'Follow-up & Monitoring',
      description: 'Track corrective actions, verify effectiveness, and continuous improvement',
      icon: RefreshCw
    },
    {
      id: 'competence',
      title: 'Competence Management',
      description: 'Define auditor requirements, independence, and training needs',
      icon: Award
    },
    {
      id: 'annexa',
      title: 'Annex A Controls',
      description: 'Select and configure ISO 27001 Annex A controls for audit',
      icon: Shield
    },
    {
      id: 'monitoring',
      title: 'Program Monitoring',
      description: 'Set KPIs, review effectiveness, and implement improvements',
      icon: TrendingUp
    }
  ]

  const handleInputChange = (section: string, field: string, value: any) => {
    setProcedureData(prev => {
      const currentSection = prev[section as keyof AuditProcedureData] as any
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      }
    })
  }

  const handleArrayChange = (section: string, field: string, index: number, value: string) => {
    setProcedureData(prev => {
      const currentSection = prev[section as keyof AuditProcedureData] as any
      const currentArray = [...(currentSection[field] || [])]
      currentArray[index] = value

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: currentArray
        }
      }
    })
  }

  const addArrayItem = (section: string, field: string) => {
    setProcedureData(prev => {
      const currentSection = prev[section as keyof AuditProcedureData] as any
      const currentArray = [...(currentSection[field] || [])]
      currentArray.push('')

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: currentArray
        }
      }
    })
  }

  const toggleControlSelection = (controlId: string) => {
    setProcedureData(prev => {
      const selectedControls = [...prev.annexAControls.selectedControls]
      const index = selectedControls.indexOf(controlId)

      if (index > -1) {
        selectedControls.splice(index, 1)
      } else {
        selectedControls.push(controlId)
      }

      return {
        ...prev,
        annexAControls: {
          ...prev.annexAControls,
          selectedControls
        }
      }
    })
  }

  const addAuditQuestion = (controlId: string) => {
    setProcedureData(prev => {
      const questions = [...(prev.annexAControls.auditQuestions[controlId] || [])]
      questions.push('')

      return {
        ...prev,
        annexAControls: {
          ...prev.annexAControls,
          auditQuestions: {
            ...prev.annexAControls.auditQuestions,
            [controlId]: questions
          }
        }
      }
    })
  }

  const updateAuditQuestion = (controlId: string, index: number, value: string) => {
    setProcedureData(prev => {
      const questions = [...(prev.annexAControls.auditQuestions[controlId] || [])]
      questions[index] = value

      return {
        ...prev,
        annexAControls: {
          ...prev.annexAControls,
          auditQuestions: {
            ...prev.annexAControls.auditQuestions,
            [controlId]: questions
          }
        }
      }
    })
  }

  const removeAuditQuestion = (controlId: string, index: number) => {
    setProcedureData(prev => {
      const questions = [...(prev.annexAControls.auditQuestions[controlId] || [])]
      questions.splice(index, 1)

      return {
        ...prev,
        annexAControls: {
          ...prev.annexAControls,
          auditQuestions: {
            ...prev.annexAControls.auditQuestions,
            [controlId]: questions
          }
        }
      }
    })
  }

  const removeArrayItem = (section: string, field: string, index: number) => {
    setProcedureData(prev => {
      const currentSection = prev[section as keyof AuditProcedureData] as any
      const currentArray = [...(currentSection[field] || [])]
      currentArray.splice(index, 1)

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: currentArray
        }
      }
    })
  }

  const generateDocument = async () => {
    const createListParagraphs = (items: string[], level = 0) => {
      return items.map(item => new Paragraph({
        text: `${level === 0 ? '•' : '-'} ${item}`,
        indent: { left: (level + 1) * 400 }
      }))
    }

    const createTable = (headers: string[], rows: string[][], options = {}) => {
      return new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
          insideVertical: { style: BorderStyle.SINGLE, size: 1 },
        },
        rows: [
          new TableRow({
            children: headers.map(header => new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: header, bold: true, color: "FFFFFF" })],
                alignment: AlignmentType.CENTER
              })],
              shading: {
                type: ShadingType.SOLID,
                color: "2563EB"
              },
              width: {
                size: 100 / headers.length,
                type: WidthType.PERCENTAGE,
              },
            }))
          }),
          ...rows.map(row => new TableRow({
            children: row.map((cell, index) => new TableCell({
              children: [new Paragraph({
                text: cell,
                alignment: index === 0 ? AlignmentType.LEFT : AlignmentType.LEFT
              })],
              width: {
                size: 100 / headers.length,
                type: WidthType.PERCENTAGE,
              },
              shading: {
                type: ShadingType.SOLID,
                color: "F8FAFC"
              }
            }))
          }))
        ]
      })
    }

    const createInfoTable = (data: { [key: string]: string }) => {
      return new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
          insideVertical: { style: BorderStyle.SINGLE, size: 1 },
        },
        rows: Object.entries(data).map(([key, value]) => new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: key, bold: true })]
              })],
              width: {
                size: 30,
                type: WidthType.PERCENTAGE,
              },
              shading: {
                type: ShadingType.SOLID,
                color: "F1F5F9"
              }
            }),
            new TableCell({
              children: [new Paragraph({ text: value })],
              width: {
                size: 70,
                type: WidthType.PERCENTAGE,
              }
            })
          ]
        }))
      })
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Title Page
          new Paragraph({
            text: "INTERNAL AUDIT PROCEDURE",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "ISO 27001:2022 Information Security Management System", size: 24, color: "4B5563" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 }
          }),

          // Document Information Table
          createInfoTable({
            "Document ID": procedureData.documentId,
            "Version": procedureData.version,
            "Effective Date": new Date().toLocaleDateString(),
            "Review Date": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            "Document Owner": procedureData.owner,
            "Approved By": procedureData.approver,
            "Organization": procedureData.organizationName
          }),

          new Paragraph({ text: "", spacing: { after: 600 } }),

          // Table of Contents placeholder
          new Paragraph({
            text: "TABLE OF CONTENTS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({ text: "1. PURPOSE ................................................................ 3" }),
          new Paragraph({ text: "2. SCOPE .................................................................. 3" }),
          new Paragraph({ text: "3. AUDIT PLANNING .................................................... 4" }),
          new Paragraph({ text: "4. AUDIT PREPARATION ................................................ 5" }),
          new Paragraph({ text: "5. AUDIT EXECUTION .................................................. 6" }),
          new Paragraph({ text: "6. AUDIT REPORTING .................................................. 7" }),
          new Paragraph({ text: "7. FOLLOW-UP ACTIONS ................................................ 8" }),
          new Paragraph({ text: "8. AUDIT FREQUENCY .................................................. 9" }),
          new Paragraph({ text: "9. COMPETENCE MANAGEMENT ........................................... 10" }),
          new Paragraph({ text: "10. ANNEX A CONTROLS AUDIT .......................................... 11" }),
          new Paragraph({ text: "11. MONITORING AND MEASUREMENT ...................................... 12" }),

          new Paragraph({ text: "", pageBreakBefore: true }),

          // 1. PURPOSE
          new Paragraph({
            text: "1. PURPOSE",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: `This procedure establishes the requirements for planning, conducting, reporting, and following up on internal audits of the Information Security Management System (ISMS) for ${procedureData.organizationName} to ensure compliance with ISO 27001:2022 requirements and organizational policies.`
          }),
          new Paragraph({
            text: "The purpose is to provide a systematic, independent, and documented process for obtaining audit evidence and evaluating it objectively to determine the extent to which ISMS audit criteria are fulfilled."
          }),
          new Paragraph({ text: "" }),

          // 2. SCOPE
          new Paragraph({
            text: "2. SCOPE",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: `This procedure applies to all internal audits of the ISMS, covering all processes, controls, and organizational units within the defined ISMS scope of ${procedureData.organizationName}.`
          }),
          new Paragraph({ text: "This includes audits of:" }),
          ...createListParagraphs(procedureData.auditPlan.scope),
          new Paragraph({ text: "" }),

          // 3. AUDIT PLANNING
          new Paragraph({
            text: "3. AUDIT PLANNING",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: "3.1 Audit Scope and Objectives",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: "Audit Objectives:" }),
          ...createListParagraphs(procedureData.auditPlan.objectives),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Methodology: ", bold: true }),
              new TextRun({ text: procedureData.auditPlan.methodology })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Schedule: ", bold: true }),
              new TextRun({ text: procedureData.auditPlan.schedule })
            ]
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Required Resources:" }),
          ...createListParagraphs(procedureData.auditPlan.resources),
          new Paragraph({ text: "" }),

          // 4. AUDIT PREPARATION
          new Paragraph({
            text: "4. AUDIT PREPARATION",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: "4.1 Required Documentation",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createListParagraphs(procedureData.preparation.requiredDocuments),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "4.2 Audit Checklist Items",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createListParagraphs(procedureData.preparation.checklistItems),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Notification Period: ", bold: true }),
              new TextRun({ text: procedureData.preparation.notificationPeriod })
            ]
          }),
          new Paragraph({ text: "" }),

          // 5. AUDIT EXECUTION
          new Paragraph({
            text: "5. AUDIT EXECUTION",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: "5.1 Opening Meeting Agenda",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createListParagraphs(procedureData.execution.openingMeetingAgenda),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "5.2 Evidence Collection Methods",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createListParagraphs(procedureData.execution.evidenceCollection),
          new Paragraph({ text: "" }),

          // 6. AUDIT REPORTING
          new Paragraph({
            text: "6. AUDIT REPORTING",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: "6.1 Finding Types",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createListParagraphs(procedureData.reporting.findingTypes),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "6.2 Report Structure",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createListParagraphs(procedureData.reporting.reportSections),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Reporting Timeline: ", bold: true }),
              new TextRun({ text: procedureData.reporting.reportingTimeline })
            ]
          }),
          new Paragraph({ text: "" }),

          // 7. FOLLOW-UP ACTIONS
          new Paragraph({
            text: "7. FOLLOW-UP ACTIONS",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: "7.1 Corrective Action Process",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createListParagraphs(procedureData.followUp.correctiveActionProcess),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "7.2 Tracking Methods",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createListParagraphs(procedureData.followUp.trackingMethods),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Verification Timeline: ", bold: true }),
              new TextRun({ text: procedureData.followUp.verificationTimeline })
            ]
          }),
          new Paragraph({ text: "" }),

          // 8. AUDIT FREQUENCY
          new Paragraph({
            text: "8. AUDIT FREQUENCY",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "The audit frequency is determined based on risk assessment results and criticality of processes:",
            spacing: { after: 200 }
          }),
          createTable(
            ["Risk Level", "Audit Frequency", "Rationale"],
            [
              ["High-risk areas", procedureData.auditFrequency.highRisk, "Critical controls requiring frequent validation"],
              ["Medium-risk areas", procedureData.auditFrequency.mediumRisk, "Standard controls with regular monitoring"],
              ["Low-risk areas", procedureData.auditFrequency.lowRisk, "Stable controls with extended intervals"],
              ["New processes", procedureData.auditFrequency.newProcesses, "Early validation of newly implemented controls"]
            ]
          ),
          new Paragraph({ text: "", spacing: { after: 400 } }),

          // 9. COMPETENCE MANAGEMENT
          new Paragraph({
            text: "9. COMPETENCE MANAGEMENT",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            text: "9.1 Auditor Competence Requirements",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          createTable(
            ["Role", "Minimum Qualifications", "Experience", "Training"],
            [
              [
                "Lead Auditor",
                "ISO 27001 Lead Auditor certification",
                "5+ years information security",
                "Annual updates on standards"
              ],
              [
                "Internal Auditor",
                "ISO 27001 Internal Auditor training",
                "2+ years information security",
                "Biannual audit technique training"
              ],
              [
                "Technical Specialist",
                "Domain expertise certification",
                "3+ years in specific domain",
                "Continuous professional development"
              ]
            ]
          ),

          new Paragraph({ text: "", spacing: { after: 200 } }),

          new Paragraph({
            text: "9.2 Independence Requirements",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          createTable(
            ["Requirement", "Description", "Verification Method"],
            procedureData.competenceManagement.independenceRequirements.map(req => [
              req.split(':')[0] || req.substring(0, 30) + '...',
              req,
              "Signed declaration of independence"
            ])
          ),

          new Paragraph({ text: "", spacing: { after: 200 } }),

          new Paragraph({
            text: "9.3 Training Program",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          createTable(
            ["Training Type", "Frequency", "Target Audience", "Completion Requirement"],
            procedureData.competenceManagement.trainingRequirements.map(training => [
              training.split(' ')[0] + ' ' + training.split(' ')[1],
              "Annual",
              "All auditors",
              "100% completion with assessment"
            ])
          ),

          new Paragraph({ text: "", spacing: { after: 400 } }),

          // 10. ANNEX A CONTROLS AUDIT (SoA INTEGRATED)
          new Paragraph({
            text: "10. ANNEX A CONTROLS AUDIT",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: "10.1 SoA Integration",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: `This audit program is automatically synchronized with the Statement of Applicability (SoA). Only controls marked as "applicable" or "partially applicable" in the SoA are included in the audit scope, ensuring consistency between declared applicability and audit coverage.`
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "10.2 Applicable Controls from SoA",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: `The following ISO 27001:2022 Annex A controls are marked as applicable in the SoA and will be audited:`
          }),
          // Controls Summary Table
          new Paragraph({
            text: "10.3 Controls Summary Table",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          createTable(
            ["Control ID", "Title", "SoA Status", "Implementation", "Audit Priority"],
            procedureData.annexAControls.selectedControls.map(controlId => {
              const control = sampleAnnexAControls.find(c => c.id === controlId)
              const soaControl = soaData.find(ca => ca.controlId === controlId)
              return [
                control?.id || controlId,
                control?.title || 'Unknown Control',
                soaControl?.status || 'applicable',
                soaControl?.implementationStatus || 'unknown',
                control?.mandatory ? 'High' : 'Medium'
              ]
            })
          ),
          new Paragraph({ text: "", spacing: { after: 400 } }),

          // Detailed Control Information
          new Paragraph({
            text: "10.4 Detailed Control Audit Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          ...procedureData.annexAControls.selectedControls.map(controlId => {
            const control = sampleAnnexAControls.find(c => c.id === controlId)
            const soaControl = soaData.find(ca => ca.controlId === controlId)
            const questions = procedureData.annexAControls.auditQuestions[controlId] || []
            const evidence = procedureData.annexAControls.evidenceRequirements[controlId] || []

            return [
              new Paragraph({ text: "", pageBreakBefore: controlId !== procedureData.annexAControls.selectedControls[0] }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Control ${control?.id}: `, bold: true, size: 28 }),
                  new TextRun({ text: control?.title || '', size: 28 })
                ],
                spacing: { after: 200 }
              }),

              // Control Information Table
              createInfoTable({
                "Control ID": control?.id || controlId,
                "Category": control?.category || 'Unknown',
                "SoA Status": soaControl?.status || 'applicable',
                "Implementation Status": soaControl?.implementationStatus || 'unknown',
                "Responsible Party": soaControl?.responsibleParty || 'Not specified',
                "Target Date": soaControl?.targetDate || 'Not specified',
                "Mandatory": control?.mandatory ? 'Yes' : 'No'
              }),

              new Paragraph({ text: "", spacing: { after: 200 } }),

              new Paragraph({
                children: [new TextRun({ text: "Control Description:", bold: true })],
                spacing: { after: 100 }
              }),
              new Paragraph({
                text: control?.description || 'No description available',
                spacing: { after: 200 }
              }),

              new Paragraph({
                children: [new TextRun({ text: "SoA Justification:", bold: true })],
                spacing: { after: 100 }
              }),
              new Paragraph({
                text: soaControl?.justification || 'No justification provided',
                spacing: { after: 200 }
              }),

              ...(soaControl?.implementationDescription ? [
                new Paragraph({
                  children: [new TextRun({ text: "Implementation Description:", bold: true })],
                  spacing: { after: 100 }
                }),
                new Paragraph({
                  text: soaControl.implementationDescription,
                  spacing: { after: 200 }
                })
              ] : []),

              // Audit Questions Table
              new Paragraph({
                children: [new TextRun({ text: "Audit Questions:", bold: true })],
                spacing: { after: 100 }
              }),
              createTable(
                ["#", "Audit Question", "Expected Evidence"],
                questions.map((question, index) => [
                  (index + 1).toString(),
                  question,
                  evidence[index] || 'Documentation, records, interviews'
                ])
              ),

              new Paragraph({ text: "", spacing: { after: 200 } }),

              // Evidence Requirements
              new Paragraph({
                children: [new TextRun({ text: "Required Evidence:", bold: true })],
                spacing: { after: 100 }
              }),
              ...createListParagraphs(evidence),

              ...(soaControl?.evidence && soaControl.evidence.length > 0 ? [
                new Paragraph({
                  children: [new TextRun({ text: "Additional Evidence from SoA:", bold: true })],
                  spacing: { before: 100, after: 100 }
                }),
                ...createListParagraphs(soaControl.evidence)
              ] : []),

              new Paragraph({ text: "", spacing: { after: 400 } })
            ]
          }).flat(),
          new Paragraph({ text: "" }),

          // 11. MONITORING AND MEASUREMENT
          new Paragraph({
            text: "11. MONITORING AND MEASUREMENT",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "11.1 Key Performance Indicators",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          createTable(
            ["KPI", "Target", "Measurement Method", "Reporting Frequency"],
            [
              ["Program Completion Rate", procedureData.monitoring.kpis.programCompletion, "Percentage of planned audits completed", "Monthly"],
              ["Average Corrective Action Closure", procedureData.monitoring.kpis.correctionTime, "Days from finding to closure", "Monthly"],
              ["Repeat Non-conformities Rate", procedureData.monitoring.kpis.repeatRate, "Percentage of recurring findings", "Quarterly"],
              ["Auditor Competence Maintenance", procedureData.monitoring.kpis.competenceMaintenance, "Training completion and certification status", "Annually"]
            ]
          ),
          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "Review Frequency: ", bold: true }),
              new TextRun({ text: procedureData.monitoring.reviewFrequency })
            ],
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: "11.2 Improvement Actions",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          ...createListParagraphs(procedureData.monitoring.improvementActions),
          new Paragraph({ text: "", spacing: { after: 400 } }),

          // Document Control
          new Paragraph({ text: "", pageBreakBefore: true }),
          new Paragraph({
            text: "DOCUMENT CONTROL",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          createInfoTable({
            "Document Creation Date": new Date().toLocaleDateString(),
            "Last Modified": new Date().toLocaleDateString(),
            "Next Review Date": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            "Document Owner": procedureData.owner,
            "Approved By": procedureData.approver,
            "Classification": "Internal Use",
            "Distribution": "ISMS Team, Internal Auditors, Management",
            "Generated By": "ISMS Application - ISO 27001:2022 Compliance Platform"
          }),

          new Paragraph({ text: "", spacing: { after: 400 } }),

          new Paragraph({
            text: "VERSION HISTORY",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),

          createTable(
            ["Version", "Date", "Author", "Description of Changes"],
            [
              [procedureData.version, new Date().toLocaleDateString(), procedureData.owner, "Initial version - Generated from ISMS Application"]
            ]
          ),

          new Paragraph({ text: "", spacing: { after: 400 } }),

          new Paragraph({
            text: "APPROVAL SIGNATURES",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),

          createTable(
            ["Role", "Name", "Signature", "Date"],
            [
              ["Prepared by", procedureData.owner, "_________________", "_______"],
              ["Reviewed by", "Quality Manager", "_________________", "_______"],
              ["Approved by", procedureData.approver, "_________________", "_______"]
            ]
          ),

          new Paragraph({ text: "", spacing: { after: 200 } }),

          new Paragraph({
            children: [
              new TextRun({
                text: "This document is generated using the ISMS Application ISO 27001:2022 Compliance Platform.",
                italics: true,
                size: 20,
                color: "6B7280"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          })
        ]
      }]
    })

    try {
      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Internal_Audit_Procedure_${procedureData.organizationName.replace(/\s+/g, '_')}_v${procedureData.version}_${new Date().getFullYear()}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Show success message
      alert('Internal Audit Procedure document generated successfully!')
    } catch (error) {
      console.error('Error generating document:', error)
      alert('Error generating document. Please try again.')
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Purpose & Scope</h3>
              </div>
              <p className="text-blue-800 mb-4">
                This procedure establishes requirements for planning, conducting, reporting, and following up on internal audits
                of the Information Security Management System (ISMS) to ensure compliance with ISO 27001:2022.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Audit Coverage Includes:</h4>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Information security policies and procedures</li>
                    <li>• Risk management processes</li>
                    <li>• Security controls implementation</li>
                    <li>• Compliance with legal requirements</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Benefits:</h4>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Systematic audit approach</li>
                    <li>• ISO 27001:2022 compliance</li>
                    <li>• Independent verification</li>
                    <li>• Continuous improvement</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={procedureData.organizationName}
                    onChange={(e) => setProcedureData(prev => ({ ...prev, organizationName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document ID</label>
                  <input
                    type="text"
                    value={procedureData.documentId}
                    onChange={(e) => setProcedureData(prev => ({ ...prev, documentId: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                  <input
                    type="text"
                    value={procedureData.version}
                    onChange={(e) => setProcedureData(prev => ({ ...prev, version: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Owner</label>
                  <input
                    type="text"
                    value={procedureData.owner}
                    onChange={(e) => setProcedureData(prev => ({ ...prev, owner: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approved By</label>
                  <input
                    type="text"
                    value={procedureData.approver}
                    onChange={(e) => setProcedureData(prev => ({ ...prev, approver: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'planning':
        return (
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Audit Planning Guidelines</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-green-200">
                  <input
                    type="checkbox"
                    checked={procedureData.auditPlan.riskBasedApproach}
                    onChange={(e) => handleInputChange('auditPlan', 'riskBasedApproach', e.target.checked)}
                    className="w-5 h-5 text-green-600"
                  />
                  <label className="text-green-800 font-medium">Risk-based approach</label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-green-200">
                  <input
                    type="checkbox"
                    checked={procedureData.auditPlan.previousAuditConsideration}
                    onChange={(e) => handleInputChange('auditPlan', 'previousAuditConsideration', e.target.checked)}
                    className="w-5 h-5 text-green-600"
                  />
                  <label className="text-green-800 font-medium">Consider previous audit findings</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Audit Scope Areas</h3>
                </div>
                {procedureData.auditPlan.scope.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('auditPlan', 'scope', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter scope area"
                    />
                    <button
                      onClick={() => removeArrayItem('auditPlan', 'scope', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('auditPlan', 'scope')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Scope Area
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Audit Objectives</h3>
                </div>
                {procedureData.auditPlan.objectives.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('auditPlan', 'objectives', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter audit objective"
                    />
                    <button
                      onClick={() => removeArrayItem('auditPlan', 'objectives', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('auditPlan', 'objectives')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Objective
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audit Methodology</label>
                <select
                  value={procedureData.auditPlan.methodology}
                  onChange={(e) => handleInputChange('auditPlan', 'methodology', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Risk-based approach">Risk-based approach</option>
                  <option value="Process-based approach">Process-based approach</option>
                  <option value="Compliance-based approach">Compliance-based approach</option>
                  <option value="Hybrid approach">Hybrid approach</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audit Schedule</label>
                <input
                  type="text"
                  value={procedureData.auditPlan.schedule}
                  onChange={(e) => handleInputChange('auditPlan', 'schedule', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Annual program with quarterly reviews"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Required Resources</h3>
              </div>
              {procedureData.auditPlan.resources.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('auditPlan', 'resources', index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter required resource"
                  />
                  <button
                    onClick={() => removeArrayItem('auditPlan', 'resources', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('auditPlan', 'resources')}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </button>
            </div>
          </div>
        )

      case 'preparation':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              {procedureData.preparation.requiredDocuments.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('preparation', 'requiredDocuments', index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter required document"
                  />
                  <button
                    onClick={() => removeArrayItem('preparation', 'requiredDocuments', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('preparation', 'requiredDocuments')}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Document
              </button>
            </div>
          </div>
        )

      case 'execution':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opening Meeting Agenda</h3>
              {procedureData.execution.openingMeetingAgenda.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('execution', 'openingMeetingAgenda', index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter agenda item"
                  />
                  <button
                    onClick={() => removeArrayItem('execution', 'openingMeetingAgenda', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('execution', 'openingMeetingAgenda')}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Agenda Item
              </button>
            </div>
          </div>
        )

      case 'reporting':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Finding Types</h3>
              {procedureData.reporting.findingTypes.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('reporting', 'findingTypes', index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter finding type"
                  />
                  <button
                    onClick={() => removeArrayItem('reporting', 'findingTypes', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('reporting', 'findingTypes')}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Finding Type
              </button>
            </div>
          </div>
        )

      case 'followup':
        return (
          <div className="space-y-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900">Follow-up & Continuous Improvement</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-yellow-200">
                  <input
                    type="checkbox"
                    checked={procedureData.followUp.processImprovement}
                    onChange={(e) => handleInputChange('followUp', 'processImprovement', e.target.checked)}
                    className="w-5 h-5 text-yellow-600"
                  />
                  <label className="text-yellow-800 font-medium">Enable process improvement tracking</label>
                </div>
                <div className="p-4 bg-white rounded-lg border border-yellow-200">
                  <label className="block text-sm font-medium text-yellow-800 mb-2">Verification Timeline</label>
                  <input
                    type="text"
                    value={procedureData.followUp.verificationTimeline}
                    onChange={(e) => handleInputChange('followUp', 'verificationTimeline', e.target.value)}
                    className="w-full p-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., Within 30 days"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Corrective Action Process</h3>
                </div>
                {procedureData.followUp.correctiveActionProcess.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('followUp', 'correctiveActionProcess', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter process step"
                    />
                    <button
                      onClick={() => removeArrayItem('followUp', 'correctiveActionProcess', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('followUp', 'correctiveActionProcess')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Process Step
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Tracking Methods</h3>
                </div>
                {procedureData.followUp.trackingMethods.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('followUp', 'trackingMethods', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter tracking method"
                    />
                    <button
                      onClick={() => removeArrayItem('followUp', 'trackingMethods', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('followUp', 'trackingMethods')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Tracking Method
                </button>
              </div>
            </div>
          </div>
        )

      case 'competence':
        return (
          <div className="space-y-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">Auditor Competence Framework</h3>
              </div>
              <p className="text-purple-800 mb-4">
                Define competence requirements, independence criteria, and training needs for internal auditors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-gold-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Lead Auditor Requirements</h3>
                </div>
                {procedureData.competenceManagement.leadAuditorRequirements.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('competenceManagement', 'leadAuditorRequirements', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter requirement"
                    />
                    <button
                      onClick={() => removeArrayItem('competenceManagement', 'leadAuditorRequirements', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('competenceManagement', 'leadAuditorRequirements')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Requirement
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Internal Auditor Requirements</h3>
                </div>
                {procedureData.competenceManagement.auditorRequirements.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('competenceManagement', 'auditorRequirements', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter requirement"
                    />
                    <button
                      onClick={() => removeArrayItem('competenceManagement', 'auditorRequirements', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('competenceManagement', 'auditorRequirements')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Requirement
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Independence Requirements</h3>
                </div>
                {procedureData.competenceManagement.independenceRequirements.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('competenceManagement', 'independenceRequirements', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter independence requirement"
                    />
                    <button
                      onClick={() => removeArrayItem('competenceManagement', 'independenceRequirements', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('competenceManagement', 'independenceRequirements')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Requirement
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Training Requirements</h3>
                </div>
                {procedureData.competenceManagement.trainingRequirements.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('competenceManagement', 'trainingRequirements', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter training requirement"
                    />
                    <button
                      onClick={() => removeArrayItem('competenceManagement', 'trainingRequirements', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('competenceManagement', 'trainingRequirements')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Training Requirement
                </button>
              </div>
            </div>
          </div>
        )

      case 'monitoring':
        return (
          <div className="space-y-8">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-indigo-900">Program Monitoring & KPIs</h3>
              </div>
              <p className="text-indigo-800 mb-4">
                Define key performance indicators and monitoring mechanisms for the audit program effectiveness.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-indigo-200">
                  <label className="block text-sm font-medium text-indigo-800 mb-2">Review Frequency</label>
                  <input
                    type="text"
                    value={procedureData.monitoring.reviewFrequency}
                    onChange={(e) => handleInputChange('monitoring', 'reviewFrequency', e.target.value)}
                    className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Quarterly reviews"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Completion Rate</label>
                  <input
                    type="text"
                    value={procedureData.monitoring.kpis.programCompletion}
                    onChange={(e) => {
          const newKpis = { ...procedureData.monitoring.kpis, programCompletion: e.target.value }
          handleInputChange('monitoring', 'kpis', newKpis)
        }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Target 100%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Average Correction Time</label>
                  <input
                    type="text"
                    value={procedureData.monitoring.kpis.correctionTime}
                    onChange={(e) => {
          const newKpis = { ...procedureData.monitoring.kpis, correctionTime: e.target.value }
          handleInputChange('monitoring', 'kpis', newKpis)
        }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Target ≤30 days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repeat Non-conformities Rate</label>
                  <input
                    type="text"
                    value={procedureData.monitoring.kpis.repeatRate}
                    onChange={(e) => {
          const newKpis = { ...procedureData.monitoring.kpis, repeatRate: e.target.value }
          handleInputChange('monitoring', 'kpis', newKpis)
        }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Target ≤5%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Competence Maintenance</label>
                  <input
                    type="text"
                    value={procedureData.monitoring.kpis.competenceMaintenance}
                    onChange={(e) => {
          const newKpis = { ...procedureData.monitoring.kpis, competenceMaintenance: e.target.value }
          handleInputChange('monitoring', 'kpis', newKpis)
        }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Target 100%"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Improvement Actions</h3>
              </div>
              {procedureData.monitoring.improvementActions.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('monitoring', 'improvementActions', index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter improvement action"
                  />
                  <button
                    onClick={() => removeArrayItem('monitoring', 'improvementActions', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('monitoring', 'improvementActions')}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Improvement Action
              </button>
            </div>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-green-800">Internal Audit Procedure Complete</h4>
              </div>
              <p className="text-green-700 text-sm mb-4">
                Your comprehensive internal audit procedure is ready for export. This includes all sections from planning through monitoring and continuous improvement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="font-medium text-green-800">✓ Planning & Preparation</div>
                  <div className="text-green-700">Scope, objectives, resources</div>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="font-medium text-green-800">✓ Execution & Reporting</div>
                  <div className="text-green-700">Meetings, evidence, findings</div>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="font-medium text-green-800">✓ Monitoring & Improvement</div>
                  <div className="text-green-700">KPIs, tracking, enhancement</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'annexa':
        const applicableControls = soaData.filter(ca => ca.status === 'applicable' || ca.status === 'partially-applicable')
        const partiallyApplicableControls = soaData.filter(ca => ca.status === 'partially-applicable')
        const notApplicableControls = soaData.filter(ca => ca.status === 'not-applicable')

        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">SoA-Integrated Audit Controls</h3>
                </div>
                <button
                  onClick={syncWithSoA}
                  disabled={isLoadingSoA}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingSoA ? 'animate-spin' : ''}`} />
                  {isLoadingSoA ? 'Syncing...' : 'Sync with SoA'}
                </button>
              </div>
              <p className="text-blue-800 mb-4">
                This audit scope is automatically synchronized with your Statement of Applicability (SoA).
                Only controls marked as "applicable" or "partially applicable" in the SoA will be included in the audit.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-900 mb-2">✓ Applicable Controls</div>
                  <div className="text-2xl font-bold text-green-800">{applicableControls.length}</div>
                  <div className="text-green-700">Ready for audit</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <div className="font-semibold text-yellow-900 mb-2">⚠ Partially Applicable</div>
                  <div className="text-2xl font-bold text-yellow-800">{partiallyApplicableControls.length}</div>
                  <div className="text-yellow-700">Requires review</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-2">✗ Not Applicable</div>
                  <div className="text-2xl font-bold text-gray-800">{notApplicableControls.length}</div>
                  <div className="text-gray-700">Excluded from audit</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-900 mb-2">📋 Total Controls</div>
                  <div className="text-2xl font-bold text-blue-800">{soaData.length}</div>
                  <div className="text-blue-700">In SoA</div>
                </div>
              </div>
            </div>

            {/* SoA Integration Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Automatic SoA Integration</h4>
                  <p className="text-green-700 text-sm mb-3">
                    The audit scope is automatically populated from your Statement of Applicability.
                    This ensures consistency between declared applicable controls and audit coverage.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2 text-green-700">
                      <ExternalLink className="w-4 h-4" />
                      Navigate to SoA to modify control applicability
                    </span>
                    <span className="text-green-600">
                      Last sync: {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicable Controls from SoA */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-6">Applicable Controls from Statement of Applicability</h4>

              <div className="space-y-4">
                {applicableControls.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h5 className="font-medium text-gray-900 mb-2">No Applicable Controls Found</h5>
                    <p className="text-gray-600 text-sm mb-4">
                      No controls are marked as applicable in your Statement of Applicability.
                      Please complete the SoA step first to define which controls are applicable to your organization.
                    </p>
                    <button
                      onClick={syncWithSoA}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Refresh from SoA
                    </button>
                  </div>
                ) : (
                  applicableControls.map(soaControl => {
                    const control = sampleAnnexAControls.find(c => c.id === soaControl.controlId)
                    const questions = procedureData.annexAControls.auditQuestions[soaControl.controlId] || []
                    const evidence = procedureData.annexAControls.evidenceRequirements[soaControl.controlId] || []

                    if (!control) return null

                    return (
                      <div key={soaControl.controlId} className="border rounded-lg p-6 bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono">
                                {control.id}
                              </span>
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                {control.category}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                soaControl.status === 'applicable'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {soaControl.status === 'applicable' ? 'Applicable' : 'Partially Applicable'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                soaControl.implementationStatus === 'implemented' ? 'bg-green-100 text-green-800' :
                                soaControl.implementationStatus === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                soaControl.implementationStatus === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {soaControl.implementationStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            <h5 className="font-semibold text-gray-900 mb-2">{control.title}</h5>
                            <p className="text-gray-600 text-sm mb-4">{control.description}</p>

                            {/* SoA Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg border border-blue-200">
                              <div>
                                <h6 className="font-medium text-blue-900 text-sm mb-2">SoA Justification:</h6>
                                <p className="text-blue-800 text-sm">{soaControl.justification || 'No justification provided'}</p>
                              </div>
                              <div>
                                <h6 className="font-medium text-blue-900 text-sm mb-2">Implementation Description:</h6>
                                <p className="text-blue-800 text-sm">{soaControl.implementationDescription || 'No description provided'}</p>
                              </div>
                              {soaControl.responsibleParty && (
                                <div>
                                  <h6 className="font-medium text-blue-900 text-sm mb-2">Responsible Party:</h6>
                                  <p className="text-blue-800 text-sm">{soaControl.responsibleParty}</p>
                                </div>
                              )}
                              {soaControl.targetDate && (
                                <div>
                                  <h6 className="font-medium text-blue-900 text-sm mb-2">Target Date:</h6>
                                  <p className="text-blue-800 text-sm">{soaControl.targetDate}</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-4">
                              {/* Audit Questions */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <ClipboardList className="w-4 h-4 text-blue-600" />
                                  <h6 className="font-medium text-blue-900">Audit Questions</h6>
                                </div>
                                {questions.map((question, index) => (
                                  <div key={index} className="flex gap-2 mb-2">
                                    <input
                                      type="text"
                                      value={question}
                                      onChange={(e) => updateAuditQuestion(control.id, index, e.target.value)}
                                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                      placeholder="Enter audit question..."
                                    />
                                    <button
                                      onClick={() => removeAuditQuestion(control.id, index)}
                                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addAuditQuestion(control.id)}
                                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1 text-sm"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add Question
                                </button>
                              </div>

                              {/* Evidence Requirements */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Eye className="w-4 h-4 text-green-600" />
                                  <h6 className="font-medium text-green-900">Required Evidence</h6>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {evidence.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-green-800 bg-green-50 p-2 rounded">
                                      <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                                      {item}
                                    </div>
                                  ))}
                                  {soaControl.evidence && soaControl.evidence.length > 0 && (
                                    <>
                                      <div className="col-span-2 text-sm font-medium text-blue-800 mt-2">From SoA:</div>
                                      {soaControl.evidence.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-blue-800 bg-blue-50 p-2 rounded">
                                          <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                          {item}
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Not Applicable Controls (for reference) */}
            {notApplicableControls.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Controls Not Applicable (Excluded from Audit)</h4>
                <p className="text-gray-600 text-sm mb-4">
                  The following controls are marked as "not applicable" in your SoA and will be excluded from the audit scope.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {notApplicableControls.slice(0, 6).map(soaControl => {
                    const control = sampleAnnexAControls.find(c => c.id === soaControl.controlId)
                    return (
                      <div key={soaControl.controlId} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                            {control?.id}
                          </span>
                          <X className="w-4 h-4 text-red-500" />
                        </div>
                        <h6 className="font-medium text-gray-900 text-sm mb-1">{control?.title}</h6>
                        <p className="text-gray-600 text-xs">{soaControl.justification}</p>
                      </div>
                    )
                  })}
                </div>
                {notApplicableControls.length > 6 && (
                  <p className="text-gray-500 text-sm mt-3">
                    ... and {notApplicableControls.length - 6} more controls marked as not applicable
                  </p>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Internal Audit Procedure</h1>
              <p className="text-gray-600 mt-1">Create systematic internal audit procedures for your ISMS</p>
            </div>
            <button
              onClick={generateDocument}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Procedure
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors ${
                    index <= currentStep
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-16 mx-2 ${
                      index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {React.createElement(steps[currentStep].icon, {
                className: "w-6 h-6 text-blue-500"
              })}
              <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep].title}</h2>
            </div>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
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
      </div>
    </div>
  )
}

export default InternalAuditProcedure