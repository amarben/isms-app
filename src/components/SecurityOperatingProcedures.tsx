import React, { useState, useEffect } from 'react'
import { Lock, CheckCircle, AlertCircle, Download, ChevronRight, ChevronLeft, Server, Database, Cloud, Network, FileText, BookOpen, Settings } from 'lucide-react'
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

interface SecurityOperatingProceduresProps {
  scopeData: ScopeData | null
}

interface OperatingProcedure {
  id: string
  category: string
  name: string
  description: string
  icon: React.ComponentType<any>
  selected: boolean
  purpose: string
  scope: string
  steps: string[]
  responsibilities: string
  frequency: string
  securityConsiderations: string[]
  toolsRequired: string[]
  customNotes: string
}

interface ProcedureCategory {
  name: string
  description: string
  icon: React.ComponentType<any>
}

const SecurityOperatingProcedures: React.FC<SecurityOperatingProceduresProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [integrationStatus, setIntegrationStatus] = useState({
    scopeDefinition: false,
    soa: false,
    riskAssessment: false
  })

  const [procedures, setProcedures] = useState<OperatingProcedure[]>([
    {
      id: 'SOP-001',
      category: 'System Administration',
      name: 'User Account Management',
      description: 'Procedures for creating, modifying, and deactivating user accounts',
      icon: Server,
      selected: false,
      purpose: 'To ensure secure and consistent management of user accounts throughout their lifecycle, maintaining proper access controls and audit trails.',
      scope: 'All user accounts across all IT systems within the ISMS scope',
      steps: [
        'Receive and validate user account request with proper authorization',
        'Verify user identity and employment/contractor status',
        'Determine appropriate access rights based on role and business need',
        'Create account following naming conventions and security standards',
        'Configure account with appropriate permissions, groups, and restrictions',
        'Document account creation in access management system',
        'Notify user of account creation and provide initial credentials securely',
        'Schedule account for regular access review',
        'For modifications: Validate change request and authorization',
        'For terminations: Immediately disable account upon notification',
        'For terminations: Archive or delete account data per retention policy'
      ],
      responsibilities: 'IT Administrators create and maintain accounts. Line managers authorize access. Information Security reviews access periodically.',
      frequency: 'As needed for account requests; quarterly access reviews',
      securityConsiderations: [
        'Enforce strong password policies and MFA where applicable',
        'Apply principle of least privilege for all access grants',
        'Disable accounts immediately upon termination or extended leave',
        'Monitor for dormant accounts and disable after 90 days inactivity',
        'Maintain audit logs of all account management activities',
        'Separate administrative accounts from standard user accounts',
        'Require re-authorization for privilege escalations'
      ],
      toolsRequired: ['Active Directory/Identity Management System', 'Access Request System', 'Audit Logging System'],
      customNotes: ''
    },
    {
      id: 'SOP-002',
      category: 'System Administration',
      name: 'System Patching and Updates',
      description: 'Procedures for applying security patches and system updates',
      icon: Server,
      selected: false,
      purpose: 'To maintain system security by timely application of security patches and updates while minimizing service disruption.',
      scope: 'All servers, workstations, network devices, and applications within the ISMS scope',
      steps: [
        'Monitor vendor security bulletins and patch notifications',
        'Assess criticality and applicability of patches to environment',
        'Prioritize patches based on severity (Critical: 7 days, High: 30 days, Medium: 90 days)',
        'Test patches in non-production environment',
        'Document test results and any compatibility issues',
        'Schedule maintenance window with stakeholders',
        'Create backups of systems before patching',
        'Apply patches according to change management procedures',
        'Verify successful patch installation',
        'Test system functionality post-patching',
        'Document patch deployment and any issues encountered',
        'Update configuration management database (CMDB)',
        'If patch fails, execute rollback procedures'
      ],
      responsibilities: 'IT Operations team manages patching. Information Security prioritizes security patches. Change Manager approves deployment schedules.',
      frequency: 'Critical patches within 7 days; routine patches monthly',
      securityConsiderations: [
        'Apply critical security patches within SLA timeframes',
        'Maintain patch management dashboard with compliance metrics',
        'Isolate unpatched systems from network if patches cannot be applied',
        'Document and track patch exceptions with compensating controls',
        'Maintain current inventory of all systems requiring patches',
        'Test patches before production deployment',
        'Implement automated patching where appropriate'
      ],
      toolsRequired: ['Patch Management System', 'Backup Solution', 'Testing Environment', 'CMDB'],
      customNotes: ''
    },
    {
      id: 'SOP-003',
      category: 'System Administration',
      name: 'Backup and Recovery',
      description: 'Procedures for data backup and system recovery operations',
      icon: Database,
      selected: false,
      purpose: 'To ensure business continuity by maintaining reliable, tested backups of critical data and systems that can be restored within defined recovery time objectives.',
      scope: 'All critical data, databases, applications, and system configurations',
      steps: [
        'Identify systems and data requiring backup based on criticality',
        'Configure automated backup schedules (daily incremental, weekly full)',
        'Verify backup jobs complete successfully',
        'Monitor backup system alerts and resolve failures within 24 hours',
        'Test backup restoration monthly using defined test scenarios',
        'Rotate backup media according to retention schedule',
        'Store offsite/cloud copies for disaster recovery',
        'Document backup success rates and storage utilization',
        'For recovery: Assess scope and impact of data loss incident',
        'For recovery: Identify appropriate backup point based on RPO',
        'For recovery: Execute restoration procedure',
        'For recovery: Verify data integrity post-restoration',
        'For recovery: Document recovery process and lessons learned'
      ],
      responsibilities: 'IT Operations configures and monitors backups. System owners define backup requirements. Information Security validates backup encryption.',
      frequency: 'Daily incremental backups; weekly full backups; monthly restoration tests',
      securityConsiderations: [
        'Encrypt all backup data at rest and in transit',
        'Store backup copies in geographically separate locations',
        'Restrict access to backup systems and media',
        'Test restoration procedures regularly',
        'Maintain backup retention per legal and business requirements',
        'Monitor for backup failures and alert immediately',
        'Protect backup credentials with same rigor as production systems',
        'Include configuration data and system images in backups'
      ],
      toolsRequired: ['Backup Software', 'Backup Storage Systems', 'Offsite/Cloud Storage', 'Recovery Testing Environment'],
      customNotes: ''
    },
    {
      id: 'SOP-004',
      category: 'Network Security',
      name: 'Firewall Configuration Management',
      description: 'Procedures for managing firewall rules and configurations',
      icon: Network,
      selected: false,
      purpose: 'To maintain secure network perimeter by properly configuring, documenting, and reviewing firewall rules to allow only authorized network traffic.',
      scope: 'All perimeter and internal firewalls protecting network segments',
      steps: [
        'Receive firewall rule change request with business justification',
        'Validate request against security policies and standards',
        'Assess risk and determine if change should be approved',
        'Document rule purpose, source, destination, ports, and protocols',
        'Configure rule using principle of least privilege',
        'Implement rule in test environment first if possible',
        'Schedule change implementation during approved window',
        'Apply rule change to production firewall',
        'Test connectivity to verify rule functions as intended',
        'Update firewall documentation and configuration database',
        'Conduct quarterly firewall rule reviews to identify unused rules',
        'Remove or disable rules no longer needed',
        'Generate firewall rule compliance reports'
      ],
      responsibilities: 'Network Security team manages firewall rules. Requesters justify business need. Information Security reviews quarterly.',
      frequency: 'As needed for rule changes; quarterly comprehensive reviews',
      securityConsiderations: [
        'Default deny all traffic; explicitly allow only required traffic',
        'Avoid using "any" in source, destination, or service fields',
        'Implement network segmentation with firewall boundaries',
        'Log all denied traffic for security monitoring',
        'Review and remove unused rules regularly',
        'Maintain firewall configuration backups',
        'Document all rule changes with business justification',
        'Implement two-person rule for critical firewall changes'
      ],
      toolsRequired: ['Firewall Management Console', 'Change Management System', 'Network Documentation Tools', 'Testing Environment'],
      customNotes: ''
    },
    {
      id: 'SOP-005',
      category: 'Network Security',
      name: 'Network Access Control',
      description: 'Procedures for controlling device access to the network',
      icon: Network,
      selected: false,
      purpose: 'To prevent unauthorized devices from accessing the network and ensure connecting devices meet security standards.',
      scope: 'All wired and wireless network access points within the organization',
      steps: [
        'Configure network access control (NAC) system with security policies',
        'Define device compliance requirements (antivirus, patches, configuration)',
        'Implement device registration process for corporate devices',
        'Configure 802.1X authentication for network access',
        'Create separate network segments for different device types',
        'Deploy guest network with restricted access',
        'Monitor for unauthorized devices attempting network access',
        'Quarantine non-compliant devices to remediation network',
        'Alert IT security of repeated unauthorized access attempts',
        'Review network access logs weekly for anomalies',
        'Update NAC policies when security requirements change',
        'Test NAC functionality monthly'
      ],
      responsibilities: 'Network team manages NAC infrastructure. IT Security defines security policies. Helpdesk assists with device onboarding.',
      frequency: 'Continuous monitoring; weekly log reviews; monthly policy reviews',
      securityConsiderations: [
        'Authenticate all devices before network access',
        'Verify device compliance with security standards',
        'Separate guest and corporate networks',
        'Monitor for rogue access points and unauthorized devices',
        'Implement role-based network access',
        'Encrypt all wireless network traffic (WPA3)',
        'Disable unused network ports',
        'Log all network access attempts'
      ],
      toolsRequired: ['Network Access Control (NAC) System', '802.1X Authentication Server', 'Network Monitoring Tools', 'Device Inventory System'],
      customNotes: ''
    },
    {
      id: 'SOP-006',
      category: 'Cloud Security',
      name: 'Cloud Resource Provisioning',
      description: 'Procedures for securely provisioning cloud resources',
      icon: Cloud,
      selected: false,
      purpose: 'To ensure cloud resources are provisioned securely following organizational standards and best practices.',
      scope: 'All cloud infrastructure, platform, and software services',
      steps: [
        'Receive cloud resource request with business justification',
        'Validate request against cloud governance policies',
        'Select appropriate cloud service tier and region',
        'Apply security baseline configuration templates',
        'Configure encryption for data at rest and in transit',
        'Implement least-privilege access controls and IAM policies',
        'Enable logging and monitoring for the resource',
        'Configure backup and disaster recovery as applicable',
        'Tag resources appropriately for cost allocation and tracking',
        'Document resource configuration and ownership',
        'Review security group rules and network configurations',
        'Perform security assessment of new resource',
        'Notify requester of resource availability'
      ],
      responsibilities: 'Cloud team provisions resources. Information Security reviews configurations. Resource owners maintain and monitor resources.',
      frequency: 'As needed for resource requests; monthly security reviews',
      securityConsiderations: [
        'Apply security baselines to all cloud resources',
        'Enable encryption by default',
        'Implement network segmentation using security groups',
        'Use managed identities instead of credentials where possible',
        'Enable audit logging and security monitoring',
        'Implement cost controls and resource limits',
        'Regularly review and remove unused resources',
        'Scan for misconfigurations using cloud security tools'
      ],
      toolsRequired: ['Cloud Management Console', 'Infrastructure as Code Tools', 'Cloud Security Posture Management', 'Configuration Templates'],
      customNotes: ''
    },
    {
      id: 'SOP-007',
      category: 'Cloud Security',
      name: 'Cloud Access Management',
      description: 'Procedures for managing access to cloud services and resources',
      icon: Cloud,
      selected: false,
      purpose: 'To control and monitor access to cloud services ensuring only authorized users can access cloud resources.',
      scope: 'All cloud service provider accounts and resources',
      steps: [
        'Implement centralized identity provider for cloud access (SSO)',
        'Configure multi-factor authentication for all cloud accounts',
        'Create role-based access policies following least privilege',
        'Provision cloud access using approval workflows',
        'Disable root/administrative accounts for daily use',
        'Implement privileged access management for admin activities',
        'Enable session recording for privileged cloud access',
        'Monitor cloud access logs for suspicious activities',
        'Review cloud access permissions quarterly',
        'Remove access immediately upon role change or termination',
        'Audit unused cloud accounts and disable',
        'Generate cloud access compliance reports'
      ],
      responsibilities: 'Cloud administrators manage IAM policies. Information Security defines access standards. Managers approve access requests.',
      frequency: 'As needed for access changes; quarterly access reviews',
      securityConsiderations: [
        'Enforce multi-factor authentication for all cloud access',
        'Use SSO integration instead of separate cloud credentials',
        'Implement conditional access policies',
        'Monitor for privilege escalation attempts',
        'Rotate access keys and credentials regularly',
        'Restrict cloud admin access to approved users',
        'Enable just-in-time privileged access where available',
        'Log all cloud access and configuration changes'
      ],
      toolsRequired: ['Identity Provider (IdP)', 'Cloud IAM Systems', 'Privileged Access Management', 'SIEM for Cloud Logs'],
      customNotes: ''
    },
    {
      id: 'SOP-008',
      category: 'Data Security',
      name: 'Data Classification and Handling',
      description: 'Procedures for classifying and handling data based on sensitivity',
      icon: FileText,
      selected: false,
      purpose: 'To ensure data is appropriately classified and handled according to its sensitivity and regulatory requirements.',
      scope: 'All data created, processed, stored, or transmitted by the organization',
      steps: [
        'Classify data according to classification scheme (Public, Internal, Confidential, Restricted)',
        'Label documents and files with appropriate classification markings',
        'Apply technical controls based on data classification',
        'Store data in approved locations based on classification',
        'Encrypt Confidential and Restricted data at rest and in transit',
        'Control access to classified data using role-based permissions',
        'Monitor and log access to Restricted data',
        'Transfer classified data using approved secure methods',
        'Dispose of data securely according to classification level',
        'Train users on data classification and handling requirements',
        'Review data classifications periodically',
        'Report data classification violations to security team'
      ],
      responsibilities: 'Data owners classify data. Users handle data per classification. IT implements technical controls. Information Security monitors compliance.',
      frequency: 'Continuous; annual classification reviews',
      securityConsiderations: [
        'Classify data at creation or as early as possible',
        'Default to higher classification when uncertain',
        'Encrypt Confidential and Restricted data',
        'Monitor and alert on unusual access to sensitive data',
        'Implement data loss prevention (DLP) controls',
        'Maintain data inventory with classifications',
        'Enforce geographic restrictions for regulated data',
        'Secure data destruction when no longer needed'
      ],
      toolsRequired: ['Data Classification Tools', 'Encryption Systems', 'DLP Solution', 'Data Inventory Database'],
      customNotes: ''
    },
    {
      id: 'SOP-009',
      category: 'Security Monitoring',
      name: 'Security Event Monitoring',
      description: 'Procedures for monitoring and responding to security events',
      icon: Settings,
      selected: false,
      purpose: 'To detect and respond to security events and potential incidents in a timely manner.',
      scope: 'All IT systems, networks, and security devices generating logs',
      steps: [
        'Configure systems to send logs to centralized SIEM',
        'Define security event detection rules and correlation logic',
        'Establish baseline behavior for normal operations',
        'Monitor security dashboards continuously during business hours',
        'Investigate alerts exceeding defined thresholds',
        'Classify events by severity (Critical, High, Medium, Low)',
        'Document investigation findings in ticketing system',
        'Escalate confirmed incidents to incident response team',
        'Track event investigation to closure',
        'Tune detection rules to reduce false positives',
        'Generate weekly security event reports',
        'Review security monitoring effectiveness quarterly'
      ],
      responsibilities: 'Security Operations Center (SOC) monitors events. Analysts investigate alerts. Incident Response team handles confirmed incidents.',
      frequency: '24/7 monitoring for Critical systems; business hours for others',
      securityConsiderations: [
        'Collect logs from all critical systems',
        'Protect log integrity and prevent tampering',
        'Define and prioritize high-risk event types',
        'Implement automated alerting for critical events',
        'Maintain log retention per compliance requirements',
        'Correlate events across multiple systems',
        'Document investigation procedures for common event types',
        'Regularly test detection rules effectiveness'
      ],
      toolsRequired: ['SIEM System', 'Log Collection Agents', 'Security Analytics Platform', 'Incident Ticketing System'],
      customNotes: ''
    },
    {
      id: 'SOP-010',
      category: 'Security Monitoring',
      name: 'Vulnerability Scanning',
      description: 'Procedures for scanning systems for security vulnerabilities',
      icon: Settings,
      selected: false,
      purpose: 'To proactively identify security vulnerabilities in systems and applications before they can be exploited.',
      scope: 'All servers, workstations, network devices, and applications in production',
      steps: [
        'Maintain inventory of all systems to be scanned',
        'Schedule authenticated vulnerability scans (monthly for internal, weekly for external)',
        'Configure scanners with appropriate credentials for authenticated scans',
        'Execute vulnerability scans during approved maintenance windows',
        'Review scan results and validate findings',
        'Classify vulnerabilities by severity (Critical, High, Medium, Low)',
        'Assign vulnerabilities to system owners for remediation',
        'Track remediation progress in vulnerability management system',
        'Verify vulnerability fixes through re-scanning',
        'Document accepted risks for vulnerabilities that cannot be remediated',
        'Generate vulnerability metrics reports for management',
        'Trend vulnerability data to identify systemic issues'
      ],
      responsibilities: 'Security team conducts scans. System owners remediate findings. Management approves risk acceptances.',
      frequency: 'Weekly external scans; monthly internal scans; post-change validation scans',
      securityConsiderations: [
        'Use authenticated scanning for complete coverage',
        'Scan external-facing systems more frequently',
        'Prioritize remediation by severity and exploitability',
        'Remediate Critical vulnerabilities within 7 days',
        'Scan after major system changes',
        'Use multiple scanning tools for comprehensive coverage',
        'Validate scan results to reduce false positives',
        'Track vulnerability trends over time'
      ],
      toolsRequired: ['Vulnerability Scanner', 'Asset Inventory System', 'Vulnerability Management Platform', 'Patch Management System'],
      customNotes: ''
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
      riskAssessment: !!localStorage.getItem('riskAssessment')
    }
    setIntegrationStatus(status)
  }

  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('securityOperatingProcedures')
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.procedures) {
          // Restore procedures but preserve icons
          const restoredProcedures = data.procedures.map((savedProc: any) => {
            const originalProc = procedures.find(p => p.id === savedProc.id)
            return {
              ...savedProc,
              icon: originalProc?.icon || Server
            }
          })
          setProcedures(restoredProcedures)
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }

  const saveData = () => {
    try {
      const dataToSave = {
        procedures: procedures.map(proc => ({
          ...proc,
          icon: undefined // Don't save icon functions
        })),
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('securityOperatingProcedures', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  const autoSelectFromPreviousSteps = () => {
    try {
      const updatedProcedures = procedures.map(proc => {
        let shouldSelect = false

        // Check SOA for relevant controls
        const savedSOA = localStorage.getItem('statementOfApplicability')
        if (savedSOA) {
          const soaData = JSON.parse(savedSOA)

          // Map procedures to related SOA controls
          const controlMappings: Record<string, string[]> = {
            'SOP-001': ['A.5.15', 'A.5.16', 'A.5.17', 'A.5.18'], // User account management
            'SOP-002': ['A.8.8'], // Patch management
            'SOP-003': ['A.8.13'], // Backup
            'SOP-004': ['A.8.20', 'A.8.21'], // Firewall
            'SOP-005': ['A.8.21'], // Network access
            'SOP-006': ['A.8.9'], // Cloud provisioning
            'SOP-007': ['A.5.15'], // Cloud access
            'SOP-008': ['A.5.10', 'A.5.12', 'A.5.13'], // Data classification
            'SOP-009': ['A.8.15', 'A.8.16'], // Security monitoring
            'SOP-010': ['A.8.8'] // Vulnerability scanning
          }

          const relevantControls = controlMappings[proc.id] || []
          shouldSelect = relevantControls.some(controlId =>
            soaData.controls?.some((c: any) => c.id === controlId && c.applicable)
          )
        }

        // Check scope for cloud services
        if (scopeData) {
          const hasCloudServices = scopeData.scopeDocument.processesAndServices.some(
            service => service.toLowerCase().includes('cloud') || service.toLowerCase().includes('saas')
          )
          if (hasCloudServices && (proc.id === 'SOP-006' || proc.id === 'SOP-007')) {
            shouldSelect = true
          }
        }

        return { ...proc, selected: shouldSelect }
      })

      setProcedures(updatedProcedures)
    } catch (error) {
      console.error('Error auto-selecting procedures:', error)
    }
  }

  const toggleProcedure = (id: string) => {
    setProcedures(prev => prev.map(proc =>
      proc.id === id ? { ...proc, selected: !proc.selected } : proc
    ))
  }

  const updateProcedureNotes = (id: string, notes: string) => {
    setProcedures(prev => prev.map(proc =>
      proc.id === id ? { ...proc, customNotes: notes } : proc
    ))
  }

  const generateDocument = async () => {
    const organizationName = scopeData?.organizationName || '[Organization Name]'
    const selectedProcedures = procedures.filter(p => p.selected)

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
              children: [new Paragraph({ text: 'SOP-DOC-001' })],
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
              children: [new Paragraph({ text: 'IT Operations Manager' })],
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
        text: 'Security Operating Procedures',
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
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'IT Department',
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
          new TextRun({ text: 'This document defines the security operating procedures for the IT department of ' + organizationName + '. These procedures ensure consistent, secure operation of IT systems and infrastructure in accordance with ISO 27001:2022 Control A.5.37.' })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Scope: ', bold: true }),
          new TextRun({ text: 'These procedures apply to all IT operations personnel and cover the secure operation of systems within the ISMS scope.' })
        ],
        spacing: { after: 200 }
      })
    )

    // 2. General Security Requirements
    documentChildren.push(
      new Paragraph({
        text: '2. General Security Requirements',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'All IT operations personnel must adhere to the following general security requirements:',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Maintain confidentiality of system credentials and sensitive information',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Follow the principle of least privilege for all system access',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Document all significant operational activities and changes',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Report security incidents immediately to the Information Security team',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Comply with change management procedures for all system modifications',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Maintain current knowledge of security threats and best practices',
        bullet: { level: 0 },
        spacing: { after: 200 }
      })
    )

    // 3. Operating Procedures (grouped by category)
    documentChildren.push(
      new Paragraph({
        text: '3. Operating Procedures',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    )

    // Group procedures by category
    const categoryGroups = selectedProcedures.reduce((acc, proc) => {
      if (!acc[proc.category]) {
        acc[proc.category] = []
      }
      acc[proc.category].push(proc)
      return acc
    }, {} as Record<string, OperatingProcedure[]>)

    // Add each category
    let procNumber = 1
    Object.entries(categoryGroups).forEach(([category, procs]) => {
      documentChildren.push(
        new Paragraph({
          text: `3.${procNumber} ${category}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      )

      procs.forEach((proc) => {
        documentChildren.push(
          new Paragraph({
            text: `${proc.id}: ${proc.name}`,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Purpose: ', bold: true }),
              new TextRun({ text: proc.purpose })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Scope: ', bold: true }),
              new TextRun({ text: proc.scope })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: 'Procedure Steps:',
            bold: true,
            spacing: { before: 100, after: 50 }
          })
        )

        // Add procedure steps
        proc.steps.forEach((step, idx) => {
          documentChildren.push(
            new Paragraph({
              text: `${idx + 1}. ${step}`,
              numbering: { reference: 'procedure-steps', level: 0 },
              spacing: { after: 50 }
            })
          )
        })

        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Responsibilities: ', bold: true }),
              new TextRun({ text: proc.responsibilities })
            ],
            spacing: { before: 100, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Frequency: ', bold: true }),
              new TextRun({ text: proc.frequency })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: 'Security Considerations:',
            bold: true,
            spacing: { before: 100, after: 50 }
          })
        )

        proc.securityConsiderations.forEach(consideration => {
          documentChildren.push(
            new Paragraph({
              text: consideration,
              bullet: { level: 0 },
              spacing: { after: 50 }
            })
          )
        })

        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Required Tools: ', bold: true }),
              new TextRun({ text: proc.toolsRequired.join(', ') })
            ],
            spacing: { before: 100, after: 100 }
          })
        )

        if (proc.customNotes) {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Additional Notes: ', bold: true }),
                new TextRun({ text: proc.customNotes })
              ],
              spacing: { after: 200 }
            })
          )
        } else {
          documentChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }))
        }
      })

      procNumber++
    })

    // 4. Compliance and Review
    documentChildren.push(
      new Paragraph({
        text: '4. Compliance and Review',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'These procedures shall be reviewed and updated:',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Annually as part of the ISMS management review',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When significant changes occur to IT systems or infrastructure',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Following security incidents or audit findings',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• When new security threats or vulnerabilities are identified',
        bullet: { level: 0 },
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'All IT operations personnel are required to follow these procedures. Violations shall be reported to management and may result in disciplinary action.',
        spacing: { after: 200 }
      })
    )

    // 5. References
    documentChildren.push(
      new Paragraph({
        text: '5. References',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: '• ISO 27001:2022 Control A.5.37 - Documented operating procedures',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Information Security Policy',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Change Management Procedure',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Incident Response Procedure',
        bullet: { level: 0 },
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Risk Treatment Plan',
        bullet: { level: 0 },
        spacing: { after: 200 }
      })
    )

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: documentChildren
      }],
      numbering: {
        config: [{
          reference: 'procedure-steps',
          levels: [{
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT
          }]
        }]
      }
    })

    // Generate and download
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Security_Operating_Procedures_${organizationName.replace(/\s+/g, '_')}.docx`
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
        This module helps you create documented security operating procedures for your IT department.
        This fulfills ISO 27001:2022 Control A.5.37 - Documented operating procedures.
      </p>

      {renderIntegrationStatus()}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          About This Module
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Purpose:</strong> Create comprehensive security operating procedures that ensure IT systems
            are operated securely and consistently.
          </p>
          <p>
            <strong>What you'll do:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Select relevant operating procedures for your IT environment</li>
            <li>Review and customize procedure templates</li>
            <li>Add organization-specific notes and requirements</li>
            <li>Generate professional procedure documentation</li>
          </ul>
          <p>
            <strong>Procedure Categories:</strong> System Administration, Network Security, Cloud Security,
            Data Security, and Security Monitoring
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => {
    const categories: ProcedureCategory[] = [
      {
        name: 'System Administration',
        description: 'User accounts, patching, backups',
        icon: Server
      },
      {
        name: 'Network Security',
        description: 'Firewall management, network access control',
        icon: Network
      },
      {
        name: 'Cloud Security',
        description: 'Cloud provisioning and access management',
        icon: Cloud
      },
      {
        name: 'Data Security',
        description: 'Data classification and handling',
        icon: FileText
      },
      {
        name: 'Security Monitoring',
        description: 'Event monitoring and vulnerability scanning',
        icon: Settings
      }
    ]

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Operating Procedures</h2>
        <p className="text-gray-600 mb-6">
          Choose the security operating procedures applicable to your IT environment. Each procedure includes
          detailed steps, responsibilities, and security considerations.
        </p>

        <div className="space-y-6">
          {categories.map(category => {
            const CategoryIcon = category.icon
            const categoryProcs = procedures.filter(p => p.category === category.name)

            return (
              <div key={category.name} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <CategoryIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {categoryProcs.map(proc => {
                    const ProcIcon = proc.icon
                    return (
                      <div
                        key={proc.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          proc.selected
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleProcedure(proc.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              proc.selected
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {proc.selected && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{proc.name}</h4>
                              <span className="text-xs text-gray-500">{proc.id}</span>
                            </div>
                            <p className="text-sm text-gray-600">{proc.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderStep3 = () => {
    const selectedProcedures = procedures.filter(p => p.selected)

    if (selectedProcedures.length === 0) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Procedures</h2>
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No procedures selected</p>
            <p className="text-sm text-gray-500 mt-1">Go back to step 2 to select procedures</p>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Procedures</h2>
        <p className="text-gray-600 mb-6">
          Review the selected procedures and add any organization-specific notes or customizations.
        </p>

        <div className="space-y-6">
          {selectedProcedures.map(proc => {
            const ProcIcon = proc.icon
            return (
              <div key={proc.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <ProcIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{proc.name}</h3>
                      <span className="text-xs text-gray-500">{proc.id}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{proc.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Category:</span>
                          <span className="text-gray-600 ml-2">{proc.category}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Frequency:</span>
                          <span className="text-gray-600 ml-2">{proc.frequency}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Steps:</span>
                        <span className="text-gray-600 ml-2">{proc.steps.length} procedure steps</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Tools:</span>
                        <span className="text-gray-600 ml-2">{proc.toolsRequired.length} required tools</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization-Specific Notes (Optional)
                  </label>
                  <textarea
                    value={proc.customNotes}
                    onChange={(e) => updateProcedureNotes(proc.id, e.target.value)}
                    placeholder="Add any additional notes, local requirements, or customizations for this procedure..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderStep4 = () => {
    const selectedProcedures = procedures.filter(p => p.selected)
    const proceduresByCategory = selectedProcedures.reduce((acc, proc) => {
      if (!acc[proc.category]) acc[proc.category] = []
      acc[proc.category].push(proc)
      return acc
    }, {} as Record<string, OperatingProcedure[]>)

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Export</h2>
        <p className="text-gray-600 mb-6">
          Review your security operating procedures and export professional documentation for your IT department.
        </p>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{selectedProcedures.length}</div>
            <div className="text-sm text-blue-700 mt-1">Total Procedures</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{Object.keys(proceduresByCategory).length}</div>
            <div className="text-sm text-green-700 mt-1">Categories</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">
              {selectedProcedures.reduce((sum, p) => sum + p.steps.length, 0)}
            </div>
            <div className="text-sm text-purple-700 mt-1">Total Steps</div>
          </div>
        </div>

        {/* Procedures Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Procedures Summary</h3>
          <div className="space-y-4">
            {Object.entries(proceduresByCategory).map(([category, procs]) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="space-y-2 ml-4">
                  {procs.map(proc => (
                    <div key={proc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{proc.id}</span>
                        <span className="text-gray-600 ml-2">{proc.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{proc.steps.length} steps</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
                Export Security Operating Procedures
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a comprehensive Word document containing all selected security operating procedures
                with detailed steps, responsibilities, security considerations, and required tools.
              </p>
              <button
                onClick={generateDocument}
                disabled={selectedProcedures.length === 0}
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
    { number: 2, title: 'Select Procedures', render: renderStep2 },
    { number: 3, title: 'Review & Customize', render: renderStep3 },
    { number: 4, title: 'Export', render: renderStep4 }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security Operating Procedures</h1>
            <p className="text-gray-600 mt-1">ISO 27001:2022 Control A.5.37</p>
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

export default SecurityOperatingProcedures
