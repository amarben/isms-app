import React, { useState, useEffect } from 'react'
import { Scale, CheckCircle, AlertCircle, Download, ChevronRight, ChevronLeft, FileText, BookOpen, Shield, Building2 } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, Table, TableRow, TableCell, WidthType, VerticalAlign, BorderStyle } from 'docx'

interface ScopeData {
  organizationName: string
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

interface LegalRegulatoryRequirementsProps {
  scopeData: ScopeData | null
}

interface Requirement {
  id: string
  category: string
  name: string
  description: string
  applicability: string
  selected: boolean
  complianceStatus: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed'
  evidenceRequired: string
  reviewFrequency: string
  owner: string
  notes: string
}

interface ComplianceEvidence {
  requirementId: string
  evidenceType: string
  evidenceDescription: string
  lastReviewDate: string
  nextReviewDate: string
}

const LegalRegulatoryRequirements: React.FC<LegalRegulatoryRequirementsProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [integrationStatus, setIntegrationStatus] = useState({
    scopeDefinition: false,
    soa: false,
    riskAssessment: false
  })

  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: 'REQ-001',
      category: 'Data Protection',
      name: 'GDPR (General Data Protection Regulation)',
      description: 'EU regulation on data protection and privacy',
      applicability: 'If processing personal data of EU residents',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'Privacy policy, DPO appointment, DPIA records, consent management',
      reviewFrequency: 'Quarterly',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-002',
      category: 'Data Protection',
      name: 'CCPA (California Consumer Privacy Act)',
      description: 'California law enhancing privacy rights and consumer protection',
      applicability: 'If processing personal data of California residents',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'Privacy notice, consumer rights procedures, data inventory',
      reviewFrequency: 'Quarterly',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-003',
      category: 'Data Protection',
      name: 'HIPAA (Health Insurance Portability and Accountability Act)',
      description: 'US law for protection of health information',
      applicability: 'If handling protected health information (PHI)',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'Security Rule compliance, HIPAA policies, BAA agreements',
      reviewFrequency: 'Annual',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-004',
      category: 'Financial Regulations',
      name: 'PCI DSS (Payment Card Industry Data Security Standard)',
      description: 'Security standard for organizations handling credit cards',
      applicability: 'If processing, storing, or transmitting credit card data',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'SAQ completion, network diagrams, vulnerability scans, penetration tests',
      reviewFrequency: 'Annual',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-005',
      category: 'Financial Regulations',
      name: 'SOX (Sarbanes-Oxley Act)',
      description: 'US law for financial reporting and corporate governance',
      applicability: 'If publicly traded company in the US',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'IT general controls, financial system access logs, change management records',
      reviewFrequency: 'Annual',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-006',
      category: 'Industry Standards',
      name: 'ISO 27001:2022',
      description: 'International standard for information security management',
      applicability: 'If seeking ISO 27001 certification',
      selected: true,
      complianceStatus: 'partial',
      evidenceRequired: 'ISMS documentation, SOA, risk assessment, internal audit reports',
      reviewFrequency: 'Annual',
      owner: '',
      notes: 'Currently implementing ISMS'
    },
    {
      id: 'REQ-007',
      category: 'Industry Standards',
      name: 'NIST Cybersecurity Framework',
      description: 'Framework for improving critical infrastructure cybersecurity',
      applicability: 'For critical infrastructure organizations',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'Framework implementation plan, security controls mapping, maturity assessment',
      reviewFrequency: 'Semi-annual',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-008',
      category: 'Sector-Specific',
      name: 'FERPA (Family Educational Rights and Privacy Act)',
      description: 'US law protecting student education records',
      applicability: 'If educational institution handling student records',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'Annual notification, consent forms, access logs',
      reviewFrequency: 'Annual',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-009',
      category: 'Sector-Specific',
      name: 'FISMA (Federal Information Security Management Act)',
      description: 'US law for federal information security',
      applicability: 'If federal agency or contractor to federal government',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'System security plans, security control assessments, POA&M',
      reviewFrequency: 'Annual',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-010',
      category: 'Employment Law',
      name: 'Employment Data Protection Laws',
      description: 'National laws governing employee personal data',
      applicability: 'All organizations with employees',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'Employee privacy notices, HR data processing records, consent forms',
      reviewFrequency: 'Annual',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-011',
      category: 'Contractual',
      name: 'Customer Contract Security Requirements',
      description: 'Security requirements specified in customer contracts',
      applicability: 'Based on specific customer agreements',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'Contract review records, compliance attestations, audit reports',
      reviewFrequency: 'Per contract terms',
      owner: '',
      notes: ''
    },
    {
      id: 'REQ-012',
      category: 'Intellectual Property',
      name: 'Copyright and Licensing Laws',
      description: 'Laws governing software licensing and intellectual property',
      applicability: 'All organizations using software and digital content',
      selected: false,
      complianceStatus: 'not-assessed',
      evidenceRequired: 'Software license inventory, usage tracking, compliance audits',
      reviewFrequency: 'Quarterly',
      owner: '',
      notes: ''
    }
  ])

  const [complianceEvidence, setComplianceEvidence] = useState<ComplianceEvidence[]>([])
  const [newEvidence, setNewEvidence] = useState<ComplianceEvidence>({
    requirementId: '',
    evidenceType: '',
    evidenceDescription: '',
    lastReviewDate: '',
    nextReviewDate: ''
  })

  useEffect(() => {
    checkIntegrationStatus()
    loadSavedData()
  }, [])

  const checkIntegrationStatus = () => {
    const status = {
      scopeDefinition: !!localStorage.getItem('scopeDefinition'),
      soa: !!localStorage.getItem('statementOfApplicability'),
      riskAssessment: !!localStorage.getItem('riskAssessment')
    }
    setIntegrationStatus(status)
  }

  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('legalRegulatoryRequirements')
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.requirements) setRequirements(data.requirements)
        if (data.complianceEvidence) setComplianceEvidence(data.complianceEvidence)
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }

  const saveData = () => {
    try {
      const dataToSave = {
        requirements,
        complianceEvidence,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('legalRegulatoryRequirements', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  const autoSelectFromPreviousSteps = () => {
    try {
      const updatedRequirements = requirements.map(req => {
        // ISO 27001 is always selected if working on ISMS
        if (req.id === 'REQ-006') {
          return { ...req, selected: true, complianceStatus: 'partial' as const }
        }

        // Check SOA for data protection controls
        const savedSOA = localStorage.getItem('statementOfApplicability')
        if (savedSOA) {
          const soaData = JSON.parse(savedSOA)
          const hasDataProtectionControls = soaData.controls?.some((c: any) =>
            c.applicable && (c.id.startsWith('A.5.3') || c.id === 'A.5.34')
          )
          if (hasDataProtectionControls && req.category === 'Data Protection') {
            return { ...req, selected: true }
          }
        }

        // Check for payment processing from scope
        if (scopeData) {
          const hasPaymentProcessing = scopeData.scopeDocument.processesAndServices.some(
            service => service.toLowerCase().includes('payment') || service.toLowerCase().includes('transaction')
          )
          if (hasPaymentProcessing && req.id === 'REQ-004') {
            return { ...req, selected: true }
          }
        }

        return req
      })

      setRequirements(updatedRequirements)
    } catch (error) {
      console.error('Error auto-selecting requirements:', error)
    }
  }

  const toggleRequirement = (id: string) => {
    setRequirements(prev => prev.map(req =>
      req.id === id ? { ...req, selected: !req.selected } : req
    ))
  }

  const updateRequirement = (id: string, field: string, value: any) => {
    setRequirements(prev => prev.map(req =>
      req.id === id ? { ...req, [field]: value } : req
    ))
  }

  const addEvidence = () => {
    if (newEvidence.requirementId && newEvidence.evidenceType) {
      setComplianceEvidence(prev => [...prev, { ...newEvidence }])
      setNewEvidence({
        requirementId: '',
        evidenceType: '',
        evidenceDescription: '',
        lastReviewDate: '',
        nextReviewDate: ''
      })
    }
  }

  const removeEvidence = (index: number) => {
    setComplianceEvidence(prev => prev.filter((_, i) => i !== index))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'non-compliant':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Compliant'
      case 'partial':
        return 'Partially Compliant'
      case 'non-compliant':
        return 'Non-Compliant'
      default:
        return 'Not Assessed'
    }
  }

  const generateDocument = async () => {
    const organizationName = scopeData?.organizationName || '[Organization Name]'
    const selectedRequirements = requirements.filter(r => r.selected)

    // Document Control Table
    const documentControlTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Document ID', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 30, type: WidthType.PERCENTAGE }
            }),
            new TableCell({
              children: [new Paragraph({ text: 'LRR-001' })],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 70, type: WidthType.PERCENTAGE }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Version', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: '1.0' })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Effective Date', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Review Date', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({
                text: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Owner', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Compliance Officer' })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Approved by', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Chief Information Security Officer' })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        })
      ]
    })

    // Build document content
    const documentChildren: (Paragraph | Table)[] = []

    // Title
    documentChildren.push(
      new Paragraph({
        text: 'Legal, Regulatory, and Contractual Requirements',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    )

    // Subtitle
    documentChildren.push(
      new Paragraph({
        text: organizationName,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    )

    // Document Control Table
    documentChildren.push(documentControlTable)
    documentChildren.push(new Paragraph({ text: '', spacing: { after: 400 } }))

    // 1. Purpose
    documentChildren.push(
      new Paragraph({
        text: '1. Purpose',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This document identifies and records all legal, regulatory, statutory, and contractual requirements related to information security that are applicable to ' + organizationName + '. It serves as a central registry to ensure compliance obligations are understood, documented, and regularly reviewed.',
        spacing: { after: 200 }
      })
    )

    // 2. Scope
    documentChildren.push(
      new Paragraph({
        text: '2. Scope',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This requirement register applies to all information assets, processes, and activities within the scope of the Information Security Management System (ISMS) as defined in the ISMS Scope Definition document.',
        spacing: { after: 200 }
      })
    )

    // 3. Applicable Requirements
    documentChildren.push(
      new Paragraph({
        text: '3. Applicable Requirements',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'The following requirements have been identified as applicable to ' + organizationName + ':',
        spacing: { after: 200 }
      })
    )

    // Group requirements by category
    const categoryGroups = selectedRequirements.reduce((acc, req) => {
      if (!acc[req.category]) {
        acc[req.category] = []
      }
      acc[req.category].push(req)
      return acc
    }, {} as Record<string, Requirement[]>)

    // Add each category
    Object.entries(categoryGroups).forEach(([category, reqs], idx) => {
      documentChildren.push(
        new Paragraph({
          text: `3.${idx + 1} ${category}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      )

      reqs.forEach((req, reqIdx) => {
        documentChildren.push(
          new Paragraph({
            text: `${req.id}: ${req.name}`,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 100, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Description: ', bold: true }),
              new TextRun({ text: req.description })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Applicability: ', bold: true }),
              new TextRun({ text: req.applicability })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Compliance Status: ', bold: true }),
              new TextRun({ text: getStatusLabel(req.complianceStatus) })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Evidence Required: ', bold: true }),
              new TextRun({ text: req.evidenceRequired })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Review Frequency: ', bold: true }),
              new TextRun({ text: req.reviewFrequency })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Owner: ', bold: true }),
              new TextRun({ text: req.owner || '[To be assigned]' })
            ],
            spacing: { after: 100 }
          })
        )

        if (req.notes) {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Notes: ', bold: true }),
                new TextRun({ text: req.notes })
              ],
              spacing: { after: 200 }
            })
          )
        } else {
          documentChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }))
        }
      })
    })

    // 4. Compliance Evidence
    if (complianceEvidence.length > 0) {
      documentChildren.push(
        new Paragraph({
          text: '4. Compliance Evidence',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          text: 'The following evidence has been collected to demonstrate compliance with applicable requirements:',
          spacing: { after: 200 }
        })
      )

      complianceEvidence.forEach((evidence, idx) => {
        const requirement = requirements.find(r => r.id === evidence.requirementId)
        documentChildren.push(
          new Paragraph({
            text: `4.${idx + 1} ${requirement?.name || evidence.requirementId}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Evidence Type: ', bold: true }),
              new TextRun({ text: evidence.evidenceType })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Description: ', bold: true }),
              new TextRun({ text: evidence.evidenceDescription })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Last Review: ', bold: true }),
              new TextRun({ text: evidence.lastReviewDate || 'Not reviewed' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Next Review: ', bold: true }),
              new TextRun({ text: evidence.nextReviewDate || 'Not scheduled' })
            ],
            spacing: { after: 200 }
          })
        )
      })
    }

    // 5. Review and Monitoring
    documentChildren.push(
      new Paragraph({
        text: '5. Review and Monitoring',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This requirement register shall be reviewed and updated:',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• At least annually as part of the ISMS management review',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When new legal or regulatory requirements are identified',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When significant changes occur to the organization\'s operations or scope',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When notified of changes to existing requirements',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Following internal or external audits',
        bullet: { level: 0 },
        spacing: { after: 200 }
      })
    )

    // 6. Responsibilities
    documentChildren.push(
      new Paragraph({
        text: '6. Responsibilities',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Compliance Officer: ', bold: true }),
          new TextRun({ text: 'Maintains this register, monitors regulatory changes, and coordinates compliance activities across the organization.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'CISO: ', bold: true }),
          new TextRun({ text: 'Reviews and approves the requirement register, ensures adequate resources for compliance, and reports to senior management.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Requirement Owners: ', bold: true }),
          new TextRun({ text: 'Responsible for demonstrating compliance with assigned requirements and maintaining relevant evidence.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Senior Management: ', bold: true }),
          new TextRun({ text: 'Ensures organizational commitment to compliance and allocates necessary resources.' })
        ],
        spacing: { after: 200 }
      })
    )

    // 7. Document Control
    documentChildren.push(
      new Paragraph({
        text: '7. Document Control',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This document is controlled and maintained by the Compliance Officer. All changes must be approved by the CISO. Version history is maintained separately.',
        spacing: { after: 200 }
      })
    )

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: documentChildren
      }]
    })

    // Generate and download
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Legal_Regulatory_Requirements_${organizationName.replace(/\s+/g, '_')}.docx`
    link.click()
    URL.revokeObjectURL(url)

    saveData()
  }

  const renderIntegrationStatus = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
        <BookOpen className="w-5 h-5 mr-2" />
        Integration Status
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">Scope Definition</span>
          {integrationStatus.scopeDefinition ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">Statement of Applicability</span>
          {integrationStatus.soa ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">Risk Assessment</span>
          {integrationStatus.riskAssessment ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      <button
        onClick={autoSelectFromPreviousSteps}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Auto-Select Based on Previous Steps
      </button>
    </div>
  )

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Overview</h2>
      <p className="text-gray-600 mb-6">
        This module helps you identify and document all legal, regulatory, statutory, and contractual requirements
        applicable to your organization's ISMS. This fulfills ISO 27001:2022 Control A.5.31.
      </p>

      {renderIntegrationStatus()}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Scale className="w-5 h-5 mr-2" />
          About This Module
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Purpose:</strong> Maintain a comprehensive register of all legal, regulatory, and contractual
            requirements related to information security.
          </p>
          <p>
            <strong>What you'll do:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Identify applicable legal and regulatory requirements</li>
            <li>Document compliance status and evidence</li>
            <li>Assign ownership and review frequencies</li>
            <li>Generate professional compliance documentation</li>
          </ul>
          <p>
            <strong>Integration:</strong> This module will use information from your scope definition, risk assessment,
            and SOA to suggest relevant requirements.
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Identify Requirements</h2>
      <p className="text-gray-600 mb-6">
        Select all legal, regulatory, statutory, and contractual requirements applicable to your organization.
        Templates are provided for common requirements.
      </p>

      <div className="space-y-4">
        {Object.entries(
          requirements.reduce((acc, req) => {
            if (!acc[req.category]) acc[req.category] = []
            acc[req.category].push(req)
            return acc
          }, {} as Record<string, Requirement[]>)
        ).map(([category, reqs]) => (
          <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              {category === 'Data Protection' && <Shield className="w-5 h-5 mr-2 text-blue-600" />}
              {category === 'Financial Regulations' && <Building2 className="w-5 h-5 mr-2 text-green-600" />}
              {category === 'Industry Standards' && <FileText className="w-5 h-5 mr-2 text-purple-600" />}
              {category === 'Sector-Specific' && <Scale className="w-5 h-5 mr-2 text-orange-600" />}
              {category === 'Employment Law' && <FileText className="w-5 h-5 mr-2 text-indigo-600" />}
              {category === 'Contractual' && <FileText className="w-5 h-5 mr-2 text-gray-600" />}
              {category === 'Intellectual Property' && <FileText className="w-5 h-5 mr-2 text-pink-600" />}
              {category}
            </h3>
            <div className="space-y-3">
              {reqs.map(req => (
                <div
                  key={req.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    req.selected
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleRequirement(req.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        req.selected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {req.selected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{req.name}</h4>
                        <span className="text-xs text-gray-500">{req.id}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                      <p className="text-xs text-gray-500 italic">{req.applicability}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance Status & Ownership</h2>
      <p className="text-gray-600 mb-6">
        Document the current compliance status, assign owners, and add notes for each selected requirement.
      </p>

      <div className="space-y-4">
        {requirements.filter(r => r.selected).map(req => (
          <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{req.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{req.description}</p>
              </div>
              <span className="text-xs text-gray-500">{req.id}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compliance Status
                </label>
                <select
                  value={req.complianceStatus}
                  onChange={(e) => updateRequirement(req.id, 'complianceStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="not-assessed">Not Assessed</option>
                  <option value="compliant">Compliant</option>
                  <option value="partial">Partially Compliant</option>
                  <option value="non-compliant">Non-Compliant</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirement Owner
                </label>
                <input
                  type="text"
                  value={req.owner}
                  onChange={(e) => updateRequirement(req.id, 'owner', e.target.value)}
                  placeholder="e.g., Compliance Officer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={req.notes}
                onChange={(e) => updateRequirement(req.id, 'notes', e.target.value)}
                placeholder="Additional notes, actions needed, or relevant information..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Evidence Required:</strong> {req.evidenceRequired}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Review Frequency:</strong> {req.reviewFrequency}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance Evidence</h2>
      <p className="text-gray-600 mb-6">
        Document evidence that demonstrates compliance with applicable requirements. This supports audit and certification activities.
      </p>

      {/* Add new evidence */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Compliance Evidence</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirement
            </label>
            <select
              value={newEvidence.requirementId}
              onChange={(e) => setNewEvidence({ ...newEvidence, requirementId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select requirement...</option>
              {requirements.filter(r => r.selected).map(req => (
                <option key={req.id} value={req.id}>{req.id} - {req.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidence Type
            </label>
            <input
              type="text"
              value={newEvidence.evidenceType}
              onChange={(e) => setNewEvidence({ ...newEvidence, evidenceType: e.target.value })}
              placeholder="e.g., Policy Document, Audit Report, Training Records"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidence Description
            </label>
            <textarea
              value={newEvidence.evidenceDescription}
              onChange={(e) => setNewEvidence({ ...newEvidence, evidenceDescription: e.target.value })}
              placeholder="Describe the evidence and how it demonstrates compliance..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Review Date
              </label>
              <input
                type="date"
                value={newEvidence.lastReviewDate}
                onChange={(e) => setNewEvidence({ ...newEvidence, lastReviewDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Review Date
              </label>
              <input
                type="date"
                value={newEvidence.nextReviewDate}
                onChange={(e) => setNewEvidence({ ...newEvidence, nextReviewDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={addEvidence}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Evidence
          </button>
        </div>
      </div>

      {/* Evidence list */}
      {complianceEvidence.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recorded Evidence</h3>
          {complianceEvidence.map((evidence, idx) => {
            const requirement = requirements.find(r => r.id === evidence.requirementId)
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{requirement?.name || evidence.requirementId}</h4>
                    <p className="text-sm text-blue-600 mt-1">{evidence.evidenceType}</p>
                  </div>
                  <button
                    onClick={() => removeEvidence(idx)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{evidence.evidenceDescription}</p>
                <div className="flex items-center space-x-6 text-xs text-gray-500">
                  <span>Last Review: {evidence.lastReviewDate || 'Not reviewed'}</span>
                  <span>Next Review: {evidence.nextReviewDate || 'Not scheduled'}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No compliance evidence recorded yet</p>
          <p className="text-sm text-gray-500 mt-1">Add evidence above to document your compliance activities</p>
        </div>
      )}
    </div>
  )

  const renderStep5 = () => {
    const selectedRequirements = requirements.filter(r => r.selected)
    const compliantCount = selectedRequirements.filter(r => r.complianceStatus === 'compliant').length
    const partialCount = selectedRequirements.filter(r => r.complianceStatus === 'partial').length
    const nonCompliantCount = selectedRequirements.filter(r => r.complianceStatus === 'non-compliant').length
    const notAssessedCount = selectedRequirements.filter(r => r.complianceStatus === 'not-assessed').length

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Export</h2>
        <p className="text-gray-600 mb-6">
          Review your legal and regulatory requirements register and export professional documentation for compliance records and audits.
        </p>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{selectedRequirements.length}</div>
            <div className="text-sm text-blue-700 mt-1">Total Requirements</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{compliantCount}</div>
            <div className="text-sm text-green-700 mt-1">Compliant</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-900">{partialCount}</div>
            <div className="text-sm text-yellow-700 mt-1">Partially Compliant</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-900">{nonCompliantCount}</div>
            <div className="text-sm text-red-700 mt-1">Non-Compliant</div>
          </div>
        </div>

        {/* Requirements Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Requirements Summary</h3>
          <div className="space-y-3">
            {selectedRequirements.map(req => (
              <div key={req.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-xs font-medium text-gray-500">{req.id}</span>
                    <h4 className="font-medium text-gray-900">{req.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{req.category}</p>
                  {req.owner && (
                    <p className="text-xs text-gray-500 mt-1">Owner: {req.owner}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.complianceStatus)}`}>
                  {getStatusLabel(req.complianceStatus)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Summary */}
        {complianceEvidence.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Evidence Summary</h3>
            <p className="text-sm text-gray-600 mb-3">
              {complianceEvidence.length} evidence item(s) recorded
            </p>
            <div className="space-y-2">
              {complianceEvidence.map((evidence, idx) => {
                const requirement = requirements.find(r => r.id === evidence.requirementId)
                return (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span className="text-gray-900">{requirement?.name || evidence.requirementId}</span>
                    <span className="text-gray-600">{evidence.evidenceType}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Export Compliance Documentation
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a professional Word document containing your complete legal and regulatory requirements register,
                including compliance status, evidence, and ownership information.
              </p>
              <button
                onClick={generateDocument}
                disabled={selectedRequirements.length === 0}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Generate Word Document
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: 'Integration Overview', render: renderStep1 },
    { number: 2, title: 'Identify Requirements', render: renderStep2 },
    { number: 3, title: 'Compliance Status', render: renderStep3 },
    { number: 4, title: 'Evidence Management', render: renderStep4 },
    { number: 5, title: 'Review & Export', render: renderStep5 }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legal & Regulatory Requirements</h1>
            <p className="text-gray-600 mt-1">ISO 27001:2022 Control A.5.31</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep === step.number
                      ? 'bg-blue-600 text-white'
                      : currentStep > step.number
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-xs mt-2 text-gray-600 text-center max-w-[80px]">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        {steps[currentStep - 1].render()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentStep(prev => Math.max(1, prev - 1))
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-gray-600">
          Step {currentStep} of {steps.length}
        </div>

        <button
          onClick={() => {
            saveData()
            setCurrentStep(prev => Math.min(steps.length, prev + 1))
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          disabled={currentStep === steps.length}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default LegalRegulatoryRequirements
