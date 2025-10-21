import React, { useState, useEffect } from 'react'
import { Code, CheckCircle, AlertCircle, Download, ChevronRight, ChevronLeft, Shield, GitBranch, Bug, Lock, FileText, BookOpen, Settings } from 'lucide-react'
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

interface SecureDevelopmentPolicyProps {
  scopeData: ScopeData | null
}

interface SDLCPhase {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  selected: boolean
  securityActivities: string[]
  deliverables: string[]
  responsibleRoles: string[]
  tools: string[]
  customNotes: string
}

interface SecurityPrinciple {
  id: string
  name: string
  description: string
  selected: boolean
  implementation: string
}

interface CodingStandard {
  id: string
  category: string
  standard: string
  rationale: string
  selected: boolean
}

const SecureDevelopmentPolicy: React.FC<SecureDevelopmentPolicyProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [integrationStatus, setIntegrationStatus] = useState({
    scopeDefinition: false,
    soa: false,
    riskAssessment: false
  })

  const [sdlcPhases, setSdlcPhases] = useState<SDLCPhase[]>([
    {
      id: 'phase-01',
      name: 'Requirements Analysis',
      description: 'Define security requirements and conduct threat modeling',
      icon: FileText,
      selected: true,
      securityActivities: [
        'Identify and document security requirements',
        'Conduct privacy impact assessment (PIA)',
        'Define security acceptance criteria',
        'Perform threat modeling and risk assessment',
        'Review regulatory and compliance requirements',
        'Define data classification requirements',
        'Establish security testing requirements'
      ],
      deliverables: [
        'Security Requirements Document',
        'Threat Model',
        'Privacy Impact Assessment',
        'Security Test Plan'
      ],
      responsibleRoles: ['Product Owner', 'Security Architect', 'Compliance Officer'],
      tools: ['Threat modeling tools', 'Requirements management system'],
      customNotes: ''
    },
    {
      id: 'phase-02',
      name: 'Design',
      description: 'Create secure architecture and design patterns',
      icon: GitBranch,
      selected: true,
      securityActivities: [
        'Apply security design principles (defense in depth, least privilege)',
        'Design authentication and authorization mechanisms',
        'Define encryption requirements for data at rest and in transit',
        'Design secure API interfaces',
        'Implement security patterns and frameworks',
        'Review and approve security architecture',
        'Document security design decisions',
        'Conduct design security review'
      ],
      deliverables: [
        'Security Architecture Document',
        'Data Flow Diagrams',
        'Security Design Review Report',
        'API Security Specifications'
      ],
      responsibleRoles: ['Security Architect', 'Lead Developer', 'System Architect'],
      tools: ['Architecture modeling tools', 'Design review checklists'],
      customNotes: ''
    },
    {
      id: 'phase-03',
      name: 'Development',
      description: 'Implement secure coding practices and conduct code reviews',
      icon: Code,
      selected: true,
      securityActivities: [
        'Follow secure coding standards and guidelines',
        'Implement input validation and output encoding',
        'Use parameterized queries to prevent SQL injection',
        'Implement proper error handling without information disclosure',
        'Use secure authentication libraries and frameworks',
        'Conduct peer code reviews with security focus',
        'Perform static application security testing (SAST)',
        'Manage secrets and credentials securely',
        'Document security-critical code sections'
      ],
      deliverables: [
        'Source Code',
        'Code Review Reports',
        'SAST Scan Results',
        'Unit Test Results'
      ],
      responsibleRoles: ['Developers', 'Code Reviewers', 'Security Champions'],
      tools: ['SAST tools', 'Code review platforms', 'Secret scanning tools', 'IDE security plugins'],
      customNotes: ''
    },
    {
      id: 'phase-04',
      name: 'Testing',
      description: 'Conduct comprehensive security testing',
      icon: Bug,
      selected: true,
      securityActivities: [
        'Execute security test cases from test plan',
        'Perform dynamic application security testing (DAST)',
        'Conduct penetration testing',
        'Test authentication and authorization controls',
        'Verify encryption implementation',
        'Test for OWASP Top 10 vulnerabilities',
        'Perform security regression testing',
        'Validate security configurations',
        'Review and remediate identified vulnerabilities'
      ],
      deliverables: [
        'Security Test Results',
        'DAST Scan Reports',
        'Penetration Test Report',
        'Vulnerability Remediation Plan'
      ],
      responsibleRoles: ['QA Engineers', 'Security Testers', 'Penetration Testers'],
      tools: ['DAST tools', 'Penetration testing tools', 'Security testing frameworks'],
      customNotes: ''
    },
    {
      id: 'phase-05',
      name: 'Deployment',
      description: 'Secure deployment and configuration management',
      icon: Settings,
      selected: true,
      securityActivities: [
        'Review deployment architecture for security',
        'Implement secure configuration baselines',
        'Enable security logging and monitoring',
        'Configure security controls (firewall, WAF, IDS/IPS)',
        'Verify encryption configurations',
        'Conduct pre-deployment security verification',
        'Document deployment security procedures',
        'Implement rollback procedures',
        'Enable automated security scanning in CI/CD'
      ],
      deliverables: [
        'Deployment Security Checklist',
        'Security Configuration Guide',
        'Deployment Verification Report',
        'Incident Response Runbook'
      ],
      responsibleRoles: ['DevOps Engineers', 'System Administrators', 'Security Operations'],
      tools: ['Configuration management tools', 'Infrastructure as Code', 'Container security scanners'],
      customNotes: ''
    },
    {
      id: 'phase-06',
      name: 'Operations & Maintenance',
      description: 'Monitor, maintain, and respond to security issues',
      icon: Lock,
      selected: true,
      securityActivities: [
        'Monitor security logs and alerts',
        'Apply security patches and updates',
        'Conduct periodic security assessments',
        'Perform vulnerability scanning',
        'Review and update security configurations',
        'Respond to security incidents',
        'Track and remediate security vulnerabilities',
        'Maintain security documentation',
        'Conduct security awareness training'
      ],
      deliverables: [
        'Security Monitoring Reports',
        'Patch Management Records',
        'Vulnerability Scan Reports',
        'Incident Response Reports'
      ],
      responsibleRoles: ['Operations Team', 'Security Operations Center', 'Incident Response Team'],
      tools: ['SIEM', 'Vulnerability scanners', 'Patch management systems', 'Monitoring tools'],
      customNotes: ''
    }
  ])

  const [securityPrinciples, setSecurityPrinciples] = useState<SecurityPrinciple[]>([
    {
      id: 'prin-01',
      name: 'Defense in Depth',
      description: 'Implement multiple layers of security controls',
      selected: true,
      implementation: 'Apply security at multiple layers: network, application, data, and endpoint levels'
    },
    {
      id: 'prin-02',
      name: 'Least Privilege',
      description: 'Grant minimum necessary access rights',
      selected: true,
      implementation: 'Users and processes should have only the minimum access required to perform their functions'
    },
    {
      id: 'prin-03',
      name: 'Fail Securely',
      description: 'Systems should fail to a secure state',
      selected: true,
      implementation: 'In case of errors or failures, default to denying access and avoid exposing sensitive information'
    },
    {
      id: 'prin-04',
      name: 'Secure by Default',
      description: 'Default configurations should be secure',
      selected: true,
      implementation: 'Security features should be enabled by default; users must explicitly disable security if needed'
    },
    {
      id: 'prin-05',
      name: 'Complete Mediation',
      description: 'Check every access to every object',
      selected: true,
      implementation: 'Validate all access attempts; do not rely on cached permissions or bypass checks'
    },
    {
      id: 'prin-06',
      name: 'Separation of Duties',
      description: 'Divide critical functions among multiple parties',
      selected: true,
      implementation: 'No single person should have complete control over critical transactions or processes'
    },
    {
      id: 'prin-07',
      name: 'Open Design',
      description: 'Security should not depend on secrecy of design',
      selected: true,
      implementation: 'Use well-tested cryptographic algorithms and security mechanisms; security through obscurity is not sufficient'
    },
    {
      id: 'prin-08',
      name: 'Keep Security Simple',
      description: 'Simplicity in design improves security',
      selected: true,
      implementation: 'Complex security mechanisms are more likely to contain flaws; prefer simple, well-understood solutions'
    }
  ])

  const [codingStandards, setCodingStandards] = useState<CodingStandard[]>([
    {
      id: 'std-01',
      category: 'Input Validation',
      standard: 'Validate all input data from external sources',
      rationale: 'Prevents injection attacks, XSS, and malicious input processing',
      selected: true
    },
    {
      id: 'std-02',
      category: 'Input Validation',
      standard: 'Use allowlists for input validation over denylists',
      rationale: 'Allowlists are more secure as they only permit known-good input',
      selected: true
    },
    {
      id: 'std-03',
      category: 'Authentication',
      standard: 'Never store passwords in plaintext; use bcrypt, scrypt, or Argon2',
      rationale: 'Protects passwords even if database is compromised',
      selected: true
    },
    {
      id: 'std-04',
      category: 'Authentication',
      standard: 'Implement multi-factor authentication for privileged accounts',
      rationale: 'Reduces risk of account compromise from stolen credentials',
      selected: true
    },
    {
      id: 'std-05',
      category: 'Session Management',
      standard: 'Generate cryptographically random session identifiers',
      rationale: 'Prevents session prediction and hijacking attacks',
      selected: true
    },
    {
      id: 'std-06',
      category: 'Session Management',
      standard: 'Set secure and HttpOnly flags on session cookies',
      rationale: 'Prevents cookie theft via XSS and transmission over insecure channels',
      selected: true
    },
    {
      id: 'std-07',
      category: 'Cryptography',
      standard: 'Use TLS 1.2 or higher for all data in transit',
      rationale: 'Protects data confidentiality and integrity during transmission',
      selected: true
    },
    {
      id: 'std-08',
      category: 'Cryptography',
      standard: 'Use AES-256 for encrypting sensitive data at rest',
      rationale: 'Provides strong protection for stored sensitive data',
      selected: true
    },
    {
      id: 'std-09',
      category: 'Error Handling',
      standard: 'Do not expose sensitive information in error messages',
      rationale: 'Prevents information disclosure that could aid attackers',
      selected: true
    },
    {
      id: 'std-10',
      category: 'Error Handling',
      standard: 'Log security-relevant events with sufficient detail',
      rationale: 'Enables security monitoring and incident investigation',
      selected: true
    },
    {
      id: 'std-11',
      category: 'Access Control',
      standard: 'Implement authorization checks on server-side',
      rationale: 'Client-side checks can be bypassed; server validation is essential',
      selected: true
    },
    {
      id: 'std-12',
      category: 'Access Control',
      standard: 'Default deny all access; explicitly grant permissions',
      rationale: 'Reduces risk of unintended access or privilege escalation',
      selected: true
    },
    {
      id: 'std-13',
      category: 'Database Security',
      standard: 'Use parameterized queries or prepared statements',
      rationale: 'Prevents SQL injection attacks',
      selected: true
    },
    {
      id: 'std-14',
      category: 'Database Security',
      standard: 'Apply principle of least privilege to database accounts',
      rationale: 'Limits damage from compromised database credentials',
      selected: true
    },
    {
      id: 'std-15',
      category: 'Dependencies',
      standard: 'Maintain inventory of third-party components',
      rationale: 'Enables tracking of vulnerabilities in dependencies',
      selected: true
    },
    {
      id: 'std-16',
      category: 'Dependencies',
      standard: 'Regularly update dependencies and scan for vulnerabilities',
      rationale: 'Reduces exposure to known vulnerabilities in libraries',
      selected: true
    }
  ])

  const [developmentEnvironment, setDevelopmentEnvironment] = useState({
    separateEnvironments: true,
    productionAccessControl: true,
    secureCodeRepository: true,
    automatedTesting: true,
    continuousIntegration: true,
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
      riskAssessment: !!localStorage.getItem('riskAssessment')
    }
    setIntegrationStatus(status)
  }

  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('secureDevelopmentPolicy')
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.sdlcPhases) {
          const restoredPhases = data.sdlcPhases.map((savedPhase: any) => {
            const originalPhase = sdlcPhases.find(p => p.id === savedPhase.id)
            return {
              ...savedPhase,
              icon: originalPhase?.icon || FileText
            }
          })
          setSdlcPhases(restoredPhases)
        }
        if (data.securityPrinciples) setSecurityPrinciples(data.securityPrinciples)
        if (data.codingStandards) setCodingStandards(data.codingStandards)
        if (data.developmentEnvironment) setDevelopmentEnvironment(data.developmentEnvironment)
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }

  const saveData = () => {
    try {
      const dataToSave = {
        sdlcPhases: sdlcPhases.map(phase => ({ ...phase, icon: undefined })),
        securityPrinciples,
        codingStandards,
        developmentEnvironment,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('secureDevelopmentPolicy', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  const autoSelectFromPreviousSteps = () => {
    // All phases and principles are selected by default as they are fundamental to secure development
    // This function can be extended to check SOA for specific development-related controls
    try {
      const savedSOA = localStorage.getItem('statementOfApplicability')
      if (savedSOA) {
        const soaData = JSON.parse(savedSOA)
        // Control A.8.27 covers secure system engineering principles
        const hasSecureDevControl = soaData.controls?.some((c: any) => c.id === 'A.8.27' && c.applicable)

        if (hasSecureDevControl) {
          // Ensure all phases and principles are selected
          setSdlcPhases(prev => prev.map(phase => ({ ...phase, selected: true })))
          setSecurityPrinciples(prev => prev.map(prin => ({ ...prin, selected: true })))
          setCodingStandards(prev => prev.map(std => ({ ...std, selected: true })))
        }
      }
    } catch (error) {
      console.error('Error auto-selecting:', error)
    }
  }

  const togglePhase = (id: string) => {
    setSdlcPhases(prev => prev.map(phase =>
      phase.id === id ? { ...phase, selected: !phase.selected } : phase
    ))
  }

  const updatePhaseNotes = (id: string, notes: string) => {
    setSdlcPhases(prev => prev.map(phase =>
      phase.id === id ? { ...phase, customNotes: notes } : phase
    ))
  }

  const togglePrinciple = (id: string) => {
    setSecurityPrinciples(prev => prev.map(prin =>
      prin.id === id ? { ...prin, selected: !prin.selected } : prin
    ))
  }

  const toggleStandard = (id: string) => {
    setCodingStandards(prev => prev.map(std =>
      std.id === id ? { ...std, selected: !std.selected } : std
    ))
  }

  const generateDocument = async () => {
    const organizationName = scopeData?.organizationName || '[Organization Name]'
    const selectedPhases = sdlcPhases.filter(p => p.selected)
    const selectedPrinciples = securityPrinciples.filter(p => p.selected)
    const selectedStandards = codingStandards.filter(s => s.selected)

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
              children: [new Paragraph({ text: 'SDP-001' })],
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
              children: [new Paragraph({ text: 'Chief Technology Officer' })],
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
        text: 'Secure System Engineering Principles',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Secure Development Policy',
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

    // 1. Introduction
    documentChildren.push(
      new Paragraph({
        text: '1. Introduction',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Purpose: ', bold: true }),
          new TextRun({ text: 'This policy establishes secure system engineering principles and secure development practices for ' + organizationName + '. It defines security requirements throughout the Software Development Lifecycle (SDLC) in accordance with ISO 27001:2022 Control A.8.27.' })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Scope: ', bold: true }),
          new TextRun({ text: 'This policy applies to all software development activities, including applications developed internally, by contractors, or through third parties.' })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Objectives: ', bold: true })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Ensure security is integrated throughout the SDLC',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Reduce security vulnerabilities in applications',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Establish secure coding standards and practices',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Define security testing requirements',
        bullet: { level: 0 },
        spacing: { after: 200 }
      })
    )

    // 2. Security Principles
    documentChildren.push(
      new Paragraph({
        text: '2. Security Design Principles',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'All system design and development must adhere to the following security principles:',
        spacing: { after: 200 }
      })
    )

    selectedPrinciples.forEach((principle, idx) => {
      documentChildren.push(
        new Paragraph({
          text: `2.${idx + 1} ${principle.name}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 150, after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Description: ', bold: true }),
            new TextRun({ text: principle.description })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Implementation: ', bold: true }),
            new TextRun({ text: principle.implementation })
          ],
          spacing: { after: 200 }
        })
      )
    })

    // 3. Secure SDLC
    documentChildren.push(
      new Paragraph({
        text: '3. Secure Software Development Lifecycle',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'Security must be integrated into every phase of the software development lifecycle:',
        spacing: { after: 200 }
      })
    )

    selectedPhases.forEach((phase, idx) => {
      documentChildren.push(
        new Paragraph({
          text: `3.${idx + 1} ${phase.name}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Description: ', bold: true }),
            new TextRun({ text: phase.description })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: 'Security Activities:',
          bold: true,
          spacing: { before: 100, after: 50 }
        })
      )

      phase.securityActivities.forEach(activity => {
        documentChildren.push(
          new Paragraph({
            text: activity,
            bullet: { level: 0 },
            spacing: { after: 50 }
          })
        )
      })

      documentChildren.push(
        new Paragraph({
          text: 'Deliverables:',
          bold: true,
          spacing: { before: 100, after: 50 }
        })
      )

      phase.deliverables.forEach(deliverable => {
        documentChildren.push(
          new Paragraph({
            text: deliverable,
            bullet: { level: 0 },
            spacing: { after: 50 }
          })
        )
      })

      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Responsible Roles: ', bold: true }),
            new TextRun({ text: phase.responsibleRoles.join(', ') })
          ],
          spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Tools: ', bold: true }),
            new TextRun({ text: phase.tools.join(', ') })
          ],
          spacing: { after: 100 }
        })
      )

      if (phase.customNotes) {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Additional Notes: ', bold: true }),
              new TextRun({ text: phase.customNotes })
            ],
            spacing: { after: 200 }
          })
        )
      } else {
        documentChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }))
      }
    })

    // 4. Secure Coding Standards
    documentChildren.push(
      new Paragraph({
        text: '4. Secure Coding Standards',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'All developers must follow these secure coding standards:',
        spacing: { after: 200 }
      })
    )

    // Group standards by category
    const standardsByCategory = selectedStandards.reduce((acc, std) => {
      if (!acc[std.category]) acc[std.category] = []
      acc[std.category].push(std)
      return acc
    }, {} as Record<string, CodingStandard[]>)

    let stdNumber = 1
    Object.entries(standardsByCategory).forEach(([category, standards]) => {
      documentChildren.push(
        new Paragraph({
          text: `4.${stdNumber} ${category}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      )

      standards.forEach(standard => {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Standard: ', bold: true }),
              new TextRun({ text: standard.standard })
            ],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rationale: ', bold: true, italics: true }),
              new TextRun({ text: standard.rationale, italics: true })
            ],
            spacing: { after: 150 }
          })
        )
      })

      stdNumber++
    })

    // 5. Development Environment
    documentChildren.push(
      new Paragraph({
        text: '5. Development Environment Security',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'The following security controls must be implemented in the development environment:',
        spacing: { after: 100 }
      })
    )

    if (developmentEnvironment.separateEnvironments) {
      documentChildren.push(
        new Paragraph({
          text: '• Maintain separate development, testing, and production environments',
          bullet: { level: 0 },
          spacing: { after: 100 }
        })
      )
    }

    if (developmentEnvironment.productionAccessControl) {
      documentChildren.push(
        new Paragraph({
          text: '• Restrict and monitor access to production environments',
          bullet: { level: 0 },
          spacing: { after: 100 }
        })
      )
    }

    if (developmentEnvironment.secureCodeRepository) {
      documentChildren.push(
        new Paragraph({
          text: '• Use secure code repositories with access controls and audit logging',
          bullet: { level: 0 },
          spacing: { after: 100 }
        })
      )
    }

    if (developmentEnvironment.automatedTesting) {
      documentChildren.push(
        new Paragraph({
          text: '• Implement automated security testing in the build pipeline',
          bullet: { level: 0 },
          spacing: { after: 100 }
        })
      )
    }

    if (developmentEnvironment.continuousIntegration) {
      documentChildren.push(
        new Paragraph({
          text: '• Use CI/CD pipelines with integrated security checks',
          bullet: { level: 0 },
          spacing: { after: 200 }
        })
      )
    }

    if (developmentEnvironment.notes) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Additional Requirements: ', bold: true }),
            new TextRun({ text: developmentEnvironment.notes })
          ],
          spacing: { after: 200 }
        })
      )
    }

    // 6. Third-Party Components
    documentChildren.push(
      new Paragraph({
        text: '6. Third-Party Component Security',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: '• Maintain an inventory of all third-party libraries and components',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Regularly scan dependencies for known vulnerabilities',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Keep dependencies updated to latest secure versions',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Review licenses for compliance with organizational policies',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Evaluate security posture of third-party components before adoption',
        bullet: { level: 0 },
        spacing: { after: 200 }
      })
    )

    // 7. Roles and Responsibilities
    documentChildren.push(
      new Paragraph({
        text: '7. Roles and Responsibilities',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Development Team: ', bold: true }),
          new TextRun({ text: 'Follow secure coding standards, conduct peer reviews, participate in security training.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Security Champions: ', bold: true }),
          new TextRun({ text: 'Provide security guidance to development teams, review security designs, promote security awareness.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Security Team: ', bold: true }),
          new TextRun({ text: 'Define security requirements, conduct security testing, review security findings, provide training.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'QA Team: ', bold: true }),
          new TextRun({ text: 'Execute security test cases, verify vulnerability remediation, validate security controls.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Product Owners: ', bold: true }),
          new TextRun({ text: 'Prioritize security requirements, allocate resources for security activities, approve security exceptions.' })
        ],
        spacing: { after: 200 }
      })
    )

    // 8. Compliance
    documentChildren.push(
      new Paragraph({
        text: '8. Compliance and Review',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This policy shall be reviewed and updated:',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Annually as part of the ISMS review process',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When significant changes occur to development processes',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Following security incidents related to application vulnerabilities',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When new security threats or attack vectors are identified',
        bullet: { level: 0 },
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Compliance with this policy is mandatory for all development activities. Violations shall be reported to management and may result in disciplinary action.',
        spacing: { after: 200 }
      })
    )

    // 9. References
    documentChildren.push(
      new Paragraph({
        text: '9. References',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: '• ISO 27001:2022 Control A.8.27 - Secure system engineering principles',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• OWASP Top 10 Web Application Security Risks',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• OWASP Secure Coding Practices Quick Reference Guide',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• NIST SP 800-64 - Security Considerations in the System Development Life Cycle',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Information Security Policy',
        bullet: { level: 0 },
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
    link.download = `Secure_Development_Policy_${organizationName.replace(/\s+/g, '_')}.docx`
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
        Auto-Select Based on SOA Controls
      </button>
    </div>
  )

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Overview</h2>
      <p className="text-gray-600 mb-6">
        This module helps you create a comprehensive secure development policy establishing security principles
        throughout the Software Development Lifecycle. This fulfills ISO 27001:2022 Control A.8.27 - Secure system engineering principles.
      </p>

      {renderIntegrationStatus()}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          About This Module
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Purpose:</strong> Establish security requirements and practices for secure system development,
            ensuring security is integrated throughout the entire SDLC.
          </p>
          <p>
            <strong>What you'll cover:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Security design principles (Defense in Depth, Least Privilege, etc.)</li>
            <li>Secure SDLC phases with security activities</li>
            <li>Secure coding standards and best practices</li>
            <li>Development environment security requirements</li>
            <li>Third-party component security</li>
          </ul>
          <p>
            <strong>Scope:</strong> Applies to all software development activities, including internal development,
            contractors, and third-party development.
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Design Principles</h2>
      <p className="text-gray-600 mb-6">
        Select the security design principles that will guide your development practices. These principles
        form the foundation of secure system design.
      </p>

      <div className="space-y-3">
        {securityPrinciples.map(principle => (
          <div
            key={principle.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              principle.selected
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => togglePrinciple(principle.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  principle.selected
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                }`}>
                  {principle.selected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{principle.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{principle.description}</p>
                <p className="text-xs text-gray-500 italic">
                  <strong>Implementation:</strong> {principle.implementation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure SDLC Phases</h2>
      <p className="text-gray-600 mb-6">
        Review the secure SDLC phases and customize security activities for your development process.
        Each phase includes specific security activities, deliverables, and responsibilities.
      </p>

      <div className="space-y-4">
        {sdlcPhases.map(phase => {
          const PhaseIcon = phase.icon
          return (
            <div key={phase.id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                  phase.selected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <PhaseIcon className={`w-5 h-5 ${phase.selected ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={phase.selected}
                        onChange={() => togglePhase(phase.id)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Include</span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{phase.description}</p>

                  {phase.selected && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                          Security Activities ({phase.securityActivities.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {phase.securityActivities.slice(0, 3).map((activity, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {activity.substring(0, 30)}...
                            </span>
                          ))}
                          {phase.securityActivities.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{phase.securityActivities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Organization-Specific Notes (Optional)
                        </label>
                        <textarea
                          value={phase.customNotes}
                          onChange={(e) => updatePhaseNotes(phase.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Add any additional requirements or customizations..."
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderStep4 = () => {
    const standardsByCategory = codingStandards.reduce((acc, std) => {
      if (!acc[std.category]) acc[std.category] = []
      acc[std.category].push(std)
      return acc
    }, {} as Record<string, CodingStandard[]>)

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure Coding Standards</h2>
        <p className="text-gray-600 mb-6">
          Select the secure coding standards that developers must follow. These standards help prevent
          common security vulnerabilities.
        </p>

        <div className="space-y-6">
          {Object.entries(standardsByCategory).map(([category, standards]) => (
            <div key={category} className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
              <div className="space-y-3">
                {standards.map(standard => (
                  <div
                    key={standard.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      standard.selected
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleStandard(standard.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          standard.selected
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {standard.selected && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <div className="ml-2 flex-1">
                        <p className="text-sm font-medium text-gray-900">{standard.standard}</p>
                        <p className="text-xs text-gray-600 italic mt-1">{standard.rationale}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Development Environment */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Environment Security</h3>
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={developmentEnvironment.separateEnvironments}
                onChange={(e) => setDevelopmentEnvironment({ ...developmentEnvironment, separateEnvironments: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <span className="ml-3 text-sm text-gray-700">
                Maintain separate development, testing, and production environments
              </span>
            </label>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={developmentEnvironment.productionAccessControl}
                onChange={(e) => setDevelopmentEnvironment({ ...developmentEnvironment, productionAccessControl: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <span className="ml-3 text-sm text-gray-700">
                Restrict and monitor access to production environments
              </span>
            </label>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={developmentEnvironment.secureCodeRepository}
                onChange={(e) => setDevelopmentEnvironment({ ...developmentEnvironment, secureCodeRepository: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <span className="ml-3 text-sm text-gray-700">
                Use secure code repositories with access controls and audit logging
              </span>
            </label>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={developmentEnvironment.automatedTesting}
                onChange={(e) => setDevelopmentEnvironment({ ...developmentEnvironment, automatedTesting: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <span className="ml-3 text-sm text-gray-700">
                Implement automated security testing in the build pipeline
              </span>
            </label>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={developmentEnvironment.continuousIntegration}
                onChange={(e) => setDevelopmentEnvironment({ ...developmentEnvironment, continuousIntegration: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <span className="ml-3 text-sm text-gray-700">
                Use CI/CD pipelines with integrated security checks
              </span>
            </label>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Environment Requirements (Optional)
              </label>
              <textarea
                value={developmentEnvironment.notes}
                onChange={(e) => setDevelopmentEnvironment({ ...developmentEnvironment, notes: e.target.value })}
                placeholder="Any additional security requirements for your development environment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStep5 = () => {
    const selectedPhases = sdlcPhases.filter(p => p.selected)
    const selectedPrinciples = securityPrinciples.filter(p => p.selected)
    const selectedStandards = codingStandards.filter(s => s.selected)
    const totalActivities = selectedPhases.reduce((sum, p) => sum + p.securityActivities.length, 0)

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Export</h2>
        <p className="text-gray-600 mb-6">
          Review your secure development policy and export professional documentation for your development teams.
        </p>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{selectedPrinciples.length}</div>
            <div className="text-sm text-blue-700 mt-1">Security Principles</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{selectedPhases.length}</div>
            <div className="text-sm text-green-700 mt-1">SDLC Phases</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">{totalActivities}</div>
            <div className="text-sm text-purple-700 mt-1">Security Activities</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-900">{selectedStandards.length}</div>
            <div className="text-sm text-orange-700 mt-1">Coding Standards</div>
          </div>
        </div>

        {/* Summary Sections */}
        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Principles</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPrinciples.map(prin => (
                <span key={prin.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {prin.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">SDLC Phases</h3>
            <div className="space-y-2">
              {selectedPhases.map(phase => (
                <div key={phase.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="font-medium text-gray-900">{phase.name}</span>
                  <span className="text-gray-600">{phase.securityActivities.length} activities</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Development Environment</h3>
            <div className="space-y-1 text-sm">
              {developmentEnvironment.separateEnvironments && (
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Separate environments
                </div>
              )}
              {developmentEnvironment.productionAccessControl && (
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Production access controls
                </div>
              )}
              {developmentEnvironment.secureCodeRepository && (
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Secure code repository
                </div>
              )}
              {developmentEnvironment.automatedTesting && (
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Automated security testing
                </div>
              )}
              {developmentEnvironment.continuousIntegration && (
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  CI/CD with security checks
                </div>
              )}
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
                Export Secure Development Policy
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a comprehensive Word document containing your secure development policy with security
                principles, SDLC phases, coding standards, and development environment requirements.
              </p>
              <button
                onClick={generateDocument}
                disabled={selectedPhases.length === 0}
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
    { number: 2, title: 'Design Principles', render: renderStep2 },
    { number: 3, title: 'SDLC Phases', render: renderStep3 },
    { number: 4, title: 'Coding Standards', render: renderStep4 },
    { number: 5, title: 'Review & Export', render: renderStep5 }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Code className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Secure System Engineering</h1>
            <p className="text-gray-600 mt-1">ISO 27001:2022 Control A.8.27 - Secure Development Policy</p>
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

export default SecureDevelopmentPolicy
