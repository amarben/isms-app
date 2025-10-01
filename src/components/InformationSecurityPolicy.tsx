import React, { useState } from 'react'
import { ChevronRight, ChevronLeft, Save, FileText, Download, Eye, Users, Building, Shield, CheckCircle, Plus, Check, Loader2, Copy, FileDown } from 'lucide-react'

interface PolicyData {
  organizationName: string
  organizationType: 'corporation' | 'government' | 'non-profit' | 'partnership' | 'other'
  industry: string
  ceo: string
  ciso: string
  securityManager: string
  effectiveDate: string
  reviewDate: string
  version: string
  policyStatement: string
  objectives: string[]
  scope: string
  responsibilities: Array<{
    role: string
    responsibilities: string[]
  }>
  compliance: string[]
  consequences: string
  approvals: Array<{
    role: string
    name: string
    date: string
    status: 'pending' | 'approved' | 'rejected'
  }>
}

const initialPolicyData: PolicyData = {
  organizationName: '',
  organizationType: 'corporation',
  industry: '',
  ceo: '',
  ciso: '',
  securityManager: '',
  effectiveDate: '',
  reviewDate: '',
  version: '1.0',
  policyStatement: '',
  objectives: [],
  scope: '',
  responsibilities: [],
  compliance: [],
  consequences: '',
  approvals: []
}

const predefinedObjectives = [
  'Protect the confidentiality, integrity, and availability of information assets',
  'Ensure compliance with applicable laws, regulations, and contractual requirements',
  'Maintain business continuity and minimize the impact of security incidents',
  'Establish a framework for setting and reviewing information security objectives',
  'Provide direction and support for information security management',
  'Prevent unauthorized access to organizational information and systems',
  'Ensure secure handling of sensitive and confidential information',
  'Maintain customer trust and confidence in our security practices',
  'Implement effective incident response and recovery procedures',
  'Foster a culture of security awareness throughout the organization',
  'Ensure secure communication and data transmission',
  'Protect against malware, cyber attacks, and other security threats',
  'Maintain effective access controls and user authentication',
  'Ensure regular security monitoring and vulnerability assessments',
  'Implement secure software development and deployment practices'
]

const predefinedResponsibilities = [
  {
    role: 'Chief Executive Officer (CEO)',
    responsibilities: [
      'Overall accountability for information security across the organization',
      'Approve information security policies and strategic direction',
      'Ensure adequate resources are allocated for information security',
      'Review and approve security risk acceptance decisions'
    ]
  },
  {
    role: 'Chief Information Security Officer (CISO)',
    responsibilities: [
      'Develop, implement, and maintain information security policies',
      'Oversee the information security management system (ISMS)',
      'Manage security risk assessments and treatment plans',
      'Coordinate incident response and business continuity planning',
      'Report security status to senior management',
      'Ensure compliance with applicable security regulations'
    ]
  },
  {
    role: 'Security Manager',
    responsibilities: [
      'Implement day-to-day security controls and procedures',
      'Monitor security events and conduct security investigations',
      'Manage security awareness training programs',
      'Coordinate vulnerability assessments and penetration testing',
      'Maintain security documentation and evidence',
      'Support incident response activities'
    ]
  },
  {
    role: 'IT Manager',
    responsibilities: [
      'Implement technical security controls and safeguards',
      'Manage user access rights and authentication systems',
      'Ensure secure configuration of systems and networks',
      'Maintain backup and recovery procedures',
      'Monitor system logs and security alerts',
      'Coordinate with vendors on security-related matters'
    ]
  },
  {
    role: 'All Employees',
    responsibilities: [
      'Comply with all information security policies and procedures',
      'Protect confidential and sensitive information',
      'Report security incidents and suspicious activities immediately',
      'Attend mandatory security awareness training',
      'Use strong passwords and multi-factor authentication',
      'Follow clean desk and screen lock policies'
    ]
  },
  {
    role: 'Managers and Supervisors',
    responsibilities: [
      'Ensure their teams comply with security policies',
      'Approve access requests for team members',
      'Conduct security briefings for new team members',
      'Monitor and report security compliance in their areas',
      'Support security awareness initiatives',
      'Escalate security concerns to appropriate authorities'
    ]
  }
]

const predefinedPolicyStatements = [
  `${initialPolicyData.organizationName || '[Organization Name]'} is committed to protecting the confidentiality, integrity, and availability of all information assets and ensuring the security of information systems that support our business operations.`,
  `${initialPolicyData.organizationName || '[Organization Name]'} recognizes that information is a critical asset and is committed to implementing comprehensive security measures to protect it from unauthorized access, use, disclosure, disruption, modification, or destruction.`,
  `This Information Security Policy establishes ${initialPolicyData.organizationName || '[Organization Name]'}'s commitment to maintaining the highest standards of information security and ensuring compliance with applicable laws, regulations, and industry standards.`,
  `${initialPolicyData.organizationName || '[Organization Name]'} is dedicated to creating and maintaining a secure environment for all information assets through the implementation of appropriate technical, administrative, and physical safeguards.`,
  `The management of ${initialPolicyData.organizationName || '[Organization Name]'} is committed to establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS) in accordance with ISO 27001:2022 standards.`,
  `${initialPolicyData.organizationName || '[Organization Name]'} commits to protecting stakeholder information and maintaining customer trust through robust information security practices and continuous improvement of our security posture.`,
  `This policy demonstrates ${initialPolicyData.organizationName || '[Organization Name]'}'s commitment to information security governance and establishes the foundation for all security-related activities across the organization.`,
  `${initialPolicyData.organizationName || '[Organization Name]'} will maintain effective information security controls to ensure business continuity, protect competitive advantage, and fulfill our obligations to customers, employees, and regulatory bodies.`
]

const predefinedScopeStatements = [
  'This policy applies to all employees, contractors, consultants, vendors, and third parties who have access to organizational information systems and data.',
  'This policy covers all information assets owned, operated, or controlled by the organization, including but not limited to: computer systems, networks, databases, applications, and physical documents.',
  'The scope includes all business locations, remote work environments, cloud services, and any location where organizational information is processed, stored, or transmitted.',
  'This policy applies to all forms of information, whether in electronic, physical, or verbal format, and covers the entire information lifecycle from creation to disposal.',
  'The policy extends to all business processes that involve the handling of sensitive, confidential, or proprietary information.',
  'This includes all information technology infrastructure, mobile devices, and any personal devices used for business purposes under our BYOD (Bring Your Own Device) policy.'
]

const predefinedCompliance = [
  'ISO/IEC 27001:2022 - Information Security Management Systems',
  'General Data Protection Regulation (GDPR)',
  'Payment Card Industry Data Security Standard (PCI DSS)',
  'Health Insurance Portability and Accountability Act (HIPAA)',
  'Sarbanes-Oxley Act (SOX)',
  'NIST Cybersecurity Framework',
  'SOC 2 Type II Compliance',
  'COBIT Framework',
  'ITIL Service Management',
  'Local data protection and privacy laws',
  'Industry-specific regulatory requirements',
  'Contractual security obligations with customers and partners',
  'Cloud security standards (CSA, ISO 27017, ISO 27018)',
  'Software development security standards (OWASP, SANS)',
  'Business continuity and disaster recovery standards'
]

const predefinedConsequences = [
  'Failure to comply with this policy may result in disciplinary action, up to and including termination of employment or contract.',
  'Non-compliance may result in progressive disciplinary action including verbal warning, written warning, suspension, and termination of employment.',
  'Violations of this policy may lead to disciplinary measures, legal action, and potential criminal prosecution depending on the severity of the breach.',
  'Employees who fail to comply with this policy may face corrective action including additional training, performance improvement plans, or termination.',
  'Non-compliance may result in loss of system access privileges, formal disciplinary action, and potential legal consequences under applicable laws.',
  'Violations may lead to immediate suspension of access rights, investigation, and appropriate disciplinary action based on the nature and impact of the incident.'
]

const InformationSecurityPolicy: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [policyData, setPolicyData] = useState<PolicyData>(initialPolicyData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    {
      title: 'Policy Statement',
      description: 'Create the core policy statement',
      icon: FileText
    },
    {
      title: 'Objectives & Scope',
      description: 'Define security objectives, scope and organization details',
      icon: Shield
    },
    {
      title: 'Roles & Responsibilities',
      description: 'Assign security responsibilities',
      icon: Users
    },
    {
      title: 'Compliance & Consequences',
      description: 'Define compliance requirements and consequences',
      icon: CheckCircle
    },
    {
      title: 'Review & Approval',
      description: 'Generate policy document for approval',
      icon: FileText
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addPredefinedObjective = (objective: string) => {
    if (!policyData.objectives.includes(objective)) {
      setPolicyData(prev => ({
        ...prev,
        objectives: [...prev.objectives, objective]
      }))
    }
  }

  const addObjective = () => {
    setPolicyData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const updateObjective = (index: number, value: string) => {
    setPolicyData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }))
  }

  const removeObjective = (index: number) => {
    setPolicyData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const addPredefinedResponsibility = (responsibilityData: typeof predefinedResponsibilities[0]) => {
    const exists = policyData.responsibilities.some(r => r.role === responsibilityData.role)
    if (!exists) {
      setPolicyData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityData]
      }))
    }
  }

  const addResponsibility = () => {
    setPolicyData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, { role: '', responsibilities: [''] }]
    }))
  }

  const updateResponsibilityRole = (index: number, role: string) => {
    setPolicyData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) =>
        i === index ? { ...resp, role } : resp
      )
    }))
  }

  const addResponsibilityItem = (roleIndex: number) => {
    setPolicyData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) =>
        i === roleIndex ? { ...resp, responsibilities: [...resp.responsibilities, ''] } : resp
      )
    }))
  }

  const updateResponsibilityItem = (roleIndex: number, itemIndex: number, value: string) => {
    setPolicyData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) =>
        i === roleIndex
          ? {
              ...resp,
              responsibilities: resp.responsibilities.map((item, j) =>
                j === itemIndex ? value : item
              )
            }
          : resp
      )
    }))
  }

  const removeResponsibility = (index: number) => {
    setPolicyData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }))
  }

  const addPredefinedCompliance = (requirement: string) => {
    if (!policyData.compliance.includes(requirement)) {
      setPolicyData(prev => ({
        ...prev,
        compliance: [...prev.compliance, requirement]
      }))
    }
  }

  const setPredefinedPolicyStatement = (statement: string) => {
    const updatedStatement = statement.replace(/\[Organization Name\]/g, policyData.organizationName || '[Organization Name]')
    setPolicyData(prev => ({
      ...prev,
      policyStatement: updatedStatement
    }))
  }

  const setPredefinedScope = (scope: string) => {
    setPolicyData(prev => ({
      ...prev,
      scope: scope
    }))
  }

  const setPredefinedConsequences = (consequences: string) => {
    setPolicyData(prev => ({
      ...prev,
      consequences: consequences
    }))
  }

  const addCompliance = () => {
    setPolicyData(prev => ({
      ...prev,
      compliance: [...prev.compliance, '']
    }))
  }

  const updateCompliance = (index: number, value: string) => {
    setPolicyData(prev => ({
      ...prev,
      compliance: prev.compliance.map((comp, i) => i === index ? value : comp)
    }))
  }

  const removeCompliance = (index: number) => {
    setPolicyData(prev => ({
      ...prev,
      compliance: prev.compliance.filter((_, i) => i !== index)
    }))
  }

  const generatePolicy = () => {
    const today = new Date().toLocaleDateString()
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    return `
# ${policyData.organizationName}
## Information Security Policy

**Version:** ${policyData.version}
**Effective Date:** ${policyData.effectiveDate || today}
**Review Date:** ${policyData.reviewDate || nextYear.toLocaleDateString()}

### 1. POLICY STATEMENT

${policyData.policyStatement || `${policyData.organizationName} is committed to protecting the confidentiality, integrity, and availability of all information assets and ensuring the security of information systems.`}

### 2. OBJECTIVES

${policyData.objectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n') || '1. Protect information assets\n2. Ensure regulatory compliance\n3. Maintain business continuity'}

### 3. SCOPE

${policyData.scope || 'This policy applies to all employees, contractors, and third parties who have access to organizational information systems and data.'}

### 4. ROLES AND RESPONSIBILITIES

${policyData.responsibilities.map(resp => `
**${resp.role}:**
${resp.responsibilities.map(item => `- ${item}`).join('\n')}
`).join('\n') || `
**Chief Executive Officer (CEO):**
- Overall accountability for information security
- Approve information security policies

**Chief Information Security Officer (CISO):**
- Develop and maintain information security policies
- Monitor security compliance

**Security Manager:**
- Implement security controls
- Conduct security assessments
`}

### 5. COMPLIANCE REQUIREMENTS

${policyData.compliance.map((comp, index) => `${index + 1}. ${comp}`).join('\n') || '1. ISO 27001:2022\n2. Applicable regulatory requirements\n3. Industry best practices'}

### 6. CONSEQUENCES OF NON-COMPLIANCE

${policyData.consequences || 'Failure to comply with this policy may result in disciplinary action, up to and including termination of employment or contract.'}

### 7. POLICY REVIEW

This policy will be reviewed annually or when significant changes occur to the organization's business or technology environment.

---

**Approved by:**
- ${policyData.ceo || '[CEO Name]'}, Chief Executive Officer
- ${policyData.ciso || '[CISO Name]'}, Chief Information Security Officer

*This document is classified as Internal Use and should be protected accordingly.*
    `.trim()
  }

  const generatePolicyWithAI = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
      if (!apiKey) {
        throw new Error('DeepSeek API key not configured')
      }

      const prompt = `
You are an expert information security consultant specializing in ISO 27001:2022 ISMS implementation. Create a comprehensive Information Security Policy document based on the following details:

ORGANIZATION DETAILS:
- Organization Name: ${policyData.organizationName || '[Organization Name]'}
- Organization Type: ${policyData.organizationType}
- Industry: ${policyData.industry || '[Industry]'}
- CEO: ${policyData.ceo || '[CEO Name]'}
- CISO: ${policyData.ciso || '[CISO Name]'}
- Policy Version: ${policyData.version}
- Effective Date: ${policyData.effectiveDate || '[Date]'}
- Review Date: ${policyData.reviewDate || '[Review Date]'}

POLICY STATEMENT:
${policyData.policyStatement || 'Create a comprehensive policy statement demonstrating management commitment to information security'}

SECURITY OBJECTIVES:
${policyData.objectives.length > 0 ? policyData.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n') : 'Include standard ISO 27001 security objectives'}

POLICY SCOPE:
${policyData.scope || 'Define comprehensive scope covering all information assets and stakeholders'}

ROLES AND RESPONSIBILITIES:
${policyData.responsibilities.length > 0 ? policyData.responsibilities.map(resp => `
**${resp.role}:**
${resp.responsibilities.map(item => `- ${item}`).join('\n')}
`).join('\n') : 'Include standard organizational roles and their security responsibilities'}

COMPLIANCE REQUIREMENTS:
${policyData.compliance.length > 0 ? policyData.compliance.map((comp, i) => `${i + 1}. ${comp}`).join('\n') : 'Include relevant compliance requirements (ISO 27001, GDPR, etc.)'}

CONSEQUENCES OF NON-COMPLIANCE:
${policyData.consequences || 'Define appropriate disciplinary measures for policy violations'}

REQUIREMENTS:
1. Create a professional, comprehensive Information Security Policy document
2. Follow ISO 27001:2022 standards and best practices
3. Use formal, professional language appropriate for organizational policies
4. Include all standard policy sections with rich detail
5. Ensure the policy demonstrates management commitment and establishes clear governance
6. Make the document suitable for formal approval and implementation
7. Structure the document with clear headings and professional formatting
8. Include implementation guidance where appropriate
9. Ensure compliance with industry best practices and regulatory requirements
10. Create content that reflects the organization's specific context and industry

Format the response as a complete, professionally written Information Security Policy document ready for organizational approval and implementation.
`

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 4000
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const generatedContent = data.choices[0]?.message?.content

      if (!generatedContent) {
        throw new Error('No content generated from API')
      }

      setGeneratedDocument(generatedContent)
    } catch (err) {
      console.error('Error generating policy:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate policy document')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPolicy = () => {
    const policyContent = generatedDocument || generatePolicy()
    const blob = new Blob([policyContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${policyData.organizationName.replace(/\s+/g, '-').toLowerCase()}-information-security-policy.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadPolicyAsDocx = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx')

      const policyContent = generatedDocument || generatePolicy()
      const lines = policyContent.split('\n')
      const children: any[] = []

      for (const line of lines) {
        if (line.startsWith('# ')) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line.substring(2), bold: true, size: 32 })],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }))
        } else if (line.startsWith('## ')) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line.substring(3), bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }))
        } else if (line.startsWith('### ')) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line.substring(4), bold: true, size: 24 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          }))
        } else if (line.startsWith('**') && line.endsWith('**')) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line.substring(2, line.length - 2), bold: true, size: 22 })],
            spacing: { before: 200, after: 100 }
          }))
        } else if (line.startsWith('- ') || line.match(/^\d+\./)) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line, size: 22 })],
            spacing: { after: 100 },
            indent: { left: 720 }
          }))
        } else if (line.trim() === '') {
          children.push(new Paragraph({ children: [new TextRun({ text: '' })] }))
        } else if (line.trim() !== '') {
          children.push(new Paragraph({
            children: [new TextRun({ text: line, size: 22 })],
            spacing: { after: 150 }
          }))
        }
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: children
        }]
      })

      const buffer = await Packer.toBuffer(doc)
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${policyData.organizationName.replace(/\s+/g, '-').toLowerCase()}-information-security-policy.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating DOCX:', error)
      alert('Failed to generate DOCX file. Please try downloading as Markdown instead.')
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Guidance</h4>
              <p className="text-blue-800 text-sm">
                The policy statement establishes your organization's commitment to information security.
                It should be clear, concise, and demonstrate management support.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Statement</h3>

              {/* Predefined Policy Statements */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from template policy statements:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedPolicyStatements.map((statement, index) => {
                    const dynamicStatement = statement.replace(/\[Organization Name\]/g, policyData.organizationName || '[Organization Name]')
                    const isSelected = policyData.policyStatement === dynamicStatement
                    return (
                      <button
                        key={index}
                        onClick={() => setPredefinedPolicyStatement(statement)}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="flex-1">{dynamicStatement}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Policy Statement */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Or write a custom policy statement:</h4>
                <textarea
                  value={policyData.policyStatement}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, policyStatement: e.target.value }))}
                  placeholder={`${policyData.organizationName || 'Our organization'} is committed to protecting the confidentiality, integrity, and availability of all information assets...`}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Scope</h3>

              {/* Predefined Scope Statements */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common scope definitions:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedScopeStatements.map((scope, index) => {
                    const isSelected = policyData.scope === scope
                    return (
                      <button
                        key={index}
                        onClick={() => setPredefinedScope(scope)}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="flex-1">{scope}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Scope */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Or define a custom scope:</h4>
                <textarea
                  value={policyData.scope}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, scope: e.target.value }))}
                  placeholder="This policy applies to all employees, contractors, and third parties who have access to organizational information systems and data..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Guidance</h4>
              <p className="text-blue-800 text-sm">
                Define organization details, security objectives and policy scope. This information
                will be used throughout the policy document.
              </p>
            </div>

            {/* Organization Details Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={policyData.organizationName}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="e.g., Acme Corporation"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Type
                  </label>
                  <select
                    value={policyData.organizationType}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, organizationType: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="corporation">Corporation</option>
                    <option value="government">Government</option>
                    <option value="non-profit">Non-Profit</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={policyData.industry}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., Technology, Healthcare, Finance"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Version
                  </label>
                  <input
                    type="text"
                    value={policyData.version}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="e.g., 1.0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEO Name
                  </label>
                  <input
                    type="text"
                    value={policyData.ceo}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, ceo: e.target.value }))}
                    placeholder="e.g., John Smith"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CISO Name
                  </label>
                  <input
                    type="text"
                    value={policyData.ciso}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, ciso: e.target.value }))}
                    placeholder="e.g., Jane Doe"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={policyData.effectiveDate}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Review Date
                  </label>
                  <input
                    type="date"
                    value={policyData.reviewDate}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, reviewDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Security Objectives Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Objectives</h3>

              {/* Predefined Objectives */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common security objectives:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedObjectives.map((objective, index) => {
                    const isSelected = policyData.objectives.includes(objective)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedObjective(objective)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{objective}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Objective */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom objective:</h4>
                <button
                  onClick={addObjective}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Objective
                </button>
              </div>

              {/* Selected Objectives */}
              {policyData.objectives.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected objectives:</h4>
                  <div className="space-y-3">
                    {policyData.objectives.map((objective, index) => {
                      const isPredefined = predefinedObjectives.includes(objective)
                      return (
                        <div key={index} className={`flex gap-2 p-3 rounded-lg border ${
                          isPredefined ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                        }`}>
                          {isPredefined ? (
                            <div className="flex-1 text-blue-800 text-sm">{objective}</div>
                          ) : (
                            <input
                              type="text"
                              value={objective}
                              onChange={(e) => updateObjective(index, e.target.value)}
                              placeholder="e.g., Protect customer data from unauthorized access"
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                          <button
                            onClick={() => removeObjective(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Policy Scope Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Scope</h3>

              {/* Predefined Scope Statements */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common scope definitions:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedScopeStatements.map((scope, index) => {
                    const isSelected = policyData.scope === scope
                    return (
                      <button
                        key={index}
                        onClick={() => setPredefinedScope(scope)}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="flex-1">{scope}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Scope */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Or define a custom scope:</h4>
                <textarea
                  value={policyData.scope}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, scope: e.target.value }))}
                  placeholder="This policy applies to all employees, contractors, and third parties who have access to organizational information systems and data..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Objectives</h3>

              {/* Predefined Objectives */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common security objectives:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedObjectives.map((objective, index) => {
                    const isSelected = policyData.objectives.includes(objective)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedObjective(objective)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{objective}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Objective */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom objective:</h4>
                <button
                  onClick={addObjective}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Objective
                </button>
              </div>

              {/* Selected Objectives */}
              {policyData.objectives.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected objectives:</h4>
                  <div className="space-y-3">
                    {policyData.objectives.map((objective, index) => {
                      const isPredefined = predefinedObjectives.includes(objective)
                      return (
                        <div key={index} className={`flex gap-2 p-3 rounded-lg border ${
                          isPredefined ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                        }`}>
                          {isPredefined ? (
                            <div className="flex-1 text-blue-800 text-sm">{objective}</div>
                          ) : (
                            <input
                              type="text"
                              value={objective}
                              onChange={(e) => updateObjective(index, e.target.value)}
                              placeholder="e.g., Protect customer data from unauthorized access"
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                          <button
                            onClick={() => removeObjective(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Guidance</h4>
              <p className="text-blue-800 text-sm">
                Define roles and their specific information security responsibilities.
                Select from predefined roles or add custom ones.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Roles & Responsibilities</h3>

              {/* Predefined Responsibilities */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from predefined roles:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedResponsibilities.map((roleData, index) => {
                    const isSelected = policyData.responsibilities.some(r => r.role === roleData.role)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedResponsibility(roleData)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{roleData.role}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {roleData.responsibilities.length} responsibilities defined
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Role */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom role:</h4>
                <button
                  onClick={addResponsibility}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Role
                </button>
              </div>

              {/* Selected Roles */}
              {policyData.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected roles and responsibilities:</h4>
                  <div className="space-y-4">
                    {policyData.responsibilities.map((resp, index) => {
                      const isPredefined = predefinedResponsibilities.some(r => r.role === resp.role)
                      return (
                        <div key={index} className={`border rounded-lg p-4 ${
                          isPredefined ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            {isPredefined ? (
                              <div className="font-medium text-blue-800">{resp.role}</div>
                            ) : (
                              <input
                                type="text"
                                value={resp.role}
                                onChange={(e) => updateResponsibilityRole(index, e.target.value)}
                                placeholder="Role (e.g., Security Manager, All Employees)"
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                              />
                            )}
                            <button
                              onClick={() => removeResponsibility(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove Role
                            </button>
                          </div>
                          <div className="space-y-2">
                            {resp.responsibilities.map((item, itemIndex) => (
                              <div key={itemIndex} className={`flex gap-2 p-2 rounded ${
                                isPredefined ? 'bg-blue-25' : 'bg-gray-50'
                              }`}>
                                {isPredefined ? (
                                  <div className="flex-1 text-sm text-blue-700">• {item}</div>
                                ) : (
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => updateResponsibilityItem(index, itemIndex, e.target.value)}
                                    placeholder="Responsibility (e.g., Conduct security awareness training)"
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                )}
                                {!isPredefined && (
                                  <button
                                    onClick={() => {
                                      setPolicyData(prev => ({
                                        ...prev,
                                        responsibilities: prev.responsibilities.map((r, i) =>
                                          i === index
                                            ? { ...r, responsibilities: r.responsibilities.filter((_, j) => j !== itemIndex) }
                                            : r
                                        )
                                      }))
                                    }}
                                    className="text-red-500 hover:text-red-700 px-2"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                            {!isPredefined && (
                              <button
                                onClick={() => addResponsibilityItem(index)}
                                className="text-blue-500 hover:text-blue-700 text-sm"
                              >
                                + Add Responsibility
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Guidance</h4>
              <p className="text-blue-800 text-sm">
                Define compliance requirements and consequences for non-compliance.
                Include relevant laws, regulations, and standards.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Requirements</h3>

              {/* Predefined Compliance Requirements */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common compliance requirements:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedCompliance.map((requirement, index) => {
                    const isSelected = policyData.compliance.includes(requirement)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedCompliance(requirement)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{requirement}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Compliance Requirement */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom compliance requirement:</h4>
                <button
                  onClick={addCompliance}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Requirement
                </button>
              </div>

              {/* Selected Compliance Requirements */}
              {policyData.compliance.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected compliance requirements:</h4>
                  <div className="space-y-3">
                    {policyData.compliance.map((requirement, index) => {
                      const isPredefined = predefinedCompliance.includes(requirement)
                      return (
                        <div key={index} className={`flex gap-2 p-3 rounded-lg border ${
                          isPredefined ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                        }`}>
                          {isPredefined ? (
                            <div className="flex-1 text-blue-800 text-sm">{requirement}</div>
                          ) : (
                            <input
                              type="text"
                              value={requirement}
                              onChange={(e) => updateCompliance(index, e.target.value)}
                              placeholder="e.g., ISO 27001:2022, GDPR, HIPAA"
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                          <button
                            onClick={() => removeCompliance(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Consequences of Non-Compliance</h3>

              {/* Predefined Consequences */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from template consequences:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedConsequences.map((consequence, index) => {
                    const isSelected = policyData.consequences === consequence
                    return (
                      <button
                        key={index}
                        onClick={() => setPredefinedConsequences(consequence)}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="flex-1">{consequence}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600 mt-1 ml-2 flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Consequences */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Or define custom consequences:</h4>
                <textarea
                  value={policyData.consequences}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, consequences: e.target.value }))}
                  placeholder="Failure to comply with this policy may result in disciplinary action, up to and including termination of employment or contract."
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Policy Ready for Review</h4>
              <p className="text-green-800 text-sm">
                Your Information Security Policy has been generated. Review the content and download
                the document for approval workflow.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Policy Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div><strong>Organization:</strong> {policyData.organizationName || 'Not specified'}</div>
                <div><strong>Version:</strong> {policyData.version}</div>
                <div><strong>Objectives:</strong> {policyData.objectives.length} defined</div>
                <div><strong>Roles:</strong> {policyData.responsibilities.length} defined</div>
                <div><strong>Compliance Reqs:</strong> {policyData.compliance.length} defined</div>
                <div><strong>CEO:</strong> {policyData.ceo || 'Not specified'}</div>
              </div>
            </div>

            {/* AI Generation Section */}
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">AI-Enhanced Policy Generation</h4>
                <p className="text-purple-800 text-sm mb-3">
                  Generate a comprehensive, professional policy document using AI based on your inputs.
                </p>
                <button
                  onClick={generatePolicyWithAI}
                  disabled={isGenerating || !policyData.organizationName}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
                </button>
                {!policyData.organizationName && (
                  <p className="text-sm text-red-600 mt-2">Please provide organization name to generate policy</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Generation Error</h4>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {generatedDocument && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">✓ Policy Generated Successfully</h4>
                  <p className="text-green-800 text-sm">
                    Your AI-generated policy document is ready for review and download.
                  </p>
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => {
                    const policyContent = generatedDocument || generatePolicy()
                    const policyWindow = window.open('', '_blank')
                    if (policyWindow) {
                      policyWindow.document.write(`
                        <html>
                          <head><title>Information Security Policy Preview</title></head>
                          <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                            <pre style="white-space: pre-wrap; font-family: inherit;">${policyContent}</pre>
                          </body>
                        </html>
                      `)
                      policyWindow.document.close()
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Policy</span>
                </button>

                <button
                  onClick={downloadPolicy}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MD</span>
                </button>

                <button
                  onClick={downloadPolicyAsDocx}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download DOCX</span>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Review the policy document with your security team</li>
                  <li>• Obtain approval from CEO and other designated authorities</li>
                  <li>• Communicate the policy to all personnel</li>
                  <li>• Schedule regular policy reviews and updates</li>
                  <li>• Proceed to Risk Assessment (next ISMS step)</li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Information Security Policy</h1>
            <p className="text-gray-600 mt-1">Create your organization's information security policy</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-50 px-8 py-4">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <React.Fragment key={index}>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  isActive ? 'bg-blue-100 text-blue-700' :
                  isCompleted ? 'bg-green-100 text-green-700' : 'text-gray-400'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-6 overflow-auto">
        <div className="max-w-4xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          {renderStepContent()}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Progress</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  alert('Policy completed! Use the Preview and Download buttons above.')
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Policy</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InformationSecurityPolicy