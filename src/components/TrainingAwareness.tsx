import React, { useState, useEffect } from 'react'
import { Users, CheckCircle, AlertCircle, Download, ChevronRight, ChevronLeft, BookOpen, GraduationCap, Bell, Award, FileText, Target } from 'lucide-react'
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

interface TrainingAwarenessProps {
  scopeData: ScopeData | null
}

interface TrainingProgram {
  id: string
  name: string
  description: string
  targetAudience: string
  duration: string
  frequency: string
  deliveryMethod: string
  learningObjectives: string[]
  topics: string[]
  selected: boolean
  mandatory: boolean
  customNotes: string
}

interface AwarenessCampaign {
  id: string
  name: string
  description: string
  targetAudience: string
  duration: string
  channels: string[]
  topics: string[]
  selected: boolean
  customNotes: string
}

interface CompetenceRequirement {
  id: string
  role: string
  securityResponsibilities: string[]
  requiredTraining: string[]
  competenceLevel: string
  selected: boolean
}

const TrainingAwareness: React.FC<TrainingAwarenessProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [integrationStatus, setIntegrationStatus] = useState({
    scopeDefinition: false,
    soa: false,
    riskAssessment: false
  })

  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([
    {
      id: 'TRN-001',
      name: 'Information Security Awareness - General Staff',
      description: 'Foundational security awareness training for all employees',
      targetAudience: 'All employees, contractors, and temporary staff',
      duration: '60 minutes',
      frequency: 'Annual (at onboarding and yearly refresh)',
      deliveryMethod: 'Online e-learning with knowledge assessment',
      learningObjectives: [
        'Understand information security policies and responsibilities',
        'Recognize common security threats (phishing, social engineering)',
        'Apply secure password practices and authentication',
        'Identify and report security incidents',
        'Handle sensitive information appropriately'
      ],
      topics: [
        'Introduction to Information Security',
        'Security Policies and Procedures',
        'Password Security and MFA',
        'Phishing and Social Engineering',
        'Data Classification and Handling',
        'Physical Security Awareness',
        'Mobile Device Security',
        'Incident Reporting Procedures',
        'Acceptable Use of IT Assets',
        'Privacy and Data Protection'
      ],
      selected: true,
      mandatory: true,
      customNotes: ''
    },
    {
      id: 'TRN-002',
      name: 'Secure Coding Training',
      description: 'Security training for software developers and engineers',
      targetAudience: 'Developers, software engineers, DevOps engineers',
      duration: '4 hours',
      frequency: 'Annual with quarterly updates',
      deliveryMethod: 'Instructor-led workshop with hands-on labs',
      learningObjectives: [
        'Apply secure coding principles and practices',
        'Identify and remediate common vulnerabilities (OWASP Top 10)',
        'Implement secure authentication and authorization',
        'Use security testing tools effectively',
        'Understand secure SDLC requirements'
      ],
      topics: [
        'Secure Coding Principles',
        'OWASP Top 10 Vulnerabilities',
        'Input Validation and Output Encoding',
        'Authentication and Session Management',
        'Cryptography Best Practices',
        'SQL Injection Prevention',
        'XSS and CSRF Prevention',
        'Security Testing (SAST/DAST)',
        'Secure API Development',
        'Third-Party Component Security'
      ],
      selected: false,
      mandatory: false,
      customNotes: ''
    },
    {
      id: 'TRN-003',
      name: 'Security for Managers and Executives',
      description: 'Security leadership training for management',
      targetAudience: 'Managers, directors, executives, team leads',
      duration: '90 minutes',
      frequency: 'Annual',
      deliveryMethod: 'Executive briefing or online course',
      learningObjectives: [
        'Understand organizational security risks and strategy',
        'Recognize management responsibilities for information security',
        'Make risk-informed business decisions',
        'Support security culture and awareness',
        'Respond appropriately to security incidents'
      ],
      topics: [
        'Information Security Strategy',
        'Risk Management Overview',
        'Regulatory and Compliance Requirements',
        'Security Incident Response',
        'Third-Party Security Management',
        'Business Continuity and Resilience',
        'Security Metrics and Reporting',
        'Security Culture and Leadership',
        'Budget and Resource Allocation',
        'Board Reporting on Security'
      ],
      selected: false,
      mandatory: false,
      customNotes: ''
    },
    {
      id: 'TRN-004',
      name: 'IT Security Operations Training',
      description: 'Advanced security training for IT operations and security teams',
      targetAudience: 'IT administrators, security analysts, SOC personnel',
      duration: '8 hours (2 days)',
      frequency: 'Annual with monthly knowledge sharing sessions',
      deliveryMethod: 'Instructor-led technical workshop',
      learningObjectives: [
        'Implement and manage security controls',
        'Monitor and respond to security events',
        'Conduct security assessments and investigations',
        'Apply security operations best practices',
        'Use security tools and technologies effectively'
      ],
      topics: [
        'Security Monitoring and SIEM',
        'Incident Detection and Response',
        'Vulnerability Management',
        'Threat Intelligence',
        'Security Tool Administration',
        'Log Analysis and Correlation',
        'Forensics and Investigation',
        'Security Automation',
        'Network Security Operations',
        'Cloud Security Operations'
      ],
      selected: false,
      mandatory: false,
      customNotes: ''
    },
    {
      id: 'TRN-005',
      name: 'Privacy and Data Protection Training',
      description: 'Training on privacy laws and data protection practices',
      targetAudience: 'All staff handling personal data, HR, Legal, Compliance',
      duration: '90 minutes',
      frequency: 'Annual',
      deliveryMethod: 'Online course with assessment',
      learningObjectives: [
        'Understand privacy laws and regulations (GDPR, CCPA)',
        'Identify and classify personal data',
        'Apply data protection principles',
        'Handle data subject requests',
        'Recognize and report privacy incidents'
      ],
      topics: [
        'Introduction to Privacy Laws (GDPR, CCPA)',
        'Personal Data Classification',
        'Data Protection Principles',
        'Consent and Legitimate Processing',
        'Data Subject Rights',
        'Privacy by Design',
        'Data Breach Notification',
        'International Data Transfers',
        'Privacy Impact Assessments',
        'Vendor Data Processing Agreements'
      ],
      selected: false,
      mandatory: false,
      customNotes: ''
    },
    {
      id: 'TRN-006',
      name: 'Phishing and Social Engineering Defense',
      description: 'Focused training on recognizing and preventing social engineering attacks',
      targetAudience: 'All employees',
      duration: '45 minutes',
      frequency: 'Quarterly with simulated phishing exercises',
      deliveryMethod: 'Online micro-learning with interactive simulations',
      learningObjectives: [
        'Identify phishing and social engineering tactics',
        'Verify suspicious communications',
        'Respond appropriately to suspected attacks',
        'Report phishing attempts',
        'Protect sensitive information from manipulation'
      ],
      topics: [
        'Types of Social Engineering Attacks',
        'Phishing Email Indicators',
        'Vishing (Voice Phishing)',
        'Smishing (SMS Phishing)',
        'Pretexting and Impersonation',
        'Baiting and Quid Pro Quo',
        'Verification Procedures',
        'Reporting Mechanisms',
        'Real-World Attack Examples',
        'Best Practices for Prevention'
      ],
      selected: false,
      mandatory: false,
      customNotes: ''
    },
    {
      id: 'TRN-007',
      name: 'Remote Work Security',
      description: 'Security practices for remote and hybrid work environments',
      targetAudience: 'Remote workers, hybrid employees',
      duration: '60 minutes',
      frequency: 'Annual or when granted remote access',
      deliveryMethod: 'Online course',
      learningObjectives: [
        'Secure home office and remote workspace',
        'Use VPN and remote access tools securely',
        'Protect devices outside the office',
        'Identify risks in remote work scenarios',
        'Apply security best practices for remote work'
      ],
      topics: [
        'Home Office Security Setup',
        'VPN and Remote Access',
        'Secure Wi-Fi Configuration',
        'Physical Security at Home',
        'Device Security and Encryption',
        'Video Conferencing Security',
        'Public Wi-Fi Risks',
        'BYOD Security',
        'Separating Work and Personal Activities',
        'Remote Incident Reporting'
      ],
      selected: false,
      mandatory: false,
      customNotes: ''
    }
  ])

  const [awarenessCampaigns, setAwarenessCampaigns] = useState<AwarenessCampaign[]>([
    {
      id: 'AWR-001',
      name: 'Security Awareness Month',
      description: 'Annual month-long campaign focusing on various security topics',
      targetAudience: 'All employees',
      duration: '1 month (typically October)',
      channels: ['Email newsletters', 'Posters and digital signage', 'Lunch & learn sessions', 'Quiz contests', 'Intranet articles'],
      topics: ['Weekly themed security topics', 'Interactive challenges', 'Guest speakers', 'Security best practices', 'Incident case studies'],
      selected: true,
      customNotes: ''
    },
    {
      id: 'AWR-002',
      name: 'Monthly Security Tips',
      description: 'Regular security tips and reminders distributed to all staff',
      targetAudience: 'All employees',
      duration: 'Ongoing (monthly)',
      channels: ['Email', 'Intranet', 'Slack/Teams channels', 'Digital signage'],
      topics: ['Password security', 'Phishing awareness', 'Device security', 'Data protection', 'Current threat alerts'],
      selected: true,
      customNotes: ''
    },
    {
      id: 'AWR-003',
      name: 'Phishing Simulation Program',
      description: 'Regular simulated phishing exercises to test and train staff',
      targetAudience: 'All employees',
      duration: 'Ongoing (monthly or quarterly)',
      channels: ['Email', 'SMS', 'Post-click training pages'],
      topics: ['Various phishing scenarios', 'Immediate feedback', 'Educational content', 'Reporting practice', 'Trend analysis'],
      selected: false,
      customNotes: ''
    },
    {
      id: 'AWR-004',
      name: 'New Hire Security Orientation',
      description: 'Security briefing for all new employees during onboarding',
      targetAudience: 'New hires',
      duration: '30 minutes during onboarding',
      channels: ['In-person or virtual briefing', 'Welcome packet', 'Onboarding portal'],
      topics: ['Security policies overview', 'Access procedures', 'Acceptable use', 'Incident reporting', 'Key contacts'],
      selected: true,
      customNotes: ''
    },
    {
      id: 'AWR-005',
      name: 'Security Incident Lessons Learned',
      description: 'Share sanitized lessons from real incidents to raise awareness',
      targetAudience: 'All employees',
      duration: 'Quarterly or as needed',
      channels: ['Email announcements', 'Team meetings', 'Intranet articles', 'Lunch & learns'],
      topics: ['Incident summaries', 'Root causes', 'Prevention measures', 'Employee actions', 'Process improvements'],
      selected: false,
      customNotes: ''
    },
    {
      id: 'AWR-006',
      name: 'Security Champion Network',
      description: 'Peer-to-peer security awareness through department champions',
      targetAudience: 'Designated security champions in each department',
      duration: 'Ongoing program',
      channels: ['Regular champion meetings', 'Champion toolkit', 'Department communications', 'Recognition program'],
      topics: ['Latest security updates', 'Department-specific guidance', 'Incident trends', 'Best practices sharing', 'Awareness activities'],
      selected: false,
      customNotes: ''
    }
  ])

  const [competenceRequirements, setCompetenceRequirements] = useState<CompetenceRequirement[]>([
    {
      id: 'COMP-001',
      role: 'All Employees',
      securityResponsibilities: [
        'Follow information security policies and procedures',
        'Protect assigned credentials and access rights',
        'Report security incidents and suspicious activities',
        'Handle information according to classification',
        'Complete required security training'
      ],
      requiredTraining: ['TRN-001: Security Awareness - General Staff', 'AWR-004: New Hire Security Orientation'],
      competenceLevel: 'Basic awareness of security principles and organizational policies',
      selected: true
    },
    {
      id: 'COMP-002',
      role: 'Software Developers',
      securityResponsibilities: [
        'Develop secure code following organizational standards',
        'Conduct security code reviews',
        'Remediate identified vulnerabilities',
        'Participate in threat modeling',
        'Use secure development tools and practices'
      ],
      requiredTraining: ['TRN-001: Security Awareness', 'TRN-002: Secure Coding Training'],
      competenceLevel: 'Proficient in secure coding practices and common vulnerability remediation',
      selected: false
    },
    {
      id: 'COMP-003',
      role: 'IT Administrators',
      securityResponsibilities: [
        'Implement and maintain security controls',
        'Manage user access and permissions',
        'Apply security patches and updates',
        'Monitor system security logs',
        'Respond to security alerts and incidents'
      ],
      requiredTraining: ['TRN-001: Security Awareness', 'TRN-004: IT Security Operations Training'],
      competenceLevel: 'Advanced knowledge of security technologies and operational procedures',
      selected: false
    },
    {
      id: 'COMP-004',
      role: 'Managers and Team Leads',
      securityResponsibilities: [
        'Ensure team compliance with security policies',
        'Approve access requests for team members',
        'Report security incidents from team activities',
        'Support security awareness within team',
        'Allocate resources for security activities'
      ],
      requiredTraining: ['TRN-001: Security Awareness', 'TRN-003: Security for Managers'],
      competenceLevel: 'Understanding of security risks and management responsibilities',
      selected: false
    },
    {
      id: 'COMP-005',
      role: 'Security Team Members',
      securityResponsibilities: [
        'Define and maintain security policies and standards',
        'Conduct security assessments and audits',
        'Investigate security incidents',
        'Provide security guidance and consultation',
        'Manage security tools and technologies'
      ],
      requiredTraining: ['TRN-004: IT Security Operations', 'External professional security certifications'],
      competenceLevel: 'Expert level security knowledge with professional certifications (CISSP, CISM, etc.)',
      selected: false
    },
    {
      id: 'COMP-006',
      role: 'HR Personnel',
      securityResponsibilities: [
        'Conduct security screening during hiring',
        'Manage access provisioning and deprovisioning',
        'Handle personnel security incidents',
        'Maintain confidentiality of employee data',
        'Enforce security policies in HR processes'
      ],
      requiredTraining: ['TRN-001: Security Awareness', 'TRN-005: Privacy and Data Protection'],
      competenceLevel: 'Understanding of privacy laws and secure HR data handling',
      selected: false
    }
  ])

  const [trainingMetrics, setTrainingMetrics] = useState({
    completionTracking: true,
    effectivenessEvaluation: true,
    annualReview: true,
    recordRetention: '3 years minimum',
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
      const savedData = localStorage.getItem('trainingAwareness')
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.trainingPrograms) setTrainingPrograms(data.trainingPrograms)
        if (data.awarenessCampaigns) setAwarenessCampaigns(data.awarenessCampaigns)
        if (data.competenceRequirements) setCompetenceRequirements(data.competenceRequirements)
        if (data.trainingMetrics) setTrainingMetrics(data.trainingMetrics)
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }

  const saveData = () => {
    try {
      const dataToSave = {
        trainingPrograms,
        awarenessCampaigns,
        competenceRequirements,
        trainingMetrics,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('trainingAwareness', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  const autoSelectFromPreviousSteps = () => {
    try {
      // General security awareness is always mandatory
      setTrainingPrograms(prev => prev.map(prog =>
        prog.id === 'TRN-001' ? { ...prog, selected: true } : prog
      ))

      setAwarenessCampaigns(prev => prev.map(camp =>
        ['AWR-001', 'AWR-002', 'AWR-004'].includes(camp.id) ? { ...camp, selected: true } : camp
      ))

      setCompetenceRequirements(prev => prev.map(comp =>
        comp.id === 'COMP-001' ? { ...comp, selected: true } : comp
      ))

      // Check SOA for development-related controls
      const savedSOA = localStorage.getItem('statementOfApplicability')
      if (savedSOA) {
        const soaData = JSON.parse(savedSOA)

        // If secure development control is applicable, add developer training
        const hasSecureDevControl = soaData.controls?.some((c: any) => c.id === 'A.8.27' && c.applicable)
        if (hasSecureDevControl) {
          setTrainingPrograms(prev => prev.map(prog =>
            prog.id === 'TRN-002' ? { ...prog, selected: true } : prog
          ))
          setCompetenceRequirements(prev => prev.map(comp =>
            comp.id === 'COMP-002' ? { ...comp, selected: true } : comp
          ))
        }

        // If privacy controls are applicable, add privacy training
        const hasPrivacyControls = soaData.controls?.some((c: any) =>
          ['A.5.34', 'A.8.11'].includes(c.id) && c.applicable
        )
        if (hasPrivacyControls) {
          setTrainingPrograms(prev => prev.map(prog =>
            prog.id === 'TRN-005' ? { ...prog, selected: true } : prog
          ))
        }
      }

      // Check scope for remote work
      if (scopeData) {
        const hasRemoteWork = scopeData.scopeDocument.physicalLocations.some(
          loc => loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('home')
        )
        if (hasRemoteWork) {
          setTrainingPrograms(prev => prev.map(prog =>
            prog.id === 'TRN-007' ? { ...prog, selected: true } : prog
          ))
        }
      }
    } catch (error) {
      console.error('Error auto-selecting:', error)
    }
  }

  const toggleTrainingProgram = (id: string) => {
    setTrainingPrograms(prev => prev.map(prog =>
      prog.id === id ? { ...prog, selected: !prog.selected } : prog
    ))
  }

  const updateProgramNotes = (id: string, notes: string) => {
    setTrainingPrograms(prev => prev.map(prog =>
      prog.id === id ? { ...prog, customNotes: notes } : prog
    ))
  }

  const toggleCampaign = (id: string) => {
    setAwarenessCampaigns(prev => prev.map(camp =>
      camp.id === id ? { ...camp, selected: !camp.selected } : camp
    ))
  }

  const toggleCompetence = (id: string) => {
    setCompetenceRequirements(prev => prev.map(comp =>
      comp.id === id ? { ...comp, selected: !comp.selected } : comp
    ))
  }

  const generateDocument = async () => {
    const organizationName = scopeData?.organizationName || '[Organization Name]'
    const selectedPrograms = trainingPrograms.filter(p => p.selected)
    const selectedCampaigns = awarenessCampaigns.filter(c => c.selected)
    const selectedCompetence = competenceRequirements.filter(c => c.selected)

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
              children: [new Paragraph({ text: 'TAP-001' })],
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
              children: [new Paragraph({ text: 'Human Resources / Information Security' })],
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
        text: 'Information Security Training and Awareness Program',
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
          new TextRun({ text: 'This document defines the information security training and awareness program for ' + organizationName + '. It ensures all personnel have the competence and awareness necessary to fulfill their information security responsibilities.' })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Scope: ', bold: true }),
          new TextRun({ text: 'This program applies to all employees, contractors, temporary staff, and other personnel with access to organizational information systems.' })
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
        text: '• Ensure all personnel understand their information security responsibilities',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Develop competence in security-related roles and functions',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Maintain ongoing awareness of security threats and best practices',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Foster a security-conscious organizational culture',
        bullet: { level: 0 },
        spacing: { after: 200 }
      })
    )

    // 2. Training Programs
    if (selectedPrograms.length > 0) {
      documentChildren.push(
        new Paragraph({
          text: '2. Training Programs',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          text: 'The following training programs have been established:',
          spacing: { after: 200 }
        })
      )

      selectedPrograms.forEach((program, idx) => {
        documentChildren.push(
          new Paragraph({
            text: `2.${idx + 1} ${program.name}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Description: ', bold: true }),
              new TextRun({ text: program.description })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Target Audience: ', bold: true }),
              new TextRun({ text: program.targetAudience })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Duration: ', bold: true }),
              new TextRun({ text: program.duration })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Frequency: ', bold: true }),
              new TextRun({ text: program.frequency })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Delivery Method: ', bold: true }),
              new TextRun({ text: program.deliveryMethod })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Mandatory: ', bold: true }),
              new TextRun({ text: program.mandatory ? 'Yes' : 'No' })
            ],
            spacing: { after: 100 }
          })
        )

        if (program.learningObjectives.length > 0) {
          documentChildren.push(
            new Paragraph({
              text: 'Learning Objectives:',
              bold: true,
              spacing: { before: 100, after: 50 }
            })
          )
          program.learningObjectives.forEach(obj => {
            documentChildren.push(
              new Paragraph({
                text: obj,
                bullet: { level: 0 },
                spacing: { after: 50 }
              })
            )
          })
        }

        if (program.topics.length > 0) {
          documentChildren.push(
            new Paragraph({
              text: 'Topics Covered:',
              bold: true,
              spacing: { before: 100, after: 50 }
            })
          )
          program.topics.forEach(topic => {
            documentChildren.push(
              new Paragraph({
                text: topic,
                bullet: { level: 0 },
                spacing: { after: 50 }
              })
            )
          })
        }

        if (program.customNotes) {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Additional Notes: ', bold: true }),
                new TextRun({ text: program.customNotes })
              ],
              spacing: { before: 100, after: 200 }
            })
          )
        } else {
          documentChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }))
        }
      })
    }

    // 3. Awareness Campaigns
    if (selectedCampaigns.length > 0) {
      documentChildren.push(
        new Paragraph({
          text: '3. Awareness Campaigns',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          text: 'The following ongoing awareness activities are conducted:',
          spacing: { after: 200 }
        })
      )

      selectedCampaigns.forEach((campaign, idx) => {
        documentChildren.push(
          new Paragraph({
            text: `3.${idx + 1} ${campaign.name}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Description: ', bold: true }),
              new TextRun({ text: campaign.description })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Target Audience: ', bold: true }),
              new TextRun({ text: campaign.targetAudience })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Duration: ', bold: true }),
              new TextRun({ text: campaign.duration })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Communication Channels: ', bold: true }),
              new TextRun({ text: campaign.channels.join(', ') })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Topics: ', bold: true }),
              new TextRun({ text: campaign.topics.join(', ') })
            ],
            spacing: { after: 100 }
          })
        )

        if (campaign.customNotes) {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Additional Notes: ', bold: true }),
                new TextRun({ text: campaign.customNotes })
              ],
              spacing: { after: 200 }
            })
          )
        } else {
          documentChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }))
        }
      })
    }

    // 4. Competence Requirements
    if (selectedCompetence.length > 0) {
      documentChildren.push(
        new Paragraph({
          text: '4. Role-Based Competence Requirements',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          text: 'Security competence requirements have been defined for the following roles:',
          spacing: { after: 200 }
        })
      )

      selectedCompetence.forEach((comp, idx) => {
        documentChildren.push(
          new Paragraph({
            text: `4.${idx + 1} ${comp.role}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 }
          }),
          new Paragraph({
            text: 'Security Responsibilities:',
            bold: true,
            spacing: { after: 50 }
          })
        )

        comp.securityResponsibilities.forEach(resp => {
          documentChildren.push(
            new Paragraph({
              text: resp,
              bullet: { level: 0 },
              spacing: { after: 50 }
            })
          )
        })

        documentChildren.push(
          new Paragraph({
            text: 'Required Training:',
            bold: true,
            spacing: { before: 100, after: 50 }
          })
        )

        comp.requiredTraining.forEach(training => {
          documentChildren.push(
            new Paragraph({
              text: training,
              bullet: { level: 0 },
              spacing: { after: 50 }
            })
          )
        })

        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Required Competence Level: ', bold: true }),
              new TextRun({ text: comp.competenceLevel })
            ],
            spacing: { before: 100, after: 200 }
          })
        )
      })
    }

    // 5. Training Administration
    documentChildren.push(
      new Paragraph({
        text: '5. Training Administration and Records',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    )

    if (trainingMetrics.completionTracking) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Completion Tracking: ', bold: true }),
            new TextRun({ text: 'Training completion is tracked for all mandatory programs. Managers receive reports on team completion status.' })
          ],
          spacing: { after: 100 }
        })
      )
    }

    if (trainingMetrics.effectivenessEvaluation) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Effectiveness Evaluation: ', bold: true }),
            new TextRun({ text: 'Training effectiveness is evaluated through assessments, surveys, and metrics such as incident rates and security behavior indicators.' })
          ],
          spacing: { after: 100 }
        })
      )
    }

    if (trainingMetrics.annualReview) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Annual Review: ', bold: true }),
            new TextRun({ text: 'The training program is reviewed annually and updated based on new threats, incidents, regulatory changes, and organizational changes.' })
          ],
          spacing: { after: 100 }
        })
      )
    }

    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Record Retention: ', bold: true }),
          new TextRun({ text: 'Training records are retained for ' + trainingMetrics.recordRetention + ' to demonstrate compliance and support audit activities.' })
        ],
        spacing: { after: 100 }
      })
    )

    if (trainingMetrics.notes) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Additional Notes: ', bold: true }),
            new TextRun({ text: trainingMetrics.notes })
          ],
          spacing: { after: 200 }
        })
      )
    }

    // 6. Responsibilities
    documentChildren.push(
      new Paragraph({
        text: '6. Roles and Responsibilities',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Human Resources: ', bold: true }),
          new TextRun({ text: 'Coordinates training delivery, maintains training records, tracks completion, and supports onboarding security briefings.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Information Security: ', bold: true }),
          new TextRun({ text: 'Develops training content, identifies training needs, delivers specialized security training, and evaluates program effectiveness.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Managers: ', bold: true }),
          new TextRun({ text: 'Ensure team members complete required training, reinforce security awareness, and support security culture within their teams.' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Employees: ', bold: true }),
          new TextRun({ text: 'Complete all required training within specified timeframes, apply learned security practices, and participate in awareness activities.' })
        ],
        spacing: { after: 200 }
      })
    )

    // 7. Review and Continuous Improvement
    documentChildren.push(
      new Paragraph({
        text: '7. Review and Continuous Improvement',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This training and awareness program shall be reviewed and updated:',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Annually as part of the ISMS management review',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When new security threats or vulnerabilities emerge',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Following security incidents that reveal training gaps',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When organizational changes affect security responsibilities',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Based on training effectiveness metrics and feedback',
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
    link.download = `Training_Awareness_Program_${organizationName.replace(/\s+/g, '_')}.docx`
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
        This module helps you create a comprehensive information security training and awareness program.
        Training and awareness are essential for building a security-conscious culture and ensuring personnel
        understand their security responsibilities.
      </p>

      {renderIntegrationStatus()}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          About This Module
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Purpose:</strong> Establish training programs and awareness activities that ensure all personnel
            have the competence and awareness necessary to fulfill their information security responsibilities.
          </p>
          <p>
            <strong>What you'll create:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Role-based training programs tailored to different audiences</li>
            <li>Ongoing awareness campaigns and activities</li>
            <li>Competence requirements for security-related roles</li>
            <li>Training administration and record-keeping procedures</li>
          </ul>
          <p>
            <strong>ISO 27001 Requirements:</strong> Addresses Clauses 7.2 (Competence) and 7.3 (Awareness),
            as well as various Annex A controls related to training.
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Training Programs</h2>
      <p className="text-gray-600 mb-6">
        Choose the training programs that will be offered to your organization. Each program is designed for
        specific audiences and security training needs.
      </p>

      <div className="space-y-4">
        {trainingPrograms.map(program => (
          <div key={program.id} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={program.selected}
                  onChange={() => toggleTrainingProgram(program.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                    {program.mandatory && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{program.id}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{program.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="font-medium text-gray-700">Target:</span>
                    <span className="text-gray-600 ml-2">{program.targetAudience}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="text-gray-600 ml-2">{program.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <span className="text-gray-600 ml-2">{program.frequency}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Method:</span>
                    <span className="text-gray-600 ml-2">{program.deliveryMethod}</span>
                  </div>
                </div>

                {program.selected && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={program.customNotes}
                      onChange={(e) => updateProgramNotes(program.id, e.target.value)}
                      placeholder="Any customizations or additional requirements..."
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Awareness Campaigns</h2>
      <p className="text-gray-600 mb-6">
        Select ongoing awareness activities to maintain security consciousness throughout the organization.
        Awareness campaigns complement formal training with regular communications and engagement.
      </p>

      <div className="space-y-4">
        {awarenessCampaigns.map(campaign => (
          <div
            key={campaign.id}
            className={`p-5 border rounded-lg cursor-pointer transition-all ${
              campaign.selected
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => toggleCampaign(campaign.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  campaign.selected
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                }`}>
                  {campaign.selected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <span className="text-xs text-gray-500">{campaign.id}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Target Audience:</span>
                    <span className="text-gray-600 ml-2">{campaign.targetAudience}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="text-gray-600 ml-2">{campaign.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Channels:</span>
                    <span className="text-gray-600 ml-2">{campaign.channels.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Topics:</span>
                    <span className="text-gray-600 ml-2">{campaign.topics.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Competence Requirements</h2>
      <p className="text-gray-600 mb-6">
        Define competence requirements for roles with information security responsibilities. This ensures
        personnel have the necessary skills and knowledge for their security functions.
      </p>

      <div className="space-y-4">
        {competenceRequirements.map(comp => (
          <div
            key={comp.id}
            className={`p-5 border rounded-lg cursor-pointer transition-all ${
              comp.selected
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => toggleCompetence(comp.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  comp.selected
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                }`}>
                  {comp.selected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{comp.role}</h3>
                  <span className="text-xs text-gray-500">{comp.id}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Security Responsibilities:</h4>
                    <ul className="space-y-1">
                      {comp.securityResponsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm text-gray-600 pl-4 relative">
                          <span className="absolute left-0">•</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Required Training:</h4>
                    <ul className="space-y-1">
                      {comp.requiredTraining.map((training, idx) => (
                        <li key={idx} className="text-sm text-gray-600 pl-4 relative">
                          <span className="absolute left-0">•</span>
                          {training}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Competence Level:</h4>
                    <p className="text-sm text-gray-600">{comp.competenceLevel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Training Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Administration</h3>
        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={trainingMetrics.completionTracking}
              onChange={(e) => setTrainingMetrics({ ...trainingMetrics, completionTracking: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="ml-3 text-sm text-gray-700">
              Track training completion and maintain records
            </span>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={trainingMetrics.effectivenessEvaluation}
              onChange={(e) => setTrainingMetrics({ ...trainingMetrics, effectivenessEvaluation: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="ml-3 text-sm text-gray-700">
              Evaluate training effectiveness through assessments and metrics
            </span>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={trainingMetrics.annualReview}
              onChange={(e) => setTrainingMetrics({ ...trainingMetrics, annualReview: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="ml-3 text-sm text-gray-700">
              Review and update training program annually
            </span>
          </label>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Record Retention Period
            </label>
            <input
              type="text"
              value={trainingMetrics.recordRetention}
              onChange={(e) => setTrainingMetrics({ ...trainingMetrics, recordRetention: e.target.value })}
              placeholder="e.g., 3 years minimum"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={trainingMetrics.notes}
              onChange={(e) => setTrainingMetrics({ ...trainingMetrics, notes: e.target.value })}
              placeholder="Any additional training administration requirements..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => {
    const selectedPrograms = trainingPrograms.filter(p => p.selected)
    const selectedCampaigns = awarenessCampaigns.filter(c => c.selected)
    const selectedCompetence = competenceRequirements.filter(c => c.selected)
    const mandatoryPrograms = selectedPrograms.filter(p => p.mandatory).length

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Export</h2>
        <p className="text-gray-600 mb-6">
          Review your training and awareness program and export professional documentation.
        </p>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{selectedPrograms.length}</div>
            <div className="text-sm text-blue-700 mt-1">Training Programs</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{selectedCampaigns.length}</div>
            <div className="text-sm text-green-700 mt-1">Awareness Campaigns</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">{selectedCompetence.length}</div>
            <div className="text-sm text-purple-700 mt-1">Role Requirements</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-900">{mandatoryPrograms}</div>
            <div className="text-sm text-orange-700 mt-1">Mandatory Programs</div>
          </div>
        </div>

        {/* Training Programs Summary */}
        {selectedPrograms.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Training Programs</h3>
            <div className="space-y-2">
              {selectedPrograms.map(prog => (
                <div key={prog.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{prog.name}</span>
                    {prog.mandatory && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600">{prog.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awareness Campaigns Summary */}
        {selectedCampaigns.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Awareness Campaigns</h3>
            <div className="space-y-2">
              {selectedCampaigns.map(camp => (
                <div key={camp.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="font-medium text-gray-900">{camp.name}</span>
                  <span className="text-gray-600">{camp.duration}</span>
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
                Export Training & Awareness Program
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a comprehensive Word document containing your complete training and awareness program
                including training programs, awareness campaigns, competence requirements, and administration procedures.
              </p>
              <button
                onClick={generateDocument}
                disabled={selectedPrograms.length === 0 && selectedCampaigns.length === 0}
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
    { number: 2, title: 'Training Programs', render: renderStep2 },
    { number: 3, title: 'Awareness Campaigns', render: renderStep3 },
    { number: 4, title: 'Competence', render: renderStep4 },
    { number: 5, title: 'Review & Export', render: renderStep5 }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training & Awareness</h1>
            <p className="text-gray-600 mt-1">ISO 27001:2022 Clauses 7.2 & 7.3 - Competence and Awareness</p>
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

export default TrainingAwareness
