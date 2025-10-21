import React, { useState, useEffect } from 'react'
import { BarChart3, CheckCircle, AlertCircle, Download, ChevronRight, ChevronLeft, ClipboardCheck, TrendingUp, Users, FileText, BookOpen, Calendar } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, VerticalAlign, BorderStyle } from 'docx'

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

interface ManagementReviewProps {
  scopeData: ScopeData | null
}

interface ReviewInput {
  id: string
  category: string
  topic: string
  description: string
  status: 'satisfactory' | 'needs-attention' | 'critical' | 'not-applicable'
  findings: string
  dataSource: string
}

interface ManagementDecision {
  id: string
  area: string
  decision: string
  actionRequired: string
  responsibleParty: string
  targetDate: string
  priority: 'high' | 'medium' | 'low'
}

const ManagementReview: React.FC<ManagementReviewProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [integrationStatus, setIntegrationStatus] = useState({
    scopeDefinition: false,
    soa: false,
    riskAssessment: false,
    objectives: false,
    internalAudit: false
  })

  const [reviewDetails, setReviewDetails] = useState({
    reviewDate: new Date().toISOString().split('T')[0],
    reviewPeriod: 'Q1 2025',
    attendees: 'CEO, CISO, CTO, CFO, COO',
    chairperson: 'Chief Executive Officer',
    notes: ''
  })

  const [reviewInputs, setReviewInputs] = useState<ReviewInput[]>([
    {
      id: 'INP-001',
      category: 'Previous Review Actions',
      topic: 'Follow-up on previous management review decisions',
      description: 'Review status of actions from previous management review',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Previous management review minutes and action tracker'
    },
    {
      id: 'INP-002',
      category: 'Context Changes',
      topic: 'Changes in external and internal issues',
      description: 'Review any changes to external context (regulations, threats, market) and internal context (organization structure, technology, processes)',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Context analysis, scope definition updates'
    },
    {
      id: 'INP-003',
      category: 'Interested Parties',
      topic: 'Feedback from interested parties',
      description: 'Review feedback from customers, partners, regulators, and other stakeholders',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Customer surveys, partner feedback, regulatory correspondence'
    },
    {
      id: 'INP-004',
      category: 'ISMS Performance',
      topic: 'Nonconformities and corrective actions',
      description: 'Review nonconformities identified and status of corrective actions',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Nonconformity register, corrective action tracking system'
    },
    {
      id: 'INP-005',
      category: 'ISMS Performance',
      topic: 'Monitoring and measurement results',
      description: 'Review KPI achievement and measurement results against objectives',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Measurement reports, KPI dashboards, security metrics'
    },
    {
      id: 'INP-006',
      category: 'ISMS Performance',
      topic: 'Internal audit results',
      description: 'Review findings from internal ISMS audits',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Internal audit reports'
    },
    {
      id: 'INP-007',
      category: 'ISMS Performance',
      topic: 'External audit results',
      description: 'Review findings from external certification audits (if applicable)',
      status: 'not-applicable',
      findings: '',
      dataSource: 'External audit reports, certification body correspondence'
    },
    {
      id: 'INP-008',
      category: 'ISMS Performance',
      topic: 'Fulfillment of information security objectives',
      description: 'Review achievement of information security objectives',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Information security objectives tracking, measurement reports'
    },
    {
      id: 'INP-009',
      category: 'Risk Management',
      topic: 'Results of risk assessment',
      description: 'Review current risk landscape and any new or emerging risks',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Risk assessment reports, risk register updates'
    },
    {
      id: 'INP-010',
      category: 'Risk Management',
      topic: 'Status of risk treatment plan',
      description: 'Review progress on risk treatment implementation',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Risk treatment plan, control implementation status'
    },
    {
      id: 'INP-011',
      category: 'Incidents & Threats',
      topic: 'Security incidents and trends',
      description: 'Review security incidents, their impact, and trending patterns',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Incident reports, incident management system'
    },
    {
      id: 'INP-012',
      category: 'Incidents & Threats',
      topic: 'Threat intelligence and vulnerability landscape',
      description: 'Review current threat landscape and vulnerability trends',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Threat intelligence reports, vulnerability scan results'
    },
    {
      id: 'INP-013',
      category: 'Improvement',
      topic: 'Opportunities for continual improvement',
      description: 'Identify opportunities to improve ISMS effectiveness',
      status: 'needs-attention',
      findings: '',
      dataSource: 'Improvement suggestions, lessons learned, best practices'
    },
    {
      id: 'INP-014',
      category: 'Resources',
      topic: 'Resource adequacy',
      description: 'Review whether resources (people, budget, tools) are adequate for ISMS',
      status: 'satisfactory',
      findings: '',
      dataSource: 'Budget reports, staffing levels, tool assessments'
    }
  ])

  const [managementDecisions, setManagementDecisions] = useState<ManagementDecision[]>([
    {
      id: 'DEC-001',
      area: 'Continual Improvement',
      decision: '',
      actionRequired: '',
      responsibleParty: '',
      targetDate: '',
      priority: 'medium'
    }
  ])

  useEffect(() => {
    checkIntegrationStatus()
    loadSavedData()
  }, [])

  const checkIntegrationStatus = () => {
    const status = {
      scopeDefinition: !!localStorage.getItem('scopeDefinition'),
      soa: !!localStorage.getItem('statementOfApplicability'),
      riskAssessment: !!localStorage.getItem('riskAssessment'),
      objectives: !!localStorage.getItem('informationSecurityObjectives'),
      internalAudit: !!localStorage.getItem('internalAuditProcedure')
    }
    setIntegrationStatus(status)
  }

  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('managementReview')
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.reviewDetails) setReviewDetails(data.reviewDetails)
        if (data.reviewInputs) setReviewInputs(data.reviewInputs)
        if (data.managementDecisions) setManagementDecisions(data.managementDecisions)
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }

  const saveData = () => {
    try {
      const dataToSave = {
        reviewDetails,
        reviewInputs,
        managementDecisions,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('managementReview', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  const autoPopulateFromPreviousSteps = () => {
    try {
      const updatedInputs = reviewInputs.map(input => {
        let findings = input.findings
        let dataSource = input.dataSource

        // INP-004: Nonconformities and corrective actions
        if (input.id === 'INP-004') {
          const correctiveActionsData = localStorage.getItem('correctiveActions')
          if (correctiveActionsData) {
            const { nonConformities } = JSON.parse(correctiveActionsData)
            const totalNCs = nonConformities?.length || 0
            const openNCs = nonConformities?.filter((nc: any) => nc.status !== 'closed').length || 0
            const closedNCs = totalNCs - openNCs
            findings = `Total non-conformities: ${totalNCs}\nOpen: ${openNCs}\nClosed: ${closedNCs}\nClosure rate: ${totalNCs > 0 ? Math.round((closedNCs / totalNCs) * 100) : 0}%`
            dataSource = 'Corrective Actions tracking system'
          }
        }

        // INP-005: Monitoring and measurement results
        if (input.id === 'INP-005') {
          const objectivesData = localStorage.getItem('informationSecurityObjectives')
          if (objectivesData) {
            const { objectives } = JSON.parse(objectivesData)
            const selectedObjectives = objectives?.filter((o: any) => o.selected) || []
            const achievedCount = selectedObjectives.filter((o: any) => o.achieved).length
            findings = `${selectedObjectives.length} security objectives defined\n${achievedCount} objectives currently on track\nKey areas: ${selectedObjectives.slice(0, 3).map((o: any) => o.area).join(', ')}`
            dataSource = 'Information Security Objectives measurement reports'
          }
        }

        // INP-006: Internal audit results
        if (input.id === 'INP-006') {
          const auditData = localStorage.getItem('internalAuditProcedure')
          if (auditData) {
            const { audits } = JSON.parse(auditData)
            const completedAudits = audits?.filter((a: any) => a.status === 'completed') || []
            const totalFindings = completedAudits.reduce((sum: number, a: any) => sum + (a.findings?.length || 0), 0)
            findings = `${completedAudits.length} internal audits completed\n${totalFindings} total findings identified\nMost recent audit: ${completedAudits[0]?.name || 'N/A'}`
            dataSource = 'Internal audit reports and findings log'
          }
        }

        // INP-008: Fulfillment of information security objectives
        if (input.id === 'INP-008') {
          const objectivesData = localStorage.getItem('informationSecurityObjectives')
          if (objectivesData) {
            const { objectives } = JSON.parse(objectivesData)
            const selectedObjectives = objectives?.filter((o: any) => o.selected) || []
            const objectivesList = selectedObjectives.map((o: any) =>
              `• ${o.area}: ${o.targetValue}`
            ).join('\n')
            findings = `${selectedObjectives.length} objectives defined and tracked:\n${objectivesList.substring(0, 200)}${objectivesList.length > 200 ? '...' : ''}`
            dataSource = 'Information Security Objectives tracking and measurement reports'
          }
        }

        // INP-009: Results of risk assessment
        if (input.id === 'INP-009') {
          const riskData = localStorage.getItem('riskAssessmentData')
          if (riskData) {
            const { risks } = JSON.parse(riskData)
            const totalRisks = risks?.length || 0
            const criticalRisks = risks?.filter((r: any) => r.riskLevel === 'critical').length || 0
            const highRisks = risks?.filter((r: any) => r.riskLevel === 'high').length || 0
            const mediumRisks = risks?.filter((r: any) => r.riskLevel === 'medium').length || 0
            findings = `Total risks identified: ${totalRisks}\nCritical: ${criticalRisks}, High: ${highRisks}, Medium: ${mediumRisks}\nHigh-priority risks require immediate attention`
            dataSource = 'Risk Assessment register and risk matrices'
          }
        }

        // INP-010: Status of risk treatment plan
        if (input.id === 'INP-010') {
          const treatmentPlanData = localStorage.getItem('riskTreatmentPlans')
          if (treatmentPlanData) {
            const plans = JSON.parse(treatmentPlanData)
            const totalControls = plans?.length || 0
            const completedControls = plans?.filter((p: any) => p.status === 'completed').length || 0
            const inProgressControls = plans?.filter((p: any) => p.status === 'in-progress').length || 0
            const completionRate = totalControls > 0 ? Math.round((completedControls / totalControls) * 100) : 0
            findings = `${totalControls} controls in treatment plan\nCompleted: ${completedControls} (${completionRate}%)\nIn Progress: ${inProgressControls}\nOn track for implementation timeline`
            dataSource = 'Risk Treatment Plan implementation tracking'
          }
        }

        // INP-002: Changes in context
        if (input.id === 'INP-002') {
          const scopeData = localStorage.getItem('scopeDefinition')
          if (scopeData) {
            const { internalIssues, externalIssues } = JSON.parse(scopeData)
            const totalIssues = (internalIssues?.length || 0) + (externalIssues?.length || 0)
            findings = `${internalIssues?.length || 0} internal issues tracked\n${externalIssues?.length || 0} external issues tracked\nTotal context factors: ${totalIssues}\nRegular review recommended`
            dataSource = 'Scope definition and context analysis'
          }
        }

        // INP-003: Interested parties feedback
        if (input.id === 'INP-003') {
          const scopeData = localStorage.getItem('scopeDefinition')
          if (scopeData) {
            const { interestedParties } = JSON.parse(scopeData)
            const totalParties = interestedParties?.length || 0
            findings = `${totalParties} interested parties identified\nKey stakeholders: ${interestedParties?.slice(0, 3).map((p: any) => p.party).join(', ') || 'None'}\nRequirements actively monitored`
            dataSource = 'Interested parties register and feedback log'
          }
        }

        return { ...input, findings, dataSource }
      })

      setReviewInputs(updatedInputs)
    } catch (error) {
      console.error('Error auto-populating review inputs:', error)
    }
  }

  const updateReviewInput = (id: string, field: keyof ReviewInput, value: any) => {
    setReviewInputs(prev => prev.map(input =>
      input.id === id ? { ...input, [field]: value } : input
    ))
  }

  const addDecision = () => {
    const newDecision: ManagementDecision = {
      id: `DEC-${String(managementDecisions.length + 1).padStart(3, '0')}`,
      area: '',
      decision: '',
      actionRequired: '',
      responsibleParty: '',
      targetDate: '',
      priority: 'medium'
    }
    setManagementDecisions([...managementDecisions, newDecision])
  }

  const updateDecision = (id: string, field: keyof ManagementDecision, value: any) => {
    setManagementDecisions(prev => prev.map(dec =>
      dec.id === id ? { ...dec, [field]: value } : dec
    ))
  }

  const removeDecision = (id: string) => {
    setManagementDecisions(prev => prev.filter(dec => dec.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'satisfactory':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'not-applicable':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const generateDocument = async () => {
    const organizationName = scopeData?.organizationName || '[Organization Name]'

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
              children: [new Paragraph({ text: 'MGR-' + reviewDetails.reviewDate.replace(/-/g, '') })],
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
              children: [new Paragraph({ text: 'Review Date', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: new Date(reviewDetails.reviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Review Period', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: reviewDetails.reviewPeriod })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Chairperson', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: reviewDetails.chairperson })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Attendees', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: reviewDetails.attendees })],
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
        text: 'Management Review Minutes',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Information Security Management System',
        heading: HeadingLevel.HEADING_1,
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

    // 1. Introduction
    documentChildren.push(
      new Paragraph({
        text: '1. Meeting Information',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Review Date: ', bold: true }),
          new TextRun({ text: new Date(reviewDetails.reviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Review Period: ', bold: true }),
          new TextRun({ text: reviewDetails.reviewPeriod })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Chairperson: ', bold: true }),
          new TextRun({ text: reviewDetails.chairperson })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Attendees: ', bold: true }),
          new TextRun({ text: reviewDetails.attendees })
        ],
        spacing: { after: 200 }
      })
    )

    if (reviewDetails.notes) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Meeting Notes: ', bold: true }),
            new TextRun({ text: reviewDetails.notes })
          ],
          spacing: { after: 200 }
        })
      )
    }

    // 2. Review Inputs
    documentChildren.push(
      new Paragraph({
        text: '2. Review of ISMS Performance',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'The following aspects of the ISMS were reviewed in accordance with ISO 27001:2022 Clause 9.3:',
        spacing: { after: 200 }
      })
    )

    // Group inputs by category
    const inputsByCategory = reviewInputs.reduce((acc, input) => {
      if (!acc[input.category]) acc[input.category] = []
      acc[input.category].push(input)
      return acc
    }, {} as Record<string, ReviewInput[]>)

    let sectionNum = 1
    Object.entries(inputsByCategory).forEach(([category, inputs]) => {
      documentChildren.push(
        new Paragraph({
          text: `2.${sectionNum} ${category}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      )

      inputs.forEach((input) => {
        documentChildren.push(
          new Paragraph({
            text: input.topic,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 100, after: 50 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Description: ', bold: true }),
              new TextRun({ text: input.description })
            ],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Status: ', bold: true }),
              new TextRun({ text: input.status === 'satisfactory' ? 'Satisfactory' :
                                    input.status === 'needs-attention' ? 'Needs Attention' :
                                    input.status === 'critical' ? 'Critical' : 'Not Applicable' })
            ],
            spacing: { after: 50 }
          })
        )

        if (input.findings) {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Findings: ', bold: true }),
                new TextRun({ text: input.findings })
              ],
              spacing: { after: 100 }
            })
          )
        }

        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Data Source: ', bold: true, italics: true }),
              new TextRun({ text: input.dataSource, italics: true })
            ],
            spacing: { after: 150 }
          })
        )
      })

      sectionNum++
    })

    // 3. Management Decisions and Actions
    const validDecisions = managementDecisions.filter(dec => dec.decision && dec.actionRequired)

    if (validDecisions.length > 0) {
      documentChildren.push(
        new Paragraph({
          text: '3. Management Decisions and Actions',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          text: 'Based on the review, management made the following decisions and assigned the following actions:',
          spacing: { after: 200 }
        })
      )

      validDecisions.forEach((dec, idx) => {
        documentChildren.push(
          new Paragraph({
            text: `3.${idx + 1} ${dec.area}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Decision: ', bold: true }),
              new TextRun({ text: dec.decision })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Action Required: ', bold: true }),
              new TextRun({ text: dec.actionRequired })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Responsible Party: ', bold: true }),
              new TextRun({ text: dec.responsibleParty || 'To be assigned' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Target Date: ', bold: true }),
              new TextRun({ text: dec.targetDate ? new Date(dec.targetDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'To be determined' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Priority: ', bold: true }),
              new TextRun({ text: dec.priority.charAt(0).toUpperCase() + dec.priority.slice(1) })
            ],
            spacing: { after: 200 }
          })
        )
      })
    }

    // 4. Summary and Conclusions
    const satisfactoryCount = reviewInputs.filter(i => i.status === 'satisfactory').length
    const needsAttentionCount = reviewInputs.filter(i => i.status === 'needs-attention').length
    const criticalCount = reviewInputs.filter(i => i.status === 'critical').length

    const conclusionSection = validDecisions.length > 0 ? '4' : '3'
    documentChildren.push(
      new Paragraph({
        text: `${conclusionSection}. Summary and Conclusions`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Overall ISMS Status: ', bold: true }),
          new TextRun({
            text: criticalCount > 0 ? 'Critical issues require immediate attention' :
                  needsAttentionCount > 0 ? 'Generally satisfactory with some areas requiring attention' :
                  'Satisfactory - ISMS is operating effectively'
          })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Review Statistics:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `• ${satisfactoryCount} areas reviewed with satisfactory status`,
        bullet: { level: 0 },
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: `• ${needsAttentionCount} areas identified as needing attention`,
        bullet: { level: 0 },
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: `• ${criticalCount} critical issues identified`,
        bullet: { level: 0 },
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: `• ${validDecisions.length} management decisions and actions recorded`,
        bullet: { level: 0 },
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Top management confirms that:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• The ISMS continues to be suitable, adequate, and effective',
        bullet: { level: 0 },
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: '• Resources allocated to the ISMS are adequate',
        bullet: { level: 0 },
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: '• Continual improvement of the ISMS is supported',
        bullet: { level: 0 },
        spacing: { after: 200 }
      })
    )

    // 5. Next Review
    const nextReviewSection = validDecisions.length > 0 ? '5' : '4'
    documentChildren.push(
      new Paragraph({
        text: `${nextReviewSection}. Next Review`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'The next management review is scheduled to be held within the next quarter/year (as per organizational schedule) and will include follow-up on the actions identified in this review.',
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
    link.download = `Management_Review_${reviewDetails.reviewDate}_${organizationName.replace(/\s+/g, '_')}.docx`
    link.click()
    URL.revokeObjectURL(url)

    saveData()
  }

  const renderIntegrationStatus = () => {
    const availableStepsCount = Object.values(integrationStatus).filter(Boolean).length

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Integration Status
        </h3>
        <div className="space-y-2 mb-4">
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
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Security Objectives</span>
            {integrationStatus.objectives ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Internal Audit</span>
            {integrationStatus.internalAudit ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        {availableStepsCount > 0 && (
          <button
            onClick={autoPopulateFromPreviousSteps}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Auto-Populate Review Inputs from {availableStepsCount} Available Step{availableStepsCount > 1 ? 's' : ''}
          </button>
        )}
      </div>
    )
  }

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Overview</h2>
      <p className="text-gray-600 mb-6">
        This module helps you conduct and document management reviews of the ISMS. Management reviews ensure
        top management oversight, evaluate ISMS performance, and drive continual improvement. This fulfills
        ISO 27001:2022 Clause 9.3 - Management review.
      </p>

      {renderIntegrationStatus()}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          About Management Review
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Purpose:</strong> Top management must review the ISMS at planned intervals to ensure its
            continuing suitability, adequacy, and effectiveness.
          </p>
          <p>
            <strong>What gets reviewed:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Status of actions from previous management reviews</li>
            <li>Changes in external and internal issues relevant to the ISMS</li>
            <li>Feedback from interested parties</li>
            <li>ISMS performance trends (incidents, audit results, objectives)</li>
            <li>Risk assessment results and risk treatment status</li>
            <li>Opportunities for continual improvement</li>
          </ul>
          <p>
            <strong>Management decisions:</strong> The review results in decisions related to continual improvement,
            changes to the ISMS, and resource needs.
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Meeting Details</h2>
      <p className="text-gray-600 mb-6">
        Document the basic information about this management review meeting.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Review Date
            </label>
            <input
              type="date"
              value={reviewDetails.reviewDate}
              onChange={(e) => setReviewDetails({ ...reviewDetails, reviewDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Review Period
            </label>
            <input
              type="text"
              value={reviewDetails.reviewPeriod}
              onChange={(e) => setReviewDetails({ ...reviewDetails, reviewPeriod: e.target.value })}
              placeholder="e.g., Q1 2025, January-March 2025"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Meeting Chairperson
          </label>
          <input
            type="text"
            value={reviewDetails.chairperson}
            onChange={(e) => setReviewDetails({ ...reviewDetails, chairperson: e.target.value })}
            placeholder="e.g., Chief Executive Officer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Attendees
          </label>
          <input
            type="text"
            value={reviewDetails.attendees}
            onChange={(e) => setReviewDetails({ ...reviewDetails, attendees: e.target.value })}
            placeholder="e.g., CEO, CISO, CTO, CFO, COO"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            List the names or titles of management review attendees
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Meeting Notes (Optional)
          </label>
          <textarea
            value={reviewDetails.notes}
            onChange={(e) => setReviewDetails({ ...reviewDetails, notes: e.target.value })}
            placeholder="Any general notes about the meeting context, objectives, or special circumstances..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Review ISMS Performance</h2>
      <p className="text-gray-600 mb-6">
        Review each aspect of ISMS performance, record the status, and document key findings.
      </p>

      <div className="space-y-6">
        {Object.entries(
          reviewInputs.reduce((acc, input) => {
            if (!acc[input.category]) acc[input.category] = []
            acc[input.category].push(input)
            return acc
          }, {} as Record<string, ReviewInput[]>)
        ).map(([category, inputs]) => (
          <div key={category} className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="space-y-4">
              {inputs.map(input => (
                <div key={input.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{input.topic}</h4>
                  <p className="text-sm text-gray-600 mb-3">{input.description}</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={input.status}
                        onChange={(e) => updateReviewInput(input.id, 'status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="satisfactory">Satisfactory</option>
                        <option value="needs-attention">Needs Attention</option>
                        <option value="critical">Critical</option>
                        <option value="not-applicable">Not Applicable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Findings / Comments
                      </label>
                      <textarea
                        value={input.findings}
                        onChange={(e) => updateReviewInput(input.id, 'findings', e.target.value)}
                        placeholder="Document key findings, observations, metrics, or concerns..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(input.status)}`}>
                        {input.status === 'satisfactory' ? 'Satisfactory' :
                         input.status === 'needs-attention' ? 'Needs Attention' :
                         input.status === 'critical' ? 'Critical' : 'Not Applicable'}
                      </span>
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

  const renderStep4 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Management Decisions & Actions</h2>
      <p className="text-gray-600 mb-6">
        Document management decisions and assign actions based on the review findings. Actions should address
        continual improvement opportunities, ISMS changes, and resource needs.
      </p>

      <div className="space-y-4 mb-6">
        {managementDecisions.map((decision, idx) => (
          <div key={decision.id} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Decision {idx + 1}</h3>
              {managementDecisions.length > 1 && (
                <button
                  onClick={() => removeDecision(decision.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area / Topic
                </label>
                <input
                  type="text"
                  value={decision.area}
                  onChange={(e) => updateDecision(decision.id, 'area', e.target.value)}
                  placeholder="e.g., Continual Improvement, Resource Allocation, ISMS Change"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Management Decision
                </label>
                <textarea
                  value={decision.decision}
                  onChange={(e) => updateDecision(decision.id, 'decision', e.target.value)}
                  placeholder="What did management decide? e.g., Approve additional security tools budget, Implement new training program"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Required
                </label>
                <textarea
                  value={decision.actionRequired}
                  onChange={(e) => updateDecision(decision.id, 'actionRequired', e.target.value)}
                  placeholder="What specific action needs to be taken to implement the decision?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsible Party
                  </label>
                  <input
                    type="text"
                    value={decision.responsibleParty}
                    onChange={(e) => updateDecision(decision.id, 'responsibleParty', e.target.value)}
                    placeholder="e.g., CISO, IT Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={decision.targetDate}
                    onChange={(e) => updateDecision(decision.id, 'targetDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={decision.priority}
                    onChange={(e) => updateDecision(decision.id, 'priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addDecision}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
      >
        + Add Another Decision/Action
      </button>
    </div>
  )

  const renderStep5 = () => {
    const satisfactoryCount = reviewInputs.filter(i => i.status === 'satisfactory').length
    const needsAttentionCount = reviewInputs.filter(i => i.status === 'needs-attention').length
    const criticalCount = reviewInputs.filter(i => i.status === 'critical').length
    const validDecisions = managementDecisions.filter(dec => dec.decision && dec.actionRequired)

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Summary & Export</h2>
        <p className="text-gray-600 mb-6">
          Review the management review summary and export the complete minutes document.
        </p>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{satisfactoryCount}</div>
            <div className="text-sm text-green-700 mt-1">Satisfactory</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-900">{needsAttentionCount}</div>
            <div className="text-sm text-yellow-700 mt-1">Needs Attention</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-900">{criticalCount}</div>
            <div className="text-sm text-red-700 mt-1">Critical</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{validDecisions.length}</div>
            <div className="text-sm text-blue-700 mt-1">Actions Assigned</div>
          </div>
        </div>

        {/* Meeting Details Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Review Date:</span>
              <span className="text-gray-600 ml-2">
                {new Date(reviewDetails.reviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Review Period:</span>
              <span className="text-gray-600 ml-2">{reviewDetails.reviewPeriod}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Chairperson:</span>
              <span className="text-gray-600 ml-2">{reviewDetails.chairperson}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Attendees:</span>
              <span className="text-gray-600 ml-2">{reviewDetails.attendees}</span>
            </div>
          </div>
        </div>

        {/* Critical/Attention Items */}
        {(criticalCount > 0 || needsAttentionCount > 0) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Requiring Attention</h3>
            <div className="space-y-2">
              {reviewInputs
                .filter(i => i.status === 'critical' || i.status === 'needs-attention')
                .map(input => (
                  <div key={input.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(input.status)}`}>
                      {input.status === 'critical' ? 'Critical' : 'Attention'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{input.topic}</p>
                      {input.findings && (
                        <p className="text-xs text-gray-600 mt-1">{input.findings}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Management Decisions Summary */}
        {validDecisions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Decisions & Actions</h3>
            <div className="space-y-3">
              {validDecisions.map((dec, idx) => (
                <div key={dec.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{dec.area}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(dec.priority)}`}>
                      {dec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{dec.decision}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span><strong>Owner:</strong> {dec.responsibleParty || 'TBD'}</span>
                    {dec.targetDate && (
                      <span><strong>Due:</strong> {new Date(dec.targetDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
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
                Export Management Review Minutes
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a comprehensive Word document containing the complete management review minutes,
                including all review inputs, findings, management decisions, and actions. This document serves
                as formal evidence of management review for ISO 27001 compliance.
              </p>
              <button
                onClick={generateDocument}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
    { number: 1, title: 'Overview', render: renderStep1 },
    { number: 2, title: 'Meeting Details', render: renderStep2 },
    { number: 3, title: 'Review Performance', render: renderStep3 },
    { number: 4, title: 'Decisions & Actions', render: renderStep4 },
    { number: 5, title: 'Summary & Export', render: renderStep5 }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Management Review</h1>
            <p className="text-gray-600 mt-1">ISO 27001:2022 Clause 9.3 - Top management ISMS review</p>
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
                <span className="text-xs mt-2 text-gray-600 text-center max-w-[100px]">
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

export default ManagementReview
