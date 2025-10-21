import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Download, AlertTriangle, CheckCircle, Users, Clock, FileText, Phone, Shield, MessageSquare, AlertCircle } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, VerticalAlign, UnderlineType } from 'docx'

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

interface IncidentType {
  id: string
  name: string
  description: string
  selected: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface ResponseRole {
  id: string
  role: string
  responsibilities: string[]
  selected: boolean
}

interface EscalationPath {
  level: number
  title: string
  timeframe: string
  notifyWho: string
}

interface CommunicationTemplate {
  id: string
  name: string
  purpose: string
  selected: boolean
}

interface Props {
  scopeData: ScopeData | null
}

const IncidentResponseProcedure: React.FC<Props> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [integrationStatus, setIntegrationStatus] = useState({
    scope: false,
    soa: false,
    riskAssessment: false
  })

  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([
    { id: 'malware', name: 'Malware/Ransomware Attack', description: 'Virus, trojan, ransomware, or other malicious software', selected: false, severity: 'critical' },
    { id: 'data-breach', name: 'Data Breach', description: 'Unauthorized access or disclosure of sensitive data', selected: false, severity: 'critical' },
    { id: 'phishing', name: 'Phishing Attack', description: 'Social engineering attempt to obtain sensitive information', selected: false, severity: 'high' },
    { id: 'dos', name: 'Denial of Service', description: 'Service disruption or unavailability', selected: false, severity: 'high' },
    { id: 'unauthorized-access', name: 'Unauthorized Access', description: 'Attempted or successful unauthorized system access', selected: false, severity: 'high' },
    { id: 'data-loss', name: 'Data Loss', description: 'Accidental or intentional data deletion or corruption', selected: false, severity: 'medium' },
    { id: 'system-failure', name: 'System Failure', description: 'Critical system or infrastructure failure', selected: false, severity: 'medium' },
    { id: 'insider-threat', name: 'Insider Threat', description: 'Malicious or negligent actions by internal personnel', selected: false, severity: 'high' }
  ])

  const [responseRoles, setResponseRoles] = useState<ResponseRole[]>([
    {
      id: 'incident-manager',
      role: 'Incident Response Manager',
      responsibilities: [
        'Coordinate overall incident response activities',
        'Make decisions on incident classification and escalation',
        'Communicate with senior management and stakeholders',
        'Ensure proper documentation of incident'
      ],
      selected: false
    },
    {
      id: 'technical-lead',
      role: 'Technical Response Lead',
      responsibilities: [
        'Lead technical investigation and analysis',
        'Coordinate technical containment and eradication efforts',
        'Implement recovery procedures',
        'Document technical findings'
      ],
      selected: false
    },
    {
      id: 'communications-lead',
      role: 'Communications Lead',
      responsibilities: [
        'Manage internal and external communications',
        'Prepare incident notifications and updates',
        'Coordinate with PR and legal teams',
        'Handle media inquiries if applicable'
      ],
      selected: false
    },
    {
      id: 'legal-compliance',
      role: 'Legal & Compliance Officer',
      responsibilities: [
        'Assess legal and regulatory implications',
        'Ensure compliance with notification requirements',
        'Coordinate with law enforcement if needed',
        'Advise on legal matters'
      ],
      selected: false
    }
  ])

  const [escalationPaths, setEscalationPaths] = useState<EscalationPath[]>([
    { level: 1, title: 'Initial Detection', timeframe: 'Immediate', notifyWho: 'IT Help Desk / Security Team' },
    { level: 2, title: 'Incident Confirmation', timeframe: 'Within 15 minutes', notifyWho: 'Incident Response Manager' },
    { level: 3, title: 'Severity Assessment', timeframe: 'Within 30 minutes', notifyWho: 'CISO / IT Director' },
    { level: 4, title: 'Major Incident', timeframe: 'Within 1 hour', notifyWho: 'Executive Management / CEO' }
  ])

  const [communicationTemplates, setCommunicationTemplates] = useState<CommunicationTemplate[]>([
    { id: 'internal-alert', name: 'Internal Alert Template', purpose: 'Initial notification to internal teams', selected: false },
    { id: 'management-update', name: 'Management Update Template', purpose: 'Status updates to senior management', selected: false },
    { id: 'user-notification', name: 'User Notification Template', purpose: 'Communications to affected users', selected: false },
    { id: 'external-notification', name: 'External Notification Template', purpose: 'Notifications to external parties/regulators', selected: false }
  ])

  useEffect(() => {
    checkIntegrationStatus()
    loadExistingData()
  }, [])

  const checkIntegrationStatus = () => {
    const scope = localStorage.getItem('scopeData') !== null
    const soa = localStorage.getItem('statementOfApplicability') !== null
    const riskAssessment = localStorage.getItem('riskAssessment') !== null

    setIntegrationStatus({ scope, soa, riskAssessment })

    // Auto-select incident types based on risk assessment
    if (riskAssessment) {
      autoSelectFromRiskAssessment()
    }
  }

  const autoSelectFromRiskAssessment = () => {
    try {
      const savedRiskAssessment = localStorage.getItem('riskAssessment')
      if (savedRiskAssessment) {
        const riskData = JSON.parse(savedRiskAssessment)

        // Auto-select common incident types
        setIncidentTypes(prev => prev.map(type => ({
          ...type,
          selected: type.severity === 'critical' || type.severity === 'high'
        })))

        // Auto-select all response roles
        setResponseRoles(prev => prev.map(role => ({
          ...role,
          selected: true
        })))

        // Auto-select all communication templates
        setCommunicationTemplates(prev => prev.map(template => ({
          ...template,
          selected: true
        })))
      }
    } catch (error) {
      console.error('Error loading risk assessment data:', error)
    }
  }

  const loadExistingData = () => {
    const saved = localStorage.getItem('incidentResponseProcedure')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.incidentTypes) setIncidentTypes(data.incidentTypes)
        if (data.responseRoles) setResponseRoles(data.responseRoles)
        if (data.communicationTemplates) setCommunicationTemplates(data.communicationTemplates)
      } catch (error) {
        console.error('Error loading incident response data:', error)
      }
    }
  }

  const saveData = () => {
    const data = {
      incidentTypes,
      responseRoles,
      communicationTemplates
    }
    localStorage.setItem('incidentResponseProcedure', JSON.stringify(data))
  }

  const handleIncidentTypeToggle = (id: string) => {
    setIncidentTypes(prev => prev.map(type =>
      type.id === id ? { ...type, selected: !type.selected } : type
    ))
    saveData()
  }

  const handleRoleToggle = (id: string) => {
    setResponseRoles(prev => prev.map(role =>
      role.id === id ? { ...role, selected: !role.selected } : role
    ))
    saveData()
  }

  const handleTemplateToggle = (id: string) => {
    setCommunicationTemplates(prev => prev.map(template =>
      template.id === id ? { ...template, selected: !template.selected } : template
    ))
    saveData()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-50 border-red-200'
      case 'high': return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-700 bg-green-50 border-green-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const generateProcedureDocument = async () => {
    const selectedTypes = incidentTypes.filter(t => t.selected)
    const selectedRoles = responseRoles.filter(r => r.selected)
    const selectedTemplates = communicationTemplates.filter(t => t.selected)

    const sections: (Paragraph | Table)[] = []

    // Title
    sections.push(
      new Paragraph({
        text: 'INCIDENT RESPONSE PROCEDURE',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    )

    // Document Control Table
    const documentControlTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
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
              children: [new Paragraph({ text: 'IRP-001' })],
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
              children: [new Paragraph({ text: new Date().toLocaleDateString() })],
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
              children: [new Paragraph({ text: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString() })],
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
              children: [new Paragraph({ text: 'Chief Information Security Officer' })],
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
              children: [new Paragraph({ text: 'Chief Executive Officer' })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        })
      ]
    })

    sections.push(
      new Paragraph({
        text: 'Document Control',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 200 }
      }),
      documentControlTable,
      new Paragraph({ text: '', spacing: { after: 300 } })
    )

    // 1. PURPOSE
    sections.push(
      new Paragraph({
        text: '1. PURPOSE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: `This Incident Response Procedure establishes a structured approach to detecting, responding to, and recovering from information security incidents at ${scopeData?.organizationName || 'the organization'}. The procedure ensures timely and effective incident management to minimize business impact and comply with ISO 27001:2022 Control A.5.26 requirements.`,
        spacing: { after: 200 }
      })
    )

    // 2. SCOPE
    sections.push(
      new Paragraph({
        text: '2. SCOPE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This procedure applies to:',
        spacing: { after: 100 }
      }),
      new Paragraph({ text: 'All information security incidents affecting organizational assets', bullet: { level: 0 } }),
      new Paragraph({ text: 'All employees, contractors, and third parties', bullet: { level: 0 } }),
      new Paragraph({ text: 'All systems, networks, applications, and data within the ISMS scope', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // 3. DEFINITIONS
    sections.push(
      new Paragraph({
        text: '3. DEFINITIONS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Security Incident: ', bold: true }),
          new TextRun('Any event that compromises or threatens the confidentiality, integrity, or availability of information assets.')
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Security Event: ', bold: true }),
          new TextRun('Any observable occurrence in a system or network that may or may not be a security incident.')
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Incident Response Team (IRT): ', bold: true }),
          new TextRun('Designated personnel responsible for managing security incidents.')
        ],
        spacing: { after: 200 }
      })
    )

    // 4. INCIDENT TYPES
    sections.push(
      new Paragraph({
        text: '4. INCIDENT TYPES AND CLASSIFICATION',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'The following incident types have been identified as relevant to the organization:',
        spacing: { after: 100 }
      })
    )

    selectedTypes.forEach(type => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${type.name} `, bold: true }),
            new TextRun({ text: `[${type.severity.toUpperCase()}]`, bold: true, color: type.severity === 'critical' ? 'FF0000' : type.severity === 'high' ? 'FF6600' : '000000' }),
            new TextRun({ text: `: ${type.description}` })
          ],
          bullet: { level: 0 },
          spacing: { after: 50 }
        })
      )
    })

    sections.push(new Paragraph({ text: '', spacing: { after: 200 } }))

    // 5. INCIDENT RESPONSE PHASES
    sections.push(
      new Paragraph({
        text: '5. INCIDENT RESPONSE PHASES',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: '5.1 Detection and Reporting',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Monitor security events through automated tools, user reports, and security monitoring', bullet: { level: 0 } }),
      new Paragraph({ text: 'Report suspected incidents immediately to the IT Help Desk or Security Team', bullet: { level: 0 } }),
      new Paragraph({ text: 'Document initial observations, date/time, and affected systems', bullet: { level: 0 }, spacing: { after: 200 } }),
      new Paragraph({
        text: '5.2 Triage and Analysis',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Validate whether the event constitutes a security incident', bullet: { level: 0 } }),
      new Paragraph({ text: 'Classify incident type and assess severity', bullet: { level: 0 } }),
      new Paragraph({ text: 'Identify affected systems, data, and business processes', bullet: { level: 0 } }),
      new Paragraph({ text: 'Determine scope and potential impact', bullet: { level: 0 }, spacing: { after: 200 } }),
      new Paragraph({
        text: '5.3 Containment',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Implement immediate containment measures to prevent incident spread', bullet: { level: 0 } }),
      new Paragraph({ text: 'Isolate affected systems while preserving evidence', bullet: { level: 0 } }),
      new Paragraph({ text: 'Block malicious traffic, accounts, or access points', bullet: { level: 0 } }),
      new Paragraph({ text: 'Document all containment actions taken', bullet: { level: 0 }, spacing: { after: 200 } }),
      new Paragraph({
        text: '5.4 Eradication',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Remove malware, unauthorized access, or other threats', bullet: { level: 0 } }),
      new Paragraph({ text: 'Patch vulnerabilities that were exploited', bullet: { level: 0 } }),
      new Paragraph({ text: 'Reset compromised credentials and strengthen authentication', bullet: { level: 0 } }),
      new Paragraph({ text: 'Verify complete removal of threats', bullet: { level: 0 }, spacing: { after: 200 } }),
      new Paragraph({
        text: '5.5 Recovery',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Restore systems and services to normal operations', bullet: { level: 0 } }),
      new Paragraph({ text: 'Verify system integrity and functionality', bullet: { level: 0 } }),
      new Paragraph({ text: 'Monitor for signs of recurring incidents', bullet: { level: 0 } }),
      new Paragraph({ text: 'Gradually return to full operational status', bullet: { level: 0 }, spacing: { after: 200 } }),
      new Paragraph({
        text: '5.6 Post-Incident Review',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Conduct lessons-learned session within 5 business days', bullet: { level: 0 } }),
      new Paragraph({ text: 'Document root cause analysis and timeline', bullet: { level: 0 } }),
      new Paragraph({ text: 'Identify process improvements and preventive measures', bullet: { level: 0 } }),
      new Paragraph({ text: 'Update incident response procedures as needed', bullet: { level: 0 } }),
      new Paragraph({ text: 'Archive incident documentation for future reference', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // 6. ROLES AND RESPONSIBILITIES
    sections.push(
      new Paragraph({
        text: '6. ROLES AND RESPONSIBILITIES',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    )

    selectedRoles.forEach(role => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: role.role, bold: true, underline: { type: UnderlineType.SINGLE } })],
          spacing: { before: 100, after: 100 }
        })
      )
      role.responsibilities.forEach(resp => {
        sections.push(
          new Paragraph({
            text: resp,
            bullet: { level: 0 }
          })
        )
      })
      sections.push(new Paragraph({ text: '', spacing: { after: 100 } }))
    })

    // 7. ESCALATION PROCEDURES
    sections.push(
      new Paragraph({
        text: '7. ESCALATION PROCEDURES',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    )

    escalationPaths.forEach((path, index) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Level ${path.level}: ${path.title}`, bold: true }),
            new TextRun({ text: ` - Timeframe: ${path.timeframe}` }),
            new TextRun({ text: ` - Notify: ${path.notifyWho}` })
          ],
          bullet: { level: 0 },
          spacing: { after: 50 }
        })
      )
    })

    sections.push(new Paragraph({ text: '', spacing: { after: 200 } }))

    // 8. COMMUNICATION TEMPLATES
    if (selectedTemplates.length > 0) {
      sections.push(
        new Paragraph({
          text: '8. COMMUNICATION TEMPLATES',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          text: 'The following communication templates are available for incident response:',
          spacing: { after: 100 }
        })
      )

      selectedTemplates.forEach(template => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${template.name}: `, bold: true }),
              new TextRun(template.purpose)
            ],
            bullet: { level: 0 },
            spacing: { after: 50 }
          })
        )
      })

      sections.push(new Paragraph({ text: '', spacing: { after: 200 } }))
    }

    // 9. DOCUMENTATION AND EVIDENCE
    sections.push(
      new Paragraph({
        text: '9. DOCUMENTATION AND EVIDENCE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({ text: 'Maintain detailed incident logs including dates, times, actions taken, and personnel involved', bullet: { level: 0 } }),
      new Paragraph({ text: 'Preserve evidence using forensically sound methods', bullet: { level: 0 } }),
      new Paragraph({ text: 'Document chain of custody for all evidence', bullet: { level: 0 } }),
      new Paragraph({ text: 'Store incident records securely for minimum of 3 years', bullet: { level: 0 } }),
      new Paragraph({ text: 'Ensure documentation complies with legal and regulatory requirements', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // 10. TRAINING AND AWARENESS
    sections.push(
      new Paragraph({
        text: '10. TRAINING AND AWARENESS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({ text: 'Provide incident response training to all IRT members annually', bullet: { level: 0 } }),
      new Paragraph({ text: 'Conduct tabletop exercises to test incident response capabilities', bullet: { level: 0 } }),
      new Paragraph({ text: 'Educate all staff on incident reporting procedures', bullet: { level: 0 } }),
      new Paragraph({ text: 'Review and update training materials based on lessons learned', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // 11. CONTINUOUS IMPROVEMENT
    sections.push(
      new Paragraph({
        text: '11. CONTINUOUS IMPROVEMENT',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({ text: 'Review this procedure annually or after major incidents', bullet: { level: 0 } }),
      new Paragraph({ text: 'Incorporate lessons learned into procedure updates', bullet: { level: 0 } }),
      new Paragraph({ text: 'Monitor industry best practices and emerging threats', bullet: { level: 0 } }),
      new Paragraph({ text: 'Align with organizational risk appetite and business objectives', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // Footer
    sections.push(
      new Paragraph({
        text: `Generated on ${new Date().toLocaleString()}`,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 }
      }),
      new Paragraph({
        text: 'Generated by ISMS Application - ISO 27001:2022 Compliance Platform',
        alignment: AlignmentType.CENTER,
        italics: true
      })
    )

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    })

    // Generate and download
    const blob = await Packer.toBlob(doc)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Incident_Response_Procedure_${new Date().toISOString().split('T')[0]}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const renderIntegrationStatus = () => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { key: 'scope', name: 'Scope Definition', icon: FileText },
          { key: 'soa', name: 'Statement of Applicability', icon: Shield },
          { key: 'riskAssessment', name: 'Risk Assessment', icon: AlertTriangle }
        ].map(({ key, name, icon: Icon }) => (
          <div
            key={key}
            className={`flex items-center gap-2 p-3 rounded-lg border ${
              integrationStatus[key as keyof typeof integrationStatus]
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${
              integrationStatus[key as keyof typeof integrationStatus]
                ? 'text-green-600'
                : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              integrationStatus[key as keyof typeof integrationStatus]
                ? 'text-green-800 font-medium'
                : 'text-gray-600'
            }`}>
              {name}
            </span>
            {integrationStatus[key as keyof typeof integrationStatus] && (
              <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Overview</h2>
        <p className="text-gray-600 mb-6">
          This Incident Response Procedure integrates with your previous ISMS steps to create a comprehensive procedure
          tailored to your organization's risk profile and security requirements.
        </p>
      </div>

      {renderIntegrationStatus()}

      {integrationStatus.riskAssessment && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Risk Assessment Integration Detected</h4>
              <p className="text-sm text-blue-800">
                Incident types have been automatically pre-selected based on your identified risks and threat landscape.
                You can modify these selections in the next step.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Incident Types</h2>
        <p className="text-gray-600 mb-6">
          Choose which types of security incidents should be covered by your Incident Response Procedure.
          Each incident type has been classified by severity.
        </p>
      </div>

      <div className="space-y-4">
        {incidentTypes.map((type) => (
          <div
            key={type.id}
            className={`border rounded-lg p-4 transition-all ${
              type.selected
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={type.selected}
                onChange={() => handleIncidentTypeToggle(type.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(type.severity)}`}>
                    {type.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Define Response Roles</h2>
        <p className="text-gray-600 mb-6">
          Select the roles that will be part of your Incident Response Team (IRT).
          Each role has specific responsibilities during incident management.
        </p>
      </div>

      <div className="space-y-4">
        {responseRoles.map((role) => (
          <div
            key={role.id}
            className={`border rounded-lg p-4 transition-all ${
              role.selected
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={role.selected}
                onChange={() => handleRoleToggle(role.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{role.role}</h3>
                <ul className="space-y-2">
                  {role.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Escalation & Communications</h2>
        <p className="text-gray-600 mb-6">
          Review escalation paths and select communication templates for incident management.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Escalation Path</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          {escalationPaths.map((path, index) => (
            <div key={path.level} className="flex items-center gap-4 mb-4 last:mb-0">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-bold">{path.level}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{path.title}</div>
                <div className="text-sm text-gray-600">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {path.timeframe} | <Users className="w-3 h-3 inline mr-1" />
                  {path.notifyWho}
                </div>
              </div>
              {index < escalationPaths.length - 1 && (
                <div className="flex-shrink-0">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication Templates</h3>
        <div className="space-y-3">
          {communicationTemplates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 transition-all ${
                template.selected
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={template.selected}
                  onChange={() => handleTemplateToggle(template.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.purpose}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review and Export</h2>
        <p className="text-gray-600 mb-6">
          Review your incident response configuration and export the final procedure document.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Procedure Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Incident Types</h4>
            <div className="text-2xl font-bold text-blue-600">
              {incidentTypes.filter(t => t.selected).length}
            </div>
            <p className="text-sm text-gray-600">Selected types</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Response Roles</h4>
            <div className="text-2xl font-bold text-blue-600">
              {responseRoles.filter(r => r.selected).length}
            </div>
            <p className="text-sm text-gray-600">Team members</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Escalation Levels</h4>
            <div className="text-2xl font-bold text-blue-600">
              {escalationPaths.length}
            </div>
            <p className="text-sm text-gray-600">Defined levels</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Important Notes</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Test incident response procedures through tabletop exercises</li>
                <li>• Ensure all IRT members receive training on their roles</li>
                <li>• Establish 24/7 contact information for incident reporting</li>
                <li>• Review and update procedure after each major incident</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateProcedureDocument}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export Procedure Document
        </button>
      </div>
    </div>
  )

  const steps = [
    { id: 1, title: 'Integration Overview', component: renderStep1 },
    { id: 2, title: 'Incident Types', component: renderStep2 },
    { id: 3, title: 'Response Roles', component: renderStep3 },
    { id: 4, title: 'Escalation & Communications', component: renderStep4 },
    { id: 5, title: 'Review & Export', component: renderStep5 }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Incident Response Procedure</h1>
        <p className="text-gray-600">
          Control A.5.26 - Create comprehensive procedures for managing information security incidents
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          {steps.map((step) => (
            <span key={step.id} className={`${currentStep === step.id ? 'font-medium text-blue-600' : ''} text-center`} style={{ width: '120px' }}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        {steps.find(step => step.id === currentStep)?.component()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
          disabled={currentStep === 5}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default IncidentResponseProcedure
