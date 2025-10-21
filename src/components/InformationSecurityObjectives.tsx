import React, { useState, useEffect } from 'react'
import { Target, CheckCircle, AlertCircle, Download, ChevronRight, ChevronLeft, TrendingUp, BarChart3, Calendar, FileText, BookOpen } from 'lucide-react'
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

interface InformationSecurityObjectivesProps {
  scopeData: ScopeData | null
}

interface SecurityObjective {
  id: string
  area: string
  objective: string
  targetValue: string
  measurementMethod: string
  frequency: string
  responsibleRole: string
  selected: boolean
  customNotes: string
}

const InformationSecurityObjectives: React.FC<InformationSecurityObjectivesProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [integrationStatus, setIntegrationStatus] = useState({
    scopeDefinition: false,
    soa: false,
    riskAssessment: false,
    treatmentPlan: false
  })

  const [objectives, setObjectives] = useState<SecurityObjective[]>([
    {
      id: 'OBJ-001',
      area: 'Backup Process',
      objective: 'Number of failed backups can be a maximum of 1%',
      targetValue: '≤1% failure rate',
      measurementMethod: 'Review backup logs and calculate failure rate',
      frequency: 'Monthly',
      responsibleRole: 'IT Operations Manager',
      selected: true,
      customNotes: ''
    },
    {
      id: 'OBJ-002',
      area: 'Incident Management',
      objective: 'Decrease the number of information security incidents by 50%',
      targetValue: '50% reduction compared to baseline',
      measurementMethod: 'Count and categorize security incidents in incident management system',
      frequency: 'Quarterly',
      responsibleRole: 'Information Security Manager',
      selected: true,
      customNotes: ''
    },
    {
      id: 'OBJ-003',
      area: 'Information Systems Uptime',
      objective: 'Maintain system availability above 99.00%',
      targetValue: '≥99.00% uptime',
      measurementMethod: 'Monitor system availability through monitoring tools',
      frequency: 'Monthly',
      responsibleRole: 'IT Operations Manager',
      selected: true,
      customNotes: ''
    },
    {
      id: 'OBJ-004',
      area: 'Vulnerability Management',
      objective: 'Remediate critical vulnerabilities within 7 days',
      targetValue: '100% of critical vulnerabilities remediated within SLA',
      measurementMethod: 'Track vulnerability remediation time in vulnerability management system',
      frequency: 'Monthly',
      responsibleRole: 'Security Operations',
      selected: false,
      customNotes: ''
    },
    {
      id: 'OBJ-005',
      area: 'Security Training',
      objective: 'Achieve 95% completion rate for mandatory security training',
      targetValue: '≥95% completion',
      measurementMethod: 'Track training completion in Learning Management System',
      frequency: 'Quarterly',
      responsibleRole: 'Human Resources / Security Awareness',
      selected: false,
      customNotes: ''
    },
    {
      id: 'OBJ-006',
      area: 'Access Management',
      objective: 'Remove access for terminated employees within 24 hours',
      targetValue: '100% compliance with 24-hour SLA',
      measurementMethod: 'Audit access removal logs against HR termination records',
      frequency: 'Monthly',
      responsibleRole: 'IT Security / HR',
      selected: false,
      customNotes: ''
    },
    {
      id: 'OBJ-007',
      area: 'Patch Management',
      objective: 'Apply critical security patches within 7 days of release',
      targetValue: '≥90% patch compliance rate',
      measurementMethod: 'Track patch deployment status in patch management system',
      frequency: 'Monthly',
      responsibleRole: 'IT Operations',
      selected: false,
      customNotes: ''
    },
    {
      id: 'OBJ-008',
      area: 'Security Awareness',
      objective: 'Reduce successful phishing simulation click rate to below 5%',
      targetValue: '<5% click rate on phishing simulations',
      measurementMethod: 'Track phishing simulation results',
      frequency: 'Quarterly',
      responsibleRole: 'Security Awareness Team',
      selected: false,
      customNotes: ''
    },
    {
      id: 'OBJ-009',
      area: 'Risk Management',
      objective: 'Review and update risk assessments annually',
      targetValue: '100% of risk assessments reviewed annually',
      measurementMethod: 'Track risk assessment review dates',
      frequency: 'Annual',
      responsibleRole: 'Information Security Manager',
      selected: false,
      customNotes: ''
    },
    {
      id: 'OBJ-010',
      area: 'Compliance',
      objective: 'Maintain zero major non-conformities in internal audits',
      targetValue: '0 major non-conformities',
      measurementMethod: 'Review internal audit reports',
      frequency: 'Per audit cycle',
      responsibleRole: 'CISO / Compliance Officer',
      selected: false,
      customNotes: ''
    },
    {
      id: 'OBJ-011',
      area: 'Data Protection',
      objective: 'Respond to data subject requests within regulatory timeframes',
      targetValue: '100% compliance with GDPR 30-day timeline',
      measurementMethod: 'Track data subject request processing times',
      frequency: 'Monthly',
      responsibleRole: 'Data Protection Officer',
      selected: false,
      customNotes: ''
    },
    {
      id: 'OBJ-012',
      area: 'Business Continuity',
      objective: 'Test business continuity plans annually for all critical systems',
      targetValue: '100% of critical systems tested',
      measurementMethod: 'Review BC/DR test records',
      frequency: 'Annual',
      responsibleRole: 'Business Continuity Manager',
      selected: false,
      customNotes: ''
    }
  ])

  const [reportingDetails, setReportingDetails] = useState({
    reportingRole: 'Chief Information Security Officer (CISO)',
    reviewFrequency: 'Quarterly management review',
    documentationMethod: 'Measurement reports maintained in ISMS documentation system',
    notes: ''
  })

  useEffect(() => {
    checkIntegrationStatus()
    loadSavedData()
  }, [])

  const checkIntegrationStatus = () => {
    const status = {
      scopeDefinition: !!localStorage.getItem('scopeDefinition'),
      soa: !!localStorage.getItem('statementOfApplicability'),
      riskAssessment: !!localStorage.getItem('riskAssessment'),
      treatmentPlan: !!localStorage.getItem('riskTreatmentPlan')
    }
    setIntegrationStatus(status)
  }

  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('informationSecurityObjectives')
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.objectives) setObjectives(data.objectives)
        if (data.reportingDetails) setReportingDetails(data.reportingDetails)
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }

  const saveData = () => {
    try {
      const dataToSave = {
        objectives,
        reportingDetails,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('informationSecurityObjectives', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  const autoSelectFromPreviousSteps = () => {
    try {
      // Auto-select objectives based on SOA controls
      const savedSOA = localStorage.getItem('statementOfApplicability')

      let updatedObjectives = objectives.map(obj => {
        // Backup is always important
        if (obj.id === 'OBJ-001') return { ...obj, selected: true }
        // Incident management is always important
        if (obj.id === 'OBJ-002') return { ...obj, selected: true }
        // System uptime is always important
        if (obj.id === 'OBJ-003') return { ...obj, selected: true }

        return obj
      })

      if (savedSOA) {
        const soaData = JSON.parse(savedSOA)

        // Helper to check if control is applicable in SOA
        const isControlApplicable = (controlId: string) => {
          const control = soaData.find((c: any) => c.controlId === controlId)
          return control && (control.status === 'applicable' || control.status === 'partially-applicable')
        }

        // Check for vulnerability management controls (A.8.8 - Management of Technical Vulnerabilities)
        if (isControlApplicable('A.8.8')) {
          updatedObjectives = updatedObjectives.map(obj =>
            obj.id === 'OBJ-004' ? { ...obj, selected: true } : obj
          )
        }

        // Check for training controls (A.6.3 - Information security awareness)
        if (isControlApplicable('A.6.3')) {
          updatedObjectives = updatedObjectives.map(obj =>
            obj.id === 'OBJ-005' ? { ...obj, selected: true } : obj
          )
        }

        // Check for access management controls
        if (isControlApplicable('A.5.15') || isControlApplicable('A.5.16') ||
            isControlApplicable('A.5.17') || isControlApplicable('A.5.18')) {
          updatedObjectives = updatedObjectives.map(obj =>
            obj.id === 'OBJ-006' ? { ...obj, selected: true } : obj
          )
        }

        // Check for patch management (A.8.8)
        if (isControlApplicable('A.8.8')) {
          updatedObjectives = updatedObjectives.map(obj =>
            obj.id === 'OBJ-007' ? { ...obj, selected: true } : obj
          )
        }

        // Check for phishing/security awareness (A.6.3, A.6.8)
        if (isControlApplicable('A.6.3') || isControlApplicable('A.6.8')) {
          updatedObjectives = updatedObjectives.map(obj =>
            obj.id === 'OBJ-008' ? { ...obj, selected: true } : obj
          )
        }

        // Check for audit controls (A.5.35, A.5.36)
        if (isControlApplicable('A.5.35') || isControlApplicable('A.5.36')) {
          updatedObjectives = updatedObjectives.map(obj =>
            obj.id === 'OBJ-010' ? { ...obj, selected: true } : obj
          )
        }

        // Check for data protection controls (A.5.34 - Privacy and PII)
        if (isControlApplicable('A.5.34')) {
          updatedObjectives = updatedObjectives.map(obj =>
            obj.id === 'OBJ-011' ? { ...obj, selected: true } : obj
          )
        }

        // Check for business continuity (A.5.29, A.5.30)
        if (isControlApplicable('A.5.29') || isControlApplicable('A.5.30')) {
          updatedObjectives = updatedObjectives.map(obj =>
            obj.id === 'OBJ-012' ? { ...obj, selected: true } : obj
          )
        }
      }

      setObjectives(updatedObjectives)
    } catch (error) {
      console.error('Error auto-selecting objectives:', error)
    }
  }

  // Get related SOA controls for an objective
  const getRelatedSOAControls = (objectiveId: string): string[] => {
    const controlMappings: Record<string, string[]> = {
      'OBJ-001': ['A.8.13'], // Backup - Information Backup
      'OBJ-002': ['A.5.24', 'A.5.25', 'A.5.26', 'A.5.27'], // Incident Management
      'OBJ-003': ['A.5.30', 'A.8.6', 'A.8.14'], // System Uptime - BC/DR, Capacity, Redundancy
      'OBJ-004': ['A.8.8'], // Vulnerability Management
      'OBJ-005': ['A.6.3'], // Security Training
      'OBJ-006': ['A.5.15', 'A.5.16', 'A.5.17', 'A.5.18'], // Access Management
      'OBJ-007': ['A.8.8'], // Patch Management
      'OBJ-008': ['A.6.3', 'A.6.8'], // Security Awareness / Phishing
      'OBJ-009': ['A.8.2', 'A.8.3'], // Risk Management
      'OBJ-010': ['A.5.35', 'A.5.36'], // Compliance / Audits
      'OBJ-011': ['A.5.34', 'A.8.11'], // Data Protection / Privacy
      'OBJ-012': ['A.5.29', 'A.5.30'] // Business Continuity
    }
    return controlMappings[objectiveId] || []
  }

  // Check how many related controls are implemented
  const getControlImplementationStatus = (objectiveId: string): { total: number, implemented: number } => {
    const relatedControls = getRelatedSOAControls(objectiveId)
    if (relatedControls.length === 0) return { total: 0, implemented: 0 }

    try {
      const savedSOA = localStorage.getItem('statementOfApplicability')
      if (!savedSOA) return { total: relatedControls.length, implemented: 0 }

      const soaData = JSON.parse(savedSOA)
      const implemented = relatedControls.filter(controlId => {
        const control = soaData.find((c: any) => c.controlId === controlId)
        return control && (control.status === 'applicable' || control.status === 'partially-applicable')
      }).length

      return { total: relatedControls.length, implemented }
    } catch (error) {
      return { total: relatedControls.length, implemented: 0 }
    }
  }

  const toggleObjective = (id: string) => {
    setObjectives(prev => prev.map(obj =>
      obj.id === id ? { ...obj, selected: !obj.selected } : obj
    ))
  }

  const updateObjectiveNotes = (id: string, notes: string) => {
    setObjectives(prev => prev.map(obj =>
      obj.id === id ? { ...obj, customNotes: notes } : obj
    ))
  }

  const generateDocument = async () => {
    const organizationName = scopeData?.organizationName || '[Organization Name]'
    const selectedObjectives = objectives.filter(o => o.selected)

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
              children: [new Paragraph({ text: 'OBJ-DOC-001' })],
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
              children: [new Paragraph({ text: reportingDetails.reportingRole })],
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
              children: [new Paragraph({ text: 'Top Management' })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        })
      ]
    })

    // Objectives Measurement Table
    const objectivesTable = new Table({
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
        // Header row
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Control / Process / Department', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Objective', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Target Value', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Measurement Method', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Frequency', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Responsible Role', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        // Data rows
        ...selectedObjectives.map(obj => new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: obj.area })],
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: obj.objective })],
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: obj.targetValue })],
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: obj.measurementMethod })],
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: obj.frequency })],
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: obj.responsibleRole })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }))
      ]
    })

    // Build document content
    const documentChildren: (Paragraph | Table)[] = []

    // Title
    documentChildren.push(
      new Paragraph({
        text: 'Information Security Objectives',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Measurement Report',
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

    // Introduction
    documentChildren.push(
      new Paragraph({
        text: '1. Introduction',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Purpose: ', bold: true }),
          new TextRun({ text: 'This document defines the information security objectives for ' + organizationName + ' and establishes the measurement methods and criteria for monitoring ISMS performance. These objectives are aligned with the Information Security Policy and risk treatment outcomes.' })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Scope: ', bold: true }),
          new TextRun({ text: 'These objectives apply to all processes, controls, and departments within the ISMS scope.' })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Reporting: ', bold: true }),
          new TextRun({ text: 'This report is analyzed and evaluated by ' + reportingDetails.reportingRole + '. ' + reportingDetails.reviewFrequency + '.' })
        ],
        spacing: { after: 200 }
      })
    )

    // Objectives Table
    documentChildren.push(
      new Paragraph({
        text: '2. Information Security Objectives and Measurements',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'The following table defines the information security objectives, target values, measurement methods, and responsibilities:',
        spacing: { after: 200 }
      })
    )

    documentChildren.push(objectivesTable)
    documentChildren.push(new Paragraph({ text: '', spacing: { after: 400 } }))

    // Objective Details (optional extended information)
    if (selectedObjectives.some(obj => obj.customNotes)) {
      documentChildren.push(
        new Paragraph({
          text: '3. Additional Objective Details',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 }
        })
      )

      selectedObjectives.filter(obj => obj.customNotes).forEach((obj, idx) => {
        documentChildren.push(
          new Paragraph({
            text: `3.${idx + 1} ${obj.area}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Notes: ', bold: true }),
              new TextRun({ text: obj.customNotes })
            ],
            spacing: { after: 200 }
          })
        )
      })
    }

    // Measurement and Reporting Process
    const sectionNumber = selectedObjectives.some(obj => obj.customNotes) ? '4' : '3'
    documentChildren.push(
      new Paragraph({
        text: `${sectionNumber}. Measurement and Reporting Process`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'Data Collection:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Responsible roles collect measurement data according to defined frequency',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Data is recorded in appropriate systems (monitoring tools, logs, management systems)',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Evidence of measurements is maintained for audit purposes',
        bullet: { level: 0 },
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Analysis and Evaluation:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• ' + reportingDetails.reportingRole + ' analyzes measurement results',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Performance is compared against target values',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Trends and patterns are identified',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Root causes of deviations are investigated',
        bullet: { level: 0 },
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Reporting:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Measurement reports are prepared ' + reportingDetails.reviewFrequency.toLowerCase(),
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Results are presented to top management during management review',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Non-conformities trigger corrective action procedures',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Documentation is maintained per ' + reportingDetails.documentationMethod.toLowerCase(),
        bullet: { level: 0 },
        spacing: { after: 200 }
      })
    )

    // Review and Continuous Improvement
    const nextSection = selectedObjectives.some(obj => obj.customNotes) ? '5' : '4'
    documentChildren.push(
      new Paragraph({
        text: `${nextSection}. Review and Continuous Improvement`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'These objectives shall be reviewed and updated:',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Annually as part of the ISMS management review',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When organizational context or scope changes',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When risk assessment identifies new priorities',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When objectives are consistently achieved or missed',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Following significant security incidents',
        bullet: { level: 0 },
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Continuous improvement actions based on measurement results will be documented and tracked through the ISMS improvement process.',
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
    link.download = `Information_Security_Objectives_${organizationName.replace(/\s+/g, '_')}.docx`
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
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">Risk Treatment Plan</span>
          {integrationStatus.treatmentPlan ? (
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
        Auto-Select Based on SOA Controls
      </button>
    </div>
  )

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Overview</h2>
      <p className="text-gray-600 mb-6">
        This module helps you define information security objectives and establish key performance indicators (KPIs)
        for monitoring ISMS effectiveness. This fulfills ISO 27001:2022 Clause 6.2 - Information security objectives.
      </p>

      {renderIntegrationStatus()}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          About This Module
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Purpose:</strong> Define measurable information security objectives that demonstrate
            ISMS performance and drive continuous improvement.
          </p>
          <p>
            <strong>What you'll create:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Measurable security objectives aligned with policy and risk treatment</li>
            <li>Key performance indicators (KPIs) with target values</li>
            <li>Measurement methods and frequencies</li>
            <li>Responsibility assignments for monitoring and reporting</li>
          </ul>
          <p>
            <strong>ISO 27001 Requirements:</strong> Addresses Clause 6.2 (Information security objectives) and
            provides input for Clause 9.1 (Monitoring, measurement, analysis and evaluation).
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Define Security Objectives</h2>
      <p className="text-gray-600 mb-6">
        Select and customize the information security objectives that will be tracked for your ISMS.
        Objectives should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
      </p>

      <div className="space-y-4">
        {objectives.map(obj => {
          const relatedControls = getRelatedSOAControls(obj.id)
          const controlStatus = getControlImplementationStatus(obj.id)
          const coveragePercentage = controlStatus.total > 0
            ? Math.round((controlStatus.implemented / controlStatus.total) * 100)
            : 0

          return (
          <div key={obj.id} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={obj.selected}
                  onChange={() => toggleObjective(obj.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{obj.area}</h3>
                    {relatedControls.length > 0 && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Linked to SOA controls: {relatedControls.join(', ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          coveragePercentage === 100 ? 'bg-green-100 text-green-800' :
                          coveragePercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {controlStatus.implemented}/{controlStatus.total} implemented
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-4">{obj.id}</span>
                </div>
                <p className="text-sm text-gray-700 mb-3 font-medium">{obj.objective}</p>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="font-medium text-gray-700">Target:</span>
                    <span className="text-gray-600 ml-2">{obj.targetValue}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <span className="text-gray-600 ml-2">{obj.frequency}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Measurement Method:</span>
                    <span className="text-gray-600 ml-2">{obj.measurementMethod}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Responsible Role:</span>
                    <span className="text-gray-600 ml-2">{obj.responsibleRole}</span>
                  </div>
                </div>

                {obj.selected && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={obj.customNotes}
                      onChange={(e) => updateObjectiveNotes(obj.id, e.target.value)}
                      placeholder="Any additional context, baseline values, or specific implementation details..."
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reporting Configuration</h2>
      <p className="text-gray-600 mb-6">
        Configure how objectives will be reported, analyzed, and reviewed within your organization.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Who analyzes and evaluates measurement results?
          </label>
          <input
            type="text"
            value={reportingDetails.reportingRole}
            onChange={(e) => setReportingDetails({ ...reportingDetails, reportingRole: e.target.value })}
            placeholder="e.g., Chief Information Security Officer (CISO)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            This role is responsible for collecting, analyzing, and reporting on objective achievement
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Review Frequency
          </label>
          <select
            value={reportingDetails.reviewFrequency}
            onChange={(e) => setReportingDetails({ ...reportingDetails, reviewFrequency: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Monthly management review">Monthly management review</option>
            <option value="Quarterly management review">Quarterly management review</option>
            <option value="Semi-annual management review">Semi-annual management review</option>
            <option value="Annual management review">Annual management review</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            How often are measurement results reviewed by top management?
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Documentation Method
          </label>
          <input
            type="text"
            value={reportingDetails.documentationMethod}
            onChange={(e) => setReportingDetails({ ...reportingDetails, documentationMethod: e.target.value })}
            placeholder="e.g., Measurement reports maintained in ISMS documentation system"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Where and how are measurement results documented and stored?
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={reportingDetails.notes}
            onChange={(e) => setReportingDetails({ ...reportingDetails, notes: e.target.value })}
            placeholder="Any additional reporting requirements, escalation procedures, or special considerations..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => {
    const selectedObjectives = objectives.filter(o => o.selected)
    const objectivesByArea = selectedObjectives.reduce((acc, obj) => {
      const category = obj.area.includes('Management') ? 'Management' :
                      obj.area.includes('Process') ? 'Process' :
                      obj.area.includes('System') || obj.area.includes('Uptime') ? 'System' : 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(obj)
      return acc
    }, {} as Record<string, typeof selectedObjectives>)

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Export</h2>
        <p className="text-gray-600 mb-6">
          Review your information security objectives and export the measurement report document.
        </p>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">{selectedObjectives.length}</div>
                <div className="text-sm text-blue-700 mt-1">Objectives Defined</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">{reportingDetails.reviewFrequency.split(' ')[0]}</div>
                <div className="text-sm text-green-700 mt-1">Review Frequency</div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {new Set(selectedObjectives.map(o => o.frequency)).size}
                </div>
                <div className="text-sm text-purple-700 mt-1">Measurement Frequencies</div>
              </div>
            </div>
          </div>
        </div>

        {/* Objectives Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Objectives Summary</h3>
          <div className="space-y-4">
            {selectedObjectives.map(obj => (
              <div key={obj.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{obj.area}</h4>
                  <span className="text-xs text-gray-500">{obj.id}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{obj.objective}</p>
                <div className="flex items-center space-x-6 text-xs text-gray-600">
                  <span><strong>Target:</strong> {obj.targetValue}</span>
                  <span><strong>Frequency:</strong> {obj.frequency}</span>
                  <span><strong>Owner:</strong> {obj.responsibleRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reporting Configuration Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporting Configuration</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Reporting Role:</span>
              <span className="text-gray-600 ml-2">{reportingDetails.reportingRole}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Review Frequency:</span>
              <span className="text-gray-600 ml-2">{reportingDetails.reviewFrequency}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Documentation:</span>
              <span className="text-gray-600 ml-2">{reportingDetails.documentationMethod}</span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Export Objectives & Measurement Report
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a comprehensive Word document containing your information security objectives,
                target values, measurement methods, and reporting configuration. This document includes
                a measurement table that can be used for ongoing tracking and reporting.
              </p>
              <button
                onClick={generateDocument}
                disabled={selectedObjectives.length === 0}
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
    { number: 1, title: 'Overview', render: renderStep1 },
    { number: 2, title: 'Define Objectives', render: renderStep2 },
    { number: 3, title: 'Reporting Config', render: renderStep3 },
    { number: 4, title: 'Review & Export', render: renderStep4 }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Information Security Objectives</h1>
            <p className="text-gray-600 mt-1">ISO 27001:2022 Clause 6.2 - Measurable objectives and KPIs</p>
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

export default InformationSecurityObjectives
